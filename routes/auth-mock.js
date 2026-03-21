'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { jwtSecret, jwtExpire } = require('../config/auth');

const router = express.Router();

// Mock user database (in-memory storage)
const mockUsers = {
  'raj@gmail.com': {
    id: 1,
    email: 'raj@gmail.com',
    password: '123',
    firstName: 'Raj',
    lastName: 'Kumar',
    role: 'admin',
    createdAt: new Date(),
  },
  'test@gmail.com': {
    id: 2,
    email: 'test@gmail.com',
    password: 'test123',
    firstName: 'Test',
    lastName: 'User',
    role: 'buyer',
    createdAt: new Date(),
  }
};

let nextUserId = 3;

/**
 * POST /api/auth/register
 * Register a new user (MOCK - no database)
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'buyer' } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if user already exists
    if (mockUsers[email.toLowerCase()]) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Create user
    const userId = nextUserId++;
    mockUsers[email.toLowerCase()] = {
      id: userId,
      email: email.toLowerCase(),
      password: password,
      firstName: firstName || '',
      lastName: lastName || '',
      role: role || 'buyer',
      createdAt: new Date(),
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, email: email.toLowerCase(), role: role || 'buyer' },
      jwtSecret,
      { expiresIn: jwtExpire }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        email: email.toLowerCase(),
        firstName: firstName || '',
        lastName: lastName || '',
        first_name: firstName || '',
        last_name: lastName || '',
        role: role || 'buyer',
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/login
 * Login with email and password (MOCK - no database)
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user
    const user = mockUsers[email.toLowerCase()];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password (plain text comparison for mock)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpire }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.firstName,
        last_name: user.lastName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
});

/**
 * GET /api/auth/profile
 * Get current user profile (MOCK)
 */
router.get('/profile', (req, res) => {
  try {
    // Mock implementation - extract from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    const user = mockUsers[decoded.email];
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Profile fetch failed',
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (MOCK - client-side token removal)
 */
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful',
  });
});

module.exports = router;
