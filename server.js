const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const testDriveRoutes = require('./routes/testDriveRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Đăng ký API routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/test-drives', testDriveRoutes);

// Xử lý lỗi toàn cục (ví dụ lỗi Multer upload)
app.use((err, req, res, next) => {
  if (err instanceof Error) {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: 'Lỗi hệ thống không xác định.' });
});

// Chạy server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`Trang chủ: http://localhost:${PORT}`);
    console.log(`Trang Admin: http://localhost:${PORT}/admin.html`);
    console.log(`========================================`);
  });
}

module.exports = app;
