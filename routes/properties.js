'use strict';

const express = require('express');
const router = express.Router();
const firebase = require('../config/firebase-service');

/**
 * GET /api/properties
 * List all properties with optional filters
 */
router.get('/', (req, res) => {
  try {
    const { type, status, city, minPrice, maxPrice, bedrooms, featured, search } = req.query;

    const filters = {};
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (city) filters.city = city;
    if (minPrice) filters.minPrice = parseInt(minPrice);
    if (maxPrice) filters.maxPrice = parseInt(maxPrice);
    if (search) filters.search = search;

    let properties = firebase.getAllProperties(filters);

    // Filter by bedrooms
    if (bedrooms) {
      const beds = parseInt(bedrooms);
      if (!isNaN(beds)) {
        properties = properties.filter(p => p.bedrooms >= beds);
      }
    }

    // Filter by featured
    if (featured === 'true') {
      properties = properties.filter(p => p.featured === true);
    }

    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    console.error('Error loading properties:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading properties',
      error: error.message
    });
  }
});

/**
 * GET /api/properties/featured
 * Get featured properties
 */
router.get('/featured', (req, res) => {
  try {
    const properties = firebase.getAllProperties({}).filter(p => p.featured === true);
    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error loading featured properties',
      error: error.message
    });
  }
});

/**
 * GET /api/properties/:id
 * Get a single property by ID
 */
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      });
    }

    const property = firebase.getPropertyById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error loading property',
      error: error.message
    });
  }
});

module.exports = router;
