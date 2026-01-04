const express = require('express');
const { 
  getOrganizations, 
  createOrganization, 
  updateOrganization, 
  deleteOrganization 
} = require('../controllers/organizationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
  .get(getOrganizations)
  .post(authorize('admin'), createOrganization);

router.route('/:id')
  .put(authorize('admin'), updateOrganization)
  .delete(authorize('admin'), deleteOrganization);

module.exports = router;