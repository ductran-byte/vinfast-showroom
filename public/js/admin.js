// Quản lý trạng thái Admin
let token = localStorage.getItem('adminToken');
let adminUser = localStorage.getItem('adminUser');
let quillEditor = null;

// Initialize Quill Editor
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('editor-container');
  if (container) {
    quillEditor = new Quill('#editor-container', {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['link', 'image'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['clean']
        ]
      }
    });
  }
});

// Helper to add version rows dynamically
function addVersionRow(name = '', basePrice = '', promoPrice = '') {
  const container = document.getElementById('versions-list-inputs');
  if (!container) return;
  
  const row = document.createElement('div');
  row.className = 'version-row';
  row.style.display = 'grid';
  row.style.gridTemplateColumns = '2fr 1.5fr 1.5fr 50px';
  row.style.gap = '10px';
  row.style.marginBottom = '10px';
  row.style.alignItems = 'center';

  row.innerHTML = `
    <input type="text" class="form-input ver-name" value="${name}" placeholder="Tên phiên bản (VD: VinFast VF3 ECO)" required>
    <input type="number" class="form-input ver-base-price" value="${basePrice}" placeholder="Giá gốc (VNĐ)" required>
    <input type="number" class="form-input ver-promo-price" value="${promoPrice}" placeholder="Giá ưu đãi (VNĐ)" required>
    <button type="button" class="btn btn-danger btn-remove-version" style="padding: 0; height: 42px; width: 42px; display: flex; align-items: center; justify-content: center; background: #b91c1c; border-color: #b91c1c; color: white;"><i class="fa-solid fa-trash"></i></button>
  `;

  // Bind remove button click
  row.querySelector('.btn-remove-version').onclick = function() {
    row.remove();
  };

  container.appendChild(row);
}

// Helper to add promo rows dynamically
function addPromoRow(content = '') {
  const container = document.getElementById('promo-list-inputs');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'promo-row';
  row.style.display = 'grid';
  row.style.gridTemplateColumns = '1fr 50px';
  row.style.gap = '10px';
  row.style.marginBottom = '10px';
  row.style.alignItems = 'center';

  row.innerHTML = `
    <input type="text" class="form-input promo-content" value="${content}" placeholder="Nội dung khuyến mãi (VD: Đặt cọc 10 - 30 triệu)" required>
    <button type="button" class="btn btn-danger btn-remove-promo" style="padding: 0; height: 42px; width: 42px; display: flex; align-items: center; justify-content: center; background: #b91c1c; border-color: #b91c1c; color: white;"><i class="fa-solid fa-trash"></i></button>
  `;

  // Bind remove button click
  row.querySelector('.btn-remove-promo').onclick = function() {
    row.remove();
  };

  container.appendChild(row);
}

