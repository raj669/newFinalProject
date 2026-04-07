const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// ── Data source: Firestore when credentials are present, JSON file otherwise ──
const USE_FIRESTORE = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
  (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_SERVICE_ACCOUNT)
);

let db;
if (USE_FIRESTORE) {
  ({ db } = require('../config/firebase'));
}

/**
 * Fetch all properties.
 * Returns a plain JS array regardless of the data source.
 */
async function loadProperties() {
  if (USE_FIRESTORE) {
    const snapshot = await db.collection('properties').orderBy('id').get();
    return snapshot.docs.map(doc => doc.data());
  }

  // Fallback: read from the local JSON file
  try {
    const filePath = path.join(__dirname, '../data/properties.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    throw new Error('Unable to load property data');
  }
}

// Guard against array-injection (e.g. ?city[]=foo) — only accept string values
const str = v => (typeof v === 'string' ? v : undefined);

// ── GET /api/properties  — list all (with optional filters) ──────────────────
router.get('/', async (req, res, next) => {
  let properties;
  try {
    properties = await loadProperties();
  } catch (err) {
    return next(err);
  }

  const { type, status, city, minPrice, maxPrice, bedrooms, featured } = req.query;

  const sType     = str(type);
  const sStatus   = str(status);
  const sCity     = str(city);
  const sMinPrice = str(minPrice);
  const sMaxPrice = str(maxPrice);
  const sBedrooms = str(bedrooms);
  const sFeatured = str(featured);

  if (sType)     properties = properties.filter(p => p.type === sType);
  if (sStatus)   properties = properties.filter(p => p.status === sStatus);
  if (sCity)     properties = properties.filter(p => p.city.toLowerCase() === sCity.toLowerCase());
  if (sMinPrice) properties = properties.filter(p => p.price >= Number(sMinPrice));
  if (sMaxPrice) properties = properties.filter(p => p.price <= Number(sMaxPrice));
  if (sBedrooms) properties = properties.filter(p => p.bedrooms >= Number(sBedrooms));
  if (sFeatured) properties = properties.filter(p => p.featured === (sFeatured === 'true'));

  res.json(properties);
});

// ── GET /api/properties/featured ─────────────────────────────────────────────
router.get('/featured', async (req, res, next) => {
  let properties;
  try {
    properties = await loadProperties();
  } catch (err) {
    return next(err);
  }
  res.json(properties.filter(p => p.featured));
});

// ── GET /api/properties/:id ───────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid property ID' });

  let property;
  try {
    if (USE_FIRESTORE) {
      const snapshot = await db.collection('properties')
        .where('id', '==', id)
        .limit(1)
        .get();
      property = snapshot.empty ? null : snapshot.docs[0].data();
    } else {
      const properties = await loadProperties();
      property = properties.find(p => p.id === id) || null;
    }
  } catch (err) {
    return next(err);
  }

  if (!property) return res.status(404).json({ error: 'Property not found' });

  res.json(property);
});

module.exports = router;
