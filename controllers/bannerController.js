const db = require('../config/db');
const fs = require('fs');
const path = require('path');
const cache = require('../config/cache');

// Lấy danh sách tất cả các banner
exports.getAllBanners = async (req, res) => {
  try {
    const cacheKey = 'banners_all';
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const [rows] = await db.query('SELECT * FROM banners ORDER BY id ASC');
    cache.set(cacheKey, rows);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi lấy danh sách banner:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi tải danh sách banner.' });
  }
};

// Thêm banner mới (Chỉ Admin)
exports.createBanner = async (req, res) => {
  try {
    const { title, subtitle, description, link_url } = req.body;

    if (!title || !subtitle) {
      // Nếu có tải ảnh lên mà lỗi, xóa đi
      if (req.file) {
        fs.unlinkSync(path.join(__dirname, '../public/uploads', req.file.filename));
      }
      return res.status(400).json({ message: 'Vui lòng cung cấp tiêu đề và phụ đề banner.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng tải lên hình ảnh cho banner.' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const [result] = await db.query(
      `INSERT INTO banners (title, subtitle, description, image_url, link_url)
       VALUES (?, ?, ?, ?, ?)`,
      [
        title,
        subtitle,
        description || '',
        imageUrl,
        link_url || '#'
      ]
    );

    cache.clear();
    res.status(201).json({
      message: 'Thêm banner mới thành công!',
      bannerId: result.insertId
    });

  } catch (error) {
    console.error('Lỗi thêm banner:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi thêm banner.' });
  }
};

// Cập nhật banner (Chỉ Admin)
exports.updateBanner = async (req, res) => {
  const { id } = req.params;
  try {
    // Kiểm tra banner có tồn tại không
    const [rows] = await db.query('SELECT * FROM banners WHERE id = ?', [id]);
    if (rows.length === 0) {
      if (req.file) {
        fs.unlinkSync(path.join(__dirname, '../public/uploads', req.file.filename));
      }
      return res.status(404).json({ message: 'Không tìm thấy thông tin banner.' });
    }

    const currentBanner = rows[0];
    const { title, subtitle, description, link_url } = req.body;

    let imageUrl = currentBanner.image_url;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      // Xóa ảnh cũ nếu nó không phải là ảnh mẫu ban đầu
      if (currentBanner.image_url && 
          currentBanner.image_url !== '/uploads/banner_summer.png' && 
          currentBanner.image_url !== '/uploads/banner_eco.png') {
        const oldImagePath = path.join(__dirname, '../public', currentBanner.image_url);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.error('Không thể xóa ảnh cũ:', err);
          }
        }
      }
    }

    await db.query(
      `UPDATE banners 
       SET title = ?, subtitle = ?, description = ?, image_url = ?, link_url = ?
       WHERE id = ?`,
      [
        title || currentBanner.title,
        subtitle || currentBanner.subtitle,
        description !== undefined ? description : currentBanner.description,
        imageUrl,
        link_url || currentBanner.link_url,
        id
      ]
    );

    cache.clear();
    res.json({ message: 'Cập nhật banner thành công!' });

  } catch (error) {
    console.error('Lỗi cập nhật banner:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi cập nhật banner.' });
  }
};

// Xóa banner (Chỉ Admin)
exports.deleteBanner = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM banners WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy banner cần xóa.' });
    }

    const banner = rows[0];

    // Xóa ảnh của banner nếu không phải ảnh mẫu mặc định
    if (banner.image_url && 
        banner.image_url !== '/uploads/banner_summer.png' && 
        banner.image_url !== '/uploads/banner_eco.png') {
      const imagePath = path.join(__dirname, '../public', banner.image_url);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.error('Lỗi khi xóa file ảnh banner:', err);
        }
      }
    }

    await db.query('DELETE FROM banners WHERE id = ?', [id]);
    cache.clear();
    res.json({ message: 'Xóa banner thành công!' });

  } catch (error) {
    console.error('Lỗi xóa banner:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi xóa banner.' });
  }
};