// Helper to add color rows dynamically
function addColorRow(colorObj = null) {
  const container = document.getElementById('colors-list-inputs');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'color-row';
  row.style.display = 'grid';
  row.style.gridTemplateColumns = '50px 2fr 3fr 50px';
  row.style.gap = '10px';
  row.style.marginBottom = '10px';
  row.style.alignItems = 'center';

  const hexVal = colorObj ? colorObj.hex : '#000000';
  const nameVal = colorObj ? colorObj.name : '';
  const imgUrl = colorObj ? colorObj.image_url : '';

  row.innerHTML = `
    <input type="color" class="color-hex" value="${hexVal}" style="width: 100%; height: 42px; padding: 2px; border: 1px solid var(--panel-border); border-radius: var(--radius-sm); cursor: pointer;">
    <input type="text" class="form-input color-name" value="${nameVal}" placeholder="Tên màu (VD: Đỏ Năng Động)" required style="height: 42px;">
    <div style="display: flex; gap: 8px; align-items: center; overflow: hidden;">
      <input type="file" class="form-input color-file-input" accept="image/*" style="flex: 1; padding: 8px 10px; font-size: 12px; height: 42px;">
      ${imgUrl ? `<img class="color-preview" src="${imgUrl}" style="width: 38px; height: 38px; object-fit: contain; border-radius: 4px; border: 1px solid var(--panel-border);" data-url="${imgUrl}">` : ''}
    </div>
    <button type="button" class="btn btn-danger btn-remove-color" style="padding: 0; height: 42px; width: 42px; display: flex; align-items: center; justify-content: center; background: #b91c1c; border-color: #b91c1c; color: white;"><i class="fa-solid fa-trash"></i></button>
  `;

  // Bind remove button click
  row.querySelector('.btn-remove-color').onclick = function() {
    row.remove();
  };

  container.appendChild(row);
}
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
    loadAdminBanners();
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
  const bannersBtn = document.getElementById('tab-banners-btn');
  const settingsBtn = document.getElementById('tab-settings-btn');
  
  const carsContent = document.getElementById('tab-cars-content');
  const drivesContent = document.getElementById('tab-drives-content');
  const bannersContent = document.getElementById('tab-banners-content');
  const settingsContent = document.getElementById('tab-settings-content');

  carsContent.style.display = 'none';
  drivesContent.style.display = 'none';
  if (bannersContent) bannersContent.style.display = 'none';
  if (settingsContent) settingsContent.style.display = 'none';

  carsBtn.classList.remove('btn-primary');
  drivesBtn.classList.remove('btn-primary');
  if (bannersBtn) bannersBtn.classList.remove('btn-primary');
  if (settingsBtn) settingsBtn.classList.remove('btn-primary');

  if (tabName === 'cars') {
    carsContent.style.display = 'block';
    carsBtn.classList.add('btn-primary');
  } else if (tabName === 'drives') {
    drivesContent.style.display = 'block';
    drivesBtn.classList.add('btn-primary');
    loadAdminTestDrives();
  } else if (tabName === 'banners') {
    if (bannersContent) bannersContent.style.display = 'block';
    if (bannersBtn) bannersBtn.classList.add('btn-primary');
    loadAdminBanners();
  } else if (tabName === 'settings') {
    if (settingsContent) settingsContent.style.display = 'block';
    if (settingsBtn) settingsBtn.classList.add('btn-primary');
    loadAdminSettings();
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
  document.getElementById('spec-price-note').value = '';
  const specContactPhone = document.getElementById('spec-contact-phone');
  if (specContactPhone) specContactPhone.value = '';
  if (quillEditor) quillEditor.root.innerHTML = '';

  // Clear versions, promotions, and colors list inputs
  const container = document.getElementById('versions-list-inputs');
  if (container) container.innerHTML = '';
  const promoContainer = document.getElementById('promo-list-inputs');
  if (promoContainer) promoContainer.innerHTML = '';
  const colorContainer = document.getElementById('colors-list-inputs');
  if (colorContainer) colorContainer.innerHTML = '';

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

// Bind add version row button click listener
const btnAddVer = document.getElementById('btn-add-version-row');
if (btnAddVer) {
  btnAddVer.onclick = function() {
    addVersionRow('', '', '');
  };
}

// Bind add color row button click listener
const btnAddColor = document.getElementById('btn-add-color-row');
if (btnAddColor) {
  btnAddColor.onclick = function() {
    addColorRow();
  };
}

// Bind add promo row button click listener
const btnAddPromo = document.getElementById('btn-add-promo-row');
if (btnAddPromo) {
  btnAddPromo.onclick = function() {
    addPromoRow('');
  };
}

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
    if (quillEditor) {
      quillEditor.root.innerHTML = car.description || '';
    }

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
    document.getElementById('spec-price-note').value = specs.price_note || '';
    const specContactPhone = document.getElementById('spec-contact-phone');
    if (specContactPhone) {
      specContactPhone.value = specs.contact_phone || '';
    }

    // Clear and populate versions list
    const container = document.getElementById('versions-list-inputs');
    if (container) {
      container.innerHTML = '';
      const versions = specs.versions || [];
      versions.forEach(v => {
        addVersionRow(v.name, v.base_price, v.promo_price);
      });
    }

    // Clear and populate colors list
    const colorContainer = document.getElementById('colors-list-inputs');
    if (colorContainer) {
      colorContainer.innerHTML = '';
      const colors = specs.colors || [];
      colors.forEach(c => {
        addColorRow(c);
      });
    }

    // Clear and populate promotions list
    const promoContainer = document.getElementById('promo-list-inputs');
    if (promoContainer) {
      promoContainer.innerHTML = '';
      const promotions = car.promotions || [];
      promotions.forEach(p => {
        addPromoRow(p);
      });
    }

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
  formData.append('description', quillEditor ? quillEditor.root.innerHTML.trim() : '');

  // Lấy danh sách các phiên bản từ form
  const versions = [];
  document.querySelectorAll('.version-row').forEach(row => {
    const name = row.querySelector('.ver-name').value.trim();
    const base_price = parseFloat(row.querySelector('.ver-base-price').value);
    const promo_price = parseFloat(row.querySelector('.ver-promo-price').value);
    if (name && !isNaN(base_price) && !isNaN(promo_price)) {
      versions.push({ name, base_price, promo_price });
    }
  });

  // Lấy danh sách các khuyến mãi từ form
  const promotions = [];
  document.querySelectorAll('.promo-row').forEach(row => {
    const content = row.querySelector('.promo-content').value.trim();
    if (content) {
      promotions.push(content);
    }
  });

  // Lấy danh sách các màu sắc từ form
  const colors = [];
  document.querySelectorAll('.color-row').forEach((row, index) => {
    const hex = row.querySelector('.color-hex').value;
    const name = row.querySelector('.color-name').value.trim();
    const fileInput = row.querySelector('.color-file-input');
    const previewImg = row.querySelector('.color-preview');
    
    let image_url = '';
    let fileKey = '';
    
    if (fileInput.files[0]) {
      fileKey = `color_image_${index}`;
      formData.append(fileKey, fileInput.files[0]);
    } else if (previewImg) {
      image_url = previewImg.getAttribute('data-url') || '';
    }
    
    if (name) {
      const colorObj = { name, hex };
      if (fileKey) {
        colorObj.fileKey = fileKey;
      } else {
        colorObj.image_url = image_url;
      }
      colors.push(colorObj);
    }
  });

  // Tạo specifications JSON
  const specifications = {
    dimensions: document.getElementById('spec-in-dimensions').value.trim(),
    wheelbase: document.getElementById('spec-in-wheelbase').value.trim(),
    ground_clearance: document.getElementById('spec-in-clearance').value.trim(),
    drive_type: document.getElementById('spec-in-drive').value.trim(),
    charging_time: document.getElementById('spec-in-charging').value.trim(),
    safety: document.getElementById('spec-in-safety').value.trim(),
    price_note: document.getElementById('spec-price-note').value.trim(),
    contact_phone: document.getElementById('spec-contact-phone') ? document.getElementById('spec-contact-phone').value.trim() : '',
    versions: versions,
    colors: colors
  };
  formData.append('specifications', JSON.stringify(specifications));
  formData.append('promotions', JSON.stringify(promotions));

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


// --- Tab 2: Quản Lý Yêu Cầu Báo Giá ---
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
    if (!response.ok) throw new Error(data.message || 'Không thể tải danh sách yêu cầu.');
    const drives = data;

    if (drives.length === 0) {
      adminDriveList.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">
            Chưa có yêu cầu báo giá hoặc lái thử nào từ khách hàng.
          </td>
        </tr>
      `;
      return;
    }

    adminDriveList.innerHTML = drives.map(drive => {
      const isQuote = drive.type === 'quote';
      const typeBadge = isQuote
        ? `<span class="badge" style="background: rgba(15, 83, 197, 0.1); color: var(--accent-color); border: 1px solid rgba(15, 83, 197, 0.2); padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 700;">Nhận Báo Giá</span>`
        : `<span class="badge" style="background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 700;">Đăng Ký Lái Thử</span>`;

      const detailsHtml = isQuote
        ? `<div style="font-size: 13px;"><i class="fa-solid fa-location-dot" style="color: var(--text-muted); margin-right: 4px;"></i> ${drive.address || 'Chưa cung cấp'}</div>`
        : `<div style="font-size: 12.5px; display: flex; flex-direction: column; gap: 4px;">
            ${drive.address ? `<div><i class="fa-solid fa-location-dot" style="color: var(--text-muted); margin-right: 4px;"></i> Địa chỉ: <span style="color: var(--text-secondary);">${drive.address}</span></div>` : ''}
            ${drive.province ? `<div><i class="fa-solid fa-map-location-dot" style="color: var(--text-muted); margin-right: 4px;"></i> Tỉnh/Thành: <strong>${drive.province}</strong></div>` : ''}
            ${drive.showroom ? `<div><i class="fa-solid fa-store" style="color: var(--text-muted); margin-right: 4px;"></i> Showroom: <span style="color: var(--text-secondary);">${drive.showroom}</span></div>` : ''}
            <div><i class="fa-solid fa-calendar-days" style="color: var(--accent-color); margin-right: 4px;"></i> Ngày hẹn: <strong style="color: var(--text-primary);">${drive.preferred_date ? new Date(drive.preferred_date).toLocaleDateString('vi-VN') : ''}</strong></div>
           </div>`;

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
          <td>
            ${typeBadge}
          </td>
          <td>
            ${detailsHtml}
          </td>
          <td>
            <select class="form-input" style="padding: 6px 12px; font-size: 13px; width: auto;" onchange="updateDriveStatus(${drive.id}, this.value)">
              <option value="Chờ liên hệ" ${drive.status === 'Chờ liên hệ' ? 'selected' : ''}>Chờ liên hệ</option>
              <option value="Đã liên hệ" ${drive.status === 'Đã liên hệ' ? 'selected' : ''}>Đã liên hệ</option>
              <option value="Hoàn thành" ${drive.status === 'Hoàn thành' ? 'selected' : ''}>Hoàn thành</option>
              <option value="Hủy yêu cầu" ${drive.status === 'Hủy yêu cầu' ? 'selected' : ''}>Hủy yêu cầu</option>
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
window.loadAdminTestDrives = loadAdminTestDrives;

// Hàm cập nhật nhanh trạng thái yêu cầu báo giá
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

    alert('Đã cập nhật trạng thái yêu cầu báo giá!');
    loadAdminTestDrives();
  } catch (error) {
    alert(error.message);
  }
}
window.updateDriveStatus = updateDriveStatus;

// Hàm xóa yêu cầu báo giá
async function deleteDrive(id) {
  if (confirm('Bạn chắc chắn muốn xóa yêu cầu báo giá này?')) {
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

      alert('Đã xóa yêu cầu báo giá thành công!');
      loadAdminTestDrives();
    } catch (error) {
      alert(error.message);
    }
  }
}
window.deleteDrive = deleteDrive;


// --- Tab 3: Quản Lý Banners Quảng Cáo (CRUD) ---
const adminBannerList = document.getElementById('admin-banner-list');
const btnAddBanner = document.getElementById('btn-add-banner');
const bannerFormModal = document.getElementById('banner-form-modal');
const bannerFormModalClose = document.getElementById('banner-form-modal-close');
const btnCancelBannerForm = document.getElementById('btn-cancel-banner-form');
const bannerForm = document.getElementById('banner-form');
const bannerImageInput = document.getElementById('banner-image');
const bannerImagePreviewBox = document.getElementById('banner-image-preview-box');
const bannerImagePreview = document.getElementById('banner-image-preview');
const bannerModalFormTitle = document.getElementById('banner-modal-form-title');

let isEditingBanner = false;

async function loadAdminBanners() {
  if (!adminBannerList) return;
  try {
    const response = await fetch('/api/banners');
    if (!response.ok) throw new Error('Không thể tải danh sách banner.');
    const banners = await response.json();

    if (banners.length === 0) {
      adminBannerList.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">
            Chưa có banner nào. Vui lòng nhấn "Thêm Banner Mới".
          </td>
        </tr>
      `;
      return;
    }

    adminBannerList.innerHTML = banners.map(banner => `
      <tr>
        <td>
          <img src="${banner.image_url}" class="car-thumb" style="width: 140px; height: 60px; object-fit: cover;" alt="${banner.title}">
        </td>
        <td>
          <div style="font-weight: 700; color: var(--text-primary); font-size: 15px;">${banner.title}</div>
          <div style="font-size: 12px; color: var(--accent-color); font-weight: 600; margin-top: 4px;">${banner.subtitle}</div>
          <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px; max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${banner.description || 'Không có mô tả'}</div>
        </td>
        <td>
          <code style="background: rgba(0,0,0,0.05); padding: 4px 8px; border-radius: 4px; font-size: 12px;">${banner.link_url}</code>
        </td>
        <td>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline" style="padding: 6px 12px; font-size: 12px;" onclick="openEditBannerModal(${JSON.stringify(banner).replace(/"/g, '&quot;')})">
              <i class="fa-solid fa-pen-to-square"></i> Sửa
            </button>
            <button class="btn btn-danger" style="padding: 6px 12px; font-size: 12px;" onclick="deleteBanner(${banner.id})">
              <i class="fa-solid fa-trash-can"></i> Xóa
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Lỗi khi tải banner:', error);
  }
}

// Mở Modal Thêm Banner
if (btnAddBanner) {
  btnAddBanner.addEventListener('click', () => {
    isEditingBanner = false;
    if (bannerModalFormTitle) bannerModalFormTitle.innerText = 'Thêm Banner Mới';
    if (bannerForm) bannerForm.reset();
    document.getElementById('banner-id').value = '';
    if (bannerImagePreviewBox) bannerImagePreviewBox.style.display = 'none';
    if (bannerImageInput) bannerImageInput.required = true;
    if (bannerFormModal) bannerFormModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}

// Đóng Modal Banner
function closeBannerModal() {
  if (bannerFormModal) bannerFormModal.classList.remove('active');
  document.body.style.overflow = '';
  if (bannerForm) bannerForm.reset();
}
if (bannerFormModalClose) bannerFormModalClose.addEventListener('click', closeBannerModal);
if (btnCancelBannerForm) btnCancelBannerForm.addEventListener('click', closeBannerModal);

// Click ngoài đóng modal
window.addEventListener('click', (e) => {
  if (e.target === bannerFormModal) closeBannerModal();
});

// Hàm sửa banner
window.openEditBannerModal = function(banner) {
  isEditingBanner = true;
  if (bannerModalFormTitle) bannerModalFormTitle.innerText = 'Chỉnh Sửa Banner';
  document.getElementById('banner-id').value = banner.id;
  document.getElementById('banner-title').value = banner.title;
  document.getElementById('banner-subtitle').value = banner.subtitle;
  document.getElementById('banner-description').value = banner.description || '';
  document.getElementById('banner-link').value = banner.link_url || '#';
  
  if (bannerImagePreview) bannerImagePreview.src = banner.image_url;
  if (bannerImagePreviewBox) bannerImagePreviewBox.style.display = 'block';
  if (bannerImageInput) bannerImageInput.required = false;
  
  if (bannerFormModal) bannerFormModal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

// Lưu / Cập nhật Banner
if (bannerForm) {
  bannerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('banner-id').value;
    const formData = new FormData();
    formData.append('title', document.getElementById('banner-title').value.trim());
    formData.append('subtitle', document.getElementById('banner-subtitle').value.trim());
    formData.append('description', document.getElementById('banner-description').value.trim());
    formData.append('link_url', document.getElementById('banner-link').value.trim());

    if (bannerImageInput.files[0]) {
      formData.append('image', bannerImageInput.files[0]);
    }

    try {
      let url = '/api/banners';
      let method = 'POST';

      if (isEditingBanner) {
        url = `/api/banners/${id}`;
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
      if (!response.ok) throw new Error(data.message || 'Lỗi khi lưu banner.');

      alert(isEditingBanner ? 'Cập nhật banner thành công!' : 'Thêm banner mới thành công!');
      closeBannerModal();
      loadAdminBanners();
    } catch (error) {
      alert(error.message);
    }
  });
}

// Xóa Banner
window.deleteBanner = async function(id) {
  if (confirm('Bạn có chắc chắn muốn xóa banner này?')) {
    try {
      const response = await fetch(`/api/banners/${id}`, {
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
      if (!response.ok) throw new Error(data.message || 'Lỗi khi xóa banner.');

      alert('Đã xóa banner thành công!');
      loadAdminBanners();
    } catch (error) {
      alert(error.message);
    }
  }
};

// --- Tab 4: Cấu Hình Hệ Thống (settings) ---
async function loadAdminSettings() {
  try {
    const response = await fetch('/api/settings');
    if (!response.ok) throw new Error('Không thể tải cấu hình hệ thống.');
    const settings = await response.json();

    document.getElementById('setting-showroom-name').value = settings.showroom_name || '';
    document.getElementById('setting-contact-phone').value = settings.contact_phone || '';
    document.getElementById('setting-contact-email').value = settings.contact_email || '';
    document.getElementById('setting-contact-hours').value = settings.contact_hours || '';
    document.getElementById('setting-contact-address').value = settings.contact_address || '';
    document.getElementById('setting-zalo-link').value = settings.zalo_link || '';
    document.getElementById('setting-messenger-link').value = settings.messenger_link || '';
  } catch (error) {
    alert(error.message);
  }
}
window.loadAdminSettings = loadAdminSettings;

const adminSettingsForm = document.getElementById('admin-settings-form');
if (adminSettingsForm) {
  adminSettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const settings = {
      showroom_name: document.getElementById('setting-showroom-name').value.trim(),
      contact_phone: document.getElementById('setting-contact-phone').value.trim(),
      contact_email: document.getElementById('setting-contact-email').value.trim(),
      contact_hours: document.getElementById('setting-contact-hours').value.trim(),
      contact_address: document.getElementById('setting-contact-address').value.trim(),
      zalo_link: document.getElementById('setting-zalo-link').value.trim(),
      messenger_link: document.getElementById('setting-messenger-link').value.trim()
    };

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError();
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Lỗi khi lưu cấu hình.');

      alert('Đã lưu cấu hình hệ thống thành công!');
      loadAdminSettings();
    } catch (error) {
      alert(error.message);
    }
  });
}

// Khởi tạo chạy ban đầu
checkAuth();
