const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// Lấy danh sách tất cả các xe (hỗ trợ lọc theo type và tìm kiếm theo tên)
exports.getAllCars = async (req, res) => {
  try {
    const { search, type } = req.query;
    let query = 'SELECT * FROM cars WHERE 1=1';
    const queryParams = [];

    if (search) {
      query += ' AND name LIKE ?';
      queryParams.push(`%${search}%`);
    }

    if (type && type !== 'Tất cả') {
      query += ' AND (category = ?)';
      queryParams.push(type);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, queryParams);

    // Parse specifications JSON
    const cars = rows.map(car => {
      let specs = {};
      if (car.specifications) {
        try {
          specs = typeof car.specifications === 'string' ? JSON.parse(car.specifications) : car.specifications;
        } catch (e) {
          specs = car.specifications;
        }
      }
      return { ...car, specifications: specs };
    });

    res.json(cars);
  } catch (error) {
    console.error('Lỗi lấy danh sách xe:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi tải danh sách xe.' });
  }
};

// Lấy chi tiết 1 xe
exports.getCarById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM cars WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin xe.' });
    }

    const car = rows[0];
    let specs = {};
    if (car.specifications) {
      try {
        specs = typeof car.specifications === 'string' ? JSON.parse(car.specifications) : car.specifications;
      } catch (e) {
        specs = car.specifications;
      }
    }

    res.json({ ...car, specifications: specs });
  } catch (error) {
    console.error('Lỗi lấy chi tiết xe:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi tải thông tin xe.' });
  }
};

// Thêm xe mới (Chỉ Admin)
exports.createCar = async (req, res) => {
  try {
    const {
      name,
      type,
      segment,
      category,
      price,
      range_km,
      power_hp,
      torque_nm,
      battery_kwh,
      seats,
      description,
      specifications
    } = req.body;

    if (!name || !type || !price) {
      return res.status(400).json({ message: 'Vui lòng cung cấp ít nhất tên xe, loại xe và giá bán.' });
    }

    // Xử lý hình ảnh
    let imageUrl = '/uploads/default-car.jpg'; // Ảnh mặc định nếu không tải lên
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Chuẩn hóa specifications thành chuỗi JSON
    let specsJson = '{}';
    if (specifications) {
      specsJson = typeof specifications === 'string' ? specifications : JSON.stringify(specifications);
    }

    const [result] = await db.query(
      `INSERT INTO cars (name, type, segment, category, price, range_km, power_hp, torque_nm, battery_kwh, seats, image_url, description, specifications)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        type,
        segment || 'Khác',
        category || 'Động cơ điện',
        parseFloat(price),
        parseInt(range_km) || 0,
        parseInt(power_hp) || 0,
        parseInt(torque_nm) || 0,
        parseFloat(battery_kwh) || 0.0,
        parseInt(seats) || 5,
        imageUrl,
        description || '',
        specsJson
      ]
    );

    res.status(201).json({
      message: 'Thêm xe mới thành công!',
      carId: result.insertId
    });

  } catch (error) {
    console.error('Lỗi thêm xe:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi thêm xe.' });
  }
};

// Cập nhật thông tin xe (Chỉ Admin)
exports.updateCar = async (req, res) => {
  const { id } = req.params;
  try {
    // Kiểm tra xe có tồn tại không
    const [rows] = await db.query('SELECT * FROM cars WHERE id = ?', [id]);
    if (rows.length === 0) {
      // Nếu có ảnh vừa tải lên, xóa đi để tránh rác
      if (req.file) {
        fs.unlinkSync(path.join(__dirname, '../public', 'uploads', req.file.filename));
      }
      return res.status(404).json({ message: 'Không tìm thấy thông tin xe cần cập nhật.' });
    }

    const currentCar = rows[0];
    const {
      name,
      type,
      segment,
      category,
      price,
      range_km,
      power_hp,
      torque_nm,
      battery_kwh,
      seats,
      description,
      specifications
    } = req.body;

    let imageUrl = currentCar.image_url;
    // Nếu có file ảnh mới tải lên
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      // Xóa ảnh cũ nếu nó không phải là ảnh mặc định và ảnh mẫu ban đầu (chỉ xóa các ảnh được upload sau này)
      if (currentCar.image_url && 
          !currentCar.image_url.startsWith('/uploads/vf') && 
          !currentCar.image_url.includes('green') && 
          !currentCar.image_url.includes('van') && 
          !currentCar.image_url.includes('bus') && 
          currentCar.image_url !== '/uploads/default-car.jpg') {
        const oldImagePath = path.join(__dirname, '../public', currentCar.image_url);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.error('Không thể xóa ảnh cũ:', err);
          }
        }
      }
    }

    let specsJson = currentCar.specifications;
    if (specifications) {
      specsJson = typeof specifications === 'string' ? specifications : JSON.stringify(specifications);
    }

    await db.query(
      `UPDATE cars 
       SET name = ?, type = ?, segment = ?, category = ?, price = ?, range_km = ?, power_hp = ?, torque_nm = ?, battery_kwh = ?, seats = ?, image_url = ?, description = ?, specifications = ?
       WHERE id = ?`,
      [
        name || currentCar.name,
        type || currentCar.type,
        segment || currentCar.segment,
        category || currentCar.category,
        price ? parseFloat(price) : currentCar.price,
        range_km ? parseInt(range_km) : currentCar.range_km,
        power_hp ? parseInt(power_hp) : currentCar.power_hp,
        torque_nm ? parseInt(torque_nm) : currentCar.torque_nm,
        battery_kwh ? parseFloat(battery_kwh) : currentCar.battery_kwh,
        seats ? parseInt(seats) : currentCar.seats,
        imageUrl,
        description !== undefined ? description : currentCar.description,
        specsJson,
        id
      ]
    );

    res.json({ message: 'Cập nhật thông tin xe thành công!' });

  } catch (error) {
    console.error('Lỗi cập nhật xe:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi cập nhật xe.' });
  }
};

// Xóa xe (Chỉ Admin)
exports.deleteCar = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM cars WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin xe để xóa.' });
    }

    const car = rows[0];

    // Xóa xe khỏi database
    await db.query('DELETE FROM cars WHERE id = ?', [id]);

    // Xóa file ảnh trên disk nếu không phải là ảnh mẫu ban đầu
    if (car.image_url && 
        !car.image_url.startsWith('/uploads/vf') && 
        !car.image_url.includes('green') && 
        !car.image_url.includes('van') && 
        !car.image_url.includes('bus') && 
        car.image_url !== '/uploads/default-car.jpg') {
      const imagePath = path.join(__dirname, '../public', car.image_url);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.error('Lỗi khi xóa file ảnh:', err);
        }
      }
    }

    res.json({ message: 'Xóa xe thành công!' });
  } catch (error) {
    console.error('Lỗi xóa xe:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi xóa xe.' });
  }
};
