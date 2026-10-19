const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

// Freshly generated bcrypt hash for 'password123'
const PASSWORD_HASH = '$2a$10$SLOZv4d7V0pvbIFMMzI8O.n9tKV9Xw9o3tWp6i.v9jD0g7RNMm19W';

async function runSeed() {
  console.log('Connecting to MySQL...');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    const seedPath = path.join(__dirname, '../../../database/seed.sql');

    console.log('Applying database schema from schema.sql...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSql);
    console.log('Schema created successfully.');

    console.log('Seeding products, categories, coupons, and test users from seed.sql...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await connection.query(seedSql);
    console.log('Seed completed successfully!');

    // Fix: Update the user password hashes to a known-good bcrypt hash
    console.log('Updating user password hashes...');
    await connection.query(`USE threadline_db`);
    await connection.query(
      `UPDATE users SET password_hash = ? WHERE email IN ('admin@threadline.com', 'user@threadline.com')`,
      [PASSWORD_HASH]
    );
    const [rows] = await connection.query(`SELECT email, role FROM users WHERE email IN ('admin@threadline.com', 'user@threadline.com')`);
    console.log('Users updated:', rows);
    console.log('');
    console.log('✅ All done! You can now log in with:');
    console.log('   admin@threadline.com / password123');
    console.log('   user@threadline.com  / password123');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nPlease check your MySQL password in server/.env (DB_PASSWORD).');
    }
  } finally {
    await connection.end();
  }
}

runSeed();
