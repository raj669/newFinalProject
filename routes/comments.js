'use strict';

const express = require('express');
const router = express.Router();
const { query, getOne, getAll } = require('../config/database');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Mock data for admin comment management (when database is unavailable)
const mockComments = [
  {
    id: 1,
    property_id: 1,
    user_id: 3,
    first_name: 'Jane',
    last_name: 'Buyer',
    text: 'Great property! Very interested.',
    comment_text: 'Great property! Very interested.',
    status: 'pending',
    is_approved: false,
    created_at: new Date()
  }
];

/**
 * GET /api/comments (admin - mock endpoint)
 * Get all comments
 */
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const total = mockComments.length;
    const pages = Math.ceil(total / limit);
    const paged = mockComments.slice(offset, offset + limit);

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
      message: 'Error loading comments',
      error: error.message
    });
  }
});

/**
 * GET /api/comments/admin/pending (mock endpoint)
 * Get pending comments for admin review
 */
router.get('/admin/pending', (req, res) => {
  try {
    const pending = mockComments.filter(c => !c.is_approved || c.status === 'pending');
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const total = pending.length;
    const pages = Math.ceil(total / limit);
    const paged = pending.slice(offset, offset + limit);

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
      message: 'Error loading pending comments',
      error: error.message
    });
  }
});

/**
 * POST /api/comments/:id/approve (mock endpoint)
 * Approve a pending comment
 */
router.post('/:id/approve', (req, res) => {
  try {
    const commentId = parseInt(req.params.id);
    const comment = mockComments.find(c => c.id === commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    comment.status = 'approved';
    comment.is_approved = true;

    res.json({
      success: true,
      message: 'Comment approved',
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving comment',
      error: error.message
    });
  }
});

/**
 * GET /api/comments/property/:propertyId
 * Get all comments for a property
 */
router.get('/property/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Verify property exists
    const property = await getOne('SELECT id FROM properties WHERE id = $1', [propertyId]);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Get comments
    const result = await query(
      `SELECT pc.id, pc.comment_text, pc.rating, pc.created_at, u.id as user_id, u.first_name, u.last_name
       FROM property_comments pc
       JOIN users u ON pc.user_id = u.id
       WHERE pc.property_id = $1 AND pc.is_approved = true
       ORDER BY pc.created_at DESC
       LIMIT $2 OFFSET $3`,
      [propertyId, limit, offset]
    );

    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) FROM property_comments WHERE property_id = $1 AND is_approved = true',
      [propertyId]
    );
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
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: error.message,
    });
  }
});

/**
 * POST /api/comments
 * Create a new comment (requires authentication)
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { propertyId, commentText, rating } = req.body;
    const userId = req.user.id;

    // Validation
    if (!propertyId || !commentText) {
      return res.status(400).json({
        success: false,
        message: 'Property ID and comment text are required',
      });
    }

    if (commentText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty',
      });
    }

    if (commentText.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Comment is too long (max 5000 characters)',
      });
    }

    // Verify property exists
    const property = await getOne('SELECT id FROM properties WHERE id = $1', [propertyId]);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    // Create comment
    const result = await query(
      `INSERT INTO property_comments (property_id, user_id, comment_text, rating, is_approved)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [propertyId, userId, commentText, rating || null, true]
    );

    const comment = result.rows[0];

    // Get user info
    const user = await getOne('SELECT first_name, last_name FROM users WHERE id = $1', [userId]);

    res.status(201).json({
      success: true,
      message: 'Comment posted successfully',
      data: {
        ...comment,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create comment',
      error: error.message,
    });
  }
});

/**
 * GET /api/comments/:id
 * Get a single comment
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await getOne(
      `SELECT pc.*, u.first_name, u.last_name
       FROM property_comments pc
       JOIN users u ON pc.user_id = u.id
       WHERE pc.id = $1`,
      [id]
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    res.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comment',
      error: error.message,
    });
  }
});

/**
 * PUT /api/comments/:id
 * Update a comment (only by the comment author or admin)
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { commentText, rating } = req.body;
    const userId = req.user.id;

    // Get comment
    const comment = await getOne('SELECT * FROM property_comments WHERE id = $1', [id]);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check authorization
    if (comment.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment',
      });
    }

    // Validate input
    if (commentText && commentText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty',
      });
    }

    if (commentText && commentText.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Comment is too long (max 5000 characters)',
      });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    // Update comment
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (commentText) {
      updates.push(`comment_text = $${paramIndex++}`);
      params.push(commentText);
    }

    if (rating !== undefined) {
      updates.push(`rating = $${paramIndex++}`);
      params.push(rating);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update',
      });
    }

    updates.push('updated_at = NOW()');
    params.push(id);

    const result = await query(
      `UPDATE property_comments SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update comment',
      error: error.message,
    });
  }
});

/**
 * DELETE /api/comments/:id
 * Delete a comment (only by the comment author or admin)
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get comment
    const comment = await getOne('SELECT * FROM property_comments WHERE id = $1', [id]);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check authorization
    if (comment.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }

    // Delete comment
    await query('DELETE FROM property_comments WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
      error: error.message,
    });
  }
});

/**
 * GET /api/comments/admin/pending
 * Get pending comments (admin only)
 */
router.get('/admin/pending', [verifyToken], async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access this endpoint',
      });
    }

    const result = await query(
      `SELECT pc.id, pc.comment_text, pc.rating, pc.created_at, u.first_name, u.last_name, p.title, p.id as property_id
       FROM property_comments pc
       JOIN users u ON pc.user_id = u.id
       JOIN properties p ON pc.property_id = p.id
       WHERE pc.is_approved = false
       ORDER BY pc.created_at ASC`
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching pending comments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending comments',
      error: error.message,
    });
  }
});

/**
 * POST /api/comments/:id/approve
 * Approve a comment (admin only)
 */
router.post('/:id/approve', [verifyToken], async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can approve comments',
      });
    }

    const { id } = req.params;

    const result = await query(
      `UPDATE property_comments SET is_approved = true, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    res.json({
      success: true,
      message: 'Comment approved successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error approving comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve comment',
      error: error.message,
    });
  }
});

module.exports = router;
