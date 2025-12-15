import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Password configuration
const passwords = {
  'NU10': 'nimun123',      // NIMUN Leader
  'NU11': 'rpm123',         // RPM Leader
  'NU12': 'icpc123',        // ICPC Leader
  'NU14': 'ieee123',        // IEEE Leader
  'NU02': 'adminSU',       // SU Admin
  'NU01': 'adminSLO'  // Student Life Admin
};

async function generateHashes() {
  console.log('🔐 Generating bcrypt hashes for all passwords...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('SQL UPDATE Statements (Copy and paste into MySQL Workbench):\n');
  console.log('USE ClubsData;\n');

  for (const [universityId, password] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`-- ${universityId} - Password: ${password}`);
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE university_id = '${universityId}';`);
    console.log('');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n✅ Copy the SQL statements above and run them in MySQL Workbench\n');
}

generateHashes().catch(console.error);

