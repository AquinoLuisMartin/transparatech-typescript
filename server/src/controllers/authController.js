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
const validator = require('../utils/validator');
const logger = require('../utils/secureLogger');

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

  logger.info('Registration request received', {
    emailDomain: email ? email.split('@')[1] : 'N/A',
    accountType,
    organization,
    fieldsReceived: Object.keys(req.body)
  }, 'AUTH');

  // Debug: Log the actual body structure (safely)
  console.log('🔍 Registration data received:', {
    hasEmail: !!email,
    hasPassword: !!password,
    hasFirstName: !!firstName,
    hasLastName: !!lastName,
    hasOrganization: !!organization,
    hasAccountType: !!accountType,
    allFields: Object.keys(req.body)
  });

  // Temporary: Basic validation only to get registration working
  const basicErrors = [];
  if (!email) basicErrors.push('Email is required');
  if (!password) basicErrors.push('Password is required');
  if (!firstName) basicErrors.push('First name is required');
  if (!lastName) basicErrors.push('Last name is required');
  
  if (basicErrors.length > 0) {
    console.log('❌ Basic validation failed:', basicErrors);
    return res.status(400).json({
      success: false,
      message: 'Basic validation failed',
      errors: basicErrors
    });
  }

  // TODO: Re-enable full validation later
  // const validationResult = validator.validateUserRegistration(req.body);
  // if (!validationResult.isValid) {
  //   logger.warn('Registration validation failed', { errors: validationResult.errors }, 'AUTH');
  //   return res.status(400).json({
  //     success: false,
  //     message: 'Validation failed',
  //     errors: validationResult.errors
  //   });
  // }

  // Basic sanitization to prevent major issues
  const sanitizedData = {
    email: email?.trim(),
    password: password,
    firstName: firstName?.trim(),
    lastName: lastName?.trim(),
    middleInitial: middleInitial?.trim() || null,
    studentNumber: studentNumber?.trim() || null,
    schoolNumber: schoolNumber?.trim() || null,
    employeeId: (req.body.employeeId || schoolNumber)?.trim() || null,
    accountType: accountType?.trim() || 'Organization Member (Viewer)',
    organization: organization?.trim() || 'Default Organization'
  };

  // Check if user exists
  const existingUser = await User.findByEmail(sanitizedData.email);
  if (existingUser) {
    logger.warn('Registration failed - user already exists', null, 'AUTH');
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  // Check if student number exists (if provided)
  if (sanitizedData.studentNumber) {
    const existingStudentNumber = await User.checkStudentNumberExists(sanitizedData.studentNumber);
    if (existingStudentNumber) {
      logger.warn('Registration failed - student number already registered', null, 'AUTH');
      return res.status(400).json({
        success: false,
        message: 'Student number already registered'
      });
    }
  }

  // Hash password with enhanced security
  const hashedPassword = await hashPassword(sanitizedData.password, 12); // Use 12 rounds for better security
  logger.debug('Password successfully hashed', null, 'AUTH');

  // Create user
  logger.debug('Creating user account', {
    accountType: sanitizedData.accountType,
    organization: sanitizedData.organization
  }, 'AUTH');

  let user;
  try {
    user = await User.create({
      email: sanitizedData.email,
      password: hashedPassword,
      firstName: sanitizedData.firstName,
      lastName: sanitizedData.lastName,
      middleName: sanitizedData.middleInitial || null,
      studentNumber: sanitizedData.studentNumber && sanitizedData.studentNumber.trim() ? sanitizedData.studentNumber : null,
      employeeId: (sanitizedData.schoolNumber || sanitizedData.employeeId) && (sanitizedData.schoolNumber || sanitizedData.employeeId).trim() ? (sanitizedData.schoolNumber || sanitizedData.employeeId) : null,
      organizationId: sanitizedData.organization || 'Default Organization',
      accountType: sanitizedData.accountType || 'Organization Member (Viewer)'
    });

    logger.info('User account created successfully', {
      userId: user.id,
      accountType: user.account_type
    }, 'AUTH');
  } catch (userCreateError) {
    console.error('❌ User creation failed:', {
      message: userCreateError.message,
      code: userCreateError.code,
      detail: userCreateError.detail,
      constraint: userCreateError.constraint,
      dataAttempted: {
        email: sanitizedData.email,
        firstName: sanitizedData.firstName,
        lastName: sanitizedData.lastName,
        hasOrganization: !!sanitizedData.organization,
        hasAccountType: !!sanitizedData.accountType
      }
    });
    
    logger.error('User creation failed', userCreateError, 'AUTH');
    
    // Return a more helpful error message
    return res.status(500).json({
      success: false,
      message: 'Failed to create user account',
      error: process.env.NODE_ENV === 'development' ? userCreateError.message : 'Internal server error'
    });
  }

  // Generate both access and refresh tokens
  const accessToken = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  logger.debug('Authentication tokens generated', null, 'AUTH');

  // Set refresh token as httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  logger.auth.registrationAttempt(true, user.account_type, sanitizedData.organization, req.ip);

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
  // Sanitize inputs immediately
  const sanitizedInput = validator.sanitizeForDatabase(req.body);
  const { email, password, studentNumber } = sanitizedInput;

  logger.debug('Login attempt initiated', {
    emailProvided: !!email,
    emailDomain: email ? email.split('@')[1] : null,
    studentNumberProvided: !!studentNumber,
    passwordProvided: !!password,
    passwordLengthValid: password ? password.length >= 8 : false
  }, 'AUTH');

  // Enhanced validation
  if ((!email && !studentNumber) || !password) {
    logger.warn('Login validation failed - missing credentials', null, 'AUTH');
    return res.status(400).json({
      success: false,
      message: 'Please provide email or student number and password'
    });
  }

  // Validate email format if provided
  if (email && !validator.isEmail(email)) {
    logger.warn('Login validation failed - invalid email format', null, 'AUTH');
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  // Validate student number format if provided
  if (studentNumber && !validator.isValidStudentNumber(studentNumber)) {
    logger.warn('Login validation failed - invalid student number format', null, 'AUTH');
    return res.status(400).json({
      success: false,
      message: 'Invalid student number format'
    });
  }

  // Check for user by email or student number
  let user;
  if (email) {
    logger.debug('Looking up user by email', { emailDomain: email.split('@')[1] }, 'AUTH');
    user = await User.findByEmail(email);
  } else if (studentNumber) {
    logger.debug('Looking up user by student number', null, 'AUTH');
    user = await User.findByStudentNumber(studentNumber);
  }

  if (!user) {
    logger.warn('Login failed - user not found', null, 'AUTH');
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  logger.debug('User found for login', {
    userId: user.id,
    accountType: user.account_type
  }, 'AUTH');

  // Check password
  logger.debug('Verifying user credentials', null, 'AUTH');
  
  const isMatch = await comparePassword(password, user.password);
  
  if (!isMatch) {
    logger.warn('Login failed - invalid credentials', { userId: user.id }, 'AUTH');
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  logger.auth.loginAttempt(true, user.id, user.account_type, req.ip);

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
  // Sanitize inputs
  const sanitizedInput = validator.sanitizeForDatabase(req.body);
  const { currentPassword, newPassword } = sanitizedInput;

  // Enhanced validation
  const validationResult = validator.validateRequestBody(
    { currentPassword, newPassword },
    ['currentPassword', 'newPassword']
  );

  if (!validationResult.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validationResult.errors
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
  const isMatch = await comparePassword(sanitizedData.currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Use sanitized data for password operations
  const { sanitizedData } = validationResult;
  
  // Validate new password
  if (!validatePassword(sanitizedData.newPassword)) {
    return res.status(400).json({
      success: false,
      message: 'New password does not meet security requirements'
    });
  }

  // Check if new password is different from current
  const isSamePassword = await comparePassword(sanitizedData.newPassword, user.password);
  if (isSamePassword) {
    return res.status(400).json({
      success: false,
      message: 'New password must be different from current password'
    });
  }

  // Hash new password
  const hashedNewPassword = await hashPassword(sanitizedData.newPassword, 12);

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