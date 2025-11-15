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
    const validRoles = ['admin', 'officer', 'viewer', 'user'];
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

  // Sanitize string input
  sanitizeString: (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/[<>]/g, '');
  },

  // Validate request body
  validateRequestBody: (body, requiredFields = []) => {
    const errors = [];

    requiredFields.forEach(field => {
      if (!validator.isRequired(body[field])) {
        errors.push(`${field} is required`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

module.exports = validator;