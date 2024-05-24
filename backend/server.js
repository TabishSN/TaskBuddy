const express = require('express');
const pool = require('./database/db.js');
const fs = require ('fs');
const bodyParser = require('body-parser')

const app = express();
const port = process.env.PORT || 8000;
app.use(bodyParser.json());


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
createTables('./database/taskbuddy.sql');


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

        if (result.rows.length === 1) {
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


app.post('/register', async (req, res) => {
    const { email,password,username } = req.body;

    try {
        // Check if the username already exists
        const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        
        if (userExists.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        // If username doesn't exist, insert new user into the database
        const newUser = await pool.query('INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *', [email, password, username]);

        res.status(201).json({ success: true, message: 'User registered successfully', user: newUser.rows[0] });
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});