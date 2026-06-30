const express = require('express');
const router = express.Router();
const testDriveController = require('../controllers/testDriveController');
const authMiddleware = require('../middleware/authMiddleware');

// Route công khai cho khách hàng đăng ký lái thử
router.post('/', testDriveController.createTestDrive);

// Các route bảo mật dành riêng cho Admin quản lý
router.get('/', authMiddleware, testDriveController.getAllTestDrives);
router.put('/:id', authMiddleware, testDriveController.updateTestDriveStatus);
router.delete('/:id', authMiddleware, testDriveController.deleteTestDrive);

module.exports = router;
