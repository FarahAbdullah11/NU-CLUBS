import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
if (!process.env.DB_PASSWORD && process.env.DB_PASSWORD !== '') {
  console.warn('⚠️  Warning: DB_PASSWORD not set in .env file. Using empty password.');
}

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ClubsData',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message);
    if (err.message.includes('Access denied') && (!process.env.DB_PASSWORD || process.env.DB_PASSWORD === 'your_password')) {
      console.error('💡 Tip: Make sure to set DB_PASSWORD in your .env file with your actual MySQL password.');
    }
  });

export default pool;

