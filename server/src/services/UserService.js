const User = require('../models/User');
const { hashPassword, validateEmail, validatePassword } = require('../utils/auth');

class UserService {
  static async createUser(userData) {
    const { email, password, firstName, lastName, role } = userData;

    // Validate email
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password
    if (!validatePassword(password)) {
      throw new Error('Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number');
    }

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || 'user'
    });

    // Return user without password
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      createdAt: user.created_at
    };
  }

  static async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }

  static async updateUserProfile(id, updateData) {
    const { email, firstName, lastName, password } = updateData;
    const fieldsToUpdate = {};

    if (email) {
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }
      
      // Check if email is already taken by another user
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== parseInt(id)) {
        throw new Error('Email already in use by another user');
      }
      
      fieldsToUpdate.email = email;
    }

    if (firstName) fieldsToUpdate.first_name = firstName;
    if (lastName) fieldsToUpdate.last_name = lastName;

    if (password) {
      if (!validatePassword(password)) {
        throw new Error('Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number');
      }
      fieldsToUpdate.password = await hashPassword(password);
    }

    const updatedUser = await User.update(id, fieldsToUpdate);
    if (!updatedUser) {
      throw new Error('User not found');
    }

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      role: updatedUser.role,
      updatedAt: updatedUser.updated_at
    };
  }

  static async getAllUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const users = await User.findAll(limit, offset);
    const total = await User.count();

    return {
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async deleteUser(id) {
    const deletedUser = await User.delete(id);
    if (!deletedUser) {
      throw new Error('User not found');
    }
    return { message: 'User deleted successfully' };
  }
}

module.exports = UserService;