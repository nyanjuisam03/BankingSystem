const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "neon2003#",
    database: "bankmanagementsystem",
    connectTimeout: 60000,
 
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Successfully connected to database');
});

module.exports = db;