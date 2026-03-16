'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'properties.json');

function loadProperties() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

// GET /api/properties - list all properties with optional filters
router.get('/', (req, res) => {
  let properties = loadProperties();

  const { type, status, city, minPrice, maxPrice, bedrooms, featured } = req.query;

  if (type) {
    properties = properties.filter(p => p.type === type);
  }
  if (status) {
    properties = properties.filter(p => p.status === status);
  }
  if (city) {
    properties = properties.filter(p =>
      p.city.toLowerCase().includes(city.toLowerCase())
    );
  }
  if (minPrice) {
    const min = parseInt(minPrice, 10);
    if (!isNaN(min)) {
      properties = properties.filter(p => p.price >= min);
    }
  }
  if (maxPrice) {
    const max = parseInt(maxPrice, 10);
    if (!isNaN(max)) {
      properties = properties.filter(p => p.price <= max);
    }
  }
  if (bedrooms) {
    const beds = parseInt(bedrooms, 10);
    if (!isNaN(beds)) {
      properties = properties.filter(p => p.bedrooms >= beds);
    }
  }
  if (featured === 'true') {
    properties = properties.filter(p => p.featured === true);
  }

  res.json({ success: true, count: properties.length, data: properties });
});

// GET /api/properties/featured - get featured properties
router.get('/featured', (req, res) => {
  const properties = loadProperties().filter(p => p.featured === true);
  res.json({ success: true, count: properties.length, data: properties });
});

// GET /api/properties/:id - get a single property
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: 'Invalid property ID' });
  }
  const property = loadProperties().find(p => p.id === id);
  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }
  res.json({ success: true, data: property });
});

module.exports = router;
