const User = require('../models/User');
const { query } = require('../config/database');
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

  // Validation
  if (!email || !password || !firstName || !lastName || !accountType || !organization) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email'
    });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number'
    });
  }

  // Check if user exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  // Map client account types to database roles
  let roleId;
  try {
    const roleMapping = {
      'member': 'viewer',
      'officer': 'officer', 
      'administrator': 'admin_full' // or 'admin_approval' based on organization
    };
    
    const roleName = roleMapping[accountType];
    const roleResult = await query('SELECT id FROM roles WHERE name = $1', [roleName]);
    if (!roleResult.rows[0]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid account type'
      });
    }
    roleId = roleResult.rows[0].id;
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error mapping account type to role'
    });
  }

  // Map organization (for now, set to null since orgs aren't seeded)
  // TODO: Implement organization lookup once organizations are seeded
  const organizationId = null;

  // Hash password with enhanced security
  const hashedPassword = await hashPassword(password, 12); // Use 12 rounds for better security

  // Generate email verification token
  const emailVerificationToken = generateEmailVerificationToken();
  const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Create user with enhanced security fields
  const user = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    middleName: middleInitial || null,
    studentNumber: studentNumber || null,
    employeeId: schoolNumber || null,
    roleId,
    organizationId,
    emailVerificationToken,
    emailVerificationExpires
  });

  // Generate both access and refresh tokens
  const accessToken = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Log registration activity
  await query(
    `INSERT INTO activity_logs (user_id, action_type, resource_type, resource_id, description, ip_address, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      user.id,
      'user_registration',
      'user',
      user.id,
      'New user account created',
      req.ip || '0.0.0.0',
      JSON.stringify({
        userAgent: req.get('User-Agent'),
        accountType: accountType,
        organization: organization
      })
    ]
  );

  // Set refresh token as httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please check your email for verification.',
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        middleName: user.middle_name,
        studentNumber: user.student_number,
        employeeId: user.employee_id,
        roleId: user.role_id,
        organizationId: user.organization_id,
        status: user.status,
        isEmailVerified: user.is_email_verified
      },
      accessToken,
      // Don't send email verification token in response for security
      needsEmailVerification: true
    }
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password, studentNumber } = req.body;

  // Validation
  if ((!email && !studentNumber) || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email or student number and password'
    });
  }

  // Check for user by email or student number
  let user;
  if (email) {
    user = await User.findByEmail(email);
  } else {
    const result = await query('SELECT * FROM users WHERE student_number = $1', [studentNumber]);
    user = result.rows[0];
  }

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if account is locked
  if (user.locked_until && new Date() < new Date(user.locked_until)) {
    const timeRemaining = Math.ceil((new Date(user.locked_until) - new Date()) / (1000 * 60));
    return res.status(423).json({
      success: false,
      message: `Account is locked. Try again in ${timeRemaining} minutes.`
    });
  }

  // Check if account is active
  if (user.status !== 'active' && user.status !== 'pending') {
    return res.status(401).json({
      success: false,
      message: 'Account is not active. Please contact administrator.'
    });
  }

  // Check password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    // Increment failed login attempts
    const newAttempts = (user.login_attempts || 0) + 1;
    let lockUntil = null;

    // Check if should lock account
    if (shouldLockAccount(newAttempts)) {
      lockUntil = calculateLockoutTime(newAttempts);
    }

    // Update failed attempts
    await query(
      `UPDATE users SET login_attempts = $1, locked_until = $2, updated_at = NOW() WHERE id = $3`,
      [newAttempts, lockUntil, user.id]
    );

    // Log failed attempt
    await query(
      `INSERT INTO activity_logs (user_id, action_type, resource_type, resource_id, description, success, ip_address, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        user.id,
        'login_attempt',
        'user',
        user.id,
        'Failed login attempt',
        false,
        req.ip || '0.0.0.0',
        JSON.stringify({
          userAgent: req.get('User-Agent'),
          attempts: newAttempts,
          lockedUntil: lockUntil
        })
      ]
    );

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Successful login - reset failed attempts
  await query(
    `UPDATE users SET login_attempts = 0, locked_until = NULL, last_login = NOW(), updated_at = NOW() WHERE id = $1`,
    [user.id]
  );

  // Generate tokens
  const accessToken = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Store refresh token (you might want to store this in database for better security)
  // For now, we'll use httpOnly cookie

  // Log successful login
  await query(
    `INSERT INTO activity_logs (user_id, action_type, resource_type, resource_id, description, success, ip_address, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      user.id,
      'login',
      'user',
      user.id,
      'Successful login',
      true,
      req.ip || '0.0.0.0',
      JSON.stringify({
        userAgent: req.get('User-Agent'),
        loginMethod: email ? 'email' : 'student_number'
      })
    ]
  );

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
        middleName: user.middle_name,
        studentNumber: user.student_number,
        employeeId: user.employee_id,
        roleId: user.role_id,
        organizationId: user.organization_id,
        status: user.status,
        isEmailVerified: user.is_email_verified,
        lastLogin: user.last_login
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

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        middleName: user.middle_name,
        studentNumber: user.student_number,
        employeeId: user.employee_id,
        roleId: user.role_id,
        organizationId: user.organization_id,
        status: user.status,
        isEmailVerified: user.is_email_verified,
        lastLogin: user.last_login
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
  const result = await query('SELECT * FROM users WHERE id = $1', [req.user.id]);
  const user = result.rows[0];

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

  // Update password
  await query(
    'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
    [hashedNewPassword, req.user.id]
  );

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

  // Log logout activity
  await query(
    `INSERT INTO activity_logs (user_id, action_type, resource_type, resource_id, description, ip_address, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      req.user.id,
      'logout',
      'user',
      req.user.id,
      'User logged out',
      req.ip || '0.0.0.0',
      JSON.stringify({
        userAgent: req.get('User-Agent')
      })
    ]
  );

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