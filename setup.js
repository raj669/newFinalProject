#!/usr/bin/env node
'use strict';

/**
 * Setup Script for Nepal Real Estate Web Application
 * This script automates the setup process by:
 * 1. Copying .env.example to .env
 * 2. Installing npm dependencies
 * 3. Creating upload directories
 * 4. Prompting for database configuration
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) =>
  new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });

async function runSetup() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║     Nepal Real Estate Web Application - Setup Script        ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  try {
    // Step 1: Copy .env.example to .env
    console.log('Step 1: Setting up environment variables...');
    const envExamplePath = path.join(__dirname, '.env.example');
    const envPath = path.join(__dirname, '.env');

    if (fs.existsSync(envPath)) {
      console.log('✓ .env file already exists\n');
    } else if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✓ Created .env file from template\n');
    } else {
      console.log('⚠ .env.example not found\n');
    }

    // Step 2: Create upload directories
    console.log('Step 2: Creating upload directories...');
    const uploadDir = path.join(__dirname, 'uploads', 'properties');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`✓ Created directory: ${uploadDir}\n`);
    } else {
      console.log(`✓ Directory already exists: ${uploadDir}\n`);
    }

    // Step 3: Install dependencies
    console.log('Step 3: Installing npm dependencies...');
    console.log('This may take a few minutes...\n');
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('\n✓ Dependencies installed successfully\n');
    } catch (error) {
      console.error('⚠ npm install failed:', error.message);
      console.log('Please run: npm install\n');
    }

    // Step 4: Database configuration
    console.log('Step 4: Database Configuration\n');
    console.log('The application uses PostgreSQL. Ensure PostgreSQL is installed.\n');

    const dbHost = await question('PostgreSQL Host (default: localhost): ') || 'localhost';
    const dbPort = await question('PostgreSQL Port (default: 5432): ') || '5432';
    const dbName = await question('Database Name (default: nepal_real_estate): ') || 'nepal_real_estate';
    const dbUser = await question('Database User (default: postgres): ') || 'postgres';
    const dbPassword = await question('Database Password: ');
    const jwtSecret = await question('JWT Secret Key (leave empty to auto-generate): ') || generateSecret();

    // Update .env file
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace('DB_HOST=localhost', `DB_HOST=${dbHost}`);
    envContent = envContent.replace('DB_PORT=5432', `DB_PORT=${dbPort}`);
    envContent = envContent.replace('DB_NAME=nepal_real_estate', `DB_NAME=${dbName}`);
    envContent = envContent.replace('DB_USER=postgres', `DB_USER=${dbUser}`);
    envContent = envContent.replace('DB_PASSWORD=your_password_here', `DB_PASSWORD=${dbPassword}`);
    envContent = envContent.replace(
      'JWT_SECRET=your_super_secret_jwt_key_change_this_in_production',
      `JWT_SECRET=${jwtSecret}`
    );

    fs.writeFileSync(envPath, envContent);
    console.log('\n✓ Environment variables updated\n');

    // Step 5: Initialize database
    console.log('Step 5: Database Initialization\n');
    const shouldInitDb = await question('Would you like to initialize the database now? (yes/no): ');

    if (shouldInitDb.toLowerCase() === 'yes' || shouldInitDb.toLowerCase() === 'y') {
      console.log('\nAttempting to connect to PostgreSQL and create schema...\n');
      try {
        execSync('node db/init.js', { stdio: 'inherit' });
        console.log('\n✓ Database initialized successfully\n');
      } catch (error) {
        console.error('\n⚠ Database initialization failed');
        console.log('This usually means PostgreSQL is not running or credentials are incorrect.');
        console.log('To retry later, run: node db/init.js\n');
      }
    } else {
      console.log('\nℹ Database initialization skipped');
      console.log('Run this later with: node db/init.js\n');
    }

    // Final summary
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                   Setup Complete!                           ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    console.log('Next Steps:\n');
    console.log('1. Ensure PostgreSQL is running');
    console.log('2. Verify database connection credentials in .env');
    console.log('3. Run database initialization: npm run db:init');
    console.log('4. Start the development server: npm run dev');
    console.log('5. Access the application at: http://localhost:3000\n');

    console.log('Available Commands:\n');
    console.log('  npm run dev              - Start development server with auto-reload');
    console.log('  npm start                - Start production server');
    console.log('  npm test                 - Run test suite');
    console.log('  npm run db:init          - Initialize/reset database');
    console.log('  npm run db:migrate       - Run database migrations\n');

    console.log('Documentation:\n');
    console.log('  - API Documentation: see API_DOCUMENTATION.md');
    console.log('  - Migration Guide: see MIGRATION_GUIDE.md');
    console.log('  - Project Report: see PROJECT_REPORT.md\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

function generateSecret() {
  return require('crypto').randomBytes(32).toString('hex');
}

// Run setup
runSetup();
