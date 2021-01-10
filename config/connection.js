require('dotenv').config();
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "employee_tracker_db"
});

module.exports = connection;