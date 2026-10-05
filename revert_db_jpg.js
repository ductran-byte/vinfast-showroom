const db = require('./config/db');
const fs = require('fs');
const path = require('path');

async function revertDbToJpg() {
  try {
    const [rows] = await db.query("SELECT id, name, image_url, specifications FROM cars");
    console.log(`Checking ${rows.length} cars in database for revert...`);
    
    for (const car of rows) {
      let updatedCar = false;
      let newImageUrl = car.image_url;

      if (car.image_url && car.image_url.endsWith('.png')) {
        const jpgUrl = car.image_url.replace('.png', '.jpg');
        const localJpgPath = path.join(__dirname, 'public', jpgUrl);
        if (fs.existsSync(localJpgPath)) {
          newImageUrl = jpgUrl;
          updatedCar = true;
        }
      }

      let specs = car.specifications;
      let updatedSpecs = false;
      if (typeof specs === 'string') {
        try { specs = JSON.parse(specs); } catch (e) {}
      }

      if (specs && Array.isArray(specs.colors)) {
        specs.colors = specs.colors.map(col => {
          if (col.image_url && col.image_url.endsWith('.png')) {
            const jpgUrl = col.image_url.replace('.png', '.jpg');
            const localJpgPath = path.join(__dirname, 'public', jpgUrl);
            if (fs.existsSync(localJpgPath)) {
              updatedSpecs = true;
              return { ...col, image_url: jpgUrl };
            }
          }
          return col;
        });
      }

      if (updatedCar || updatedSpecs) {
        await db.query(
          "UPDATE cars SET image_url = ?, specifications = ? WHERE id = ?",
          [newImageUrl, JSON.stringify(specs), car.id]
        );
        console.log(`Reverted car #${car.id} (${car.name}) to JPG images.`);
      }
    }
    console.log("Revert to JPG completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Revert error:", err);
    process.exit(1);
  }
}

revertDbToJpg();
