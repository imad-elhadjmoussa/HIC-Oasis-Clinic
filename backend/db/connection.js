require('dotenv').config();

const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'imad123',
    database: 'oasisclinic'
    // host: process.env.DB_HOST || 'db4free.net',
    // user: process.env.DB_USER || 'your_db_username',
    // password: process.env.DB_PASSWORD || 'your_db_password',
    // database: process.env.DB_NAME || 'your_db_name',
    // port: process.env.DB_PORT || 3306,
}).promise();

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('MySQL Connected');
});

module.exports = db;