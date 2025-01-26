require('dotenv').config();
const mysql = require('mysql2');

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'node_task',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
  }
}; 