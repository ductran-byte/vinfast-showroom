const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bannerController = require('../controllers/bannerController');
const authMiddleware = require('../middleware/authMiddleware');

// Cấu hình lưu trữ file ảnh banner bằng Multer trong RAM
const storage = multer.memoryStorage();

// Bộ lọc file ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png, webp, gif).'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// API endpoints
router.get('/', bannerController.getAllBanners);
router.post('/', authMiddleware, upload.single('image'), bannerController.createBanner);
router.put('/:id', authMiddleware, upload.single('image'), bannerController.updateBanner);
router.delete('/:id', authMiddleware, bannerController.deleteBanner);

module.exports = router;
