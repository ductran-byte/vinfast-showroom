// Dedicated Car Detail Page Javascript Logic

let currentCar = null;

// Helper to format currency
function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

// Extract car ID from URL path (e.g. /car/1)
function getCarIdFromUrl() {
  const pathname = window.location.pathname;
  const parts = pathname.split('/');
  return parts[parts.length - 1];
}

// Fetch and render car details
async function initCarDetailPage() {
  const carId = getCarIdFromUrl();
  if (!carId) {
    alert('Không tìm thấy mã dòng xe.');
    window.location.href = '/';
    return;
  }

  try {
    const response = await fetch(`/api/cars/${carId}`);
    if (!response.ok) throw new Error('Không thể tải chi tiết dòng xe.');
    currentCar = await response.json();

    // Hydrate Basic Info
    document.getElementById('page-title').innerText = `${currentCar.name} - Thông số kỹ thuật & Bảng giá lăn bánh`;
    document.getElementById('detail-badge').innerText = `${currentCar.type} (Phân khúc ${currentCar.segment})`;
    document.getElementById('detail-name').innerText = currentCar.name;
    document.getElementById('detail-price').innerText = `Giá bán từ: ${formatVND(currentCar.price)}`;
    document.getElementById('detail-desc').innerText = currentCar.description || 'Chưa có bài viết mô tả chi tiết dòng xe.';
    document.getElementById('detail-img').src = currentCar.image_url;

    // Hydrate Specs Grid
    document.getElementById('spec-seats').innerText = `${currentCar.seats} chỗ`;
    document.getElementById('spec-range').innerText = `${currentCar.range_km} km`;
    document.getElementById('spec-power').innerText = `${currentCar.power_hp} Hp`;
    document.getElementById('spec-torque').innerText = `${currentCar.torque_nm} Nm`;
    document.getElementById('spec-battery').innerText = `${currentCar.battery_kwh} kWh`;

    // Hydrate Table Specifications
    const specs = currentCar.specifications || {};
    document.getElementById('spec-dims').innerText = specs.dimensions || 'Đang cập nhật';
    document.getElementById('spec-wheelbase').innerText = specs.wheelbase || 'Đang cập nhật';
    document.getElementById('spec-clearance').innerText = specs.ground_clearance || 'Đang cập nhật';
    document.getElementById('spec-drive').innerText = specs.drive_type || 'Đang cập nhật';
    document.getElementById('spec-charging').innerText = specs.charging_time || 'Đang cập nhật';
    document.getElementById('spec-safety').innerText = specs.safety || 'Hệ thống phanh ABS, EBD, Cân bằng điện tử';

    // Build Visualizer Color Dots
    const dotsContainer = document.getElementById('detail-color-dots');
    dotsContainer.innerHTML = '';

    const colors = specs.colors || [
      { name: 'Màu tiêu chuẩn', hex: '#0f53c5', image_url: currentCar.image_url }
    ];

    document.getElementById('selected-color-name').innerText = colors[0].name;

    colors.forEach((color, index) => {
      const dot = document.createElement('div');
      dot.className = `color-dot ${index === 0 ? 'active' : ''}`;
      dot.style.backgroundColor = color.hex;
      dot.title = color.name;
      dot.onclick = function() {
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        document.getElementById('detail-img').src = color.image_url;
        document.getElementById('selected-color-name').innerText = color.name;
      };
      dotsContainer.appendChild(dot);
    });

    // Populate Test Drive Model Name
    document.getElementById('td-car-name-display').value = currentCar.name;

    // Load User Header Profile (if logged in)
    checkUserLogin();

    // Init Calculator Labels & Logic
    initCalculator();

    // Init Location Selects
    initLocations();

  } catch (err) {
    console.error('Error hydrating page details:', err);
    alert('Có lỗi xảy ra khi tải dữ liệu dòng xe.');
    window.location.href = '/';
  }
}

// Function to scroll smoothly to a page section
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}
window.scrollToSection = scrollToSection;

// Check user authentication status (same header profile sync as home page)
function checkUserLogin() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const profileDiv = document.getElementById('user-header-profile');
  const welcomeText = document.getElementById('user-welcome');
  const logoutBtn = document.getElementById('btn-user-logout');
  const adminPortalBtn = document.getElementById('btn-admin-portal');

  if (token && user) {
    if (welcomeText) welcomeText.innerText = `Chào, ${user.fullname || user.username}`;
    if (profileDiv) profileDiv.style.display = 'flex';
    
    if (user.role === 'admin' && adminPortalBtn) {
      adminPortalBtn.style.display = 'inline-flex';
    }

    if (logoutBtn) {
      logoutBtn.onclick = function() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
      };
    }
  }
}

