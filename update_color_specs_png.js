const db = require('./config/db');
const fs = require('fs');
const path = require('path');

async function updateSpecsColorImages() {
  try {
    const [rows] = await db.query("SELECT id, specifications FROM cars");
    for (const car of rows) {
      if (!car.specifications) continue;
      let specs = car.specifications;
      if (typeof specs === 'string') {
        try { specs = JSON.parse(specs); } catch (e) {}
      }
      if (specs && Array.isArray(specs.colors)) {
        let updated = false;
        specs.colors = specs.colors.map(col => {
          if (col.image_url && col.image_url.endsWith('.jpg')) {
            const pngUrl = col.image_url.replace('.jpg', '.png');
            const localPath = path.join(__dirname, 'public', pngUrl);
            if (fs.existsSync(localPath)) {
              updated = true;
              return { ...col, image_url: pngUrl };
            }
          }
          return col;
        });
        if (updated) {
          await db.query("UPDATE cars SET specifications = ? WHERE id = ?", [JSON.stringify(specs), car.id]);
          console.log(`Updated color variant images for car #${car.id}`);
        }
      }
    }
    console.log("Color variants update completed!");
    process.exit(0);
  } catch (err) {
    console.error("Specs update error:", err);
    process.exit(1);
  }
}

updateSpecsColorImages();
