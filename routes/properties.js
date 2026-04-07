const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

function loadProperties() {
  try {
    const filePath = path.join(__dirname, '../data/properties.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    throw new Error('Unable to load property data');
  }
}

// GET /api/properties  — list all (with optional filters)
router.get('/', (req, res, next) => {
  let properties;
  try {
    properties = loadProperties();
  } catch (err) {
    return next(err);
  }

  const { type, status, city, minPrice, maxPrice, bedrooms, featured } = req.query;

  // Guard against array-injection (e.g. ?city[]=foo) — only accept string values
  const str = v => (typeof v === 'string' ? v : undefined);

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

// GET /api/properties/featured
router.get('/featured', (req, res, next) => {
  let properties;
  try {
    properties = loadProperties().filter(p => p.featured);
  } catch (err) {
    return next(err);
  }
  res.json(properties);
});

// GET /api/properties/:id
router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid property ID' });

  let property;
  try {
    property = loadProperties().find(p => p.id === id);
  } catch (err) {
    return next(err);
  }

  if (!property) return res.status(404).json({ error: 'Property not found' });

  res.json(property);
});

module.exports = router;
