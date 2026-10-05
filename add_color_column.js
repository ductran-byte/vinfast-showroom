const db = require('./config/db');

async function addColorColumn() {
  try {
    const [cols] = await db.query("SHOW COLUMNS FROM test_drives LIKE 'selected_color'");
    if (cols.length === 0) {
      await db.query("ALTER TABLE test_drives ADD COLUMN selected_color VARCHAR(100) NULL AFTER car_id");
      console.log("Added selected_color column to test_drives table successfully!");
    } else {
      console.log("selected_color column already exists in test_drives table.");
    }
    process.exit(0);
  } catch (err) {
    console.error("Error adding selected_color column:", err);
    process.exit(1);
  }
}

addColorColumn();
