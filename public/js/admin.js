// Quản lý trạng thái Admin
let token = localStorage.getItem('adminToken');
let adminUser = localStorage.getItem('adminUser');

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const adminHeaderActions = document.getElementById('admin-header-actions');
const adminWelcome = document.getElementById('admin-welcome');
const btnLogout = document.getElementById('btn-logout');

// Điều khiển Hamburger Menu trên di động cho Admin
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

  navMenu.querySelectorAll('ul li a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const icon = mobileMenuBtn.querySelector('i');
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    });
  });
}

const adminCarList = document.getElementById('admin-car-list');
const adminDriveList = document.getElementById('admin-drive-list');
const btnAddCar = document.getElementById('btn-add-car');
const carFormModal = document.getElementById('car-form-modal');
const formModalClose = document.getElementById('form-modal-close');
const btnCancelForm = document.getElementById('btn-cancel-form');
const carForm = document.getElementById('car-form');
const carImageInput = document.getElementById('car-image');
const imagePreviewContainer = document.getElementById('image-preview-container');
const modalFormTitle = document.getElementById('modal-form-title');

// Trạng thái Form
let isEditing = false;

// Tỉnh/Thành & Showrooms phục vụ hiển thị
const showroomsByProvince = {
  'Hà Nội': 'Showroom Hà Nội',
  'TP. Hồ Chí Minh': 'Showroom TP.HCM',
  'Đà Nẵng': 'Showroom Đà Nẵng',
  'Hải Phòng': 'Showroom Hải Phòng'
};

// Xử lý lỗi xác thực (token hết hạn hoặc không có quyền)
function handleAuthError() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  token = null;
  adminUser = null;
  alert('Phiên làm việc của bạn đã hết hạn hoặc bạn không có quyền truy cập quản trị. Vui lòng đăng nhập lại.');
  checkAuth();
}

// Kiểm tra phiên đăng nhập khi tải trang
function checkAuth() {
  if (token) {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    adminHeaderActions.style.display = 'flex';
    adminWelcome.innerText = `Chào, ${adminUser || 'Admin'}`;
    loadAdminCars();
    loadAdminTestDrives();
  } else {
    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    adminHeaderActions.style.display = 'none';
  }
}

// Format VND
function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

// Đăng nhập tài khoản Admin
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lỗi đăng nhập.');
    }

    // Lưu token vào localStorage
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminUser', data.admin.username);
    token = data.token;
    adminUser = data.admin.username;

    checkAuth();
  } catch (error) {
    alert(error.message);
  }
});

// Đăng xuất tài khoản
btnLogout.addEventListener('click', () => {
  const modal = document.getElementById('logout-confirm-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
});

// Xử lý các sự kiện nút trong Modal Xác nhận Đăng xuất
document.addEventListener('click', (e) => {
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
  
  // Xác nhận đăng xuất
  const confirmBtn = e.target.closest('#btn-logout-confirm');
  if (confirmBtn) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    token = null;
    adminUser = null;
    if (confirmModal) confirmModal.classList.remove('active');
    document.body.style.overflow = '';
    checkAuth();
  }
});

// --- Quản Lý Tabs Điều Hướng ---
function switchTab(tabName) {
  const carsBtn = document.getElementById('tab-cars-btn');
  const drivesBtn = document.getElementById('tab-drives-btn');
  const carsContent = document.getElementById('tab-cars-content');
  const drivesContent = document.getElementById('tab-drives-content');

  if (tabName === 'cars') {
    carsContent.style.display = 'block';
    drivesContent.style.display = 'none';
    carsBtn.classList.add('btn-primary');
    drivesBtn.classList.remove('btn-primary');
  } else {
    carsContent.style.display = 'none';
    drivesContent.style.display = 'block';
    carsBtn.classList.remove('btn-primary');
    drivesBtn.classList.add('btn-primary');
    loadAdminTestDrives(); // Reload lịch hẹn lái thử khi click tab
  }
}
window.switchTab = switchTab; // Gán global để sử dụng trong onclick html

// --- Tab 1: Quản Lý Ô Tô (CRUD) ---
async function loadAdminCars() {
  try {
    const response = await fetch('/api/cars');
    if (!response.ok) throw new Error('Không thể tải danh sách xe.');
    const cars = await response.json();

    if (cars.length === 0) {
      adminCarList.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">
            Chưa có dòng xe nào. Vui lòng nhấn "Đăng Xe Mới".
          </td>
        </tr>
      `;
      return;
    }

    adminCarList.innerHTML = cars.map(car => `
      <tr>
        <td>
          <img src="${car.image_url}" class="car-thumb" alt="${car.name}" onerror="this.src='/uploads/default-car.jpg'">
        </td>
        <td style="font-weight: 700; color: var(--text-primary);">${car.name}</td>
        <td><span class="logo-badge" style="background: rgba(15, 83, 197, 0.08); color: var(--accent-color); border: 1px solid rgba(15, 83, 197, 0.15);">${car.type}</span></td>
        <td>Phân khúc ${car.segment}</td>
        <td style="color: var(--accent-color); font-weight: 600;">${formatVND(car.price)}</td>
        <td style="font-size: 13px;">
          <div><i class="fa-solid fa-charging-station"></i> ${car.range_km} km</div>
          <div><i class="fa-solid fa-bolt"></i> ${car.power_hp} hp</div>
          <div><i class="fa-solid fa-users"></i> ${car.seats} chỗ</div>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn" style="padding: 6px 12px; font-size: 12px;" onclick="editCar(${car.id})">
              <i class="fa-solid fa-pen-to-square"></i> Sửa
            </button>
            <button class="btn btn-danger" style="padding: 6px 12px; font-size: 12px;" onclick="deleteCar(${car.id})">
              <i class="fa-solid fa-trash"></i> Xóa
            </button>
          </div>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error(error);
  }
}

// Xử lý xem trước ảnh khi chọn file
carImageInput.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreviewContainer.innerHTML = `<img src="${e.target.result}" alt="Preview image">`;
    };
    reader.readAsDataURL(file);
  } else {
    imagePreviewContainer.innerHTML = `<span>Chưa có ảnh nào được chọn</span>`;
  }
});

