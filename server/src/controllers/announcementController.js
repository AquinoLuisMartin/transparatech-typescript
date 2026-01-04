const { asyncHandler } = require('../utils/asyncHandler');
const pool = require('../config/database');

// @desc    Get all announcements
// @route   GET /api/v1/announcements
// @access  Private
const getAnnouncements = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const category = req.query.category;
  const offset = (page - 1) * limit;

  let query = `
    SELECT 
      id, 
      title, 
      category, 
      priority, 
      content, 
      author, 
      is_sticky,
      views,
      tags,
      created_at as publish_date,
      updated_at
    FROM announcements
    WHERE 1=1
  `;

  const params = [];
  if (category && category !== 'All') {
    query += ` AND category = $${params.length + 1}`;
    params.push(category);
  }

  query += ` ORDER BY is_sticky DESC, created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);

  res.status(200).json({
    success: true,
    count: result.rows.length,
    data: result.rows
  });
});

// @desc    Get single announcement
// @route   GET /api/v1/announcements/:id
// @access  Private
const getAnnouncement = asyncHandler(async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM announcements WHERE id = $1',
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Announcement not found'
    });
  }

  // Increment view count
  await pool.query(
    'UPDATE announcements SET views = views + 1 WHERE id = $1',
    [req.params.id]
  );

  res.status(200).json({
    success: true,
    data: result.rows[0]
  });
});

// @desc    Create announcement
// @route   POST /api/v1/announcements
// @access  Private (Admin/Officer)
const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, category, priority, content, isSticky, tags } = req.body;

  if (!title || !category || !content) {
    return res.status(400).json({
      success: false,
      message: 'Please provide title, category, and content'
    });
  }

  const author = `${req.user.first_name} ${req.user.last_name}`;

  const result = await pool.query(
    `INSERT INTO announcements (title, category, priority, content, author, is_sticky, tags)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [title, category, priority || 'medium', content, author, isSticky || false, JSON.stringify(tags || [])]
  );

  res.status(201).json({
    success: true,
    data: result.rows[0]
  });
});

// @desc    Update announcement
// @route   PUT /api/v1/announcements/:id
// @access  Private (Admin/Officer)
const updateAnnouncement = asyncHandler(async (req, res) => {
  const { title, category, priority, content, isSticky, tags } = req.body;

  const result = await pool.query(
    `UPDATE announcements 
     SET title = COALESCE($1, title),
         category = COALESCE($2, category),
         priority = COALESCE($3, priority),
         content = COALESCE($4, content),
         is_sticky = COALESCE($5, is_sticky),
         tags = COALESCE($6, tags),
         updated_at = NOW()
     WHERE id = $7
     RETURNING *`,
    [title, category, priority, content, isSticky, tags ? JSON.stringify(tags) : null, req.params.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Announcement not found'
    });
  }

  res.status(200).json({
    success: true,
    data: result.rows[0]
  });
});

// @desc    Delete announcement
// @route   DELETE /api/v1/announcements/:id
// @access  Private (Admin)
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const result = await pool.query(
    'DELETE FROM announcements WHERE id = $1 RETURNING id',
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Announcement not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Announcement deleted successfully'
  });
});

// @desc    Get announcement categories
// @route   GET /api/v1/announcements/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
  const categories = [
    "System Update",
    "Meeting",
    "Policy",
    "Schedule",
    "Community",
    "Technical"
  ];

  res.status(200).json({
    success: true,
    data: categories
  });
});

module.exports = {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getCategories
};
