const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting: 100 requests per 15 minutes per IP (API)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// Routes
const propertiesRouter = require('./routes/properties');
app.use('/api/properties', propertiesRouter);

// Return JSON 404 for any unmatched /api/* path (prevents HTML falling through)
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Rate-limit the SPA catch-all to prevent filesystem-access abuse
const staticLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { error: 'Too many requests, please try again later.' }
});

// Serve index.html for all unmatched routes (SPA support)
app.get('*', staticLimiter, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler — must have 4 parameters to be recognised by Express
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.message || err);
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`NepalEstates server running on port ${PORT}`);
  });
}

module.exports = app;
