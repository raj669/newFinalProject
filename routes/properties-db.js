'use strict';

const express = require('express');
const multer = require('multer');
const path = require('path');
const { query, getAll, getOne } = require('../config/database');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { maxFileSize } = require('../config/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/properties'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'property-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: maxFileSize },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * GET /api/properties-db
 * Get all properties or filtered results (database version)
 */
router.get('/', async (req, res) => {
  try {
    const { type, status, city, minPrice, maxPrice, bedrooms, featured } = req.query;

    let whereConditions = [];
    let params = [];
    let paramCount = 1;

    if (type) {
      whereConditions.push(`type = $${paramCount++}`);
      params.push(type);
    }
    if (status) {
      whereConditions.push(`status = $${paramCount++}`);
      params.push(status);
    }
    if (city) {
      whereConditions.push(`city ILIKE $${paramCount++}`);
      params.push(`%${city}%`);
    }
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        whereConditions.push(`price >= $${paramCount++}`);
        params.push(min);
      }
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        whereConditions.push(`price <= $${paramCount++}`);
        params.push(max);
      }
    }
    if (bedrooms) {
      const beds = parseInt(bedrooms, 10);
      if (!isNaN(beds)) {
        whereConditions.push(`bedrooms >= $${paramCount++}`);
        params.push(beds);
      }
    }
    if (featured === 'true') {
      whereConditions.push(`featured = true`);
    }

    const whereClause = whereConditions.length > 0
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    const sqlQuery = `
      SELECT p.id, p.title, p.type, p.status, p.price, p.bedrooms, p.bathrooms,
             p.area, p.area_unit, p.city, p.district, p.address, p.description,
             p.contact, p.featured, p.listed_date, p.view_count,
             u.first_name as seller_name,
             (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image,
             (SELECT json_agg(feature_name) FROM property_features WHERE property_id = p.id) as features
      FROM properties p
      LEFT JOIN users u ON p.seller_id = u.id
      ${whereClause}
      ORDER BY p.listed_date DESC, p.featured DESC
    `;

    const result = await query(sqlQuery, params);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Fetch properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties',
      error: error.message,
    });
  }
});

/**
 * GET /api/properties-db/:id
 * Get single property details
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    const property = await getOne(
      `SELECT p.id, p.title, p.type, p.status, p.price, p.bedrooms, p.bathrooms,
              p.area, p.area_unit, p.city, p.district, p.address, p.description,
              p.contact, p.featured, p.listed_date, p.view_count,
              u.first_name, u.last_name, u.phone,
              (SELECT json_agg(json_build_object('id', id, 'url', image_url, 'isPrimary', is_primary))
               FROM property_images WHERE property_id = p.id) as images,
              (SELECT json_agg(feature_name) FROM property_features WHERE property_id = p.id) as features
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

    // Increment view count
    await query('UPDATE properties SET view_count = view_count + 1 WHERE id = $1', [id]);

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('Fetch property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch property',
      error: error.message,
    });
  }
});

/**
 * GET /api/properties-db/featured
 * Get featured properties
 */
router.get('/featured', async (req, res) => {
  try {
    const properties = await getAll(
      `SELECT p.id, p.title, p.type, p.status, p.price, p.bedrooms, p.bathrooms,
              p.area, p.area_unit, p.city, p.district, p.address,
              (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
       FROM properties p
       WHERE featured = TRUE
       ORDER BY p.listed_date DESC
       LIMIT 12`,
      []
    );

    res.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error('Fetch featured properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured properties',
      error: error.message,
    });
  }
});

/**
 * POST /api/properties-db
 * Create new property (requires authentication as seller/admin)
 */
router.post('/', verifyToken, upload.array('images', 5), async (req, res) => {
  try {
    const {
      title, type, status, price, bedrooms, bathrooms, 
      area, areaUnit, city, district, address, description, contact, features = []
    } = req.body;

    // Validation
    if (!title || !type || !status || !price || !city) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, type, status, price, city',
      });
    }

    // Insert property
    const propResult = await query(
      `INSERT INTO properties 
       (seller_id, title, type, status, price, bedrooms, bathrooms, area, area_unit, city, district, address, description, contact)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING id`,
      [req.user.id, title, type, status, parseFloat(price), bedrooms || 0, bathrooms || 0,
       area, areaUnit || 'sqft', city, district, address, description, contact]
    );

    const propertyId = propResult.rows[0].id;

    // Insert features
    if (Array.isArray(features) && features.length > 0) {
      for (const feature of features) {
        await query(
          'INSERT INTO property_features (property_id, feature_name) VALUES ($1, $2)',
          [propertyId, feature]
        );
      }
    }

    // Insert images
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        await query(
          'INSERT INTO property_images (property_id, image_url, is_primary) VALUES ($1, $2, $3)',
          [propertyId, `/uploads/properties/${req.files[i].filename}`, i === 0]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      propertyId,
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create property',
      error: error.message,
    });
  }
});

/**
 * PUT /api/properties-db/:id
 * Update property (requires ownership or admin)
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    // Check ownership
    const property = await getOne(
      'SELECT seller_id FROM properties WHERE id = $1',
      [id]
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    if (property.seller_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this property',
      });
    }

    const { title, type, status, price, bedrooms, bathrooms, area, areaUnit, city, district, address, description, contact, featured } = req.body;

    const result = await query(
      `UPDATE properties 
       SET title = COALESCE($2, title),
           type = COALESCE($3, type),
           status = COALESCE($4, status),
           price = COALESCE($5, price),
           bedrooms = COALESCE($6, bedrooms),
           bathrooms = COALESCE($7, bathrooms),
           area = COALESCE($8, area),
           area_unit = COALESCE($9, area_unit),
           city = COALESCE($10, city),
           district = COALESCE($11, district),
           address = COALESCE($12, address),
           description = COALESCE($13, description),
           contact = COALESCE($14, contact),
           featured = COALESCE($15, featured),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id`,
      [id, title, type, status, price ? parseFloat(price) : null, bedrooms, bathrooms, area, areaUnit, city, district, address, description, contact, featured]
    );

    res.json({
      success: true,
      message: 'Property updated successfully',
      propertyId: result.rows[0].id,
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update property',
      error: error.message,
    });
  }
});

/**
 * DELETE /api/properties-db/:id
 * Delete property (requires ownership or admin)
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    // Check ownership
    const property = await getOne(
      'SELECT seller_id FROM properties WHERE id = $1',
      [id]
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    if (property.seller_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this property',
      });
    }

    await query('DELETE FROM properties WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete property',
      error: error.message,
    });
  }
});

module.exports = router;
