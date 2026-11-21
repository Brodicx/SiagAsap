import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is required');
}

const db = new Pool({
    connectionString,
    max: 10,
    connectionTimeoutMillis: 10000
});

db.query('SELECT 1')
    .then(() => console.log('Connected to PostgreSQL'))
    .catch((error) => console.error('PostgreSQL connection failed:', error.message));

db.on('error', (error) => {
    console.error('Unexpected PostgreSQL pool error:', error.message);
});

export default db;