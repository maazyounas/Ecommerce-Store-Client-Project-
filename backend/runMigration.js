import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function runMigration() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    console.log('✅ MySQL Connected...');

    // Check if parent_id column already exists
    const [columns] = await connection.query(
      "SHOW COLUMNS FROM categories LIKE 'parent_id'"
    );

    if (columns.length > 0) {
      console.log('ℹ️  parent_id column already exists. Skipping migration.');
      return;
    }

    // Read the migration file
    const migrationPath = path.join(__dirname, 'migrations', 'add_subcategory_support.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Split by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
        const preview = statement.substring(0, 60).replace(/\n/g, ' ');
        console.log('✅ Executed:', preview + '...');
      }
    }

    console.log('✅ Migration completed successfully!');
    console.log('📦 Database now supports subcategories.');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigration();
