require('dotenv').config();

const database = process.env.DATA_BASE;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;
const host     = process.env.HOST;
const dialect  = process.env.DIALECT;

const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: host,
    user: username,
    database: database,
    password: password
});

export { connection };