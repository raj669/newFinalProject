const express = require('express');
const router = express.Router();

const USE_FIRESTORE = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
  (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_SERVICE_ACCOUNT)
);

let db;
if (USE_FIRESTORE) {
  ({ db } = require('../config/firebase'));
}

/**
 * Simple, ReDoS-safe email structure check.
 * Splits on the last '@' and verifies the domain contains at least one dot
 * with non-empty local, domain-name, and TLD parts.
 */
function isValidEmail(addr) {
  const at = addr.lastIndexOf('@');
  if (at <= 0 || at === addr.length - 1) return false;
  const local  = addr.slice(0, at);
  const domain = addr.slice(at + 1);
  const dot    = domain.lastIndexOf('.');
  if (dot <= 0 || dot === domain.length - 1) return false;
  // No whitespace allowed anywhere
  return !/\s/.test(local) && !/\s/.test(domain);
}

// ── POST /api/contact ─────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  const { name, email, phone, interest, message } = req.body;

  // Basic validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (!email || typeof email !== 'string' || !isValidEmail(email.trim())) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const inquiry = {
    name:      name.trim().slice(0, 200),
    email:     email.trim().slice(0, 200),
    phone:     typeof phone === 'string' ? phone.trim().slice(0, 50) : '',
    interest:  typeof interest === 'string' ? interest.trim().slice(0, 100) : 'other',
    message:   message.trim().slice(0, 2000),
    createdAt: new Date().toISOString(),
  };

  try {
    if (USE_FIRESTORE) {
      await db.collection('inquiries').add(inquiry);
    }
    // When Firestore is not configured we still return success so the UI
    // works in development without credentials.
    res.status(201).json({ success: true, message: 'Inquiry received. We will contact you shortly.' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
