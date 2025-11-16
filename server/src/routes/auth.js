const express = require('express');
const { register, login, getMe, changePassword, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

console.log('Auth routes being registered:');
console.log('POST /register');
console.log('POST /login');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);
router.post('/logout', protect, logout);

module.exports = router;