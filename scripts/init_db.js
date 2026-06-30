const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function initDB() {
  const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  };

  const dbName = process.env.DB_NAME || 'vinfast_db';
  console.log(`Connecting to MySQL at ${connectionConfig.host}:${connectionConfig.port}...`);

  let connection;
  try {
    connection = await mysql.createConnection(connectionConfig);
  } catch (error) {
    console.error('Cannot connect to MySQL server. Please make sure MySQL is running.', error);
    process.exit(1);
  }

  try {
    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`Database "${dbName}" checked/created successfully.`);
    
    // Switch to database
    await connection.query(`USE \`${dbName}\`;`);

    // Drop tables if they exist to refresh schema
    console.log('Dropping existing tables to refresh schema...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    await connection.query('DROP TABLE IF EXISTS test_drives;');
    await connection.query('DROP TABLE IF EXISTS cars;');
    await connection.query('DROP TABLE IF EXISTS banners;');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

    // Create admins table
    console.log('Creating "admins" table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // Create users table
    console.log('Creating "users" table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        fullname VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // Create cars table with category column
    console.log('Creating "cars" table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cars (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        segment VARCHAR(10) NOT NULL,
        category VARCHAR(50) NOT NULL,
        price DECIMAL(15, 2) NOT NULL,
        range_km INT NOT NULL,
        power_hp INT NOT NULL,
        torque_nm INT NOT NULL,
        battery_kwh DECIMAL(5, 2) NOT NULL,
        seats INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        description TEXT,
        specifications JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // Create test_drives table
    console.log('Creating "test_drives" table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS test_drives (
        id INT AUTO_INCREMENT PRIMARY KEY,
        car_id INT,
        fullname VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(100),
        province VARCHAR(50) NOT NULL,
        showroom VARCHAR(100) NOT NULL,
        preferred_date DATE NOT NULL,
        status VARCHAR(30) DEFAULT 'Chờ liên hệ',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);

    // Create banners table
    console.log('Creating "banners" table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255) NOT NULL,
        link_url VARCHAR(255) DEFAULT '#',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // Check if admin exists, if not insert default admin
    const [admins] = await connection.query('SELECT * FROM admins WHERE username = ?', ['admin']);
    if (admins.length === 0) {
      console.log('Inserting default admin account...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.query('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
      console.log('Default admin created: admin / admin123');
    } else {
      console.log('Admin account already exists.');
    }

    // Refresh sample banners
    console.log('Inserting default banners...');
    const defaultBanners = [
      {
        title: 'VINFASCINATION ĐÓN HÈ RỰC RỠ',
        subtitle: 'CHƯƠNG TRÌNH ƯU ĐÃI HÈ',
        description: 'Nhận ngay ưu đãi giá bán lên đến 3%* cùng cơ hội nhận Voucher nghỉ dưỡng Vinpearl thượng lưu khi đặt cọc các dòng ô tô điện thông minh ngay hôm nay.',
        image_url: '/uploads/banner_summer.png',
        link_url: '#showroom'
      },
      {
        title: 'TƯƠNG LAI XANH KIẾN TẠO PHONG CÁCH',
        subtitle: 'HỆ SINH THÁI XE ĐIỆN',
        description: 'Hệ sinh thái di chuyển xanh bền vững của VinFast mang tính đột phá về công nghệ, kết nối và trải nghiệm lái tự hành thông minh cấp độ cao.',
        image_url: '/uploads/banner_eco.png',
        link_url: '#showroom'
      }
    ];

    for (const banner of defaultBanners) {
      await connection.query(
        `INSERT INTO banners (title, subtitle, description, image_url, link_url) VALUES (?, ?, ?, ?, ?)`,
        [banner.title, banner.subtitle, banner.description, banner.image_url, banner.link_url]
      );
    }
    console.log('Default banners inserted.');

    // Refresh sample cars
    console.log('Refreshing sample cars...');
    const sampleCars = [
      // === ĐỘNG CƠ ĐIỆN ===
      {
        name: 'VinFast VF 3',
        type: 'Mini SUV',
        segment: 'Mini',
        category: 'Động cơ điện',
        price: 240000000.00,
        range_km: 210,
        power_hp: 43,
        torque_nm: 110,
        battery_kwh: 18.64,
        seats: 4,
        image_url: '/uploads/vf3.jpg',
        description: 'VinFast VF 3 là mẫu xe điện cỡ nhỏ thông minh được thiết kế đặc biệt dành riêng cho giao thông đô thị. Với kiểu dáng hình hộp cá tính, năng động và khoảng sáng gầm xe lớn, VF 3 mang lại khả năng di chuyển linh hoạt trên mọi nẻo đường đô thị đông đúc.',
        specifications: JSON.stringify({
          dimensions: '3190 x 1679 x 1622 mm',
          wheelbase: '2075 mm',
          ground_clearance: '191 mm',
          drive_type: 'Cầu sau (RWD)',
          charging_time: '36 phút (10% lên 70%)',
          safety: 'Phanh ABS, EBD, Hỗ trợ khởi hành ngang dốc, Cảm biến lùi, 1 túi khí',
          colors: [
            { name: 'Vàng Dã Ngoại (Mặc định)', hex: '#EBC83C', image_url: '/uploads/vf3.jpg' },
            { name: 'Trắng Tinh Khôi', hex: '#F5F6F8', image_url: '/uploads/vf3_white.jpg' },
            { name: 'Hồng Phấn', hex: '#F3A3B8', image_url: '/uploads/vf3_pink.jpg' }
          ]
        })
      },
      {
        name: 'VinFast VF 5 Plus',
        type: 'A-SUV',
        segment: 'A',
        category: 'Động cơ điện',
        price: 468000000.00,
        range_km: 326,
        power_hp: 134,
        torque_nm: 135,
        battery_kwh: 37.23,
        seats: 5,
        image_url: '/uploads/vf5.jpg',
        description: 'VinFast VF 5 Plus sở hữu thiết kế hiện đại, trẻ trung, cá tính với các tùy chọn phối màu sơn độc đáo. Xe được trang bị các tính năng an toàn vượt trội cùng công nghệ thông minh hàng đầu phân khúc A-SUV, mang lại trải nghiệm lái thú vị và kinh tế.',
        specifications: JSON.stringify({
          dimensions: '3965 x 1720 x 1580 mm',
          wheelbase: '2513 mm',
          ground_clearance: '182 mm',
          drive_type: 'Cầu trước (FWD)',
          charging_time: '30 phút (10% lên 70%)',
          safety: '6 túi khí, ABS, EBD, BA, ESC, TCS, HAS, Cảnh báo điểm mù, Cảnh báo phương tiện cắt ngang phía sau',
          colors: [
            { name: 'Xanh Turquoise (Mặc định)', hex: '#00ced1', image_url: '/uploads/vf5.jpg' }
          ]
        })
      },
      {
        name: 'VinFast VF 6',
        type: 'B-SUV',
        segment: 'B',
        category: 'Động cơ điện',
        price: 675000000.00,
        range_km: 399,
        power_hp: 174,
        torque_nm: 250,
        battery_kwh: 59.60,
        seats: 5,
        image_url: '/uploads/vf6.jpg',
        description: 'VinFast VF 6 là sự kết hợp hoàn hảo giữa thiết kế thời thượng của studio danh tiếng Torino Design và công nghệ tiên tiến. Đây là mẫu xe lý tưởng cho các gia đình trẻ hiện đại mong muốn sở hữu một chiếc xe xanh, thông minh và đầy phong cách.',
        specifications: JSON.stringify({
          dimensions: '4238 x 1820 x 1594 mm',
          wheelbase: '2730 mm',
          ground_clearance: '170 mm',
          drive_type: 'Cầu trước (FWD)',
          charging_time: '30 phút (10% lên 70%)',
          safety: 'Hệ thống trợ lái nâng cao ADAS cấp độ 2, 8 túi khí, Cảnh báo chệch làn, Hỗ trợ giữ làn, Giám sát hành trình thích ứng',
          colors: [
            { name: 'Cam Hoàng Hôn (Mặc định)', hex: '#e67e22', image_url: '/uploads/vf6.jpg' }
          ]
        })
      },
      {
        name: 'VinFast VF MPV 7',
        type: 'MPV',
        segment: 'C',
        category: 'Động cơ điện',
        price: 730000000.00,
        range_km: 380,
        power_hp: 150,
        torque_nm: 240,
        battery_kwh: 55.40,
        seats: 7,
        image_url: '/uploads/vf9.jpg',
        description: 'VinFast VF MPV 7 là dòng xe đa dụng gia đình 7 chỗ thời thượng sử dụng động cơ điện thông minh, mang lại không gian rộng rãi cho cả gia đình lớn.',
        specifications: JSON.stringify({
          dimensions: '4450 x 1820 x 1650 mm',
          wheelbase: '2750 mm',
          ground_clearance: '175 mm',
          drive_type: 'Cầu trước (FWD)',
          charging_time: '28 phút (10% lên 70%)',
          safety: 'ABS, EBD, Cân bằng điện tử, Hỗ trợ khởi hành ngang dốc, 6 túi khí',
          colors: [
            { name: 'Xanh Navy (Mặc định)', hex: '#0a3d62', image_url: '/uploads/vf9.jpg' }
          ]
        })
      },
      {
        name: 'VinFast VF 7',
        type: 'C-SUV',
        segment: 'C',
        category: 'Động cơ điện',
        price: 850000000.00,
        range_km: 431,
        power_hp: 349,
        torque_nm: 500,
        battery_kwh: 75.30,
        seats: 5,
        image_url: '/uploads/vf7.jpg',
        description: 'VinFast VF 7 sở hữu ngôn ngữ thiết kế "Vũ trụ phi đối xứng" đầy táo bạo và đậm chất tương lai được chắp bút bởi Torino Design. Với công suất cực khủng lên tới 349 mã lực và hệ dẫn động 2 cầu toàn thời gian AWD, VF 7 mang đến cảm giác lái thể thao phấn khích tột độ.',
        specifications: JSON.stringify({
          dimensions: '4545 x 1890 x 1635 mm',
          wheelbase: '2840 mm',
          ground_clearance: '190 mm',
          drive_type: 'Hai cầu toàn thời gian (AWD)',
          charging_time: '24.6 phút (10% lên 70%)',
          safety: 'Trợ lái ADAS nâng cao, 8 túi khí, Camera 360 độ, Tự động phanh khẩn cấp, Cảnh báo va chạm phía trước',
          colors: [
            { name: 'Xám Kim Loại (Mặc định)', hex: '#7f8c8d', image_url: '/uploads/vf7.jpg' },
            { name: 'Xanh Neon', hex: '#00f0ff', image_url: '/uploads/vf7_blue.jpg' },
            { name: 'Đỏ Hoàng Hôn', hex: '#c0392b', image_url: '/uploads/vf7_red.jpg' }
          ]
        })
      },
      {
        name: 'VinFast VF 8 Eco',
        type: 'D-SUV',
        segment: 'D',
        category: 'Động cơ điện',
        price: 1090000000.00,
        range_km: 471,
        power_hp: 349,
        torque_nm: 500,
        battery_kwh: 88.80,
        seats: 5,
        image_url: '/uploads/vf8.jpg',
        description: 'VinFast VF 8 là dòng xe điện phân khúc D-SUV toàn cầu kết hợp tính sang trọng, công nghệ hiện đại và khả năng vận hành mạnh mẽ. Thiết kế cân đối mang hơi hướng SUV Coupe năng động cùng không gian nội thất rộng rãi cao cấp.',
        specifications: JSON.stringify({
          dimensions: '4750 x 1934 x 1667 mm',
          wheelbase: '2950 mm',
          ground_clearance: '175 mm',
          drive_type: 'Hai cầu toàn thời gian (AWD)',
          charging_time: '31 phút (10% lên 70%)',
          safety: 'Hệ thống trợ lái ADAS cao cấp, 11 túi khí, Nhận diện biển báo giao thông, Hỗ trợ đỗ xe thông minh, Camera 360',
          colors: [
            { name: 'Đỏ Crimson (Mặc định)', hex: '#c0392b', image_url: '/uploads/vf8.jpg' },
            { name: 'Xanh Đại Dương', hex: '#0a3d62', image_url: '/uploads/vf8_blue.jpg' },
            { name: 'Đen Sang Trọng', hex: '#1e272e', image_url: '/uploads/vf8_black.jpg' }
          ]
        })
      },
      {
        name: 'VinFast VF 8 The All New',
        type: 'D-SUV',
        segment: 'D',
        category: 'Động cơ điện',
        price: 1160000000.00,
        range_km: 490,
        power_hp: 402,
        torque_nm: 620,
        battery_kwh: 90.00,
        seats: 5,
        image_url: '/uploads/vf8_black.jpg',
        description: 'Phiên bản cải tiến vượt bậc VinFast VF 8 The All New được trang bị những tính năng an toàn hiện đại nhất cùng kiểu dáng thể thao đỉnh cao.',
        specifications: JSON.stringify({
          dimensions: '4750 x 1934 x 1667 mm',
          wheelbase: '2950 mm',
          ground_clearance: '180 mm',
          drive_type: 'Hai cầu toàn thời gian (AWD)',
          charging_time: '26 phút (10% lên 70%)',
          safety: 'ADAS cấp độ 2+, 11 túi khí, Tránh va chạm sớm, Phanh khẩn cấp trước sau',
          colors: [
            { name: 'Đen Thượng Lưu (Mặc định)', hex: '#1e272e', image_url: '/uploads/vf8_black.jpg' }
          ]
        })
      },
      {
        name: 'VinFast VF 9 Plus',
        type: 'E-SUV',
        segment: 'E',
        category: 'Động cơ điện',
        price: 1566000000.00,
        range_km: 626,
        power_hp: 402,
        torque_nm: 620,
        battery_kwh: 123.00,
        seats: 7,
        image_url: '/uploads/vf9.jpg',
        description: 'VinFast VF 9 là mẫu SUV điện 7 chỗ cỡ lớn hạng sang hàng đầu của VinFast. Sở hữu vóc dáng bề thế, sang trọng đẳng cấp cùng khoang cabin rộng rãi như chuyên cơ mặt đất, VF 9 khẳng định vị thế dẫn đầu và phong cách thượng lưu của chủ nhân.',
        specifications: JSON.stringify({
          dimensions: '5118 x 2254 x 1696 mm',
          wheelbase: '3150 mm',
          ground_clearance: '197 mm',
          drive_type: 'Hai cầu toàn thời gian (AWD)',
          charging_time: '35 phút (10% lên 70%)',
          safety: '11 túi khí, Hệ thống tự lái cấp độ 2, Ghế massage sưởi/thông gió, Cửa sổ trời toàn cảnh, Đèn Matrix LED thông minh',
          colors: [
            { name: 'Xanh Hàng Hải (Mặc định)', hex: '#002b5c', image_url: '/uploads/vf9.jpg' },
            { name: 'Bạc Quý Phái', hex: '#bdc3c7', image_url: '/uploads/vf9_silver.jpg' },
            { name: 'Trắng Ngọc Trai', hex: '#ffffff', image_url: '/uploads/vf9_white.jpg' }
          ]
        })
      },

      // === ĐỘNG CƠ XĂNG ===
      {
        name: 'VinFast Lux A2.0',
        type: 'Sedan',
        segment: 'D',
        category: 'Động cơ xăng',
        price: 881000000.00,
        range_km: 0,
        power_hp: 228,
        torque_nm: 350,
        battery_kwh: 0,
        seats: 5,
        image_url: '/uploads/default-car.jpg',
        description: 'VinFast Lux A2.0 là dòng xe sedan hạng sang mang thiết kế Ý quyến rũ kết hợp khung gầm và động cơ tăng áp 2.0L hiệu suất cao của Đức.',
        specifications: JSON.stringify({
          dimensions: '4973 x 1900 x 1464 mm',
          wheelbase: '2968 mm',
          ground_clearance: '150 mm',
          drive_type: 'Cầu sau (RWD)',
          charging_time: 'Không có (Chạy Xăng)',
          safety: '6 túi khí, ABS, EBD, Cân bằng điện tử, Hỗ trợ khởi hành ngang dốc, Cảnh báo điểm mù',
          colors: [
            { name: 'Đen Lịch Lãm (Mặc định)', hex: '#1e272e', image_url: '/uploads/default-car.jpg' }
          ]
        })
      },
      {
        name: 'VinFast Lux SA2.0',
        type: 'SUV',
        segment: 'E',
        category: 'Động cơ xăng',
        price: 1200000000.00,
        range_km: 0,
        power_hp: 228,
        torque_nm: 350,
        battery_kwh: 0,
        seats: 7,
        image_url: '/uploads/default-car.jpg',
        description: 'VinFast Lux SA2.0 là mẫu xe SUV 7 chỗ đa dụng cao cấp sở hữu phong cách thiết kế mạnh mẽ đột phá đầy cuốn hút mang bản sắc Việt.',
        specifications: JSON.stringify({
          dimensions: '4940 x 1960 x 1773 mm',
          wheelbase: '2933 mm',
          ground_clearance: '192 mm',
          drive_type: 'Hai cầu chủ động (AWD/RWD)',
          charging_time: 'Không có (Chạy Xăng)',
          safety: '6 túi khí, ABS, EBD, Cân bằng điện tử, Hỗ trợ đổ đèo, Cảnh báo điểm mù, Camera 360',
          colors: [
            { name: 'Đỏ Đậm (Mặc định)', hex: '#c0392b', image_url: '/uploads/default-car.jpg' }
          ]
        })
      },

      // === DÒNG XE DỊCH VỤ ===
      {
        name: 'Minio Green',
        type: 'Mini Car',
        segment: 'Mini',
        category: 'Dòng xe dịch vụ',
        price: 180000000.00,
        range_km: 150,
        power_hp: 30,
        torque_nm: 85,
        battery_kwh: 15.00,
        seats: 4,
        image_url: '/uploads/minio_green.png',
        description: 'Dòng xe điện dịch vụ mini nhỏ gọn, màu sắc năng động, cực kỳ thích hợp cho di chuyển đô thị ngắn và kinh doanh dịch vụ giao nhận.',
        specifications: JSON.stringify({
          dimensions: '2920 x 1493 x 1621 mm',
          wheelbase: '1940 mm',
          ground_clearance: '125 mm',
          drive_type: 'Cầu sau (RWD)',
          charging_time: '5.5 tiếng sạc đầy chậm',
          safety: 'Phanh đĩa trước, ABS, Cảnh báo va chạm tốc độ thấp',
          colors: [
            { name: 'Xanh Lục Bảo', hex: '#00ced1', image_url: '/uploads/minio_green.png' }
          ]
        })
      },
      {
        name: 'Herio Green',
        type: 'Hatchback',
        segment: 'A',
        category: 'Dòng xe dịch vụ',
        price: 280000000.00,
        range_km: 250,
        power_hp: 60,
        torque_nm: 120,
        battery_kwh: 30.00,
        seats: 5,
        image_url: '/uploads/herio_green.png',
        description: 'Dòng xe Hatchback dịch vụ di chuyển vô cùng linh hoạt, tiết kiệm nhiên liệu tối đa và giá thành đầu tư cực kỳ kinh tế.',
        specifications: JSON.stringify({
          dimensions: '3765 x 1660 x 1520 mm',
          wheelbase: '2400 mm',
          ground_clearance: '140 mm',
          drive_type: 'Cầu trước (FWD)',
          charging_time: '40 phút (10% lên 70%)',
          safety: '2 túi khí, ABS, EBD, Cảm biến hỗ trợ đỗ xe',
          colors: [
            { name: 'Trắng Sữa', hex: '#f5f6f8', image_url: '/uploads/herio_green.png' }
          ]
        })
      },
      {
        name: 'Nerio Green',
        type: 'B-SUV',
        segment: 'B',
        category: 'Dòng xe dịch vụ',
        price: 350000000.00,
        range_km: 300,
        power_hp: 100,
        torque_nm: 180,
        battery_kwh: 40.00,
        seats: 5,
        image_url: '/uploads/nerio_green.png',
        description: 'SUV đô thị chuyên dụng cho dịch vụ vận tải hành khách công nghệ cao, đem lại độ tin cậy và không gian cabin thoải mái.',
        specifications: JSON.stringify({
          dimensions: '4050 x 1760 x 1580 mm',
          wheelbase: '2560 mm',
          ground_clearance: '165 mm',
          drive_type: 'Cầu trước (FWD)',
          charging_time: '35 phút (10% lên 70%)',
          safety: '4 túi khí, Cân bằng điện tử ESC, Hỗ trợ khởi hành ngang dốc',
          colors: [
            { name: 'Đen Bóng', hex: '#1e272e', image_url: '/uploads/nerio_green.png' }
          ]
        })
      },
      {
        name: 'Limo Green',
        type: 'C-SUV',
        segment: 'C',
        category: 'Dòng xe dịch vụ',
        price: 490000000.00,
        range_km: 380,
        power_hp: 150,
        torque_nm: 250,
        battery_kwh: 60.00,
        seats: 7,
        image_url: '/uploads/limo_green.png',
        description: 'Dòng xe dịch vụ Limousine 7 chỗ cao cấp, tạo cảm giác thư giãn cho hành khách trên các chặng hành trình dài liên tỉnh.',
        specifications: JSON.stringify({
          dimensions: '4620 x 1850 x 1720 mm',
          wheelbase: '2800 mm',
          ground_clearance: '185 mm',
          drive_type: 'Cầu trước (FWD)',
          charging_time: '30 phút (10% lên 70%)',
          safety: '6 túi khí, ABS, EBD, ESC, Hỗ trợ đổ đèo, Camera 360',
          colors: [
            { name: 'Bạc Quý Phái', hex: '#bdc3c7', image_url: '/uploads/limo_green.png' }
          ]
        })
      },
      {
        name: 'EC Van',
        type: 'Cargo Van',
        segment: 'Commercial',
        category: 'Dòng xe dịch vụ',
        price: 320000000.00,
        range_km: 220,
        power_hp: 80,
        torque_nm: 150,
        battery_kwh: 35.00,
        seats: 2,
        image_url: '/uploads/ec_van.png',
        description: 'Xe bán tải điện dịch vụ chở hàng hóa thông minh trong đô thị giờ cấm, năng lực chuyên chở vượt trội và không khí thải.',
        specifications: JSON.stringify({
          dimensions: '4500 x 1680 x 1980 mm',
          wheelbase: '2925 mm',
          ground_clearance: '160 mm',
          drive_type: 'Cầu sau (RWD)',
          charging_time: '45 phút (10% lên 70%)',
          safety: 'ABS, EBD, Cảm biến lùi, Vách ngăn cabin an toàn',
          colors: [
            { name: 'Đỏ Năng Động', hex: '#c0392b', image_url: '/uploads/ec_van.png' }
          ]
        })
      },
      {
        name: 'EBus',
        type: 'Transit Bus',
        segment: 'Commercial',
        category: 'Dòng xe dịch vụ',
        price: 1200000000.00,
        range_km: 250,
        power_hp: 250,
        torque_nm: 600,
        battery_kwh: 150.00,
        seats: 29,
        image_url: '/uploads/ebus.png',
        description: 'Dòng xe buýt điện thông minh công cộng, giúp đô thị hiện đại giảm thiểu khói bụi và tạo môi trường sống xanh.',
        specifications: JSON.stringify({
          dimensions: '7500 x 2200 x 3000 mm',
          wheelbase: '4200 mm',
          ground_clearance: '200 mm',
          drive_type: 'Cầu sau (RWD)',
          charging_time: '1.2 giờ sạc siêu nhanh',
          safety: 'Hệ thống phanh khí nén ABS, Cân bằng điện tử, Camera an ninh cabin, Hệ thống dập lửa tự động',
          colors: [
            { name: 'Xanh Lá và Trắng', hex: '#2ecc71', image_url: '/uploads/ebus.png' }
          ]
        })
      }
    ];

    for (const car of sampleCars) {
      await connection.query(
        `INSERT INTO cars (name, type, segment, category, price, range_km, power_hp, torque_nm, battery_kwh, seats, image_url, description, specifications) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [car.name, car.type, car.segment, car.category, car.price, car.range_km, car.power_hp, car.torque_nm, car.battery_kwh, car.seats, car.image_url, car.description, car.specifications]
      );
    }
    console.log('Sample cars inserted with color configurations.');

    console.log('Database initialization and upgrades completed successfully!');
  } catch (error) {
    console.error('Error during database initialization:', error);
  } finally {
    await connection.end();
  }
}

initDB();
