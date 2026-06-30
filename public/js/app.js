// Hiệu ứng thay đổi kiểu Header khi cuộn trang
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Điều khiển Hamburger Menu trên di động
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

if (mobileMenuBtn && navMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const icon = mobileMenuBtn.querySelector('i');
    if (navMenu.classList.contains('open')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    } else {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  });

  // Đóng menu khi bấm vào link điều hướng
  navMenu.querySelectorAll('ul li a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const icon = mobileMenuBtn.querySelector('i');
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    });
  });
}

// Trạng thái ứng dụng (App State)
let cars = [];
let compareList = [];
let selectedCarForFinance = null;
let currentFilter = 'Động cơ điện';
let currentSearch = '';

// Dữ liệu mẫu Trạm sạc & Showroom
const stationsData = [
  { name: 'Showroom VinFast Landmark 81', type: 'showroom', province: 'TP. Hồ Chí Minh', address: 'Tầng L1, Tòa Landmark 81, 720A Điện Biên Phủ, Bình Thạnh', phone: '1900 232389', hours: '09:00 - 21:00' },
  { name: 'Trạm sạc VinFast Megamall Thảo Điền', type: 'charger', province: 'TP. Hồ Chí Minh', address: 'Hầm B1, TTTM Vincom Thảo Điền, 161 Xa Lộ Hà Nội, Quận 2', detail: '4 trụ sạc siêu nhanh DC 250kW, 8 trụ sạc nhanh DC 60kW' },
  { name: 'Showroom VinFast Ocean Park', type: 'showroom', province: 'Hà Nội', address: 'TTTM Vincom Mega Mall Ocean Park, Gia Lâm', phone: '1900 232389', hours: '09:00 - 21:30' },
  { name: 'Trạm sạc VinFast Mỹ Đình', type: 'charger', province: 'Hà Nội', address: 'Bãi đỗ xe đối diện SVĐ Mỹ Đình, Lê Đức Thọ, Nam Từ Liêm', detail: '2 trụ sạc siêu nhanh DC 250kW, 12 trụ sạc nhanh DC 60kW, 6 trụ sạc AC 11kW' },
  { name: 'Showroom VinFast Royal City', type: 'showroom', province: 'Hà Nội', address: 'Tầng B2, TTTM Vincom Mega Mall Royal City, 72A Nguyễn Trãi, Thanh Xuân', phone: '1900 232389', hours: '09:30 - 22:00' },
  { name: 'Showroom VinFast Ngô Quyền', type: 'showroom', province: 'Đà Nẵng', address: 'TTTM Vincom Plaza Ngô Quyền, 910A Ngô Quyền, Sơn Trà', phone: '1900 232389', hours: '09:00 - 21:30' },
  { name: 'Trạm sạc Siêu Nhanh Đà Nẵng Riverside', type: 'charger', province: 'Đà Nẵng', address: 'Đường Trần Hưng Đạo, An Hải Tây, Sơn Trà (gần Cầu Rồng)', detail: '2 trụ sạc siêu nhanh DC 250kW, 4 trụ sạc nhanh DC 60kW' },
  { name: 'Showroom VinFast Cát Hải (Nhà máy)', type: 'showroom', province: 'Hải Phòng', address: 'Khu kinh tế Đình Vũ - Cát Hải, Huyện Cát Hải', phone: '1900 232389', hours: '08:00 - 17:00' },
  { name: 'Trạm sạc VinFast Lê Thánh Tông', type: 'charger', province: 'Hải Phòng', address: 'TTTM Vincom Plaza Lê Thánh Tông, 1 Lê Thánh Tông, Ngô Quyền', detail: '6 trụ sạc nhanh DC 60kW, 4 trụ sạc AC 11kW' }
];

