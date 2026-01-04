const { asyncHandler } = require('../utils/asyncHandler');
const pool = require('../config/database');

// @desc    Get all documents
// @route   GET /api/v1/documents
// @access  Private
const getDocuments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const category = req.query.category;
  const offset = (page - 1) * limit;

  // Use submissions table with type='document'
  let query = `
    SELECT 
      s.id,
      s.title,
      s.category,
      s.description,
      s.files,
      s.created_at as upload_date,
      s.updated_at,
      u.first_name,
      u.last_name
    FROM submissions s
    LEFT JOIN users u ON s.user_id = u.id
    WHERE s.type = 'document' AND s.status = 'approved'
  `;

  const params = [];
  if (category && category !== 'All') {
    query += ` AND s.category = $${params.length + 1}`;
    params.push(category);
  }

  query += ` ORDER BY s.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);

  // Format the response
  const documents = result.rows.map(row => ({
    id: row.id,
    title: row.title,
    category: row.category || 'General',
    uploadDate: row.upload_date,
    size: '2.3 MB', // Mock for now, we can add this to DB later
    type: 'PDF',
    description: row.description,
    fileUrl: row.files && row.files.length > 0 ? `/uploads/${row.files[0]}` : null,
    uploadedBy: `${row.first_name} ${row.last_name}`
  }));

  res.status(200).json({
    success: true,
    count: documents.length,
    data: documents
  });
});

// @desc    Get single document
// @route   GET /api/v1/documents/:id
// @access  Private
const getDocument = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT 
      s.id,
      s.title,
      s.category,
      s.description,
      s.files,
      s.created_at as upload_date,
      s.updated_at,
      u.first_name,
      u.last_name,
      u.email
    FROM submissions s
    LEFT JOIN users u ON s.user_id = u.id
    WHERE s.id = $1 AND s.type = 'document'`,
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Document not found'
    });
  }

  const row = result.rows[0];
  const document = {
    id: row.id,
    title: row.title,
    category: row.category || 'General',
    uploadDate: row.upload_date,
    size: '2.3 MB',
    type: 'PDF',
    description: row.description,
    fileUrl: row.files && row.files.length > 0 ? `/uploads/${row.files[0]}` : null,
    uploadedBy: `${row.first_name} ${row.last_name}`,
    uploaderEmail: row.email
  };

  res.status(200).json({
    success: true,
    data: document
  });
});

// @desc    Get document categories
// @route   GET /api/v1/documents/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
  const categories = [
    "Financial Report",
    "Turnover of Assets",
    "Expense Summary",
    "Policy Document",
    "Meeting Minutes",
    "Other"
  ];

  res.status(200).json({
    success: true,
    data: categories
  });
});

module.exports = {
  getDocuments,
  getDocument,
  getCategories
};
