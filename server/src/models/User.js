const DatabaseService = require('../services/DatabaseService');

class User {
  static async create(userData) {
    try {
      const result = await DatabaseService.insertSignUp(userData);
      return this._formatUser(result);
    } catch (error) {
      console.error('User creation failed - Database error occurred');
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const user = await DatabaseService.findSignUpByEmail(email);
      return user ? this._formatUser(user) : null;
    } catch (error) {
      console.error('User lookup by email failed - Database error occurred');
      throw error;
    }
  }

  static async findById(id) {
    try {
      const user = await DatabaseService.findSignUpById(id);
      return user ? this._formatUser(user) : null;
    } catch (error) {
      console.error('User lookup by ID failed - Database error occurred');
      throw error;
    }
  }

  static async findByStudentNumber(studentNumber) {
    try {
      const user = await DatabaseService.findSignUpByStudentNumber(studentNumber);
      return user ? this._formatUser(user) : null;
    } catch (error) {
      console.error('User lookup by student number failed - Database error occurred');
      throw error;
    }
  }

  static async findAll(limit = 10, offset = 0) {
    try {
      const results = await DatabaseService.findAllSignUp(limit, offset);
      return results.map(user => this._formatUser(user));
    } catch (error) {
      console.error('User fetch operation failed - Database error occurred');
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const result = await DatabaseService.updateSignUp(id, updateData);
      return result ? this._formatUser(result) : null;
    } catch (error) {
      console.error('User update operation failed - Database error occurred');
      throw error;
    }
  }

  static async updatePassword(id, hashedPassword) {
    try {
      const result = await DatabaseService.updateSignUpPassword(id, hashedPassword);
      return result ? this._formatUser(result) : null;
    } catch (error) {
      console.error('Password update operation failed - Database error occurred');
      throw error;
    }
  }

  static async delete(id) {
    try {
      return await DatabaseService.deleteSignUp(id);
    } catch (error) {
      console.error('User deletion operation failed - Database error occurred');
      throw error;
    }
  }

  static async count() {
    try {
      return await DatabaseService.countSignUp();
    } catch (error) {
      console.error('User count operation failed - Database error occurred');
      throw error;
    }
  }

  static async checkEmailExists(email) {
    try {
      return await DatabaseService.emailExists(email);
    } catch (error) {
      console.error('Email existence check failed - Database error occurred');
      throw error;
    }
  }

  static async checkStudentNumberExists(studentNumber) {
    try {
      return await DatabaseService.studentNumberExists(studentNumber);
    } catch (error) {
      console.error('Student number existence check failed - Database error occurred');
      throw error;
    }
  }

  // Helper method to format database response to consistent user object
  static _formatUser(dbUser) {
    return {
      id: dbUser.id,
      email: dbUser.email,
      password: dbUser.password,
      first_name: dbUser.first_name,
      last_name: dbUser.last_name,
      middle_name: dbUser.middle_initial,
      student_number: dbUser.student_number,
      employee_id: dbUser.employee_id,
      organization_id: dbUser.organization,
      account_type: dbUser.account_type,
      role_id: dbUser.role_id,
      status: dbUser.status || 'active',
      is_email_verified: dbUser.is_email_verified || false,
      created_at: dbUser.created_at,
      updated_at: dbUser.updated_at
    };
  }
}

module.exports = User;