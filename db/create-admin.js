#!/usr/bin/env node
'use strict';

/**
 * Admin User Setup Script
 * Creates or updates the admin user with specified credentials
 * 
 * Usage: node db/create-admin.js
 */

const { pool } = require('../config/database');
const bcryptjs = require('bcryptjs');

async function createAdminUser() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║           Admin User Setup                                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const adminEmail = 'raj@gmail.com';
    const adminPassword = '123';
    const SALT_ROUNDS = 10;
    
    console.log('⏳ Creating admin user...\n');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}\n`);
    
    // Hash the password
    const adminPasswordHash = await bcryptjs.hash(adminPassword, SALT_ROUNDS);
    
    const adminResult = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, is_verified)
       VALUES ($1, $2, $3, $4, $5, true)
       ON CONFLICT (email) DO UPDATE SET password_hash = $2, role = 'admin', is_verified = true
       RETURNING id, email, role, created_at`,
      [adminEmail, adminPasswordHash, 'Admin', 'User', 'admin']
    );

    if (adminResult.rows.length > 0) {
      const user = adminResult.rows[0];
      console.log('✅ Admin user successfully created/updated:\n');
      console.log(`  ID:    ${user.id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role:  ${user.role}`);
      console.log(`  Since: ${user.created_at}\n`);
      
      console.log('You can now login with:');
      console.log(`  Email:    ${adminEmail}`);
      console.log(`  Password: ${adminPassword}\n`);
      
      console.log('Admin Dashboard: http://localhost:3000/admin-dashboard.html\n');
    }

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createAdminUser();
