require('dotenv').config();
const { query } = require('./src/config/database');

async function testUpdate() {
  try {
    // 1. Get a submission
    const subRes = await query('SELECT id FROM "Submission" LIMIT 1');
    if (subRes.rows.length === 0) {
      console.log('No submissions found');
      process.exit(0);
    }
    const submissionId = subRes.rows[0].id;
    console.log('Testing with submission ID:', submissionId);

    // 2. Get a user
    const userRes = await query('SELECT id FROM "SignUp" LIMIT 1');
    if (userRes.rows.length === 0) {
      console.log('No users found');
      process.exit(0);
    }
    const userId = userRes.rows[0].id;
    console.log('Testing with user ID:', userId);

    // 3. Try update
    const updateQuery = `
    UPDATE "Submission" 
    SET status = $1::varchar, 
        reviewer_id = $2, 
        approved_date = CASE WHEN $1::varchar = 'approved' THEN NOW() ELSE NULL END,
        rejected_date = CASE WHEN $1::varchar = 'rejected' THEN NOW() ELSE NULL END,
        rejection_reason = $3,
        updated_at = NOW()
    WHERE id = $4
    RETURNING *
    `;
    
    const params = ['rejected', userId, 'Test rejection', submissionId];
    console.log('Executing query with params:', params);
    
    const result = await query(updateQuery, params);
    console.log('Update success!', result.rows[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
}

testUpdate();
