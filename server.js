'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const propertiesRouter = require('./routes/properties');
const authRouter = require('./routes/auth-mock'); // Using mock auth (no database required)
const bookmarksRouter = require('./routes/bookmarks');
const propertiesDbRouter = require('./routes/properties-db');
const adminRouter = require('./routes/admin-mock'); // Using mock admin (no database required)
const commentsRouter = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiter – 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads', 'properties');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// API routes (rate-limited)
// Legacy JSON-based properties API
app.use('/api/properties', apiLimiter, propertiesRouter);

// New authentication endpoints
app.use('/api/auth', apiLimiter, authRouter);

// Bookmarks endpoints (requires authentication)
app.use('/api/bookmarks', apiLimiter, bookmarksRouter);

// New database-based properties API
app.use('/api/properties-db', apiLimiter, propertiesDbRouter);

// Admin routes
app.use('/api/admin', apiLimiter, adminRouter);

// Comments routes
app.use('/api/comments', apiLimiter, commentsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// Catch-all: serve index.html for client-side navigation (rate-limited)
// But allow .html files in public folder to be served directly
app.get('*', apiLimiter, (req, res) => {
  const filePath = path.join(__dirname, 'public', req.path);
  // Check if requesting an HTML file that exists
  if (req.path.endsWith('.html') && fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  // Otherwise serve index.html for SPA routing
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Only start listening when not in test mode
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✓ Nepal Real Estate server running on http://localhost:${PORT}`);
    console.log(`✓ API Documentation:`);
    console.log(`  - Legacy API: GET /api/properties`);
    console.log(`  - Database API: GET /api/properties-db`);
    console.log(`  - Authentication: POST /api/auth/register, POST /api/auth/login`);
    console.log(`  - Bookmarks: GET /api/bookmarks`);
    console.log(`  - Admin: GET /api/admin/properties, POST /api/admin/properties`);
    console.log(`  - Comments: GET /api/comments/property/:id, POST /api/comments`);
    console.log(`  - Health: GET /api/health`);
  });
}

module.exports = app;
