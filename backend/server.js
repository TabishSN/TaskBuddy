const express = require('express');
const pool = require('./database/db.js');
const fs = require ('fs');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(cors());

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log('Error connecting to the database:', err);
    } else {
        console.log('Successfully connected to the CockroachDB', res.rows[0].now);
    }
});

async function createTables(filePath) {
    try {
      const sql = fs.readFileSync(filePath, 'utf-8');
      await pool.query(sql);
      console.log('Successfully created tables in the database');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
}
createTables('./database/powerpulse.sql');

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE username = $1';
        const { rows } = await pool.query(query, [username]);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Passwords do not match' });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Login successful', 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                workouts_completed: user.workouts_completed,
                achievements_earned: user.achievements_earned,
                current_streak: user.current_streak
            }
        });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/register', async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        
        if (userExists.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (email, password, username, workouts_completed, achievements_earned, current_streak) VALUES ($1, $2, $3, 0, 0, 0) RETURNING *',
            [email, hashedPassword, username]
        );

        res.status(201).json({ success: true, message: 'User registered successfully', user: newUser.rows[0] });
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/complete-workout', async (req, res) => {
    const { userId, workoutType } = req.body;
    
    if (!userId || !workoutType) {
        return res.status(400).json({ 
            success: false, 
            message: 'Missing required fields: userId and workoutType are required' 
        });
    }

    try {
        // Start a transaction
        await pool.query('BEGIN');

        // Insert completed workout
        await pool.query(
            'INSERT INTO completed_workouts (user_id, workout_type) VALUES ($1, $2)',
            [userId, workoutType]
        );

        // Update user stats
        const result = await pool.query(
            'UPDATE users SET workouts_completed = workouts_completed + 1, current_streak = current_streak + 1 WHERE id = $1 RETURNING workouts_completed, current_streak',
            [userId]
        );

        await pool.query('COMMIT');

        res.status(200).json({
            success: true,
            stats: result.rows[0]
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error completing workout:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/user-stats/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
        const result = await pool.query(
            'SELECT workouts_completed, achievements_earned, current_streak FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            stats: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/search', async (req, res) => {
    const searchTerm = req.query.q;

    if (!searchTerm) {
        return res.status(400).json({ success: false, message: 'Search term is required' });
    }

    try {
        const result = await pool.query(
            'SELECT id, username, email FROM users WHERE username ILIKE $1 LIMIT 10',
            [`%${searchTerm}%`]
        );
        
        // Get friendship status for each user
        const users = await Promise.all(result.rows.map(async (user) => {
            const friendshipStatus = await pool.query(
                `SELECT status FROM friendships 
                 WHERE (from_user_id = $1 OR to_user_id = $1) 
                 AND (from_user_id = $2 OR to_user_id = $2)
                 LIMIT 1`,
                [req.query.currentUserId, user.id]
            );
            
            return {
                ...user,
                friendshipStatus: friendshipStatus.rows[0]?.status || null
            };
        }));

        res.json({ success: true, users });
    } catch (err) {
        console.error('Error searching users:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/friendships', async (req, res) => {
    const { from_user_id, to_user_id } = req.body;

    if (!from_user_id || !to_user_id) {
        return res.status(400).json({ success: false, message: 'Both users are required' });
    }

    try {
        // Check if friendship already exists
        const existingFriendship = await pool.query(
            `SELECT * FROM friendships 
             WHERE (from_user_id = $1 AND to_user_id = $2)
             OR (from_user_id = $2 AND to_user_id = $1)`,
            [from_user_id, to_user_id]
        );

        if (existingFriendship.rows.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Friendship request already exists' 
            });
        }

        // Create new friendship request
        await pool.query(
            `INSERT INTO friendships (from_user_id, to_user_id, status) 
             VALUES ($1, $2, 'pending')`,
            [from_user_id, to_user_id]
        );

        res.json({ success: true, message: 'Friend request sent successfully' });
    } catch (err) {
        console.error('Error creating friendship:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on port ${port}`);
});