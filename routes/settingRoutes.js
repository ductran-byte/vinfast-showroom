const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const authMiddleware = require('../middleware/authMiddleware');

// Lấy tất cả cấu hình (Công khai)
router.get('/', settingController.getSettings);

// Cập nhật cấu hình (Chỉ Admin)
router.put('/', authMiddleware, settingController.updateSettings);

module.exports = router;
