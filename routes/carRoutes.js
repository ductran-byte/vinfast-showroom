const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const carController = require('../controllers/carController');
const authMiddleware = require('../middleware/authMiddleware');

// Cấu hình lưu trữ file ảnh bằng Multer trong RAM
const storage = multer.memoryStorage();

// Bộ lọc định dạng file hợp lệ (Hình ảnh & File PDF)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'application/pdf';

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận định dạng file hình ảnh (jpg, png, webp, gif) và file PDF (.pdf).'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 15 * 1024 * 1024, // Giới hạn kích thước file 15MB
    fieldSize: 10 * 1024 * 1024 // Giới hạn kích thước các trường text là 10MB
  },
  fileFilter: fileFilter
});

// API routes công khai cho khách xem xe
router.get('/', carController.getAllCars);
router.get('/:id', carController.getCarById);

// API routes được bảo mật cho Admin để chỉnh sửa thông tin xe
router.post('/', authMiddleware, upload.any(), carController.createCar);
router.put('/:id', authMiddleware, upload.any(), carController.updateCar);
router.delete('/:id', authMiddleware, carController.deleteCar);

module.exports = router;
