const db = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ tài khoản và mật khẩu.' });
  }

  try {
    // 1. Kiểm tra tài khoản trong bảng admins trước
    const [adminRows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    
    if (adminRows.length > 0) {
      const admin = adminRows[0];
      
      // Đối chiếu mật khẩu admin
      const isMatch = (password === admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không chính xác.' });
      }

      // Tạo JWT Token cho admin
      const payload = { id: admin.id, username: admin.username, role: 'admin' };
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'vinfast_secret_key_123456_789',
        { expiresIn: '24h' }
      );

      return res.json({
        message: 'Đăng nhập thành công!',
        token: token,
        role: 'admin',
        admin: {
          id: admin.id,
          username: admin.username
        }
      });
    }

    // 2. Nếu không phải admin, kiểm tra tài khoản trong bảng users
    const [userRows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (userRows.length === 0) {
      return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không chính xác.' });
    }

    const user = userRows[0];

    // Đối chiếu mật khẩu khách hàng
    const isMatch = (password === user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không chính xác.' });
    }

    // Tạo JWT Token cho khách hàng
    const payload = { id: user.id, username: user.username, role: 'user' };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'vinfast_secret_key_123456_789',
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Đăng nhập thành công!',
      token: token,
      role: 'user',
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        phone: user.phone,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi xử lý đăng nhập.' });
  }
};

exports.register = async (req, res) => {
  const { username, password, fullname, phone, email } = req.body;

  if (!username || !password || !fullname || !phone) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ các thông tin bắt buộc.' });
  }

  try {
    // Kiểm tra tên tài khoản trong bảng admins
    const [adminRows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (adminRows.length > 0) {
      return res.status(400).json({ message: 'Tên tài khoản này đã được đăng ký.' });
    }

    // Kiểm tra tên tài khoản trong bảng users
    const [userRows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (userRows.length > 0) {
      return res.status(400).json({ message: 'Tên tài khoản này đã được đăng ký.' });
    }

    // Lưu khách hàng mới vào database
    await db.query(
      'INSERT INTO users (username, password, fullname, phone, email) VALUES (?, ?, ?, ?, ?)',
      [username, password, fullname, phone, email || null]
    );

    res.status(201).json({ message: 'Đăng ký tài khoản thành công! Bây giờ bạn có thể đăng nhập.' });

  } catch (error) {
    console.error('Lỗi đăng ký tài khoản:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi xử lý đăng ký.' });
  }
};
