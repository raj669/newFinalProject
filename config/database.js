'use strict';

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'nepal_real_estate',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✓ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Helper function to query database
async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`Database query executed: ${duration}ms`);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to get single row
async function getOne(text, params) {
  const result = await query(text, params);
  return result.rows[0];
}

// Helper function to get all rows
async function getAll(text, params) {
  const result = await query(text, params);
  return result.rows;
}

module.exports = {
  pool,
  query,
  getOne,
  getAll,
};
