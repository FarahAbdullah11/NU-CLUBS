import bcrypt from 'bcrypt';

// Simple script to generate bcrypt hash for a password
// Usage: node scripts/generate-hash.js "yourpassword"

const password = process.argv[2];

if (!password) {
  console.log('Usage: node scripts/generate-hash.js "yourpassword"');
  console.log('\nExample:');
  console.log('  node scripts/generate-hash.js "mypassword123"');
  process.exit(1);
}

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }
  
  console.log('\n✅ Generated bcrypt hash:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(hash);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📝 SQL UPDATE statement:');
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE university_id = 'YOUR_UNIVERSITY_ID';\n`);
});

