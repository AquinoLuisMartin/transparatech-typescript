const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { 
  hashPassword, 
  comparePassword, 
  generateToken,
  generateRefreshToken,
  validateEmail, 
  validatePassword,
  shouldLockAccount,
  calculateLockoutTime,
  generateEmailVerificationToken,
  isPasswordHashed
} = require('../utils/auth');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { 
    email, 
    password, 
    firstName, 
    lastName, 
    middleInitial,
    studentNumber,
    schoolNumber,
    accountType,
    organization 
  } = req.body;

  console.log('====== REGISTRATION REQUEST ======');
  console.log('Body received:', req.body);
  console.log('===================================\n');

  // Validation
  if (!email || !password || !firstName || !lastName || !accountType || !organization) {
    console.log('Missing required fields');
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  if (!validateEmail(email)) {
    console.log('Invalid email');
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email'
    });
  }

  if (!validatePassword(password)) {
    console.log('Password validation failed');
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character'
    });
  }

  // Check if user exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    console.log('User already exists');
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  // Check if student number exists (if provided)
  if (studentNumber) {
    const existingStudentNumber = await User.checkStudentNumberExists(studentNumber);
    if (existingStudentNumber) {
      console.log('Student number already registered');
      return res.status(400).json({
        success: false,
        message: 'Student number already registered'
      });
    }
  }

  // Hash password with enhanced security
  const hashedPassword = await hashPassword(password, 12); // Use 12 rounds for better security
  console.log('✅ Password hashed');

  // Create user
  console.log('📝 Creating user with data:', {
    email,
    firstName,
    lastName,
    middleInitial,
    studentNumber,
    schoolNumber,
    accountType,
    organization
  });

  let user;
  try {
    user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      middleName: middleInitial || null,
      studentNumber: studentNumber && studentNumber.trim() ? studentNumber : null,
      employeeId: schoolNumber && schoolNumber.trim() ? schoolNumber : null,
      organizationId: organization,
      accountType
    });

    console.log('✅ User created:', user);
  } catch (userCreateError) {
    console.error('User creation failed with error:', userCreateError);
    console.error('Error details:', {
      message: userCreateError.message,
      code: userCreateError.code,
      detail: userCreateError.detail,
      constraint: userCreateError.constraint
    });
    throw userCreateError;
  }

  // Generate both access and refresh tokens
  const accessToken = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  console.log('✅ Tokens generated');

  // Set refresh token as httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  console.log('✅ Registration successful for:', email);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        middleInitial: user.middle_name,
        studentNumber: user.student_number,
        schoolNumber: user.employee_id,
        organization: user.organization_id,
        accountType: user.account_type
      },
      accessToken
    }
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password, studentNumber } = req.body;

  console.log('🔐 LOGIN REQUEST DEBUG:');
  console.log('   Email:', email);
  console.log('   Student Number:', studentNumber);
  console.log('   Password received:', password ? 'YES' : 'NO');
  console.log('   Password length:', password ? password.length : 0);
  console.log('   Password value:', password);

  // Validation
  if ((!email && !studentNumber) || !password) {
    console.log('❌ Validation failed: Missing credentials');
    return res.status(400).json({
      success: false,
      message: 'Please provide email or student number and password'
    });
  }

  // Check for user by email or student number
  let user;
  if (email) {
    console.log('🔍 Looking up user by email:', email);
    user = await User.findByEmail(email);
  } else if (studentNumber) {
    console.log('🔍 Looking up user by student number:', studentNumber);
    user = await User.findByStudentNumber(studentNumber);
  }

  if (!user) {
    console.log('❌ User not found');
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  console.log('✅ User found:', user.email);
  console.log('   Stored hash:', user.password);

  // Check password
  console.log('🔑 Comparing passwords...');
  console.log('   Input password:', password);
  console.log('   Stored hash:', user.password);
  
  const isMatch = await comparePassword(password, user.password);
  console.log('   Password match result:', isMatch);
  
  if (!isMatch) {
    console.log('❌ Password comparison failed');
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  console.log('✅ Login successful for:', user.email);

  // Generate tokens
  const accessToken = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Set refresh token as httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        middleInitial: user.middle_name,
        studentNumber: user.student_number,
        schoolNumber: user.employee_id,
        organization: user.organization_id,
        accountType: user.account_type,
        roleId: user.role_id || 3
      },
      accessToken
    }
  });
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

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
        middleInitial: user.middle_name,
        studentNumber: user.student_number,
        schoolNumber: user.employee_id,
        organization: user.organization_id
      }
    }
  });
});

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current password and new password'
    });
  }

  // Get user with password
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check current password
  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Validate new password
  if (!validatePassword(newPassword)) {
    return res.status(400).json({
      success: false,
      message: 'New password does not meet security requirements'
    });
  }

  // Check if new password is different from current
  const isSamePassword = await comparePassword(newPassword, user.password);
  if (isSamePassword) {
    return res.status(400).json({
      success: false,
      message: 'New password must be different from current password'
    });
  }

  // Hash new password
  const hashedNewPassword = await hashPassword(newPassword, 12);

  // Update password using dedicated method
  await User.updatePassword(req.user.id, hashedNewPassword);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  // Clear refresh token cookie
  res.clearCookie('refreshToken');

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = {
  register,
  login,
  getMe,
  changePassword,
  logout
};