// Dữ liệu Tỉnh/Thành, Quận/Huyện, Phường/Xã phục vụ Form đăng ký lái thử
const locationsData = {
  'Hà Nội': {
    'Quận Ba Đình': ['Phường Trúc Bạch', 'Phường Vĩnh Phúc', 'Phường Cống Vị', 'Phường Liễu Giai'],
    'Quận Hoàn Kiếm': ['Phường Hàng Bạc', 'Phường Tràng Tiền', 'Phường Đồng Xuân', 'Phường Lý Thái Tổ'],
    'Quận Tây Hồ': ['Phường Quảng An', 'Phường Xuân La', 'Phường Bưởi', 'Phường Phú Thượng'],
    'Quận Cầu Giấy': ['Phường Dịch Vọng', 'Phường Nghĩa Tân', 'Phường Mai Dịch', 'Phường Trung Hòa']
  },
  'TP. Hồ Chí Minh': {
    'Quận 1': ['Phường Bến Nghé', 'Phường Đa Kao', 'Phường Tân Định', 'Phường Phạm Ngũ Lão'],
    'Quận 3': ['Phường Võ Thị Sáu', 'Phường 12', 'Phường 14', 'Phường 5'],
    'Quận Bình Thạnh': ['Phường 15', 'Phường 25', 'Phường Hàng Xanh', 'Phường 27'],
    'Quận Thủ Đức': ['Phường Linh Trung', 'Phường Bình Thọ', 'Phường Thảo Điền', 'Phường Hiệp Bình Chánh']
  },
  'Đà Nẵng': {
    'Quận Hải Châu': ['Phường Thạch Thang', 'Phường Hòa Thuận Đông', 'Phường Phước Ninh'],
    'Quận Sơn Trà': ['Phường An Hải Tây', 'Phường Thọ Quang', 'Phường Mân Thái'],
    'Quận Ngũ Hành Sơn': ['Phường Mỹ An', 'Phường Khuê Mỹ', 'Phường Hòa Quý']
  },
  'Hải Phòng': {
    'Quận Hồng Bàng': ['Phường Hoàng Văn Thụ', 'Phường Minh Khai', 'Phường Phan Bội Châu'],
    'Quận Ngô Quyền': ['Phường Lạch Tray', 'Phường Máy Tơ', 'Phường Gia Viên'],
    'Quận Lê Chân': ['Phường Cát Dài', 'Phường An Biên', 'Phường Dư Hàng Kênh']
  }
};

// Các phần tử DOM
const carGrid = document.getElementById('car-grid');
const searchInput = document.getElementById('search-input');
const filterContainer = document.getElementById('filter-container');
const carModal = document.getElementById('car-modal');
const modalClose = document.getElementById('modal-close');

// DOM cho So Sánh
const compareDrawer = document.getElementById('compare-drawer');
const compareCountEl = document.getElementById('compare-count');
const compareSlotsEl = document.getElementById('compare-slots');
const btnCompareNow = document.getElementById('btn-compare-now');
const btnCompareClear = document.getElementById('btn-compare-clear');
const compareModal = document.getElementById('compare-modal');
const compareModalClose = document.getElementById('compare-modal-close');
const compareTable = document.getElementById('compare-table');

// DOM cho Lái Thử
const tdCarSelect = document.getElementById('td-car-select');
const tdProvince = document.getElementById('td-province');
const tdDistrict = document.getElementById('td-district');
const tdWard = document.getElementById('td-ward');
const testDriveForm = document.getElementById('test-drive-form');

// DOM cho Trạm sạc
const stationGrid = document.getElementById('station-grid');
const stationCountEl = document.getElementById('station-count');
const stationProvinceFilter = document.getElementById('station-province-filter');

// DOM cho Tính toán Tài chính
const selectBatteryOpt = document.getElementById('finance-battery-option');
const sliderPrepay = document.getElementById('finance-prepay');
const sliderMonths = document.getElementById('finance-months');
const sliderInterest = document.getElementById('finance-interest');
const lblPrepay = document.getElementById('lbl-prepay-percent');
const lblMonths = document.getElementById('lbl-loan-months');
const lblInterest = document.getElementById('lbl-interest-rate');

// Tải danh sách xe ban đầu
async function fetchCars() {
  try {
    let url = `/api/cars?search=${encodeURIComponent(currentSearch)}&type=${encodeURIComponent(currentFilter)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Không thể lấy danh sách xe.');
    cars = await response.json();
    renderCars();
  } catch (error) {
    console.error(error);
    carGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #ff3b30;">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 32px; margin-bottom: 12px;"></i>
        <p>Đã xảy ra lỗi khi tải dữ liệu xe. Vui lòng thử lại.</p>
      </div>
    `;
  }
}

