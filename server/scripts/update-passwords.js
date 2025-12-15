import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Password configuration - Change these to your desired passwords
const passwords = {
  'NU10': 'nimun123',      // NIMUN Leader
  'NU11': 'rpm123',         // RPM Leader
  'NU12': 'icpc123',        // ICPC Leader
  'NU13': 'ieee123',        // IEEE Leader
  'NU02': 'adminSU',       // SU Admin
  'NU01': 'adminSLO'  // Student Life Admin
};

async function updatePasswords() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ClubsData',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to database');
    console.log('🔄 Updating passwords...\n');

    // Update each user's password
    for (const [universityId, plainPassword] of Object.entries(passwords)) {
      // Generate bcrypt hash
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(plainPassword, saltRounds);

      // Update password in database
      await connection.execute(
        'UPDATE users SET password_hash = ? WHERE university_id = ?',
        [passwordHash, universityId]
      );

      const [users] = await connection.execute(
        'SELECT fullname, role FROM users WHERE university_id = ?',
        [universityId]
      );

      if (users.length > 0) {
        console.log(`✅ Updated password for: ${users[0].fullname} (${users[0].role})`);
        console.log(`   University ID: ${universityId}`);
        console.log(`   Password: ${plainPassword}\n`);
      }
    }

    console.log('✅ All passwords updated successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    Object.entries(passwords).forEach(([id, pass]) => {
      console.log(`   ${id} / ${pass}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error updating passwords:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updatePasswords();

