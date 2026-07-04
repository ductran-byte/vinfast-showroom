const db = require('../config/db');

// Khách đăng ký nhận báo giá hoặc đăng ký lái thử
exports.createTestDrive = async (req, res) => {
  const { type = 'drive', car_id, fullname, phone, email, preferred_date, address } = req.body;

  if (!car_id || !fullname || !phone) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin: Mẫu xe, Họ tên và Số điện thoại.' });
  }

  if (type === 'quote') {
    if (!address) {
      return res.status(400).json({ message: 'Vui lòng cung cấp địa chỉ nhận báo giá.' });
    }
  } else {
    if (!address || !preferred_date) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin lái thử: Địa chỉ và Ngày hẹn.' });
    }
  }

  try {
    const [result] = await db.query(
      `INSERT INTO test_drives (car_id, fullname, phone, email, address, preferred_date, type) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        parseInt(car_id),
        fullname.trim(),
        phone.trim(),
        email ? email.trim() : null,
        address.trim(),
        type === 'drive' ? preferred_date : null,
        type
      ]
    );

    const successMessage = type === 'quote'
      ? 'Yêu cầu nhận báo giá thành công! Nhân viên VinFast sẽ liên hệ với bạn trong thời gian sớm nhất.'
      : 'Đăng ký lái thử thành công! Nhân viên VinFast sẽ liên hệ với bạn để xác nhận lịch hẹn trong thời gian sớm nhất.';

    res.status(201).json({
      message: successMessage,
      bookingId: result.insertId
    });
  } catch (error) {
    console.error('Lỗi khi xử lý yêu cầu đăng ký:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi xử lý yêu cầu đăng ký.' });
  }
};


// Admin lấy danh sách lịch hẹn lái thử (Bảo mật)
exports.getAllTestDrives = async (req, res) => {
  try {
    const query = `
      SELECT td.*, c.name as car_name 
      FROM test_drives td 
      LEFT JOIN cars c ON td.car_id = c.id 
      ORDER BY td.created_at DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi lấy danh sách lái thử:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi tải danh sách lái thử.' });
  }
};

// Admin cập nhật trạng thái lịch hẹn lái thử (Bảo mật)
exports.updateTestDriveStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Vui lòng cung cấp trạng thái mới.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE test_drives SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin lịch hẹn lái thử.' });
    }

    res.json({ message: 'Cập nhật trạng thái thành công!' });
  } catch (error) {
    console.error('Lỗi cập nhật trạng thái lái thử:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi cập nhật trạng thái.' });
  }
};

// Admin xóa lịch hẹn lái thử (Bảo mật)
exports.deleteTestDrive = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM test_drives WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin lịch hẹn để xóa.' });
    }

    res.json({ message: 'Xóa lịch hẹn thành công!' });
  } catch (error) {
    console.error('Lỗi xóa lịch hẹn lái thử:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi xóa lịch hẹn.' });
  }
};