// Mở modal thêm xe mới
btnAddCar.addEventListener('click', () => {
  isEditing = false;
  modalFormTitle.innerText = 'Đăng Xe Ô Tô VinFast Mới';
  carForm.reset();
  document.getElementById('car-id').value = '';
  imagePreviewContainer.innerHTML = `<span>Chưa có ảnh nào được chọn</span>`;
  carFormModal.classList.add('active');
  document.body.style.overflow = 'hidden';
});

// Đóng modal form
function closeFormModal() {
  carFormModal.classList.remove('active');
  document.body.style.overflow = '';
}
formModalClose.addEventListener('click', closeFormModal);
btnCancelForm.addEventListener('click', closeFormModal);
carFormModal.addEventListener('click', (e) => {
  if (e.target === carFormModal) closeFormModal();
});

// Hàm sửa thông tin xe
async function editCar(id) {
  try {
    const response = await fetch(`/api/cars/${id}`);
    if (!response.ok) throw new Error('Không thể tải chi tiết xe.');
    const car = await response.json();

    isEditing = true;
    modalFormTitle.innerText = `Chỉnh Sửa Thông Tin: ${car.name}`;
    
    document.getElementById('car-id').value = car.id;
    document.getElementById('car-name').value = car.name;
    document.getElementById('car-type').value = car.type;
    document.getElementById('car-segment').value = car.segment;
    document.getElementById('car-category').value = car.category || 'Động cơ điện';
    document.getElementById('car-price').value = parseInt(car.price);
    document.getElementById('car-range').value = car.range_km;
    document.getElementById('car-power').value = car.power_hp;
    document.getElementById('car-torque').value = car.torque_nm;
    document.getElementById('car-battery').value = car.battery_kwh;
    document.getElementById('car-seats').value = car.seats;
    document.getElementById('car-desc').value = car.description || '';

    // Xem trước hình ảnh hiện tại
    imagePreviewContainer.innerHTML = `<img src="${car.image_url}" alt="${car.name}" onerror="this.src='/uploads/default-car.jpg'">`;

    // Thông số kỹ thuật mở rộng
    const specs = car.specifications || {};
    document.getElementById('spec-in-dimensions').value = specs.dimensions || '';
    document.getElementById('spec-in-wheelbase').value = specs.wheelbase || '';
    document.getElementById('spec-in-clearance').value = specs.ground_clearance || '';
    document.getElementById('spec-in-drive').value = specs.drive_type || '';
    document.getElementById('spec-in-charging').value = specs.charging_time || '';
    document.getElementById('spec-in-safety').value = specs.safety || '';

    carImageInput.value = '';

    carFormModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } catch (error) {
    alert('Lỗi tải thông tin xe: ' + error.message);
  }
}
window.editCar = editCar;

// Xử lý gửi Form thêm/sửa xe
carForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('car-id').value;
  const formData = new FormData();
  
  formData.append('name', document.getElementById('car-name').value.trim());
  formData.append('type', document.getElementById('car-type').value.trim());
  formData.append('segment', document.getElementById('car-segment').value);
  formData.append('category', document.getElementById('car-category').value);
  formData.append('price', document.getElementById('car-price').value);
  formData.append('range_km', document.getElementById('car-range').value);
  formData.append('power_hp', document.getElementById('car-power').value);
  formData.append('torque_nm', document.getElementById('car-torque').value);
  formData.append('battery_kwh', document.getElementById('car-battery').value);
  formData.append('seats', document.getElementById('car-seats').value);
  formData.append('description', document.getElementById('car-desc').value);

  // Tạo specifications JSON
  const specifications = {
    dimensions: document.getElementById('spec-in-dimensions').value.trim(),
    wheelbase: document.getElementById('spec-in-wheelbase').value.trim(),
    ground_clearance: document.getElementById('spec-in-clearance').value.trim(),
    drive_type: document.getElementById('spec-in-drive').value.trim(),
    charging_time: document.getElementById('spec-in-charging').value.trim(),
    safety: document.getElementById('spec-in-safety').value.trim()
  };
  formData.append('specifications', JSON.stringify(specifications));

  if (carImageInput.files[0]) {
    formData.append('image', carImageInput.files[0]);
  }

  try {
    let url = '/api/cars';
    let method = 'POST';

    if (isEditing && id) {
      url = `/api/cars/${id}`;
      method = 'PUT';
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.status === 401 || response.status === 403) {
      handleAuthError();
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lỗi xử lý yêu cầu.');
    }

    alert(isEditing ? 'Cập nhật thông tin xe thành công!' : 'Đăng bán xe mới thành công!');
    closeFormModal();
    loadAdminCars();
  } catch (error) {
    alert(error.message);
  }
});