// Calculator Logic
function initCalculator() {
  const selectBatteryOpt = document.getElementById('finance-battery-option');
  const sliderPrepay = document.getElementById('finance-prepay');
  const sliderMonths = document.getElementById('finance-months');
  const sliderInterest = document.getElementById('finance-interest');

  const lblPrepay = document.getElementById('lbl-prepay-percent');
  const lblMonths = document.getElementById('lbl-loan-months');
  const lblInterest = document.getElementById('lbl-interest-rate');

  function updateLabels() {
    lblPrepay.innerText = `${sliderPrepay.value}%`;
    lblMonths.innerText = `${sliderMonths.value} tháng (${sliderMonths.value / 12} năm)`;
    lblInterest.innerText = `${sliderInterest.value}%`;
  }

  function calculate() {
    if (!currentCar) return;

    const basePrice = parseFloat(currentCar.price);
    
    // Estimate battery addition price
    let batteryPrice = 0;
    if (selectBatteryOpt.value === 'buy') {
      const seg = currentCar.segment;
      if (seg === 'Mini' || seg === 'A') batteryPrice = 80000000;
      else if (seg === 'B' || seg === 'C') batteryPrice = 110000000;
      else batteryPrice = 150000000;
    }

    const carPrice = basePrice + batteryPrice;

    // Rolling fees estimation in Vietnam (Registration fee = 0%)
    const plateFee = 20000000;
    const registrationInspection = 340000;
    const roadMaintenanceFee = 1560000;
    const insuranceMandatory = 480000;
    const rollingFees = plateFee + registrationInspection + roadMaintenanceFee + insuranceMandatory;

    const rollingPrice = carPrice + rollingFees;

    // Prepayment amount based on car base price
    const prepayPercent = parseInt(sliderPrepay.value) / 100;
    const prepayAmount = carPrice * prepayPercent + rollingFees;
    
    // Loan amount
    const loanAmount = carPrice * (1 - prepayPercent);

    // Monthly payment calculation (first month installment: Principal + Interest)
    const months = parseInt(sliderMonths.value);
    const yearlyInterest = parseFloat(sliderInterest.value) / 100;
    const monthlyInterest = yearlyInterest / 12;

    const monthlyPrincipal = loanAmount / months;
    const monthlyInterestPayment = loanAmount * monthlyInterest;
    const totalFirstMonth = monthlyPrincipal + monthlyInterestPayment;

    // Render results
    document.getElementById('calc-rolling-price').innerText = formatVND(rollingPrice);
    document.getElementById('calc-prepay-amount').innerText = `${formatVND(prepayAmount)} (${sliderPrepay.value}%)`;
    document.getElementById('calc-loan-amount').innerText = formatVND(loanAmount);
    document.getElementById('calc-monthly-payment').innerText = formatVND(totalFirstMonth);
  }

  // Bind Listeners
  [selectBatteryOpt, sliderPrepay, sliderMonths, sliderInterest].forEach(el => {
    el.addEventListener('input', () => {
      updateLabels();
      calculate();
    });
    el.addEventListener('change', () => {
      updateLabels();
      calculate();
    });
  });

  // Run initial calculation
  updateLabels();
  calculate();
}

// Showroom Locations booking logic
const showroomsByProvince = {
  'Hà Nội': [
    'Showroom VinFast Ocean Park - Gia Lâm',
    'Showroom VinFast Royal City - Thanh Xuân',
    'Showroom VinFast Mỹ Đình - Nam Từ Liêm'
  ],
  'TP. Hồ Chí Minh': [
    'Showroom VinFast Landmark 81 - Bình Thạnh',
    'Showroom VinFast Megamall Thảo Điền - Quận 2'
  ],
  'Đà Nẵng': [
    'Showroom VinFast Ngô Quyền - Sơn Trà'
  ],
  'Hải Phòng': [
    'Showroom VinFast Cát Hải - Huyện Cát Hải',
    'Showroom VinFast Lê Thánh Tông - Ngô Quyền'
  ]
};

function initLocations() {
  const tdProvince = document.getElementById('td-province');
  const tdShowroom = document.getElementById('td-showroom');
  const tdForm = document.getElementById('detail-test-drive-form');
  const statusMsg = document.getElementById('td-status-msg');

  // Populate Provinces
  tdProvince.innerHTML = '<option value="">Chọn Tỉnh/Thành...</option>';
  Object.keys(showroomsByProvince).forEach(prov => {
    const opt = document.createElement('option');
    opt.value = prov;
    opt.innerText = prov;
    tdProvince.appendChild(opt);
  });

  // Province change event
  tdProvince.addEventListener('change', function() {
    const selectedProv = this.value;
    tdShowroom.innerHTML = '<option value="">Chọn Showroom...</option>';
    tdShowroom.disabled = true;

    if (selectedProv && showroomsByProvince[selectedProv]) {
      tdShowroom.disabled = false;
      showroomsByProvince[selectedProv].forEach(showroom => {
        const opt = document.createElement('option');
        opt.value = showroom;
        opt.innerText = showroom;
        tdShowroom.appendChild(opt);
      });
    }
  });

  // Submit test drive form
  tdForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!currentCar) return;

    const fullname = document.getElementById('td-name').value.trim();
    const phone = document.getElementById('td-phone').value.trim();
    const email = document.getElementById('td-email').value.trim();
    const province = tdProvince.value;
    const showroom = tdShowroom.value;
    const preferred_date = document.getElementById('td-date').value;

    const requestBody = {
      car_id: currentCar.id,
      fullname: fullname,
      phone: phone,
      email: email || null,
      province: province,
      showroom: showroom,
      preferred_date: preferred_date
    };

    try {
      statusMsg.style.display = 'block';
      statusMsg.style.background = 'rgba(0,0,0,0.05)';
      statusMsg.style.color = 'var(--text-primary)';
      statusMsg.innerText = 'Đang gửi yêu cầu đăng ký...';

      const response = await fetch('/api/test-drives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok) {
        statusMsg.style.background = 'rgba(74, 222, 128, 0.15)';
        statusMsg.style.color = '#15803d';
        statusMsg.innerText = 'Đăng ký lái thử thành công! Chúng tôi sẽ sớm liên hệ lại.';
        tdForm.reset();
        tdShowroom.disabled = true;
      } else {
        throw new Error(data.message || 'Lỗi khi gửi yêu cầu đăng ký.');
      }
    } catch (err) {
      statusMsg.style.background = 'rgba(239, 68, 68, 0.15)';
      statusMsg.style.color = '#b91c1c';
      statusMsg.innerText = err.message || 'Lỗi kết nối mạng.';
    }
  });
}

// Run on page load
document.addEventListener('DOMContentLoaded', initCarDetailPage);
