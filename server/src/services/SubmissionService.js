const { query } = require('../config/database');
const SUBMISSION_QUERIES = require('../database/queries/submissionQueries');

class SubmissionService {
  static async executeQuery(queryText, params = []) {
    try {
      return await query(queryText, params);
    } catch (error) {
      console.error('Database query execution failed:', error);
      throw error;
    }
  }

  static async createTable() {
    await this.executeQuery(SUBMISSION_QUERIES.CREATE_TABLE);
  }

  static async create(data) {
    const { title, category, type, description, status, priority, userId, files } = data;
    const result = await this.executeQuery(SUBMISSION_QUERIES.CREATE_SUBMISSION, [
      title, category, type, description, status || 'pending', priority || 'medium', userId, files || []
    ]);
    return result.rows[0];
  }

  static async findAll(limit = 10, offset = 0) {
    const result = await this.executeQuery(SUBMISSION_QUERIES.FIND_ALL, [limit, offset]);
    return result.rows;
  }

  static async findById(id) {
    const result = await this.executeQuery(SUBMISSION_QUERIES.FIND_BY_ID, [id]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await this.executeQuery(SUBMISSION_QUERIES.FIND_BY_USER_ID, [userId]);
    return result.rows;
  }

  static async findPublic(limit = 10, offset = 0) {
    const result = await this.executeQuery(SUBMISSION_QUERIES.FIND_PUBLIC, [limit, offset]);
    return result.rows;
  }

  static async updateStatus(id, status, reviewerId, rejectionReason = null) {
    const result = await this.executeQuery(SUBMISSION_QUERIES.UPDATE_STATUS, [
      status, reviewerId, rejectionReason, id
    ]);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await this.executeQuery(SUBMISSION_QUERIES.DELETE_SUBMISSION, [id]);
    return result.rowCount > 0;
  }

  static async getStats() {
    const result = await this.executeQuery(SUBMISSION_QUERIES.GET_STATS);
    return result.rows[0];
  }

  static async getRecentActivity() {
    const result = await this.executeQuery(SUBMISSION_QUERIES.GET_RECENT_ACTIVITY);
    return result.rows;
  }
}

module.exports = SubmissionService;
