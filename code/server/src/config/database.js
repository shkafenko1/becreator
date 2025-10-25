import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    client.release();
  } catch (error) {
    console.log('⚠️  Database not available yet:', error.message);
    console.log('💡 Tip: Install PostgreSQL or use a cloud database');
  }
};

testConnection();

export const query = (text, params) => pool.query(text, params);
export default pool;