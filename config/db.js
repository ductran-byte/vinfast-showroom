const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vinfast_db'
};

const db = {
  async query(sql, params) {
    let connection;
    try {
      connection = await mysql.createConnection(config);
      const result = await connection.query(sql, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  }
};

module.exports = db;
