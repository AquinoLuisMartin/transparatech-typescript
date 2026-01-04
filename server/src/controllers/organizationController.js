const { asyncHandler } = require('../utils/asyncHandler');
const pool = require('../config/database');

// @desc    Get all organizations
// @route   GET /api/v1/organizations
// @access  Private
const getOrganizations = asyncHandler(async (req, res) => {
  const result = await pool.query('SELECT * FROM organizations ORDER BY name ASC');

  const organizations = await Promise.all(result.rows.map(async (org) => {
    // Count members
    const memberCountRes = await pool.query('SELECT COUNT(*) FROM "SignUp" WHERE organization = $1', [org.name]);
    
    // Count submissions
    const submissionCountRes = await pool.query(
      'SELECT COUNT(*) FROM "Submission" s JOIN "SignUp" u ON s.user_id = u.id WHERE u.organization = $1', 
      [org.name]
    );
    
    return {
      ...org,
      memberCount: parseInt(memberCountRes.rows[0].count),
      submissionCount: parseInt(submissionCountRes.rows[0].count),
      officerCount: 0, // Placeholder
      lastActivity: new Date().toISOString() // Placeholder
    };
  }));

  res.status(200).json({
    success: true,
    count: organizations.length,
    data: organizations
  });
});

// @desc    Create organization
// @route   POST /api/v1/organizations
// @access  Private (Admin)
const createOrganization = asyncHandler(async (req, res) => {
  const { name, acronym, description, establishedDate, contactEmail, president, adviser } = req.body;

  const result = await pool.query(
    `INSERT INTO organizations (name, acronym, description, established_date, contact_email, president, adviser)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [name, acronym, description, establishedDate, contactEmail, president, adviser]
  );

  res.status(201).json({
    success: true,
    data: result.rows[0]
  });
});

// @desc    Update organization
// @route   PUT /api/v1/organizations/:id
// @access  Private (Admin)
const updateOrganization = asyncHandler(async (req, res) => {
  const { name, acronym, description, status, establishedDate, contactEmail, president, adviser } = req.body;
  const { id } = req.params;

  const result = await pool.query(
    `UPDATE organizations 
     SET name = COALESCE($1, name),
         acronym = COALESCE($2, acronym),
         description = COALESCE($3, description),
         status = COALESCE($4, status),
         established_date = COALESCE($5, established_date),
         contact_email = COALESCE($6, contact_email),
         president = COALESCE($7, president),
         adviser = COALESCE($8, adviser),
         updated_at = NOW()
     WHERE id = $9
     RETURNING *`,
    [name, acronym, description, status, establishedDate, contactEmail, president, adviser, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Organization not found'
    });
  }

  res.status(200).json({
    success: true,
    data: result.rows[0]
  });
});

// @desc    Delete organization
// @route   DELETE /api/v1/organizations/:id
// @access  Private (Admin)
const deleteOrganization = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await pool.query('DELETE FROM organizations WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Organization not found'
    });
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization
};