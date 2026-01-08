const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { hashPassword, validateEmail } = require('../utils/auth');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const users = await User.findAll(limit, offset);
  const total = await User.count();

  res.status(200).json({
    success: true,
    data: {
      users: users.map(user => {
        // Map account_type to role for frontend
        let role = 'viewer';
        const type = (user.account_type || '').toLowerCase();
        
        if (type.includes('admin')) {
          role = 'admin_full';
        } else if (type.includes('officer')) {
          role = 'officer';
        }

        return {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: role,
          organization: user.organization_id || 'N/A',
          createdAt: user.created_at,
          updatedAt: user.updated_at
        };
      }),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Create new user
// @route   POST /api/v1/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
  const { name, firstName, lastName, email, password, role, organization, studentNumber } = req.body;

  // Handle name splitting if provided as a single string
  let fName = firstName;
  let lName = lastName;
  if (!fName && name) {
    const parts = name.split(' ');
    fName = parts[0];
    lName = parts.slice(1).join(' ') || ' ';
  }

  // Check if user already exists
  const userExists = await User.findByEmail(email);
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Map "role" (frontend value) to "accountType" (db value) logic
  let accountType = 'Organization Member (Viewer)';
  if (role === 'admin_full') accountType = 'Administrator';
  else if (role === 'admin_approval') accountType = 'Administrator';
  else if (role === 'officer') accountType = 'Officer';

  const user = await User.create({
    firstName: fName,
    lastName: lName,
    email,
    password: hashedPassword,
    accountType,
    organizationId: organization, // Maps to organizationId in DatabaseService -> organization column
    studentNumber: studentNumber || null,
    middleInitial: ''
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: user
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid user data'
    });
  }
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    }
  });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, role, password } = req.body;
  const updateData = {};

  if (email) {
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email'
      });
    }
    updateData.email = email;
  }

  if (firstName) updateData.first_name = firstName;
  if (lastName) updateData.last_name = lastName;
  if (role) updateData.role = role;

  if (password) {
    updateData.password = await hashPassword(password);
  }

  const user = await User.update(req.params.id, updateData);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        updatedAt: user.updated_at
      }
    }
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.delete(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
};