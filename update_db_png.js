const db = require('./config/db');
const fs = require('fs');
const path = require('path');

async function updateDbImagePaths() {
  try {
    const [rows] = await db.query("SELECT id, name, image_url FROM cars");
    console.log(`Checking ${rows.length} cars in database...`);
    
    for (const car of rows) {
      if (car.image_url && car.image_url.endsWith('.jpg')) {
        const pngUrl = car.image_url.replace('.jpg', '.png');
        const localPngPath = path.join(__dirname, 'public', pngUrl);
        
        if (fs.existsSync(localPngPath)) {
          await db.query("UPDATE cars SET image_url = ? WHERE id = ?", [pngUrl, car.id]);
          console.log(`Updated car #${car.id} (${car.name}): ${car.image_url} -> ${pngUrl}`);
        }
      }
    }
    console.log("Database update completed!");
    process.exit(0);
  } catch (err) {
    console.error("DB Update error:", err);
    process.exit(1);
  }
}

updateDbImagePaths();
