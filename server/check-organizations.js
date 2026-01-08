require('dotenv').config();
const { query } = require('./src/config/database');

async function checkOrganizations() {
  try {
    console.log('Checking organizations table...');
    
    // Check if table exists
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'organizations'
      );
    `);
    
    console.log('Table exists:', tableCheck.rows[0].exists);
    
    if (tableCheck.rows[0].exists) {
      // Check content
      const result = await query('SELECT * FROM organizations LIMIT 1');
      console.log('Sample Organization:', result.rows[0]);
      
      // Check SignUp table content to verify joins
      try {
        const userSample = await query('SELECT organization FROM "SignUp" WHERE organization IS NOT NULL LIMIT 5');
        console.log('Sample User Organizations:', userSample.rows);
        
        // Check if they match
        if (result.rows.length > 0 && userSample.rows.length > 0) {
            console.log("Org Name:", result.rows[0].name);
            console.log("Org Acronym:", result.rows[0].acronym);
            
            const matchName = await query('SELECT COUNT(*) FROM "SignUp" WHERE organization = $1', [result.rows[0].name]);
            console.log(`Count by Full Name ('${result.rows[0].name}'):`, matchName.rows[0].count);
            
            const matchAcronym = await query('SELECT COUNT(*) FROM "SignUp" WHERE organization = $1', [result.rows[0].acronym]);
             console.log(`Count by Acronym ('${result.rows[0].acronym}'):`, matchAcronym.rows[0].count);
        }
        
      } catch (err) {
        console.log('Error querying SignUp table:', err.message);
      }
      
    } else {
      console.log('Organizations table does NOT exist.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkOrganizations();