const jwt = require('jsonwebtoken');
const DatabaseService = require('../services/DatabaseService');
const { asyncHandler } = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await DatabaseService.findSignUpById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Map account_type to role/roleId
    let role = 'viewer';
    let roleId = 3;
    
    const accountType = (user.account_type || '').toLowerCase();
    if (accountType.includes('admin')) {
      role = 'admin';
      roleId = 1;
    } else if (accountType.includes('officer')) {
      role = 'officer';
      roleId = 2;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role,
      roleId,
      accountType: user.account_type
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };