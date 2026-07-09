// Reusable Success/Error Notification Modal
function showNotification(message, isSuccess = true) {
  let overlay = document.getElementById('notification-modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'notification-modal';
    overlay.className = 'notification-modal-overlay';
    overlay.innerHTML = `
      <div class="notification-modal-card">
        <div class="notification-modal-icon" id="notification-icon"></div>
        <div class="notification-modal-title" id="notification-title"></div>
        <div class="notification-modal-message" id="notification-message"></div>
        <button class="notification-modal-btn" onclick="closeNotification()">Đóng</button>
      </div>
    `;
    document.body.appendChild(overlay);
    
    window.closeNotification = function() {
      const modal = document.getElementById('notification-modal');
      if (modal) modal.classList.remove('active');
    };
  }

  const iconEl = overlay.querySelector('#notification-icon');
  const titleEl = overlay.querySelector('#notification-title');
  const messageEl = overlay.querySelector('#notification-message');

  if (isSuccess) {
    iconEl.className = 'notification-modal-icon success';
    iconEl.innerHTML = '<i class="fa-solid fa-check"></i>';
    titleEl.innerText = 'Thành công';
  } else {
    iconEl.className = 'notification-modal-icon error';
    iconEl.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    titleEl.innerText = 'Thông báo';
  }

  messageEl.innerText = message;
  overlay.classList.add('active');
}
window.showNotification = showNotification;

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
let cars = []; // Dòng xe hiển thị trong Danh mục (Showroom grid)
let hotCars = []; // Dòng xe hiển thị trong Slider Xe Mới/Hot
let compareList = [];
let selectedCarForFinance = null;
let currentFilter = 'Tất cả';
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
const sliderContent = document.getElementById('slider-main-content');
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

// DOM cho Nhận Báo Giá & Lái Thử
const tdCarSelect = document.getElementById('td-car-select');
const tdAddress = document.getElementById('td-address');
const testDriveForm = document.getElementById('test-drive-form');

const homeTestDriveForm = document.getElementById('home-test-drive-form');

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

