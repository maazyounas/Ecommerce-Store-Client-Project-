import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function fixSubcategories() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    console.log('✅ MySQL Connected...');

    // Get all categories
    const [categories] = await connection.query("SELECT * FROM categories");
    
    console.log(`\nFound ${categories.length} categories in database:\n`);
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ID: ${cat.id}, Name: ${cat.name}, Parent ID: ${cat.parent_id}`);
    });

    console.log('\n✅ Review complete!');
    console.log('\nIf you see subcategories with parent_id = NULL, you need to update them manually.');
    console.log('Example: UPDATE categories SET parent_id = 1 WHERE id = 2;');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixSubcategories();
