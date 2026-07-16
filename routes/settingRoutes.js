const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const authMiddleware = require('../middleware/authMiddleware');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Lấy tất cả cấu hình (Công khai)
router.get('/', settingController.getSettings);

// Cập nhật cấu hình (Chỉ Admin)
router.put('/', authMiddleware, upload.single('intro_image_file'), settingController.updateSettings);

module.exports = router;
