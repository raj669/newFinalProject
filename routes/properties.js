const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

function loadProperties() {
  const filePath = path.join(__dirname, '../data/properties.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

// GET /api/properties  — list all (with optional filters)
router.get('/', (req, res) => {
  let properties = loadProperties();
  const { type, status, city, minPrice, maxPrice, bedrooms, featured } = req.query;

  if (type)     properties = properties.filter(p => p.type === type);
  if (status)   properties = properties.filter(p => p.status === status);
  if (city)     properties = properties.filter(p => p.city.toLowerCase() === city.toLowerCase());
  if (minPrice) properties = properties.filter(p => p.price >= Number(minPrice));
  if (maxPrice) properties = properties.filter(p => p.price <= Number(maxPrice));
  if (bedrooms) properties = properties.filter(p => p.bedrooms >= Number(bedrooms));
  if (featured) properties = properties.filter(p => p.featured === (featured === 'true'));

  res.json(properties);
});

// GET /api/properties/featured
router.get('/featured', (req, res) => {
  const properties = loadProperties().filter(p => p.featured);
  res.json(properties);
});

// GET /api/properties/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid property ID' });

  const property = loadProperties().find(p => p.id === id);
  if (!property) return res.status(404).json({ error: 'Property not found' });

  res.json(property);
});

module.exports = router;
