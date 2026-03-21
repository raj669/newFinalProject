'use strict';

const express = require('express');
const router = express.Router();
const { query, getOne, getAll } = require('../config/database');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

/**
 * Middleware to verify admin access
 */
const requireAdmin = [verifyToken, verifyAdmin];

/**
 * GET /api/admin/properties
 * Get all properties (with filtering options)
 */
router.get('/properties', requireAdmin, async (req, res) => {
  try {
    const { approval_status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT p.*, u.first_name, u.last_name, u.email, pv.verification_status
      FROM properties p
      LEFT JOIN users u ON p.seller_id = u.id
      LEFT JOIN property_verifications pv ON p.id = pv.property_id
    `;

    const params = [];

    if (approval_status) {
      sql += ` WHERE p.approval_status = $${params.length + 1}`;
      params.push(approval_status);
    }

    sql += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    
    // Get total count
    let countSql = 'SELECT COUNT(*) FROM properties WHERE approval_status = $1';
    const countParams = approval_status ? [approval_status] : [];
    if (!approval_status) {
      countSql = 'SELECT COUNT(*) FROM properties';
    }
    const countResult = await query(countSql, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties',
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/properties/:id
 * Get a single property with all details
 */
router.get('/properties/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const property = await getOne(
      `SELECT p.*, u.first_name, u.last_name, u.email, u.phone
       FROM properties p
       LEFT JOIN users u ON p.seller_id = u.id
       WHERE p.id = $1`,
      [id]
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Get images
    const images = await getAll(
      'SELECT id, image_url, is_primary FROM property_images WHERE property_id = $1 ORDER BY is_primary DESC',
      [id]
    );

    // Get features
    const features = await getAll(
      'SELECT feature_name FROM property_features WHERE property_id = $1',
      [id]
    );

    // Get verification status
    const verification = await getOne(
      'SELECT * FROM property_verifications WHERE property_id = $1',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...property,
        images: images,
        features: features.map(f => f.feature_name),
        verification,
      },
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch property',
      error: error.message,
    });
  }
});

/**
 * POST /api/admin/properties
 * Create a new property (admin)
 */
router.post('/properties', requireAdmin, async (req, res) => {
  try {
    const {
      title,
      type,
      status,
      price,
      bedrooms,
      bathrooms,
      area,
      area_unit,
      city,
      district,
      address,
      description,
      contact,
      featured,
      seller_id,
      images,
      features,
    } = req.body;

    // Validate required fields
    if (!title || !type || !status || !price || !area || !city) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Create property
    const result = await query(
      `INSERT INTO properties (
        seller_id, title, type, status, price, bedrooms, bathrooms, 
        area, area_unit, city, district, address, description, contact, featured, approval_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        seller_id || null,
        title,
        type,
        status,
        price,
        bedrooms || 0,
        bathrooms || 0,
        area,
        area_unit || 'sqft',
        city,
        district || null,
        address || null,
        description || null,
        contact || null,
        featured || false,
        'approved', // Admin-created properties are automatically approved
      ]
    );

    const property = result.rows[0];

    // Add images if provided
    if (images && Array.isArray(images)) {
      for (const image of images) {
        await query(
          'INSERT INTO property_images (property_id, image_url, is_primary) VALUES ($1, $2, $3)',
          [property.id, image.url, image.is_primary || false]
        );
      }
    }

    // Add features if provided
    if (features && Array.isArray(features)) {
      for (const feature of features) {
        await query(
          'INSERT INTO property_features (property_id, feature_name) VALUES ($1, $2)',
          [property.id, feature]
        );
      }
    }

    // Create verification record
    await query(
      `INSERT INTO property_verifications (property_id, verified_by, verification_status, verification_date)
       VALUES ($1, $2, $3, NOW())`,
      [property.id, req.user.id, 'approved']
    );

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property,
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create property',
      error: error.message,
    });
  }
});

/**
 * PUT /api/admin/properties/:id
 * Update a property
 */
router.put('/properties/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic SQL for updates
    const allowedFields = [
      'title',
      'type',
      'status',
      'price',
      'bedrooms',
      'bathrooms',
      'area',
      'area_unit',
      'city',
      'district',
      'address',
      'description',
      'contact',
      'featured',
    ];

    const updates_sql = [];
    const params = [];
    let paramIndex = 1;

    allowedFields.forEach(field => {
      if (field in updates) {
        updates_sql.push(`${field} = $${paramIndex++}`);
        params.push(updates[field]);
      }
    });

    if (updates_sql.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update',
      });
    }

    params.push(id);
    updates_sql.push('updated_at = NOW()');

    const result = await query(
      `UPDATE properties SET ${updates_sql.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update property',
      error: error.message,
    });
  }
});

/**
 * DELETE /api/admin/properties/:id
 * Delete a property
 */
router.delete('/properties/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Delete property (cascades will remove related records)
    const result = await query(
      'DELETE FROM properties WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    res.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete property',
      error: error.message,
    });
  }
});

/**
 * POST /api/admin/properties/:id/approve
 * Approve a property
 */
router.post('/properties/:id/approve', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    // Update approval status
    const propertyResult = await query(
      `UPDATE properties SET approval_status = 'approved', updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );

    if (propertyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Update or create verification record
    const verifyResult = await query(
      `UPDATE property_verifications 
       SET verification_status = 'approved', verified_by = $1, verification_date = NOW(), comments = $2, updated_at = NOW()
       WHERE property_id = $3
       RETURNING *`,
      [req.user.id, comments || null, id]
    );

    if (verifyResult.rows.length === 0) {
      // Create verification record if it doesn't exist
      await query(
        `INSERT INTO property_verifications (property_id, verified_by, verification_status, verification_date, comments)
         VALUES ($1, $2, 'approved', NOW(), $3)`,
        [id, req.user.id, comments || null]
      );
    }

    res.json({
      success: true,
      message: 'Property approved successfully',
      data: propertyResult.rows[0],
    });
  } catch (error) {
    console.error('Error approving property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve property',
      error: error.message,
    });
  }
});

/**
 * POST /api/admin/properties/:id/reject
 * Reject a property
 */
router.post('/properties/:id/reject', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { rejection_reason = '' } = req.body;

    // Update approval status
    const propertyResult = await query(
      `UPDATE properties SET approval_status = 'rejected', updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );

    if (propertyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Update or create verification record
    const verifyResult = await query(
      `UPDATE property_verifications 
       SET verification_status = 'rejected', verified_by = $1, verification_date = NOW(), rejection_reason = $2, updated_at = NOW()
       WHERE property_id = $3
       RETURNING *`,
      [req.user.id, rejection_reason, id]
    );

    if (verifyResult.rows.length === 0) {
      await query(
        `INSERT INTO property_verifications (property_id, verified_by, verification_status, verification_date, rejection_reason)
         VALUES ($1, $2, 'rejected', NOW(), $3)`,
        [id, req.user.id, rejection_reason]
      );
    }

    res.json({
      success: true,
      message: 'Property rejected successfully',
      data: propertyResult.rows[0],
    });
  } catch (error) {
    console.error('Error rejecting property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject property',
      error: error.message,
    });
  }
});

module.exports = router;
