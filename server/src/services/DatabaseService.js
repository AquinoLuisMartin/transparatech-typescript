const { query } = require('../config/database');

/**
 * DatabaseService
 * Centralized service for all database operations with parameterized queries
 * Prevents SQL injection attacks
 */
class DatabaseService {
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
      const result = await query(
        `INSERT INTO "SignUp" 
         (email, password, first_name, last_name, middle_initial, student_number, school_number, organization, account_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, email, password, first_name, last_name, middle_initial, student_number, school_number, organization, account_type, created_at, updated_at`,
        [
          email,
          password,
          firstName,
          lastName,
          middleName || null,
          studentNumber || null,
          employeeId || null,
          organizationId || null,
          accountType || 'member'
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('DatabaseService insertSignUp error:', error.message);
      throw error;
    }
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Object} - User record
   */
  static async findSignUpByEmail(email) {
    const result = await query(
      `SELECT id, email, password, first_name, last_name, middle_initial, 
              student_number, school_number, organization, account_type, created_at, updated_at
       FROM "SignUp" 
       WHERE email = $1`,
      [email]
    );

    return result.rows[0] || null;
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Object} - User record
   */
  static async findSignUpById(id) {
    const result = await query(
      `SELECT id, email, password, first_name, last_name, middle_initial, 
              student_number, school_number, organization, account_type, created_at, updated_at
       FROM "SignUp" 
       WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Find user by student number
   * @param {string} studentNumber - Student number
   * @returns {Object} - User record
   */
  static async findSignUpByStudentNumber(studentNumber) {
    const result = await query(
      `SELECT id, email, password, first_name, last_name, middle_initial, 
              student_number, school_number, organization, account_type, created_at, updated_at
       FROM "SignUp" 
       WHERE student_number = $1`,
      [studentNumber]
    );

    return result.rows[0] || null;
  }

  /**
   * Get all signup records with pagination
   * @param {number} limit - Records per page
   * @param {number} offset - Offset for pagination
   * @returns {Array} - User records
   */
  static async findAllSignUp(limit, offset) {
    const result = await query(
      `SELECT id, email, first_name, last_name, middle_initial, 
              student_number, school_number, organization, account_type, created_at, updated_at
       FROM "SignUp" 
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

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

    const result = await query(
      `UPDATE "SignUp" 
       SET email = COALESCE($1, email),
           first_name = COALESCE($2, first_name),
           last_name = COALESCE($3, last_name),
           middle_initial = COALESCE($4, middle_initial),
           student_number = COALESCE($5, student_number),
           school_number = COALESCE($6, school_number),
           organization = COALESCE($7, organization),
           password = COALESCE($8, password),
           account_type = COALESCE($9, account_type),
           updated_at = NOW()
       WHERE id = $10
       RETURNING id, email, first_name, last_name, middle_initial, 
                 student_number, school_number, organization, account_type, created_at, updated_at`,
      [
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
      ]
    );

    return result.rows[0] || null;
  }

  /**
   * Update password only
   * @param {number} id - User ID
   * @param {string} hashedPassword - Hashed password
   * @returns {Object} - Updated user record
   */
  static async updateSignUpPassword(id, hashedPassword) {
    const result = await query(
      `UPDATE "SignUp" 
       SET password = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, email, first_name, last_name, middle_initial, 
                 student_number, school_number, organization, account_type, created_at, updated_at`,
      [hashedPassword, id]
    );

    return result.rows[0] || null;
  }

  /**
   * Delete signup record
   * @param {number} id - User ID
   * @returns {boolean} - Success status
   */
  static async deleteSignUp(id) {
    const result = await query(
      `DELETE FROM "SignUp" 
       WHERE id = $1 
       RETURNING id`,
      [id]
    );

    return result.rowCount > 0;
  }

  /**
   * Count total signup records
   * @returns {number} - Total count
   */
  static async countSignUp() {
    const result = await query(
      `SELECT COUNT(*) as count FROM "SignUp"`
    );

    return parseInt(result.rows[0].count);
  }

  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @returns {boolean} - Email exists status
   */
  static async emailExists(email) {
    const result = await query(
      `SELECT id FROM "SignUp" WHERE email = $1`,
      [email]
    );

    return result.rows.length > 0;
  }

  /**
   * Check if student number exists
   * @param {string} studentNumber - Student number to check
   * @returns {boolean} - Student number exists status
   */
  static async studentNumberExists(studentNumber) {
    const result = await query(
      `SELECT id FROM "SignUp" WHERE student_number = $1`,
      [studentNumber]
    );

    return result.rows.length > 0;
  }
}

module.exports = DatabaseService;