// Tải toàn bộ danh sách xe phục vụ Form Đăng ký lái thử
async function loadAllCarsForTestDrive() {
  try {
    const response = await fetch('/api/cars'); // Không lọc tham số để lấy toàn bộ xe
    if (!response.ok) throw new Error('Không thể tải danh sách xe lái thử.');
    const allCars = await response.json();
    
    if (tdCarSelect) {
      const currentVal = tdCarSelect.value;
      tdCarSelect.innerHTML = '<option value="">-- Chọn dòng xe --</option>' + 
        allCars.map(car => `<option value="${car.id}">${car.name}</option>`).join('');
      if (currentVal) tdCarSelect.value = currentVal;
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách xe lái thử:', error);
  }
}

// Định dạng tiền tệ VND
function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

// Hiển thị danh sách xe ra Grid
function renderCars() {
  if (cars.length === 0) {
    carGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--text-muted);">
        <i class="fa-solid fa-car-rear" style="font-size: 48px; margin-bottom: 16px;"></i>
        <p>Không tìm thấy mẫu xe nào phù hợp với yêu cầu.</p>
      </div>
    `;
    return;
  }

  carGrid.innerHTML = cars.map(car => {
    const isAddedToCompare = compareList.includes(car.id);
    return `
      <div class="car-card glass-panel" onclick="showCarDetails(${car.id})">
        <div class="car-card-image">
          <span class="car-badge">${car.type}</span>
          <img src="${car.image_url}" alt="${car.name}" onerror="this.src='/uploads/default-car.jpg'">
        </div>
        <div class="car-card-body">
          <h3 class="car-card-title">${car.name}</h3>
          <p class="car-card-price">Giá từ: ${formatVND(car.price)}</p>
          <div class="car-features-mini">
            <div class="feature-mini-item">
              <span class="feature-mini-val">${car.range_km} km</span>
              <span class="feature-mini-lbl">Quãng đường</span>
            </div>
            <div class="feature-mini-item">
              <span class="feature-mini-val">${car.power_hp} Hp</span>
              <span class="feature-mini-lbl">Công suất</span>
            </div>
            <div class="feature-mini-item">
              <span class="feature-mini-val">${car.seats} chỗ</span>
              <span class="feature-mini-lbl">Số ghế</span>
            </div>
          </div>
          <div class="car-card-actions">
            <button class="btn btn-primary" onclick="event.stopPropagation(); showCarDetails(${car.id})">
              Xem Chi Tiết
            </button>
            <button class="btn btn-outline-compare ${isAddedToCompare ? 'added' : ''}" 
                    onclick="event.stopPropagation(); toggleCompare(${car.id})">
              ${isAddedToCompare ? '<i class="fa-solid fa-check"></i> Đã thêm' : '<i class="fa-solid fa-plus"></i> So sánh'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Xem chi tiết xe & Tính toán trả góp
async function showCarDetails(id) {
  try {
    const response = await fetch(`/api/cars/${id}`);
    if (!response.ok) throw new Error('Không thể tải chi tiết xe.');
    const car = await response.json();
    selectedCarForFinance = car;

    // Điền dữ liệu xe cơ bản
    document.getElementById('modal-img').src = car.image_url;
    document.getElementById('modal-img').onerror = function() { this.src = '/uploads/default-car.jpg'; };
    document.getElementById('modal-name').innerText = car.name;
    document.getElementById('modal-badge').innerText = `${car.type} (Phân khúc ${car.segment})`;
    document.getElementById('modal-price').innerText = `Giá từ: ${formatVND(car.price)}`;
    document.getElementById('modal-desc').innerText = car.description || 'Chưa có bài viết giới thiệu chi tiết.';

    // Điền thông số kỹ thuật
    document.getElementById('spec-range').innerText = `${car.range_km} km`;
    document.getElementById('spec-power').innerText = `${car.power_hp} Hp`;
    document.getElementById('spec-torque').innerText = `${car.torque_nm} Nm`;
    document.getElementById('spec-battery').innerText = `${car.battery_kwh} kWh`;
    document.getElementById('spec-seats').innerText = `${car.seats} chỗ`;

    const specs = car.specifications || {};
    document.getElementById('spec-dims').innerText = specs.dimensions || 'Đang cập nhật';
    document.getElementById('spec-wheelbase').innerText = specs.wheelbase || 'Đang cập nhật';
    document.getElementById('spec-clearance').innerText = specs.ground_clearance || 'Đang cập nhật';
    document.getElementById('spec-drive').innerText = specs.drive_type || 'Đang cập nhật';
    document.getElementById('spec-charging').innerText = specs.charging_time || 'Đang cập nhật';
    document.getElementById('spec-safety').innerText = specs.safety || 'ABS, EBD, Cân bằng điện tử';

    // Tạo các nút đổi màu xe (Visualizer)
    const colorDotsContainer = document.getElementById('modal-color-dots');
    colorDotsContainer.innerHTML = '';
    
    const colors = specs.colors || [
      { name: 'Màu sắc tiêu chuẩn', hex: '#00f0ff', image_url: car.image_url }
    ];

    document.getElementById('selected-color-name').innerText = colors[0].name;

    colors.forEach((color, index) => {
      const dot = document.createElement('div');
      dot.className = `color-dot ${index === 0 ? 'active' : ''}`;
      dot.style.backgroundColor = color.hex;
      dot.title = color.name;
      dot.onclick = function() {
        // Gỡ bỏ class active cũ
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        // Thêm active cho nút hiện tại
        dot.classList.add('active');
        // Đổi ảnh xe và tên màu
        document.getElementById('modal-img').src = color.image_url;
        document.getElementById('selected-color-name').innerText = color.name;
      };
      colorDotsContainer.appendChild(dot);
    });

    // Reset và tính toán bảng tài chính ban đầu cho xe này
    selectBatteryOpt.value = 'rent';
    sliderPrepay.value = 20;
    sliderMonths.value = 60;
    sliderInterest.value = 7.5;
    
    updateFinanceLabels();
    calculateLoan();

    // Hiển thị Modal
    carModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } catch (error) {
    alert('Không thể tải thông tin chi tiết xe: ' + error.message);
  }
}

// Đóng Modal chi tiết xe
function closeModal() {
  carModal.classList.remove('active');
  document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeModal);
carModal.addEventListener('click', (e) => {
  if (e.target === carModal) closeModal();
});

// Chuyển nhanh từ Modal chi tiết sang Đăng ký lái thử
function bookTestDriveFromModal() {
  if (!selectedCarForFinance) return;
  
  // Đóng modal chi tiết
  closeModal();
  
  // Điền xe quan tâm vào dropdown lái thử
  tdCarSelect.value = selectedCarForFinance.id;
  
  // Cuộn mượt mà đến khu vực Đăng ký lái thử
  document.getElementById('test-drive').scrollIntoView({ behavior: 'smooth' });
  
  // Tập trung con trỏ vào ô nhập họ tên khách hàng
  setTimeout(() => {
    document.getElementById('td-name').focus();
  }, 600);
}
window.bookTestDriveFromModal = bookTestDriveFromModal;

// --- Logic Tính Toán Trả Góp / Tài Chính ---
function updateFinanceLabels() {
  lblPrepay.innerText = `${sliderPrepay.value}%`;
  lblMonths.innerText = `${sliderMonths.value} tháng (${sliderMonths.value / 12} năm)`;
  lblInterest.innerText = `${sliderInterest.value}%`;
}

function calculateLoan() {
  if (!selectedCarForFinance) return;

  const basePrice = parseFloat(selectedCarForFinance.price);
  
  // Xác định chi phí Pin (Mua đứt pin cộng thêm tiền, ví dụ ước tính)
  let batteryPrice = 0;
  if (selectBatteryOpt.value === 'buy') {
    // Phân khúc nhỏ cộng ít, lớn cộng nhiều
    const seg = selectedCarForFinance.segment;
    if (seg === 'Mini' || seg === 'A') batteryPrice = 80000000;
    else if (seg === 'B' || seg === 'C') batteryPrice = 110000000;
    else batteryPrice = 150000000; // D, E
  }

  const carPrice = basePrice + batteryPrice;

  // Tính chi phí đăng ký lăn bánh thực tế tại Việt Nam cho xe điện
  // Trước bạ = 0%
  const plateFee = 20000000; // Hà Nội/HCM mặc định
  const registrationInspection = 340000;
  const roadMaintenanceFee = 1560000; // 1 năm
  const insuranceMandatory = 480000; // 1 năm
  const rollingFees = plateFee + registrationInspection + roadMaintenanceFee + insuranceMandatory;

  const rollingPrice = carPrice + rollingFees;

  // Tiền trả trước
  const prepayPercent = parseInt(sliderPrepay.value) / 100;
  const carPrepayAmount = carPrice * prepayPercent;
  const totalPrepayNeeded = carPrepayAmount + rollingFees; // Khách phải trả trước tiền đối ứng xe + chi phí làm biển số

  // Khoản vay ngân hàng
  const loanAmount = carPrice - carPrepayAmount;

  // Gốc hàng tháng
  const months = parseInt(sliderMonths.value);
  const monthlyPrincipal = loanAmount / months;

  // Lãi tháng đầu tiên (Lãi suất giảm dần tính trên dư nợ gốc ban đầu)
  const yearlyRate = parseFloat(sliderInterest.value) / 100;
  const monthlyRate = yearlyRate / 12;
  const monthlyInterest = loanAmount * monthlyRate;

  const totalFirstMonthPayment = monthlyPrincipal + monthlyInterest;

  // Cập nhật lên UI
  document.getElementById('calc-rolling-price').innerText = formatVND(rollingPrice);
  document.getElementById('calc-prepay-amount').innerText = formatVND(totalPrepayNeeded);
  document.getElementById('calc-loan-amount').innerText = formatVND(loanAmount);
  document.getElementById('calc-monthly-payment').innerText = formatVND(totalFirstMonthPayment);
}

// Lắng nghe các thanh trượt thay đổi để tính lại tiền ngay lập tức
[sliderPrepay, sliderMonths, sliderInterest, selectBatteryOpt].forEach(element => {
  element.addEventListener('input', () => {
    updateFinanceLabels();
    calculateLoan();
  });
});


// --- Logic So Sánh Xe Điện ---
function toggleCompare(id) {
  const index = compareList.indexOf(id);
  if (index > -1) {
    // Đã có thì xóa đi
    compareList.splice(index, 1);
  } else {
    // Chưa có thì thêm mới (giới hạn tối đa 3 xe)
    if (compareList.length >= 3) {
      alert('Bạn chỉ có thể so sánh tối đa 3 xe điện cùng lúc.');
      return;
    }
    compareList.push(id);
  }
  updateCompareDrawer();
  renderCars(); // Render lại xe để cập nhật trạng thái nút so sánh
}

function updateCompareDrawer() {
  const count = compareList.length;
  compareCountEl.innerText = count;

  if (count > 0) {
    compareDrawer.classList.add('active');
  } else {
    compareDrawer.classList.remove('active');
  }

  // Đổ dữ liệu vào các slots
  compareSlotsEl.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const slot = document.createElement('div');
    slot.className = 'compare-slot';
    
    if (i < count) {
      const carId = compareList[i];
      const car = cars.find(c => c.id === carId);
      if (car) {
        slot.className = 'compare-slot filled glass-panel';
        slot.innerHTML = `
          <button class="compare-slot-remove" onclick="toggleCompare(${car.id})"><i class="fa-solid fa-xmark"></i></button>
          <img src="${car.image_url}" alt="${car.name}" onerror="this.src='/uploads/default-car.jpg'">
          <span class="compare-slot-name">${car.name}</span>
        `;
      }
    } else {
      slot.innerHTML = `<span style="color: var(--text-muted); font-size: 11px;">Trống</span>`;
    }
    compareSlotsEl.appendChild(slot);
  }

  // Bật/tắt nút so sánh ngay
  if (count >= 2) {
    btnCompareNow.disabled = false;
  } else {
    btnCompareNow.disabled = true;
  }
}

// Xóa toàn bộ danh sách so sánh
btnCompareClear.addEventListener('click', () => {
  compareList = [];
  updateCompareDrawer();
  renderCars();
});

// Mở Modal So Sánh Đối Chiếu Chi Tiết
btnCompareNow.addEventListener('click', () => {
  const selectedCars = compareList.map(id => cars.find(c => c.id === id)).filter(Boolean);
  if (selectedCars.length < 2) return;

  // Tạo cấu trúc bảng so sánh song song
  let html = `
    <thead>
      <tr>
        <th class="spec-name-column">Tiêu chí</th>
        ${selectedCars.map(car => `<th><h4 style="margin-bottom:8px;">${car.name}</h4><img src="${car.image_url}" alt="${car.name}" onerror="this.src='/uploads/default-car.jpg'"></th>`).join('')}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="spec-name-column">Giá niêm yết</td>
        ${selectedCars.map(car => `<td class="compare-price">${formatVND(car.price)}</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name-column">Phân khúc xe</td>
        ${selectedCars.map(car => `<td>Phân khúc ${car.segment}</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name-column">Kiểu dáng / Loại xe</td>
        ${selectedCars.map(car => `<td>${car.type}</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name-column">Quãng đường (sạc đầy)</td>
        ${selectedCars.map(car => `<td style="font-weight:600; color:var(--accent-color);">${car.range_km} km</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name-column">Công suất động cơ</td>
        ${selectedCars.map(car => `<td>${car.power_hp} hp</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name-column">Mô-men xoắn</td>
        ${selectedCars.map(car => `<td>${car.torque_nm} Nm</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name-column">Dung lượng Pin</td>
        ${selectedCars.map(car => `<td>${car.battery_kwh} kWh</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name-column">Số chỗ ngồi</td>
        ${selectedCars.map(car => `<td>${car.seats} chỗ</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name-column">Kích thước (DxRxC)</td>
        ${selectedCars.map(car => `<td>${(car.specifications && car.specifications.dimensions) || 'Đang cập nhật'}</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name-column">Hệ dẫn động</td>
        ${selectedCars.map(car => `<td>${(car.specifications && car.specifications.drive_type) || 'Đang cập nhật'}</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name-column">Thời gian sạc nhanh</td>
        ${selectedCars.map(car => `<td>${(car.specifications && car.specifications.charging_time) || 'Đang cập nhật'}</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name-column">Hệ thống an toàn</td>
        ${selectedCars.map(car => `<td style="font-size:12.5px; text-align:left; line-height:1.4;">${(car.specifications && car.specifications.safety) || 'Đang cập nhật'}</td>`).join('')}
      </tr>
    </tbody>
  `;

  compareTable.innerHTML = html;
  compareModal.classList.add('active');
  document.body.style.overflow = 'hidden';
});

// Đóng Modal So Sánh
function closeCompareModal() {
  compareModal.classList.remove('active');
  if (!carModal.classList.contains('active')) {
    document.body.style.overflow = '';
  }
}
compareModalClose.addEventListener('click', closeCompareModal);
compareModal.addEventListener('click', (e) => {
  if (e.target === compareModal) closeCompareModal();
});


// --- Logic Đăng Ký Lái Thử ---
// Hàm tải danh sách Tỉnh/Thành từ API
async function loadProvinces() {
  try {
    const response = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm');
    const result = await response.json();
    if (result.error === 0 && tdProvince) {
      tdProvince.innerHTML = '<option value="">Chọn Tỉnh/Thành...</option>';
      result.data.forEach(prov => {
        const opt = document.createElement('option');
        opt.value = prov.id;
        opt.innerText = prov.name;
        tdProvince.appendChild(opt);
      });
    }
  } catch (err) {
    console.error('Lỗi khi tải danh sách Tỉnh/Thành:', err);
  }
}
window.loadProvinces = loadProvinces;

// Thay đổi Tỉnh/Thành -> Lọc Quận/Huyện tự động qua API
tdProvince.addEventListener('change', async function() {
  const provinceId = this.value;
  tdDistrict.innerHTML = '<option value="">Chọn Quận/Huyện...</option>';
  tdWard.innerHTML = '<option value="">Chọn Phường/Xã...</option>';
  tdDistrict.disabled = true;
  tdWard.disabled = true;
  
  if (provinceId) {
    try {
      const response = await fetch(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
      const result = await response.json();
      if (result.error === 0) {
        tdDistrict.disabled = false;
        result.data.forEach(dist => {
          const opt = document.createElement('option');
          opt.value = dist.id;
          opt.innerText = dist.full_name;
          tdDistrict.appendChild(opt);
        });
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách Quận/Huyện:', err);
    }
  }
});

// Thay đổi Quận/Huyện -> Lọc Phường/Xã tự động qua API
tdDistrict.addEventListener('change', async function() {
  const districtId = this.value;
  tdWard.innerHTML = '<option value="">Chọn Phường/Xã...</option>';
  tdWard.disabled = true;
  
  if (districtId) {
    try {
      const response = await fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
      const result = await response.json();
      if (result.error === 0) {
        tdWard.disabled = false;
        result.data.forEach(ward => {
          const opt = document.createElement('option');
          opt.value = ward.full_name;
          opt.innerText = ward.full_name;
          tdWard.appendChild(opt);
        });
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách Phường/Xã:', err);
    }
  }
});

// Gửi form đăng ký lên Backend API
testDriveForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const car_id = document.getElementById('td-car-select').value;
  const fullname = document.getElementById('td-name').value.trim();
  const phone = document.getElementById('td-phone').value.trim();
  const email = document.getElementById('td-email').value.trim();
  
  // Lấy tên hiển thị (text) thay vì ID của option đã chọn
  const province = tdProvince.options[tdProvince.selectedIndex].text;
  const district = tdDistrict.options[tdDistrict.selectedIndex].text;
  const ward = tdWard.options[tdWard.selectedIndex].text;
  const detailAddr = document.getElementById('td-address-detail').value.trim();
  
  // Ghép chi tiết, Quận/Huyện và Phường/Xã để gửi lên trường showroom trong CSDL
  const showroom = detailAddr ? `${detailAddr}, ${district}, ${ward}` : `${district}, ${ward}`;
  
  const preferred_date = document.getElementById('td-date').value;

  try {
    const response = await fetch('/api/test-drives', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ car_id, fullname, phone, email, province, showroom, preferred_date })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi khi gửi đăng ký.');

    alert(data.message);
    testDriveForm.reset();
    tdDistrict.disabled = true;
    tdWard.disabled = true;
  } catch (error) {
    alert(error.message);
  }
});


// --- Logic Bản Đồ Trạm Sạc / Showroom ---
// --- Logic Bản Đồ Trạm Sạc / Showroom ---
function renderStations(provinceFilter = 'Tất cả') {
  if (!stationGrid || !stationCountEl) return;
  const filtered = provinceFilter === 'Tất cả' 
    ? stationsData 
    : stationsData.filter(s => s.province === provinceFilter);

  stationCountEl.innerText = filtered.length;

  stationGrid.innerHTML = filtered.map(s => `
    <div class="station-card glass-panel">
      <h4 class="station-title">${s.name}</h4>
      <span class="station-tag ${s.type}">
        ${s.type === 'showroom' ? '<i class="fa-solid fa-store"></i> Showroom' : '<i class="fa-solid fa-charging-station"></i> Trạm Sạc EV'}
      </span>
      <div class="station-info-row">
        <i class="fa-solid fa-location-dot"></i>
        <span>${s.address}</span>
      </div>
      ${s.type === 'showroom' ? `
        <div class="station-info-row">
          <i class="fa-solid fa-phone"></i>
          <span>${s.phone}</span>
        </div>
        <div class="station-info-row">
          <i class="fa-solid fa-clock"></i>
          <span>${s.hours}</span>
        </div>
      ` : `
        <div class="station-info-row">
          <i class="fa-solid fa-circle-info"></i>
          <span>${s.detail}</span>
        </div>
      `}
    </div>
  `).join('');
}

// Lắng nghe sự kiện lọc Trạm Sạc
if (stationProvinceFilter) {
  stationProvinceFilter.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      document.querySelectorAll('#station-province-filter .filter-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      
      const prov = e.target.getAttribute('data-province');
      renderStations(prov);
    }
  });
}


// --- Các Sự Kiện Đầu Vào Cho Showroom ---
let searchTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  currentSearch = e.target.value;
  searchTimeout = setTimeout(() => {
    fetchCars();
  }, 300);
});

filterContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-btn')) {
    document.querySelectorAll('#filter-container .filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    currentFilter = e.target.getAttribute('data-filter');
    fetchCars();
  }
});


// --- Khởi tạo ---
fetchCars();
renderStations();
checkUserSession();
loadProvinces();
loadAllCarsForTestDrive();

// --- Logic Đăng Nhập / Đăng Ký Khách Hàng ---
const authModal = document.getElementById('auth-modal');
const btnLoginTrigger = document.getElementById('btn-login-trigger');
const authModalClose = document.getElementById('auth-modal-close');
const btnUserLogout = document.getElementById('btn-user-logout');
const userLoginForm = document.getElementById('user-login-form');
const userRegisterForm = document.getElementById('user-register-form');

// Hiển thị thông báo trạng thái tùy chỉnh
function showAuthMsg(message, isSuccess) {
  const msgBox = document.getElementById('auth-status-msg');
  if (msgBox) {
    msgBox.innerText = message;
    msgBox.style.display = 'block';
    if (isSuccess) {
      msgBox.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
      msgBox.style.color = '#10b981';
      msgBox.style.border = '1px solid rgba(16, 185, 129, 0.2)';
    } else {
      msgBox.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
      msgBox.style.color = '#ef4444';
      msgBox.style.border = '1px solid rgba(239, 68, 68, 0.2)';
    }
  }
}

// Xóa thông báo trạng thái
function clearAuthMsg() {
  const msgBox = document.getElementById('auth-status-msg');
  if (msgBox) {
    msgBox.style.display = 'none';
    msgBox.innerText = '';
  }
}

// Mở Auth Modal
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('#btn-login-trigger');
  if (trigger) {
    switchAuthTab('login');
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
});

// Đóng Auth Modal
document.addEventListener('click', (e) => {
  const closeBtn = e.target.closest('#auth-modal-close');
  const modal = document.getElementById('auth-modal');
  if (closeBtn && modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    clearAuthMsg();
  }
  
  if (e.target === modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    clearAuthMsg();
  }
});

// Chuyển Tab Đăng nhập / Đăng ký
function switchAuthTab(tab) {
  const loginBtn = document.getElementById('tab-login-btn');
  const registerBtn = document.getElementById('tab-register-btn');
  const loginContent = document.getElementById('auth-login-content');
  const registerContent = document.getElementById('auth-register-content');
  
  clearAuthMsg();
  
  if (tab === 'login') {
    loginBtn.classList.add('btn-primary');
    registerBtn.classList.remove('btn-primary');
    loginContent.style.display = 'block';
    registerContent.style.display = 'none';
  } else {
    loginBtn.classList.remove('btn-primary');
    registerBtn.classList.add('btn-primary');
    loginContent.style.display = 'none';
    registerContent.style.display = 'block';
  }
}
window.switchAuthTab = switchAuthTab;

// Gửi Form Đăng Nhập Khách Hàng / Admin
if (userLoginForm) {
  userLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('ul-username').value.trim();
    const password = document.getElementById('ul-password').value;

    clearAuthMsg();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Lỗi đăng nhập.');

      if (data.role === 'admin') {
        // Đăng nhập Admin
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', data.admin.username);
        showAuthMsg('Đăng nhập Quản Trị thành công! Đang chuyển hướng...', true);
        setTimeout(() => {
          window.location.href = '/admin.html';
        }, 800);
        return;
      }

      // Lưu phiên đăng nhập khách hàng
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userProfile', JSON.stringify(data.user));

      showAuthMsg('Đăng nhập thành công!', true);
      setTimeout(() => {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
        checkUserSession();
        userLoginForm.reset();
        clearAuthMsg();
      }, 1000);
    } catch (error) {
      showAuthMsg(error.message, false);
    }
  });
}

// Gửi Form Đăng Ký Khách Hàng
if (userRegisterForm) {
  userRegisterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('ur-username').value.trim();
    const password = document.getElementById('ur-password').value;
    const fullname = document.getElementById('ur-fullname').value.trim();
    const phone = document.getElementById('ur-phone').value.trim();
    const email = document.getElementById('ur-email').value.trim();

    clearAuthMsg();

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, fullname, phone, email })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Lỗi đăng ký.');

      showAuthMsg('Đăng ký thành công! Đang chuyển sang Đăng nhập...', true);
      setTimeout(() => {
        switchAuthTab('login');
        document.getElementById('ul-username').value = username;
        userRegisterForm.reset();
        clearAuthMsg();
      }, 1200);
    } catch (error) {
      showAuthMsg(error.message, false);
    }
  });
}

// Kiểm tra phiên đăng nhập và cập nhật giao diện
function checkUserSession() {
  const token = localStorage.getItem('userToken');
  const profileStr = localStorage.getItem('userProfile');
  const adminToken = localStorage.getItem('adminToken');
  
  const userHeaderProfile = document.getElementById('user-header-profile');
  const welcomeText = document.getElementById('user-welcome');
  const btnLoginTrigger = document.getElementById('btn-login-trigger');
  const btnAdminPortal = document.getElementById('btn-admin-portal');
  
  const tdName = document.getElementById('td-name');
  const tdPhone = document.getElementById('td-phone');
  const tdEmail = document.getElementById('td-email');

  // Hiển thị nút Quản Trị chỉ khi đã đăng nhập tài khoản admin
  if (btnAdminPortal) {
    if (adminToken) {
      btnAdminPortal.style.display = 'inline-flex';
    } else {
      btnAdminPortal.style.display = 'none';
    }
  }

  if (token && profileStr) {
    const profile = JSON.parse(profileStr);
    
    // Hiển thị lời chào
    if (btnLoginTrigger) btnLoginTrigger.style.display = 'none';
    if (userHeaderProfile) userHeaderProfile.style.display = 'flex';
    if (welcomeText) welcomeText.innerText = `Chào, ${profile.fullname || profile.username}`;
    
    // Tự động điền form lái thử
    if (tdName) {
      tdName.value = profile.fullname || '';
      tdName.readOnly = true;
    }
    if (tdPhone) {
      tdPhone.value = profile.phone || '';
      tdPhone.readOnly = true;
    }
    if (tdEmail) {
      tdEmail.value = profile.email || '';
      tdEmail.readOnly = true;
    }
  } else {
    // Ẩn lời chào, hiện nút đăng nhập
    if (btnLoginTrigger) btnLoginTrigger.style.display = 'inline-flex';
    if (userHeaderProfile) userHeaderProfile.style.display = 'none';
    
    // Mở khóa các trường nhập trong form lái thử và dọn trống
    if (tdName) {
      tdName.value = '';
      tdName.readOnly = false;
    }
    if (tdPhone) {
      tdPhone.value = '';
      tdPhone.readOnly = false;
    }
    if (tdEmail) {
      tdEmail.value = '';
      tdEmail.readOnly = false;
    }
  }
}
window.checkUserSession = checkUserSession;

// Đăng xuất khách hàng (Sử dụng Modal Xác Nhận Custom)
document.addEventListener('click', (e) => {
  const logoutBtn = e.target.closest('#btn-user-logout');
  if (logoutBtn) {
    const modal = document.getElementById('logout-confirm-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  // Nút Hủy Đăng xuất
  const cancelBtn = e.target.closest('#btn-logout-cancel');
  const confirmModal = document.getElementById('logout-confirm-modal');
  if (cancelBtn && confirmModal) {
    confirmModal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Click ra ngoài vùng modal để đóng
  if (e.target === confirmModal) {
    confirmModal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Nút Xác Nhận Đăng Xuất
  const confirmBtn = e.target.closest('#btn-logout-confirm');
  if (confirmBtn) {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    if (confirmModal) confirmModal.classList.remove('active');
    document.body.style.overflow = '';
    checkUserSession();
  }
});
