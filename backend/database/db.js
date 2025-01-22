const dotenv = require('dotenv');
const pkg = require('pg');
const { Pool } = pkg;

dotenv.config();

let poolConfig = ({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false,
    }
});

const pool = new Pool(poolConfig);
module.exports = pool;