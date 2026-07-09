const db = require('../config/db');
const cache = require('../config/cache');

// Lấy tất cả cấu hình
exports.getSettings = async (req, res) => {
  try {
    const cacheKey = 'settings_all';
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const [rows] = await db.query('SELECT * FROM settings');
    const settings = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    cache.set(cacheKey, settings);
    res.json(settings);
  } catch (error) {
    console.error('Lỗi lấy danh sách cấu hình:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi tải cấu hình.' });
  }
};

// Cập nhật cấu hình (Chỉ Admin)
exports.updateSettings = async (req, res) => {
  try {
    const settings = req.body;
    
    // settings là một object chứa các cặp key: value
    for (const [key, value] of Object.entries(settings)) {
      await db.query(
        'INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        [key, String(value).trim(), String(value).trim()]
      );
    }
    
    cache.clear();
    res.json({ message: 'Cập nhật cấu hình hệ thống thành công!' });
  } catch (error) {
    console.error('Lỗi cập nhật cấu hình:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi lưu cấu hình.' });
  }
};
