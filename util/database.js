const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    database:'onlineshop',
    password:'123445'
});

module.exports = pool.promise();