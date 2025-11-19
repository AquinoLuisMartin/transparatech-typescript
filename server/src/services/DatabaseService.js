const { query } = require('../config/database');
const USER_QUERIES = require('../database/queries/userQueries');

/**
 * Enhanced DatabaseService with improved security and maintainability
 * All queries use parameterized statements to prevent SQL injection
 * Query constants are externalized for better maintainability
 */
class DatabaseService {
  /**
   * Executes a parameterized query safely
   * @param {string} queryText - SQL query with parameters
   * @param {Array} params - Query parameters
   * @returns {Object} Query result
   */
  static async executeQuery(queryText, params = []) {
    try {
      return await query(queryText, params);
    } catch (error) {
      console.error('Database query execution failed:', {
        error: error.message,
        code: error.code,
        constraint: error.constraint
      });
      throw error;
    }
  }
  /**
   * Insert a new signup record
   * @param {Object} userData - User data
   * @returns {Object} - Created user record
   */
  static async insertSignUp(userData) {
    const {
      email,
      password,
      firstName,
      lastName,
      middleName,
      studentNumber,
      employeeId,
      organizationId,
      accountType
    } = userData;

    try {
      const result = await this.executeQuery(USER_QUERIES.CREATE_USER, [
        email,
        password,
        firstName,
        lastName,
        middleName || null,
        studentNumber || null,
        employeeId || null,
        organizationId || null,
        accountType || 'member'
      ]);

      return result.rows[0];
    } catch (error) {
      console.error('User creation failed in database layer');
      throw error;
    }
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Object} - User record
   */
  static async findSignUpByEmail(email) {
    const result = await this.executeQuery(USER_QUERIES.FIND_BY_EMAIL, [email]);
    return result.rows[0] || null;
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Object} - User record
   */
  static async findSignUpById(id) {
    const result = await this.executeQuery(USER_QUERIES.FIND_BY_ID, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find user by student number
   * @param {string} studentNumber - Student number
   * @returns {Object} - User record
   */
  static async findSignUpByStudentNumber(studentNumber) {
    const result = await this.executeQuery(USER_QUERIES.FIND_BY_STUDENT_NUMBER, [studentNumber]);
    return result.rows[0] || null;
  }

  /**
   * Get all signup records with pagination
   * @param {number} limit - Records per page
   * @param {number} offset - Offset for pagination
   * @returns {Array} - User records
   */
  static async findAllSignUp(limit, offset) {
    const result = await this.executeQuery(USER_QUERIES.FIND_ALL_PAGINATED, [limit, offset]);
    return result.rows;
  }

  /**
   * Update signup record
   * @param {number} id - User ID
   * @param {Object} updateData - Fields to update
   * @returns {Object} - Updated user record
   */
  static async updateSignUp(id, updateData) {
    const { 
      email, 
      firstName, 
      lastName, 
      middleName, 
      studentNumber, 
      employeeId, 
      organizationId,
      password,
      accountType
    } = updateData;

    const result = await this.executeQuery(USER_QUERIES.UPDATE_USER, [
      email || null,
      firstName || null,
      lastName || null,
      middleName || null,
      studentNumber || null,
      employeeId || null,
      organizationId || null,
      password || null,
      accountType || null,
      id
    ]);

    return result.rows[0] || null;
  }

  /**
   * Update password only
   * @param {number} id - User ID
   * @param {string} hashedPassword - Hashed password
   * @returns {Object} - Updated user record
   */
  static async updateSignUpPassword(id, hashedPassword) {
    const result = await this.executeQuery(USER_QUERIES.UPDATE_PASSWORD, [hashedPassword, id]);

    return result.rows[0] || null;
  }

  /**
   * Delete signup record
   * @param {number} id - User ID
   * @returns {boolean} - Success status
   */
  static async deleteSignUp(id) {
    const result = await this.executeQuery(USER_QUERIES.DELETE_USER, [id]);

    return result.rowCount > 0;
  }

  /**
   * Count total signup records
   * @returns {number} - Total count
   */
  static async countSignUp() {
    const result = await this.executeQuery(USER_QUERIES.COUNT_USERS);

    return parseInt(result.rows[0].count);
  }

  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @returns {boolean} - Email exists status
   */
  static async emailExists(email) {
    const result = await this.executeQuery(USER_QUERIES.CHECK_EMAIL_EXISTS, [email]);

    return result.rows.length > 0;
  }

  /**
   * Check if student number exists
   * @param {string} studentNumber - Student number to check
   * @returns {boolean} - Student number exists status
   */
  static async studentNumberExists(studentNumber) {
    const result = await this.executeQuery(USER_QUERIES.CHECK_STUDENT_NUMBER_EXISTS, [studentNumber]);

    return result.rows.length > 0;
  }

  /**
   * Validate database table structure
   * @returns {Array} - Column information
   */
  static async validateTableStructure() {
    const result = await this.executeQuery(USER_QUERIES.VALIDATE_TABLE_STRUCTURE);
    return result.rows;
  }
}

module.exports = DatabaseService;
