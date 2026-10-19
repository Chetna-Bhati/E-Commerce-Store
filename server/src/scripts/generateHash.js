const bcrypt = require('bcryptjs');

async function main() {
  const password = 'password123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash for password123:', hash);

  // Verify it works
  const match = await bcrypt.compare(password, hash);
  console.log('Verification check:', match ? 'PASS ✓' : 'FAIL ✗');
}

main();
