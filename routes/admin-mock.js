'use strict';

const express = require('express');
const router = express.Router();
const firebase = require('../config/firebase-service');

// Mock data for users, comments, and logs (properties come from Firebase)
const mockUsers = [
  {
    id: 1,
    email: 'raj@gmail.com',
    first_name: 'Raj',
    last_name: 'Kumar',
    role: 'admin',
    created_at: new Date()
  },
  {
    id: 2,
    email: 'seller@example.com',
    first_name: 'John',
    last_name: 'Seller',
    role: 'seller',
    created_at: new Date()
  },
  {
    id: 3,
    email: 'buyer@example.com',
    first_name: 'Jane',
    last_name: 'Buyer',
    role: 'buyer',
    created_at: new Date()
  }
];

const mockLogs = [
  {
    id: 1,
    action: 'Property Created',
    user_id: 2,
    details: 'New property listed',
    timestamp: new Date()
  },
  {
    id: 2,
    action: 'User Registered',
    user_id: 3,
    details: 'New buyer registered',
    timestamp: new Date()
  }
];

/**
 * GET /api/admin/properties
 * Get all properties with pagination
 */
router.get('/properties', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Build filters for Firebase service
    const filters = {};
    if (req.query.approval_status) {
      filters.approval_status = req.query.approval_status;
    }
    if (req.query.type) {
      filters.type = req.query.type;
    }
    if (req.query.status) {
      filters.status = req.query.status;
    }

    // Get filtered properties from Firebase
    let filtered = firebase.getAllProperties(filters);

    const total = filtered.length;
    const pages = Math.ceil(total / limit);
    const paged = filtered.slice(offset, offset + limit);

    res.json({
      success: true,
      data: paged,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error loading properties',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/properties/:id
 * Get a single property
 */
router.get('/properties/:id', (req, res) => {
  try {
    const propId = parseInt(req.params.id);
    const property = firebase.getPropertyById(propId);
    
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

/**
 * GET /api/admin/users
 * Get all users
 */
router.get('/users', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let filtered = mockUsers;
    
    if (req.query.role) {
      filtered = filtered.filter(u => u.role === req.query.role);
    }

    const total = filtered.length;
    const pages = Math.ceil(total / limit);
    const paged = filtered.slice(offset, offset + limit);

    res.json({
      success: true,
      data: paged,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error loading users',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 */
router.get('/stats', (req, res) => {
  try {
    const stats = firebase.getStats();
    res.json({
      success: true,
      data: {
        totalProperties: stats.totalProperties,
        pendingProperties: stats.pendingProperties,
        approvedProperties: stats.approvedProperties,
        rejectedProperties: stats.rejectedProperties,
        totalUsers: mockUsers.length,
        totalComments: mockComments.length,
        recentActivity: mockLogs.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error loading stats',
      error: error.message
    });
  }
});

/**
 * PATCH /api/admin/properties/:id/approve
 * Approve a property
 */
router.patch('/properties/:id/approve', (req, res) => {
  try {
    const propId = parseInt(req.params.id);
    const property = firebase.approveProperty(propId);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    mockLogs.unshift({
      id: mockLogs.length + 1,
      action: 'Property Approved',
      user_id: 1,
      details: `Property ${propId} approved`,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Property approved',
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving property',
      error: error.message
    });
  }
});

/**
 * PATCH /api/admin/properties/:id/reject
 * Reject a property
 */
router.patch('/properties/:id/reject', (req, res) => {
  try {
    const propId = parseInt(req.params.id);
    const property = firebase.rejectProperty(propId);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    mockLogs.unshift({
      id: mockLogs.length + 1,
      action: 'Property Rejected',
      user_id: 1,
      details: `Property ${propId} rejected`,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Property rejected',
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting property',
      error: error.message
    });
  }
});

/**
 * DELETE /api/admin/properties/:id
 * Delete a property
 */
router.delete('/properties/:id', (req, res) => {
  try {
    const propId = parseInt(req.params.id);
    const success = firebase.deleteProperty(propId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    mockLogs.unshift({
      id: mockLogs.length + 1,
      action: 'Property Deleted',
      user_id: 1,
      details: `Property ${propId} deleted`,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Property deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/logs
 * Get activity logs
 */
router.get('/logs', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const total = mockLogs.length;
    const pages = Math.ceil(total / limit);
    const paged = mockLogs.slice(offset, offset + limit);

    res.json({
      success: true,
      data: paged,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error loading logs',
      error: error.message
    });
  }
});

/**
 * DELETE /api/admin/logs
 * Clear all activity logs
 */
router.delete('/logs', (req, res) => {
  try {
    const count = mockLogs.length;
    mockLogs.length = 0;
    res.json({
      success: true,
      message: `Deleted ${count} logs`,
      deletedCount: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing logs',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/properties
 * Create a new property
 */
router.post('/properties', (req, res) => {
  try {
    const propertyData = req.body;
    const newProperty = firebase.createProperty({
      title: propertyData.title,
      type: propertyData.type,
      status: propertyData.status,
      price: propertyData.price,
      city: propertyData.city,
      area: propertyData.area,
      area_unit: propertyData.area_unit || 'sqft',
      bedrooms: propertyData.bedrooms || 0,
      bathrooms: propertyData.bathrooms || 0,
      district: propertyData.district,
      address: propertyData.address,
      description: propertyData.description,
      contact: propertyData.contact,
      featured: propertyData.featured || false,
      approval_status: 'pending'
    });

    mockLogs.unshift({
      id: mockLogs.length + 1,
      action: 'Property Created',
      user_id: 1,
      details: `New property created: ${propertyData.title}`,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Property created successfully',
      data: newProperty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating property',
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/properties/:id
 * Update a property
 */
router.put('/properties/:id', (req, res) => {
  try {
    const propId = parseInt(req.params.id);
    const updates = req.body;
    
    const property = firebase.updateProperty(propId, updates);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    mockLogs.unshift({
      id: mockLogs.length + 1,
      action: 'Property Updated',
      user_id: 1,
      details: `Property ${propId} updated`,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating property',
      error: error.message
    });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete a user
 */
router.delete('/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Prevent deleting admin user
    if (userId === 1) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin user'
      });
    }

    const index = mockUsers.findIndex(u => u.id === userId);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    mockUsers.splice(index, 1);

    mockLogs.unshift({
      id: mockLogs.length + 1,
      action: 'User Deleted',
      user_id: 1,
      details: `User ${userId} deleted`,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

module.exports = router;
