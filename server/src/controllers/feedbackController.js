const { asyncHandler } = require('../utils/asyncHandler');
const pool = require('../config/database');

// @desc    Submit feedback
// @route   POST /api/v1/feedback
// @access  Private
const submitFeedback = asyncHandler(async (req, res) => {
  const { name, email, subject, category, message, anonymous } = req.body;

  if (!subject || !category || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide subject, category, and message'
    });
  }

  // If anonymous, don't store name and email
  const feedbackName = anonymous ? 'Anonymous' : (name || `${req.user.first_name} ${req.user.last_name}`);
  const feedbackEmail = anonymous ? null : (email || req.user.email);

  const result = await pool.query(
    `INSERT INTO feedback (user_id, name, email, subject, category, message, anonymous, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [req.user.id, feedbackName, feedbackEmail, subject, category, message, anonymous || false, 'pending']
  );

  res.status(201).json({
    success: true,
    message: 'Feedback submitted successfully',
    data: result.rows[0]
  });
});

// @desc    Get all feedback
// @route   GET /api/v1/feedback
// @access  Private (Admin/Officer)
const getFeedback = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const category = req.query.category;
  const status = req.query.status;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM feedback WHERE 1=1';
  const params = [];

  if (category && category !== 'All') {
    query += ` AND category = $${params.length + 1}`;
    params.push(category);
  }

  if (status && status !== 'all') {
    query += ` AND status = $${params.length + 1}`;
    params.push(status);
  }

  query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);

  res.status(200).json({
    success: true,
    count: result.rows.length,
    data: result.rows
  });
});

// @desc    Get single feedback
// @route   GET /api/v1/feedback/:id
// @access  Private (Admin/Officer)
const getFeedbackById = asyncHandler(async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM feedback WHERE id = $1',
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Feedback not found'
    });
  }

  res.status(200).json({
    success: true,
    data: result.rows[0]
  });
});

// @desc    Update feedback status
// @route   PUT /api/v1/feedback/:id
// @access  Private (Admin/Officer)
const updateFeedbackStatus = asyncHandler(async (req, res) => {
  const { status, response } = req.body;

  const result = await pool.query(
    `UPDATE feedback 
     SET status = COALESCE($1, status),
         response = COALESCE($2, response),
         responded_by = $3,
         responded_at = NOW(),
         updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [status, response, req.user.id, req.params.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Feedback not found'
    });
  }

  res.status(200).json({
    success: true,
    data: result.rows[0]
  });
});

// @desc    Get feedback categories
// @route   GET /api/v1/feedback/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
  const categories = [
    'General Feedback',
    'Website Usability',
    'Information Request',
    'Technical Issue',
    'Suggestion for Improvement',
    'Complaint',
    'Compliment',
    'Other'
  ];

  res.status(200).json({
    success: true,
    data: categories
  });
});

module.exports = {
  submitFeedback,
  getFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  getCategories
};
