'use strict';

const express = require('express');
const { query, getAll, getOne } = require('../config/database');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * GET /api/bookmarks
 * Get user's bookmarked properties (requires authentication)
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const bookmarks = await getAll(
      `SELECT p.id, p.title, p.type, p.status, p.price, p.bedrooms, p.bathrooms, 
              p.area, p.area_unit, p.city, p.address, p.featured,
              p.created_at, ub.created_at as bookmarked_at,
              (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
       FROM properties p
       INNER JOIN user_bookmarks ub ON p.id = ub.property_id
       WHERE ub.user_id = $1
       ORDER BY ub.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    });
  } catch (error) {
    console.error('Fetch bookmarks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookmarks',
      error: error.message,
    });
  }
});

/**
 * POST /api/bookmarks/:propertyId
 * Add property to bookmarks (requires authentication)
 */
router.post('/:propertyId', verifyToken, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const parsedId = parseInt(propertyId, 10);

    if (isNaN(parsedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    // Check if property exists
    const property = await getOne(
      'SELECT id FROM properties WHERE id = $1',
      [parsedId]
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check if already bookmarked
    const existing = await getOne(
      'SELECT id FROM user_bookmarks WHERE user_id = $1 AND property_id = $2',
      [req.user.id, parsedId]
    );

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Property already bookmarked',
      });
    }

    // Add bookmark
    const result = await query(
      'INSERT INTO user_bookmarks (user_id, property_id) VALUES ($1, $2) RETURNING id, created_at',
      [req.user.id, parsedId]
    );

    res.status(201).json({
      success: true,
      message: 'Property bookmarked successfully',
      bookmark: result.rows[0],
    });
  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bookmark property',
      error: error.message,
    });
  }
});

/**
 * DELETE /api/bookmarks/:propertyId
 * Remove property from bookmarks (requires authentication)
 */
router.delete('/:propertyId', verifyToken, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const parsedId = parseInt(propertyId, 10);

    if (isNaN(parsedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    const result = await query(
      'DELETE FROM user_bookmarks WHERE user_id = $1 AND property_id = $2',
      [req.user.id, parsedId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found',
      });
    }

    res.json({
      success: true,
      message: 'Bookmark removed successfully',
    });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove bookmark',
      error: error.message,
    });
  }
});

/**
 * GET /api/bookmarks/check/:propertyId
 * Check if property is bookmarked by user (requires authentication)
 */
router.get('/check/:propertyId', verifyToken, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const parsedId = parseInt(propertyId, 10);

    if (isNaN(parsedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    const bookmark = await getOne(
      'SELECT id FROM user_bookmarks WHERE user_id = $1 AND property_id = $2',
      [req.user.id, parsedId]
    );

    res.json({
      success: true,
      isBookmarked: !!bookmark,
    });
  } catch (error) {
    console.error('Check bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check bookmark status',
      error: error.message,
    });
  }
});

module.exports = router;
