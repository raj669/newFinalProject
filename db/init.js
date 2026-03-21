#!/usr/bin/env node
'use strict';

/**
 * Database Initialization Script
 * This script initializes the PostgreSQL database with the required schema
 * and migrates data from the legacy JSON file (if desired)
 */

const { pool } = require('../config/database');
const bcryptjs = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing Nepal Real Estate Database...\n');

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📋 Creating database schema...');
    await pool.query(schema);
    console.log('✓ Schema created successfully\n');

    // Create admin user with specified credentials
    console.log('👤 Creating default admin user...');
    const adminEmail = 'raj@gmail.com';
    const adminPassword = '123';
    const SALT_ROUNDS = 10;
    
    // Hash the password
    const adminPasswordHash = await bcryptjs.hash(adminPassword, SALT_ROUNDS);
    
    const adminResult = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, is_verified)
       VALUES ($1, $2, $3, $4, $5, true)
       ON CONFLICT (email) DO UPDATE SET password_hash = $2
       RETURNING id, email`,
      [adminEmail, adminPasswordHash, 'Admin', 'User', 'admin']
    );

    if (adminResult.rows.length > 0) {
      console.log(`✓ Admin user created/updated: ${adminResult.rows[0].email}`);
      console.log(`  Email: ${adminEmail}`);
      console.log(`  Password: ${adminPassword}\n`);
    } else {
      console.log('ℹ Admin user setup complete\n');
    }

    // Migrate data from JSON (if exists)
    const jsonPath = path.join(__dirname, '../data/properties.json');
    if (fs.existsSync(jsonPath)) {
      console.log('📤 Migrating data from JSON file...');
      await migrateFromJSON();
      console.log('✓ Data migration complete\n');
    }

    console.log('✅ Database initialization complete!\n');
    console.log('Database Configuration:');
    console.log(`  - Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`  - Port: ${process.env.DB_PORT || 5432}`);
    console.log(`  - Database: ${process.env.DB_NAME || 'nepal_real_estate'}`);
    console.log(`  - User: ${process.env.DB_USER || 'postgres'}\n`);

    console.log('📚 API Endpoints:');
    console.log('  - POST   /api/auth/register        - Register new user');
    console.log('  - POST   /api/auth/login           - Login user');
    console.log('  - GET    /api/auth/profile         - Get user profile');
    console.log('  - GET    /api/properties-db        - List properties (database)');
    console.log('  - POST   /api/properties-db        - Create property');
    console.log('  - GET    /api/bookmarks            - Get bookmarked properties');
    console.log('  - POST   /api/bookmarks/:id        - Bookmark property');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

async function migrateFromJSON() {
  try {
    const jsonPath = path.join(__dirname, '../data/properties.json');
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // Create a default seller account
    const sellerResult = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, is_verified)
       VALUES ('seller@nepalestate.com', '$2a$10$ilqipqPh4T/GvL8hSxWCWOH.GzSYrqRSCMn2xXFjvHyIlOHQmDnKu', 'Property', 'Manager', 'seller', true)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      []
    );

    const sellerId = sellerResult.rows[0]?.id || 1;

    // Migrate each property
    for (const prop of data) {
      const propResult = await pool.query(
        `INSERT INTO properties 
         (seller_id, title, type, status, price, bedrooms, bathrooms, area, area_unit, 
          city, district, address, description, contact, featured, listed_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         ON CONFLICT DO NOTHING
         RETURNING id`,
        [sellerId, prop.title, prop.type, prop.status, prop.price, prop.bedrooms, 
         prop.bathrooms, prop.area, prop.areaUnit, prop.city, prop.district, 
         prop.address, prop.description, prop.contact, prop.featured, prop.listedDate]
      );

      if (propResult.rows.length > 0) {
        const propertyId = propResult.rows[0].id;

        // Insert features
        if (Array.isArray(prop.features)) {
          for (const feature of prop.features) {
            await pool.query(
              'INSERT INTO property_features (property_id, feature_name) VALUES ($1, $2)',
              [propertyId, feature]
            );
          }
        }

        // Insert images
        if (Array.isArray(prop.images) && prop.images.length > 0) {
          for (let i = 0; i < prop.images.length; i++) {
            await pool.query(
              'INSERT INTO property_images (property_id, image_url, is_primary) VALUES ($1, $2, $3)',
              [propertyId, `/images/${prop.images[i]}`, i === 0]
            );
          }
        }
      }
    }

    console.log(`✓ Migrated ${data.length} properties from JSON`);
  } catch (error) {
    console.error('Error migrating JSON data:', error);
    throw error;
  }
}

// Run initialization
initializeDatabase();
