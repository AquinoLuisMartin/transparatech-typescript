const validator = {
  // Email validation
  isEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password validation
  isStrongPassword: (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  // Name validation
  isValidName: (name) => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name);
  },

  // Role validation
  isValidRole: (role) => {
    const validRoles = [
      'Administrator',
      'Officer', 
      'Organization Member (Viewer)',
      'admin', 'officer', 'viewer', 'user' // Legacy support
    ];
    return validRoles.includes(role);
  },

  // ID validation
  isValidId: (id) => {
    return !isNaN(id) && parseInt(id) > 0;
  },

  // Phone number validation
  isPhoneNumber: (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  // URL validation
  isURL: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Required field validation
  isRequired: (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },

  // Length validation
  hasMinLength: (value, min) => {
    return value && value.toString().length >= min;
  },

  hasMaxLength: (value, max) => {
    return value && value.toString().length <= max;
  },

  // Enhanced sanitize string input - prevents XSS and SQL injection attempts
  sanitizeString: (str) => {
    if (typeof str !== 'string') return str;
    
    return str
      .trim()
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove potential script injection
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      // Remove SQL injection keywords (basic prevention) - but preserve normal text
      .replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\s+/gi, '')
      // Remove only the most dangerous characters
      .replace(/[<>"';\\]/g, '')
      // Limit length
      .substring(0, 1000);
  },

  // Advanced input sanitization for database operations
  sanitizeForDatabase: (input) => {
    if (input === null || input === undefined) return input;
    
    if (typeof input === 'string') {
      return validator.sanitizeString(input);
    }
    
    if (typeof input === 'number') {
      // Ensure it's a valid number and within safe range
      return isNaN(input) ? null : Math.max(-2147483648, Math.min(2147483647, input));
    }
    
    if (typeof input === 'boolean') {
      return input;
    }
    
    // For arrays and objects, sanitize recursively
    if (Array.isArray(input)) {
      return input.map(item => validator.sanitizeForDatabase(item));
    }
    
    if (typeof input === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(input)) {
        const sanitizedKey = validator.sanitizeString(key);
        sanitized[sanitizedKey] = validator.sanitizeForDatabase(value);
      }
      return sanitized;
    }
    
    return input;
  },

  // Student number validation
  isValidStudentNumber: (studentNumber) => {
    if (!studentNumber) return false;
    // Allow only alphanumeric characters and hyphens, 6-20 characters
    const studentRegex = /^[a-zA-Z0-9\-]{6,20}$/;
    return studentRegex.test(studentNumber);
  },

  // Employee ID validation
  isValidEmployeeId: (employeeId) => {
    if (!employeeId) return false;
    // Allow only alphanumeric characters and hyphens, 4-15 characters
    const employeeRegex = /^[a-zA-Z0-9\-]{4,15}$/;
    return employeeRegex.test(employeeId);
  },

  // Organization validation
  isValidOrganization: (organization) => {
    if (!organization) return false;
    // More flexible validation - allow most characters except potentially dangerous ones
    if (typeof organization !== 'string') return false;
    if (organization.trim().length < 2 || organization.trim().length > 200) return false;
    // Just check for basic safety - no script tags or suspicious patterns
    if (/<script|javascript:|on\w+=/i.test(organization)) return false;
    return true;
  },

  // Enhanced request body validation with sanitization
  validateRequestBody: (body, requiredFields = [], optionalFields = []) => {
    const errors = [];
    const sanitizedBody = {};
    
    // Validate and sanitize required fields
    requiredFields.forEach(field => {
      const value = body[field];
      
      if (!validator.isRequired(value)) {
        errors.push(`${field} is required`);
        return;
      }
      
      sanitizedBody[field] = validator.sanitizeForDatabase(value);
    });
    
    // Sanitize optional fields if present
    optionalFields.forEach(field => {
      if (body[field] !== undefined) {
        sanitizedBody[field] = validator.sanitizeForDatabase(body[field]);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: sanitizedBody
    };
  },

  // Comprehensive user registration validation
  validateUserRegistration: (userData) => {
    const errors = [];
    const {
      email,
      password,
      firstName,
      lastName,
      middleInitial,
      studentNumber,
      employeeId,
      organization,
      accountType
    } = userData;

    // Required field validation - only essential fields
    if (!validator.isRequired(email)) errors.push('Email is required');
    if (!validator.isRequired(password)) errors.push('Password is required');
    if (!validator.isRequired(firstName)) errors.push('First name is required');
    if (!validator.isRequired(lastName)) errors.push('Last name is required');

    // Basic format validation - more lenient
    if (email && !validator.isEmail(email)) errors.push('Invalid email format');
    
    // Simplified password validation for now
    if (password && password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    // Basic name validation - just check they're not empty and reasonable length
    if (firstName && (firstName.trim().length < 1 || firstName.trim().length > 50)) {
      errors.push('First name must be 1-50 characters');
    }
    if (lastName && (lastName.trim().length < 1 || lastName.trim().length > 50)) {
      errors.push('Last name must be 1-50 characters');
    }
    
    // Optional field validation - only if provided
    if (middleInitial && middleInitial.length > 5) errors.push('Middle initial too long');
    
    // Make organization and accountType optional for now to debug
    if (organization && organization.trim().length > 200) {
      errors.push('Organization name too long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

module.exports = validator;