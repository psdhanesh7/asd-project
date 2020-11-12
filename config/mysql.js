const mysql = require('mysql2/promise');
const keys = require('./keys');

const db = mysql.createPool({
    host : keys.MYSQL_HOST,
    user : keys.MYSQL_USER,
    password : keys.MYSQL_PASSWORD,
    database : 'asd_lab',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;