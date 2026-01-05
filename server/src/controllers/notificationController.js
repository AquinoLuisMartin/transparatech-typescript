const SubmissionService = require('../services/SubmissionService');
const { asyncHandler } = require('../utils/asyncHandler');

// @desc    Get latest notification
// @route   GET /api/v1/notifications/latest
// @access  Private
const getLatestNotification = asyncHandler(async (req, res) => {
  const activities = await SubmissionService.getRecentActivity();
  
  if (!activities || activities.length === 0) {
    return res.status(200).json({});
  }

  const activity = activities[0];
  
  let message = '';
  let type = 'info';
  
  if (activity.status === 'pending') {
    message = `New submission: ${activity.title}`;
    type = 'info';
  } else if (activity.status === 'approved') {
    message = `Submission approved: ${activity.title}`;
    type = 'success';
  } else if (activity.status === 'rejected') {
    message = `Submission rejected: ${activity.title}`;
    type = 'error';
  } else {
    message = `Submission updated: ${activity.title}`;
  }

  // Use timestamp as ID to ensure we catch updates to the same submission
  const timestamp = activity.updated_at || activity.created_at;
  const id = new Date(timestamp).getTime();

  const notification = {
    id: id,
    title: 'System Update',
    message: message,
    type: type,
    timestamp: timestamp
  };

  res.status(200).json(notification);
});

module.exports = {
  getLatestNotification
};
