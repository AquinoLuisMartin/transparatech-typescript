const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Enhanced password hashing with configurable rounds
const hashPassword = async (password, rounds = 12) => {
  // Validate password before hashing
  if (!validatePassword(password)) {
    throw new Error('Password does not meet security requirements');
  }
  
  const salt = await bcrypt.genSalt(rounds);
  return await bcrypt.hash(password, salt);
};

// Secure password comparison
const comparePassword = async (enteredPassword, hashedPassword) => {
  if (!enteredPassword || !hashedPassword) {
    return false;
  }
  
  try {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  } catch (error) {
    console.error('Password comparison failed - bcrypt error occurred');
    return false;
  }
};

// Enhanced JWT token generation
const generateToken = (id, options = {}) => {
  const payload = { 
    id,
    iat: Math.floor(Date.now() / 1000),
    type: options.type || 'access'
  };
  
  const tokenOptions = {
    expiresIn: options.expiresIn || process.env.JWT_EXPIRE || '7d',
    issuer: process.env.JWT_ISSUER || 'transparatech',
    audience: process.env.JWT_AUDIENCE || 'transparatech-users'
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, tokenOptions);
};

// Generate refresh token
const generateRefreshToken = (id) => {
  return generateToken(id, { 
    type: 'refresh', 
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' 
  });
};

// Verify JWT token
const verifyToken = (token, options = {}) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER || 'transparatech',
      audience: process.env.JWT_AUDIENCE || 'transparatech-users',
      ...options
    });
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Enhanced email validation
const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  // More comprehensive email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Length check
  if (email.length > 254) return false;
  
  return emailRegex.test(email);
};

// Enhanced password validation
const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  
  // Minimum 8 characters
  if (password.length < 8) return false;
  
  // Maximum length for security (prevent DoS)
  if (password.length > 128) return false;
  
  // At least 1 uppercase letter
  if (!/[A-Z]/.test(password)) return false;
  
  // At least 1 lowercase letter
  if (!/[a-z]/.test(password)) return false;
  
  // At least 1 digit
  if (!/\d/.test(password)) return false;
  
  // At least 1 special character
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  
  // Check for common weak passwords
  const commonPasswords = [
    'password', '12345678', 'qwerty123', 'admin123', 
    'Password1', 'password123', 'welcome123'
  ];
  
  if (commonPasswords.some(weak => password.toLowerCase().includes(weak.toLowerCase()))) {
    return false;
  }
  
  return true;
};

// Generate secure random token
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate email verification token
const generateEmailVerificationToken = () => {
  return generateSecureToken(32);
};

// Generate password reset token
const generatePasswordResetToken = () => {
  return generateSecureToken(32);
};

// Hash sensitive data (for tokens, etc.)
const hashSensitiveData = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Check if password is already hashed (bcrypt format)
const isPasswordHashed = (password) => {
  return /^\$2[aby]\$/.test(password);
};

// Rate limiting helper for failed login attempts
const shouldLockAccount = (loginAttempts, lastFailedLogin) => {
  const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
  const lockoutDuration = parseInt(process.env.LOCKOUT_DURATION) || 15 * 60 * 1000; // 15 minutes
  
  if (loginAttempts >= maxAttempts) {
    const timeSinceLastAttempt = Date.now() - new Date(lastFailedLogin).getTime();
    return timeSinceLastAttempt < lockoutDuration;
  }
  
  return false;
};

// Calculate lockout time
const calculateLockoutTime = (loginAttempts) => {
  const baseLockout = 5 * 60 * 1000; // 5 minutes base
  const multiplier = Math.min(loginAttempts - 4, 10); // Max 10x multiplier
  return new Date(Date.now() + (baseLockout * multiplier));
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  generateRefreshToken,
  verifyToken,
  validateEmail,
  validatePassword,
  generateSecureToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  hashSensitiveData,
  isPasswordHashed,
  shouldLockAccount,
  calculateLockoutTime
};