// Tải danh sách xe nổi bật (Mới & Hot) cho Slider
async function fetchHotCars() {
  try {
    const response = await fetch('/api/cars');
    if (!response.ok) throw new Error('Không thể tải xe nổi bật.');
    const allCars = await response.json();
    // Lấy 6 xe mới nhất đưa vào Slider
    hotCars = allCars.slice(0, 6);
    renderHotCarsSlider();
  } catch (error) {
    console.error('Lỗi khi tải xe nổi bật:', error);
    if (sliderContent) {
      sliderContent.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #ff3b30;">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 32px; margin-bottom: 12px;"></i>
          <p>Không thể tải danh sách xe nổi bật.</p>
        </div>
      `;
    }
  }
}

// Tải danh sách xe cho Danh mục sản phẩm (Showroom grid)
async function fetchShowroomCars() {
  try {
    let url = `/api/cars?search=${encodeURIComponent(currentSearch)}&type=${encodeURIComponent(currentFilter)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Không thể lấy danh sách xe.');
    cars = await response.json();
    renderShowroomGrid();
  } catch (error) {
    console.error('Lỗi khi tải danh sách xe showroom:', error);
    if (carGrid) {
      carGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #ff3b30;">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 32px; margin-bottom: 12px;"></i>
          <p>Đã xảy ra lỗi khi tải danh sách xe. Vui lòng thử lại.</p>
        </div>
      `;
    }
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

    const homeTdCarSelect = document.getElementById('home-td-car-select');
    if (homeTdCarSelect) {
      const currentValHome = homeTdCarSelect.value;
      homeTdCarSelect.innerHTML = '<option value="">-- Chọn dòng xe --</option>' + 
        allCars.map(car => `<option value="${car.id}">${car.name}</option>`).join('');
      if (currentValHome) homeTdCarSelect.value = currentValHome;
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách xe lái thử:', error);
  }
}

// Định dạng tiền tệ VND
function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

// Hiển thị dòng xe ra Slider (thay vì Grid)
let activeCarIndex = 0;

// Hiển thị dòng xe ra Slider nổi bật
function renderHotCarsSlider() {
  const sliderBgName = document.getElementById('slider-bg-name');
  const sliderDots = document.getElementById('slider-dots');
  
  if (!sliderContent) return;

  if (hotCars.length === 0) {
    sliderContent.innerHTML = `
      <div style="text-align: center; padding: 60px; color: var(--text-muted);">
        <i class="fa-solid fa-car-rear" style="font-size: 48px; margin-bottom: 16px;"></i>
        <p>Không có mẫu xe nổi bật nào.</p>
      </div>
    `;
    if (sliderBgName) sliderBgName.innerText = "";
    if (sliderDots) sliderDots.innerHTML = "";
    return;
  }

  // Đảm bảo chỉ số activeCarIndex hợp lệ
  if (activeCarIndex >= hotCars.length) activeCarIndex = 0;
  if (activeCarIndex < 0) activeCarIndex = hotCars.length - 1;

  const car = hotCars[activeCarIndex];
  
  // Cập nhật tên nền chữ lớn phía sau
  if (sliderBgName) {
    let shortName = car.name.replace('VinFast ', '');
    sliderBgName.innerText = shortName;
  }

  const isAddedToCompare = compareList.includes(car.id);
  
  // Điền dữ liệu xe đang chọn vào slider
  sliderContent.innerHTML = `
    <div class="slider-car-display">
      <img src="${car.image_url}" alt="${car.name}" class="slider-car-image" id="slider-img" onerror="this.src='/uploads/default-car.jpg'">
    </div>
    
    <div class="slider-car-details">
      <div class="slider-spec-grid">
        <div class="slider-spec-item">
          <span class="slider-spec-lbl">Dòng xe</span>
          <span class="slider-spec-val">${car.segment || 'SUV'}</span>
        </div>
        <div class="slider-spec-item">
          <span class="slider-spec-lbl">Số chỗ ngồi</span>
          <span class="slider-spec-val">${car.seats} chỗ</span>
        </div>
        <div class="slider-spec-item">
          <span class="slider-spec-lbl">Quãng đường lên tới</span>
          <span class="slider-spec-val">${car.range_km > 0 ? car.range_km + ' km' : 'Đang cập nhật'}</span>
        </div>
        <div class="slider-spec-item">
          <span class="slider-spec-lbl">Giá bán từ</span>
          <span class="slider-spec-val">${formatVND(car.price)}</span>
        </div>
      </div>
      
      <div class="slider-actions">
        <button class="btn btn-slider-order" onclick="openTestDriveModal(${car.id})">
          ĐĂNG KÝ LÁI THỬ
        </button>
        <button class="btn btn-slider-details" onclick="showCarDetails(${car.id})">
          XEM CHI TIẾT
        </button>
      </div>
    </div>
  `;

  // Tạo các chấm tròn chỉ số slide (pagination dots)
  if (sliderDots) {
    sliderDots.innerHTML = hotCars.map((_, idx) => `
      <div class="slider-dot ${idx === activeCarIndex ? 'active' : ''}" onclick="goToCarSlide(${idx})"></div>
    `).join('');
  }
}

// Di chuyển slide xe nổi bật
function goToCarSlide(index) {
  activeCarIndex = index;
  renderHotCarsSlider();
}
window.goToCarSlide = goToCarSlide;

// Hiển thị tất cả dòng xe ra dạng lưới Card
function renderShowroomGrid() {
  if (!carGrid) return;

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
          <p class="car-card-price" style="margin-bottom: 4px;">Giá từ: ${formatVND(car.price)}</p>
          ${car.specifications && car.specifications.price_note ? `<div class="car-card-price-note" style="margin-bottom: 4px;">${car.specifications.price_note}</div>` : ''}
          <div class="flashing-price-alert">
            GIÁ TRÊN LÀ GIÁ CÔNG KHAI CỦA HÃNG, NHẬN “GIÁ ĐÁY” TỐT NHẤT ANH/CHỊ ĐỂ LẠI THÔNG TIN ĐỂ NHẬN ƯU ĐÃI
          </div>
          <div class="car-features-mini">
            <div class="feature-mini-item">
              <span class="feature-mini-val">${car.range_km > 0 ? car.range_km + ' km' : 'Đang cập nhật'}</span>
              <span class="feature-mini-lbl">Quãng đường</span>
            </div>
            <div class="feature-mini-item">
              <span class="feature-mini-val">${car.power_hp > 0 ? car.power_hp + ' Hp' : 'Đang cập nhật'}</span>
              <span class="feature-mini-lbl">Công suất</span>
            </div>
            <div class="feature-mini-item">
              <span class="feature-mini-val">${car.seats} chỗ</span>
              <span class="feature-mini-lbl">Số ghế</span>
            </div>
          </div>
          <div class="car-card-actions" style="display: flex; flex-direction: column; gap: 8px;">
            <button class="btn btn-primary" onclick="event.stopPropagation(); showCarDetails(${car.id})" style="width: 100%;">
              Xem Chi Tiết
            </button>
            <div class="card-btn-row">
              <button class="btn btn-outline" style="flex: 1; padding: 8px 12px; font-size: 13px;"
                      onclick="event.stopPropagation(); openTestDriveModal(${car.id})">
                <i class="fa-solid fa-file-invoice-dollar"></i> Báo giá
              </button>
              <button class="btn btn-outline" style="flex: 1; padding: 8px 12px; font-size: 13px;"
                      onclick="event.stopPropagation(); scrollToTestDrive(${car.id})">
                <i class="fa-solid fa-car-side"></i> Lái thử
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Xem chi tiết xe & Tính toán trả góp
function showCarDetails(id) {
  window.location.href = `/car/${id}`;
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

// Quản lý Modal Đăng Ký Lái Thử
const testDriveModal = document.getElementById('test-drive-modal');
const testDriveModalClose = document.getElementById('test-drive-modal-close');

function openTestDriveModal(carId) {
  if (carId && tdCarSelect) {
    tdCarSelect.value = carId;
  }
  if (testDriveModal) {
    testDriveModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Tập trung con trỏ vào ô nhập họ tên khách hàng
    const tdName = document.getElementById('td-name');
    if (tdName) {
      setTimeout(() => {
        tdName.focus();
      }, 300);
    }
  }
}
window.openTestDriveModal = openTestDriveModal;

function closeTestDriveModal() {
  if (testDriveModal) {
    testDriveModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
window.closeTestDriveModal = closeTestDriveModal;

if (testDriveModalClose) {
  testDriveModalClose.addEventListener('click', closeTestDriveModal);
}
if (testDriveModal) {
  testDriveModal.addEventListener('click', (e) => {
    if (e.target === testDriveModal) closeTestDriveModal();
  });
}

// Chuyển nhanh từ Modal chi tiết sang Đăng ký lái thử hoặc Nhận báo giá
function bookTestDriveFromModal(isTestDrive = false) {
  if (!selectedCarForFinance) return;
  
  // Đóng modal chi tiết
  closeModal();
  
  if (isTestDrive) {
    scrollToTestDrive(selectedCarForFinance.id);
  } else {
    openTestDriveModal(selectedCarForFinance.id);
  }
}
window.bookTestDriveFromModal = bookTestDriveFromModal;

function scrollToTestDrive(carId) {
  const section = document.getElementById('test-drive');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
  const homeTdCarSelect = document.getElementById('home-td-car-select');
  if (homeTdCarSelect && carId) {
    homeTdCarSelect.value = carId;
  }
}
window.scrollToTestDrive = scrollToTestDrive;

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


// --- Logic Đăng Ký Nhận Báo Giá ---
// Gửi form đăng ký nhận báo giá lên Backend API
if (testDriveForm) {
  testDriveForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const car_id = document.getElementById('td-car-select').value;
    const fullname = document.getElementById('td-name').value.trim();
    const phone = document.getElementById('td-phone').value.trim();
    const address = document.getElementById('td-address').value.trim();

    try {
      const response = await fetch('/api/test-drives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'quote', car_id, fullname, phone, address })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Lỗi khi gửi yêu cầu báo giá.');

      showNotification(data.message, true);
      testDriveForm.reset();
      closeTestDriveModal();
    } catch (error) {
      showNotification(error.message, false);
    }
  });
}

// --- Tải Cấu Hình Hệ Thống (Địa Chỉ, Hotline...) ---
async function fetchSystemSettings() {
  try {
    const response = await fetch('/api/settings');
    if (!response.ok) throw new Error('Không thể tải cấu hình.');
    const settings = await response.json();

    // 1. Cập nhật khối thông tin liên hệ phần Đăng ký lái thử
    const tdShowroom = document.getElementById('td-info-showroom');
    const tdPhone = document.getElementById('td-info-phone');
    const tdEmail = document.getElementById('td-info-email');
    const tdAddress = document.getElementById('td-info-address');

    if (tdShowroom && settings.showroom_name) tdShowroom.innerText = settings.showroom_name;
    if (tdPhone && settings.contact_phone) tdPhone.innerText = settings.contact_phone;
    if (tdEmail && settings.contact_email) tdEmail.innerText = settings.contact_email;
    if (tdAddress && settings.contact_address) tdAddress.innerText = settings.contact_address;

    // 2. Cập nhật phần Showroom Location ở cuối trang
    const locName = document.getElementById('locator-showroom-name');
    const locDesc = document.getElementById('locator-showroom-desc');
    const locAddr = document.getElementById('locator-showroom-address');
    const locPhone = document.getElementById('locator-showroom-phone');
    const locPhoneLink = document.getElementById('locator-showroom-phone-link');
    const locHours = document.getElementById('locator-showroom-hours');
    const locRouteBtn = document.getElementById('locator-route-btn');
    const locCallBtn = document.getElementById('locator-call-btn');
    const locIframe = document.getElementById('locator-map-iframe');

    if (locName && settings.showroom_name) locName.innerText = settings.showroom_name;
    if (locDesc && settings.showroom_name) {
      document.querySelectorAll('.locator-showroom-name-inline').forEach(el => {
        el.innerText = settings.showroom_name;
      });
    }
    if (locAddr && settings.contact_address) locAddr.innerText = settings.contact_address;
    if (locPhone && settings.contact_phone) locPhone.innerText = settings.contact_phone;
    if (locPhoneLink && settings.contact_phone) locPhoneLink.href = `tel:${settings.contact_phone.replace(/\s+/g, '')}`;
    if (locHours && settings.contact_hours) locHours.innerText = settings.contact_hours;
    if (locCallBtn && settings.contact_phone) locCallBtn.href = `tel:${settings.contact_phone.replace(/\s+/g, '')}`;

    if (settings.contact_address) {
      if (locRouteBtn) {
        locRouteBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.contact_address)}`;
      }
      if (locIframe) {
        locIframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(settings.contact_address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
      }
    }

    // 3. Cập nhật các nút liên hệ nổi (Floating contact)
    const floatPhone = document.getElementById('float-phone-link');
    const floatZalo = document.getElementById('float-zalo-link');
    const floatMessenger = document.getElementById('float-messenger-link');

    if (floatPhone && settings.contact_phone) {
      floatPhone.href = `tel:${settings.contact_phone.replace(/\s+/g, '')}`;
      floatPhone.title = `Hotline gọi hỗ trợ (${settings.contact_phone})`;
    }
    if (floatZalo && settings.zalo_link) floatZalo.href = settings.zalo_link;
    if (floatMessenger && settings.messenger_link) floatMessenger.href = settings.messenger_link;

  } catch (error) {
    console.error('Lỗi khi tải cấu hình liên hệ:', error);
  }
}
window.fetchSystemSettings = fetchSystemSettings;

// --- Logic Đăng Ký Lái Thử (Embedded Form) ---
if (homeTestDriveForm) {
  homeTestDriveForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const car_id = document.getElementById('home-td-car-select').value;
    const fullname = document.getElementById('home-td-name').value.trim();
    const phone = document.getElementById('home-td-phone').value.trim();
    const email = document.getElementById('home-td-email').value.trim();
    const address = document.getElementById('home-td-address').value.trim();
    const preferred_date = document.getElementById('home-td-date').value;

    try {
      const response = await fetch('/api/test-drives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'drive', car_id, fullname, phone, email, address, preferred_date })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Lỗi khi gửi yêu cầu lái thử.');

      showNotification(data.message, true);
      homeTestDriveForm.reset();
    } catch (error) {
      showNotification(error.message, false);
    }
  });
}


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
    fetchShowroomCars();
  }, 300);
});

filterContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-btn')) {
    document.querySelectorAll('#filter-container .filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    currentFilter = e.target.getAttribute('data-filter');
    fetchShowroomCars();
  }
});


// --- Khởi tạo ---
fetchBanners();
fetchHotCars();
fetchShowroomCars();
renderStations();
checkUserSession();
loadAllCarsForTestDrive();
fetchSystemSettings();

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
  const adminUser = localStorage.getItem('adminUser');
  
  const userHeaderProfile = document.getElementById('user-header-profile');
  const welcomeText = document.getElementById('user-welcome');
  const btnLoginTrigger = document.getElementById('btn-login-trigger');
  const btnAdminPortal = document.getElementById('btn-admin-portal');
  
  const tdName = document.getElementById('td-name');
  const tdPhone = document.getElementById('td-phone');
  const tdEmail = document.getElementById('td-email');

  // Hiển thị nút Quản Trị chỉ khi đã đăng nhập tài khoản admin
  if (btnAdminPortal) {
    btnAdminPortal.style.display = adminToken ? 'inline-flex' : 'none';
  }

  if (adminToken) {
    // Admin đã đăng nhập: ẩn nút Đăng Nhập, hiện lời chào Admin + nút Đăng Xuất
    if (btnLoginTrigger) btnLoginTrigger.style.display = 'none';
    if (userHeaderProfile) userHeaderProfile.style.display = 'flex';
    if (welcomeText) welcomeText.innerText = `Chào, ${adminUser || 'Admin'}`;
  } else if (token && profileStr) {
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

// --- Logic Hero Banners Động ---
let banners = [];
let heroCurrentSlide = 0;
let heroInterval = null;

async function fetchBanners() {
  try {
    const response = await fetch('/api/banners');
    if (!response.ok) throw new Error('Không thể tải danh sách banners.');
    banners = await response.json();
    renderBanners();
  } catch (error) {
    console.error('Lỗi khi tải banners:', error);
    // Phục hồi banner mặc định khi gặp lỗi hệ thống
    const heroInner = document.getElementById('hero-carousel-inner');
    if (heroInner) {
      heroInner.innerHTML = `
        <div class="carousel-item active" style="background-image: url('/uploads/banner_summer.png');">
          <div class="carousel-caption">
            <h2>VINFASCINATION<br><span style="color: var(--accent-color); font-size: 32px;">ĐÓN HÈ RỰC RỠ</span></h2>
            <p>Nhận ngay ưu đãi giá bán lên đến 3%* cùng cơ hội nhận Voucher nghỉ dưỡng Vinpearl thượng lưu khi đặt cọc các dòng ô tô điện thông minh ngay hôm nay.</p>
            <div style="display: flex; gap: 12px;">
              <a href="#showcase" class="btn btn-primary">Khám Phá Xe</a>
            </div>
          </div>
        </div>
      `;
    }
  }
}

function renderBanners() {
  const heroInner = document.getElementById('hero-carousel-inner');
  const heroIndicators = document.getElementById('hero-indicators');
  if (!heroInner) return;

  if (banners.length === 0) {
    heroInner.innerHTML = `
      <div class="carousel-item active" style="min-height: 500px; display: flex; align-items: center; justify-content: center; background: #0a0f1e;">
        <div class="carousel-caption" style="text-align: center; position: static; max-width: 100%; transform: none; width: 100%;">
          <p>Chưa có chương trình ưu đãi nào được đăng.</p>
        </div>
      </div>
    `;
    if (heroIndicators) heroIndicators.innerHTML = '';
    return;
  }

  // Render slides
  heroInner.innerHTML = banners.map((banner, idx) => `
    <div class="carousel-item ${idx === 0 ? 'active' : ''}" style="background-image: url('${banner.image_url}');">
      <div class="carousel-caption">
        <h2>${banner.title}</h2>
        <p>${banner.description || ''}</p>
        <div style="display: flex; gap: 12px;">
          <a href="${banner.link_url || '#showcase'}" class="btn btn-primary">Khám Phá Ngay</a>
        </div>
      </div>
    </div>
  `).join('');

  // Render indicators
  if (heroIndicators) {
    heroIndicators.innerHTML = banners.map((_, idx) => `
      <div class="carousel-indicator ${idx === 0 ? 'active' : ''}" data-slide="${idx}"></div>
    `).join('');
  }

  // Khởi tạo các sự kiện điều hướng sau khi render xong DOM
  initHeroCarousel();
}

function initHeroCarousel() {
  if (heroInterval) clearInterval(heroInterval);

  const heroInner = document.getElementById('hero-carousel-inner');
  const slides = heroInner ? heroInner.querySelectorAll('.carousel-item') : [];
  const indicators = document.querySelectorAll('.carousel-indicator');
  
  if (slides.length <= 1) return;

  heroCurrentSlide = 0;

  function showHeroSlide(index) {
    if (!heroInner || slides.length === 0) return;
    if (index >= slides.length) heroCurrentSlide = 0;
    else if (index < 0) heroCurrentSlide = slides.length - 1;
    else heroCurrentSlide = index;
    
    heroInner.style.transform = `translateX(-${heroCurrentSlide * 100}%)`;
    
    indicators.forEach((dot, idx) => {
      if (idx === heroCurrentSlide) dot.classList.add('active');
      else dot.classList.remove('active');
    });
  }

  const btnHeroPrev = document.getElementById('hero-prev');
  const btnHeroNext = document.getElementById('hero-next');

  if (btnHeroPrev) {
    const newPrev = btnHeroPrev.cloneNode(true);
    btnHeroPrev.parentNode.replaceChild(newPrev, btnHeroPrev);
    newPrev.addEventListener('click', () => showHeroSlide(heroCurrentSlide - 1));
  }
  if (btnHeroNext) {
    const newNext = btnHeroNext.cloneNode(true);
    btnHeroNext.parentNode.replaceChild(newNext, btnHeroNext);
    newNext.addEventListener('click', () => showHeroSlide(heroCurrentSlide + 1));
  }

  indicators.forEach((dot, idx) => {
    const newDot = dot.cloneNode(true);
    dot.parentNode.replaceChild(newDot, dot);
    newDot.addEventListener('click', () => showHeroSlide(idx));
  });

  heroInterval = setInterval(() => {
    showHeroSlide(heroCurrentSlide + 1);
  }, 6000);
}

// --- Logic Nút Điều Hướng Car Slider ---
const btnCarPrev = document.getElementById('car-slider-prev');
const btnCarNext = document.getElementById('car-slider-next');
if (btnCarPrev) {
  btnCarPrev.addEventListener('click', () => {
    activeCarIndex--;
    renderHotCarsSlider();
  });
}
if (btnCarNext) {
  btnCarNext.addEventListener('click', () => {
    activeCarIndex++;
    renderHotCarsSlider();
  });
}