// Hàm xóa xe
async function deleteCar(id) {
  if (confirm('Bạn có chắc chắn muốn xóa mẫu xe này?')) {
    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError();
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Lỗi khi xóa.');

      alert('Đã xóa xe thành công!');
      loadAdminCars();
    } catch (error) {
      alert(error.message);
    }
  }
}
window.deleteCar = deleteCar;


// --- Tab 2: Quản Lý Lịch Đăng Ký Lái Thử ---
async function loadAdminTestDrives() {
  try {
    const response = await fetch('/api/test-drives', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      handleAuthError();
      return;
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Không thể tải lịch đăng ký lái thử.');
    const drives = data;

    if (drives.length === 0) {
      adminDriveList.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">
            Chưa có khách hàng đăng ký lái thử xe.
          </td>
        </tr>
      `;
      return;
    }

    adminDriveList.innerHTML = drives.map(drive => {
      // Định dạng ngày hẹn sang định dạng DD/MM/YYYY
      const date = new Date(drive.preferred_date);
      const formattedDate = isNaN(date.getTime()) ? drive.preferred_date : `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

      return `
        <tr>
          <td>
            <div style="font-weight: 700; color: var(--text-primary);">${drive.fullname}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Ngày gửi: ${new Date(drive.created_at).toLocaleDateString('vi-VN')}</div>
          </td>
          <td style="font-size: 13.5px;">
            <div><i class="fa-solid fa-phone" style="color:var(--accent-color); font-size:11px; margin-right:4px;"></i> ${drive.phone}</div>
            ${drive.email ? `<div><i class="fa-solid fa-envelope" style="color:var(--text-muted); font-size:11px; margin-right:4px;"></i> ${drive.email}</div>` : ''}
          </td>
          <td>
            <span class="logo-badge" style="background: rgba(15, 83, 197, 0.08); color: var(--accent-color); border: 1px solid rgba(15, 83, 197, 0.15);">
              ${drive.car_name || 'Xe đã bị xóa'}
            </span>
          </td>
          <td style="font-size: 13px;">
            <div style="font-weight:500;">${drive.province}</div>
            <div style="color: var(--text-muted); font-size:11px; margin-top: 2px;">${drive.showroom}</div>
          </td>
          <td style="font-weight: 600; color: var(--text-primary);">${formattedDate}</td>
          <td>
            <select class="form-input" style="padding: 6px 12px; font-size: 13px; width: auto;" onchange="updateDriveStatus(${drive.id}, this.value)">
              <option value="Chờ liên hệ" ${drive.status === 'Chờ liên hệ' ? 'selected' : ''}>Chờ liên hệ</option>
              <option value="Đã xác nhận" ${drive.status === 'Đã xác nhận' ? 'selected' : ''}>Đã xác nhận</option>
              <option value="Đã lái thử" ${drive.status === 'Đã lái thử' ? 'selected' : ''}>Đã lái thử</option>
              <option value="Hủy lịch" ${drive.status === 'Hủy lịch' ? 'selected' : ''}>Hủy lịch</option>
            </select>
          </td>
          <td>
            <button class="btn btn-danger" style="padding: 6px 12px; font-size: 12px;" onclick="deleteDrive(${drive.id})">
              <i class="fa-solid fa-trash"></i> Xóa
            </button>
          </td>
        </tr>
      `;
    }).join('');

  } catch (error) {
    console.error(error);
  }
}

// Hàm cập nhật nhanh trạng thái lịch lái thử
async function updateDriveStatus(id, newStatus) {
  try {
    const response = await fetch(`/api/test-drives/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (response.status === 401 || response.status === 403) {
      handleAuthError();
      return;
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi khi cập nhật.');

    alert('Đã cập nhật trạng thái lịch hẹn!');
    loadAdminTestDrives();
  } catch (error) {
    alert(error.message);
  }
}
window.updateDriveStatus = updateDriveStatus;

// Hàm xóa lịch lái thử
async function deleteDrive(id) {
  if (confirm('Bạn chắc chắn muốn xóa lịch hẹn đăng ký lái thử này?')) {
    try {
      const response = await fetch(`/api/test-drives/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError();
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Lỗi khi xóa.');

      alert('Đã xóa lịch hẹn thành công!');
      loadAdminTestDrives();
    } catch (error) {
      alert(error.message);
    }
  }
}
window.deleteDrive = deleteDrive;


// Khởi tạo chạy ban đầu
checkAuth();
