const { pool } = require('./src/config/database');

async function checkViewerData() {
  try {
    console.log('\n=== Checking Database for Viewer Data ===\n');

    // Check total submissions
    const totalSubmissions = await pool.query('SELECT COUNT(*) FROM "Submission"');
    console.log('📊 Total Submissions:', totalSubmissions.rows[0].count);

    // Check approved submissions
    const approvedSubmissions = await pool.query('SELECT COUNT(*) FROM "Submission" WHERE status = \'approved\'');
    console.log('✅ Approved Submissions:', approvedSubmissions.rows[0].count);

    // Check submissions by status
    const byStatus = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM "Submission" 
      GROUP BY status
    `);
    console.log('\n📈 Submissions by Status:');
    byStatus.rows.forEach(row => {
      console.log(`  ${row.status}: ${row.count}`);
    });

    // Check organizations
    const organizations = await pool.query(`
      SELECT DISTINCT organization 
      FROM "SignUp" 
      WHERE organization IS NOT NULL 
      ORDER BY organization
    `);
    console.log('\n🏢 Organizations in Database:');
    organizations.rows.forEach(row => {
      console.log(`  - "${row.organization}"`);
    });

    // Check submissions by organization
    const submissionsByOrg = await pool.query(`
      SELECT u.organization, 
             COUNT(s.id) as total_submissions,
             COUNT(CASE WHEN s.status = 'approved' THEN 1 END) as approved_submissions
      FROM "SignUp" u
      LEFT JOIN "Submission" s ON s.user_id = u.id
      WHERE u.organization IS NOT NULL
      GROUP BY u.organization
      ORDER BY u.organization
    `);
    console.log('\n📑 Submissions by Organization:');
    submissionsByOrg.rows.forEach(row => {
      console.log(`  ${row.organization}:`);
      console.log(`    Total: ${row.total_submissions}`);
      console.log(`    Approved: ${row.approved_submissions}`);
    });

    // Check viewer accounts
    const viewers = await pool.query(`
      SELECT email, organization, account_type 
      FROM "SignUp" 
      WHERE LOWER(account_type) LIKE '%viewer%'
      ORDER BY organization, email
    `);
    console.log('\n👥 Viewer Accounts:');
    if (viewers.rows.length === 0) {
      console.log('  No viewer accounts found!');
    } else {
      viewers.rows.forEach(row => {
        console.log(`  ${row.email} - Org: "${row.organization}" (${row.account_type})`);
      });
    }

    // Sample approved submissions with details
    const sampleApproved = await pool.query(`
      SELECT s.id, s.title, s.status, u.organization, u.first_name, u.last_name
      FROM "Submission" s
      JOIN "SignUp" u ON s.user_id = u.id
      WHERE s.status = 'approved'
      LIMIT 5
    `);
    console.log('\n📄 Sample Approved Submissions:');
    if (sampleApproved.rows.length === 0) {
      console.log('  ⚠️  No approved submissions found!');
    } else {
      sampleApproved.rows.forEach(row => {
        console.log(`  ID: ${row.id} - "${row.title}" by ${row.first_name} ${row.last_name} (Org: "${row.organization}")`);
      });
    }

    console.log('\n=== Check Complete ===\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking data:', error);
    process.exit(1);
  }
}

checkViewerData();
