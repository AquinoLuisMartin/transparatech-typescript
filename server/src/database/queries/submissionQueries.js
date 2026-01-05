/**
 * SQL Query Constants for Submission Operations
 */

const SUBMISSION_QUERIES = {
  // Create Submission
  CREATE_SUBMISSION: `
    INSERT INTO "Submission" 
    (title, category, type, description, status, priority, user_id, files)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,

  // Find Submissions
  FIND_ALL: `
    SELECT s.*, 
           u.first_name as user_first_name, u.last_name as user_last_name, u.organization as user_organization,
           r.first_name as reviewer_first_name, r.last_name as reviewer_last_name
    FROM "Submission" s
    LEFT JOIN "SignUp" u ON s.user_id = u.id
    LEFT JOIN "SignUp" r ON s.reviewer_id = r.id
    ORDER BY s.created_at DESC
    LIMIT $1 OFFSET $2
  `,

  FIND_BY_ID: `
    SELECT s.*, 
           u.first_name as user_first_name, u.last_name as user_last_name,
           r.first_name as reviewer_first_name, r.last_name as reviewer_last_name
    FROM "Submission" s
    LEFT JOIN "SignUp" u ON s.user_id = u.id
    LEFT JOIN "SignUp" r ON s.reviewer_id = r.id
    WHERE s.id = $1
  `,

  FIND_BY_USER_ID: `
    SELECT * FROM "Submission" 
    WHERE user_id = $1
    ORDER BY created_at DESC
  `,

  FIND_PUBLIC: `
    SELECT s.*, 
           u.first_name as user_first_name, u.last_name as user_last_name
    FROM "Submission" s
    LEFT JOIN "SignUp" u ON s.user_id = u.id
    WHERE s.status = 'approved'
    ORDER BY s.updated_at DESC
    LIMIT $1 OFFSET $2
  `,

  // Update Submission
  UPDATE_STATUS: `
    UPDATE "Submission" 
    SET status = $1::text, 
        reviewer_id = $2, 
        approved_date = CASE WHEN $1::text = 'approved' THEN NOW() ELSE NULL END,
        rejected_date = CASE WHEN $1::text = 'rejected' THEN NOW() ELSE NULL END,
        rejection_reason = $3,
        updated_at = NOW()
    WHERE id = $4
    RETURNING *
  `,

  // Delete Submission
  DELETE_SUBMISSION: `
    DELETE FROM "Submission" WHERE id = $1 RETURNING id
  `,

  // Get Stats
  GET_STATS: `
    SELECT
      COUNT(*) FILTER (WHERE status = 'approved') as public_documents,
      COUNT(*) FILTER (WHERE type = 'report') as reports,
      COUNT(*) FILTER (WHERE type = 'dataset') as datasets,
      COUNT(*) FILTER (WHERE status = 'pending') as pending_submissions
    FROM "Submission"
  `,

  // Get Recent Activity (for notifications)
  GET_RECENT_ACTIVITY: `
    SELECT s.id, s.title, s.status, s.updated_at, s.created_at, s.type,
           u.first_name, u.last_name
    FROM "Submission" s
    LEFT JOIN "SignUp" u ON s.user_id = u.id
    ORDER BY s.updated_at DESC
    LIMIT 10
  `,

  // Schema Creation
  CREATE_TABLE: `
    CREATE TABLE IF NOT EXISTS "Submission" (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      type VARCHAR(100),
      description TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      priority VARCHAR(50) DEFAULT 'medium',
      submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER REFERENCES "SignUp"(id),
      reviewer_id INTEGER REFERENCES "SignUp"(id),
      approved_date TIMESTAMP,
      rejected_date TIMESTAMP,
      rejection_reason TEXT,
      files TEXT[],
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
};

module.exports = SUBMISSION_QUERIES;
