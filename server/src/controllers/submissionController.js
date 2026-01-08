const SubmissionService = require('../services/SubmissionService');
const { asyncHandler } = require('../utils/asyncHandler');

// @desc    Create new submission
// @route   POST /api/v1/submissions
// @access  Private
const createSubmission = asyncHandler(async (req, res) => {
  console.log('Create Submission Request Received');
  console.log('Body:', req.body);
  console.log('Files:', req.files);

  const { title, category, type, description, priority } = req.body;
  
  // Handle files from multer
  const files = req.files ? req.files.map(file => file.filename) : [];

  if (!title) {
    console.error('Missing title in submission');
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    });
  }

  const submission = await SubmissionService.create({
    title,
    category,
    type,
    description,
    priority,
    files,
    userId: req.user.id
  });

  res.status(201).json({
    success: true,
    data: submission
  });
});

// @desc    Get all submissions
// @route   GET /api/v1/submissions
// @access  Private (Admin/Officer)
const getSubmissions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // If user is not admin/officer, only return their own submissions
  // This logic depends on your role implementation. 
  // Assuming roleId 1=Admin, 2=Officer, 3=Viewer/Member
  if (req.user.roleId > 2) {
    const submissions = await SubmissionService.findByUserId(req.user.id);
    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  }

  const submissions = await SubmissionService.findAll(limit, offset);

  res.status(200).json({
    success: true,
    count: submissions.length,
    data: submissions
  });
});

// @desc    Get single submission
// @route   GET /api/v1/submissions/:id
// @access  Private
const getSubmission = asyncHandler(async (req, res) => {
  const submission = await SubmissionService.findById(req.params.id);

  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found'
    });
  }

  // Check ownership if not admin/officer
  if (req.user.roleId > 2 && submission.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this submission'
    });
  }

  res.status(200).json({
    success: true,
    data: submission
  });
});

// @desc    Update submission status
// @route   PUT /api/v1/submissions/:id/status
// @access  Private (Admin/Officer)
const updateSubmissionStatus = asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  const submission = await SubmissionService.updateStatus(
    req.params.id,
    status,
    req.user.id, // Reviewer ID
    rejectionReason || null
  );

  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found'
    });
  }

  res.status(200).json({
    success: true,
    data: submission
  });
});

// @desc    Get submission stats
// @route   GET /api/v1/submissions/stats
// @access  Private
const getSubmissionStats = asyncHandler(async (req, res) => {
  // If user is a viewer, filter by their organization
  const organization = req.user.roleId === 3 ? req.user.organization : null;
  
  if (req.user.roleId === 3) {
    console.log(`Stats Request for Viewer: ${req.user.email} (Org: ${organization})`);
  }

  const stats = await SubmissionService.getStats(organization);
  
  // Add mock views count since it's not in DB yet
  stats.views = 12500; // Mock value matching the UI for now
  
  if (req.user.roleId === 3) {
    console.log('Stats Result for Viewer:', stats);
  }

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Get public submissions
// @route   GET /api/v1/submissions/public
// @access  Private
const getPublicSubmissions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  console.log('Get Public Submissions - User Info:', {
    roleId: req.user.roleId,
    organization: req.user.organization,
    email: req.user.email
  });

  // If user is a viewer, filter by their organization
  let submissions;
  if (req.user.roleId === 3) {
    if (req.user.organization) {
      console.log('Fetching submissions for organization:', req.user.organization);
      submissions = await SubmissionService.findPublicByOrganization(req.user.organization, limit, offset);
    } else {
      console.log('Viewer has no organization assigned. Returning empty list.');
      submissions = [];
    }
  } else {
    console.log('Fetching all public submissions (admin/officer)');
    submissions = await SubmissionService.findPublic(limit, offset);
  }

  console.log('Found submissions:', submissions.length);

  res.status(200).json({
    success: true,
    count: submissions.length,
    data: submissions
  });
});

// @desc    Get notifications (recent activity)
// @route   GET /api/v1/submissions/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const activities = await SubmissionService.getRecentActivity();
  
  // Transform activities to notification format
  const notifications = activities.map(activity => {
    let message = '';
    let type = 'project'; // default
    
    if (activity.status === 'pending') {
      message = 'submitted a new request';
    } else if (activity.status === 'approved') {
      message = 'submission was approved';
    } else if (activity.status === 'rejected') {
      message = 'submission was rejected';
    } else {
      message = 'updated a submission';
    }

    return {
      id: activity.id.toString(),
      user: {
        name: `${activity.first_name} ${activity.last_name}`,
        avatar: null, // Frontend handles missing avatar
        isOnline: true, // Mock
      },
      message: message,
      project: activity.title,
      type: type,
      timestamp: activity.updated_at || activity.created_at,
      isRead: false, // Mock
    };
  });

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications
  });
});

// @desc    Get submission categories
// @route   GET /api/v1/submissions/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
  const categories = [
    'Financial Report',
    'Turnover of Assets',
    'Expense Summary'
  ];

  res.status(200).json({
    success: true,
    data: categories
  });
});

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmission,
  updateSubmissionStatus,
  getSubmissionStats,
  getPublicSubmissions,
  getNotifications,
  getCategories
};
