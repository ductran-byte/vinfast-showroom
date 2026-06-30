const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Không có quyền truy cập. Token bị thiếu.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vinfast_secret_key_123456_789');
    
    // Kiểm tra role của user
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập. Bạn không phải là quản trị viên.' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
};
