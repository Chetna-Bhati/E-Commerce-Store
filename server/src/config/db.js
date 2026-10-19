const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'threadline_db',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  queueLimit: 0,
  decimalNumbers: true,
  timezone: 'Z'
});

// Helper for executing parameterized raw SQL
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// Check database connectivity
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    connection.release();
    console.log('Connected to MySQL database:', process.env.DB_NAME || 'threadline_db');
    return true;
  } catch (error) {
    console.error('MySQL connection error:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  query,
  testConnection
};
