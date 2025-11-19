/**
 * SQL Query Constants for User Operations
 * All queries use parameterized statements to prevent SQL injection
 */

const USER_QUERIES = {
  // User Creation
  CREATE_USER: `
    INSERT INTO "SignUp" 
    (email, password, first_name, last_name, middle_initial, student_number, employee_id, organization, account_type)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, email, password, first_name, last_name, middle_initial, student_number, employee_id, organization, account_type, created_at, updated_at
  `,

  // User Lookup Queries
  FIND_BY_EMAIL: `
    SELECT id, email, password, first_name, last_name, middle_initial, 
           student_number, employee_id, organization, account_type, created_at, updated_at
    FROM "SignUp" 
    WHERE email = $1
  `,

  FIND_BY_ID: `
    SELECT id, email, password, first_name, last_name, middle_initial, 
           student_number, employee_id, organization, account_type, created_at, updated_at
    FROM "SignUp" 
    WHERE id = $1
  `,

  FIND_BY_STUDENT_NUMBER: `
    SELECT id, email, password, first_name, last_name, middle_initial, 
           student_number, employee_id, organization, account_type, created_at, updated_at
    FROM "SignUp" 
    WHERE student_number = $1
  `,

  // Listing Queries
  FIND_ALL_PAGINATED: `
    SELECT id, email, first_name, last_name, middle_initial, 
           student_number, employee_id, organization, account_type, created_at, updated_at
    FROM "SignUp" 
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `,

  // Update Queries
  UPDATE_USER: `
    UPDATE "SignUp" 
    SET email = COALESCE($1, email),
        first_name = COALESCE($2, first_name),
        last_name = COALESCE($3, last_name),
        middle_initial = COALESCE($4, middle_initial),
        student_number = COALESCE($5, student_number),
        employee_id = COALESCE($6, employee_id),
        organization = COALESCE($7, organization),
        password = COALESCE($8, password),
        account_type = COALESCE($9, account_type),
        updated_at = NOW()
    WHERE id = $10
    RETURNING id, email, first_name, last_name, middle_initial, 
              student_number, employee_id, organization, account_type, created_at, updated_at
  `,

  UPDATE_PASSWORD: `
    UPDATE "SignUp" 
    SET password = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, email, first_name, last_name, middle_initial, 
              student_number, employee_id, organization, account_type, created_at, updated_at
  `,

  // Delete Queries
  DELETE_USER: `
    DELETE FROM "SignUp" 
    WHERE id = $1 
    RETURNING id
  `,

  // Utility Queries
  COUNT_USERS: `
    SELECT COUNT(*) as count FROM "SignUp"
  `,

  CHECK_EMAIL_EXISTS: `
    SELECT id FROM "SignUp" WHERE email = $1
  `,

  CHECK_STUDENT_NUMBER_EXISTS: `
    SELECT id FROM "SignUp" WHERE student_number = $1
  `,

  // Table Schema Validation
  VALIDATE_TABLE_STRUCTURE: `
    SELECT column_name, data_type, is_nullable, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'SignUp'
    ORDER BY ordinal_position
  `
};

module.exports = USER_QUERIES;