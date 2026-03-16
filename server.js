'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const propertiesRouter = require('./routes/properties');

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

// API routes (rate-limited)
app.use('/api/properties', apiLimiter, propertiesRouter);

// Catch-all: serve index.html for client-side navigation (rate-limited)
app.get('*', apiLimiter, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Only start listening when not in test mode
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Nepal Real Estate server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
