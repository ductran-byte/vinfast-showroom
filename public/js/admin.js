// Quản lý trạng thái Admin
let token = localStorage.getItem('adminToken');
let adminUser = localStorage.getItem('adminUser');
let quillEditor = null;

// Reusable Custom Sleek Notification Popup
function showAlert(message, isSuccess = true, callback = null) {
  let modal = document.getElementById('custom-alert-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'custom-alert-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;
    modal.innerHTML = `
      <div id="custom-alert-card" style="
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        padding: 32px 24px;
        width: 90%;
        max-width: 380px;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        transform: scale(0.85) translateY(-10px);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      ">
        <div id="custom-alert-icon" style="
          width: 64px;
          height: 64px;
          border-radius: 50%;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.05);
        "></div>
        <h4 id="custom-alert-title" style="
          margin: 0 0 8px;
          font-family: 'Inter', sans-serif;
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
        "></h4>
        <p id="custom-alert-message" style="
          margin: 0 0 24px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #64748b;
          line-height: 1.5;
          word-break: break-word;
        "></p>
        <button id="custom-alert-btn" style="
          background: #0f53c5;
          color: #ffffff;
          border: none;
          padding: 12px 28px;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 13.5px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(15, 83, 197, 0.3);
          width: 100%;
        ">Đồng ý</button>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Add hover effect
    const btn = document.getElementById('custom-alert-btn');
    btn.onmouseover = () => {
      btn.style.background = '#0d46a5';
      btn.style.transform = 'translateY(-1px)';
    };
    btn.onmouseout = () => {
      btn.style.background = '#0f53c5';
      btn.style.transform = 'translateY(0)';
    };
  }

  const card = document.getElementById('custom-alert-card');
  const icon = document.getElementById('custom-alert-icon');
  const title = document.getElementById('custom-alert-title');
  const msg = document.getElementById('custom-alert-message');
  const btn = document.getElementById('custom-alert-btn');

  if (isSuccess) {
    icon.style.background = 'rgba(34, 197, 94, 0.12)';
    icon.style.color = '#22c55e';
    icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    title.innerText = 'Thành Công';
  } else {
    icon.style.background = 'rgba(239, 68, 68, 0.12)';
    icon.style.color = '#ef4444';
    icon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
    title.innerText = 'Thông Báo';
  }

  msg.innerText = message;

  const closeAlert = () => {
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    card.style.transform = 'scale(0.85) translateY(-10px)';
    if (callback) callback();
  };

  btn.onclick = closeAlert;
  modal.onclick = (e) => {
    if (e.target === modal) closeAlert();
  };

  modal.style.visibility = 'visible';
  modal.style.opacity = '1';
  setTimeout(() => {
    card.style.transform = 'scale(1) translateY(0)';
  }, 50);
}

// Reusable Custom Sleek Confirm Popup
function showConfirm(message, callback) {
  let modal = document.getElementById('custom-confirm-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'custom-confirm-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;
    modal.innerHTML = `
      <div id="custom-confirm-card" style="
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        padding: 32px 24px;
        width: 90%;
        max-width: 380px;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        transform: scale(0.85) translateY(-10px);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      ">
        <div style="
          width: 64px;
          height: 64px;
          border-radius: 50%;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          background: rgba(234, 179, 8, 0.12);
          color: #eab308;
          box-shadow: 0 8px 16px rgba(0,0,0,0.05);
        ">
          <i class="fa-solid fa-circle-exclamation"></i>
        </div>
        <h4 style="
          margin: 0 0 8px;
          font-family: 'Inter', sans-serif;
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
        ">Xác Nhận</h4>
        <p id="custom-confirm-message" style="
          margin: 0 0 24px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #64748b;
          line-height: 1.5;
          word-break: break-word;
        "></p>
        <div style="display: flex; gap: 12px;">
          <button id="custom-confirm-cancel-btn" style="
            background: #f1f5f9;
            color: #475569;
            border: none;
            padding: 12px 20px;
            border-radius: 10px;
            font-family: 'Inter', sans-serif;
            font-weight: 700;
            font-size: 13.5px;
            cursor: pointer;
            transition: all 0.2s ease;
            flex: 1;
          ">Hủy bỏ</button>
          <button id="custom-confirm-ok-btn" style="
            background: #ef4444;
            color: #ffffff;
            border: none;
            padding: 12px 20px;
            border-radius: 10px;
            font-family: 'Inter', sans-serif;
            font-weight: 700;
            font-size: 13.5px;
            cursor: pointer;
            transition: all 0.2s ease;
            flex: 1;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          ">Xác nhận</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const cancel = document.getElementById('custom-confirm-cancel-btn');
    const ok = document.getElementById('custom-confirm-ok-btn');
    cancel.onmouseover = () => cancel.style.background = '#e2e8f0';
    cancel.onmouseout = () => cancel.style.background = '#f1f5f9';
    ok.onmouseover = () => ok.style.background = '#dc2626';
    ok.onmouseout = () => ok.style.background = '#ef4444';
  }

  const card = document.getElementById('custom-confirm-card');
  const msg = document.getElementById('custom-confirm-message');
  const okBtn = document.getElementById('custom-confirm-ok-btn');
  const cancelBtn = document.getElementById('custom-confirm-cancel-btn');

  msg.innerText = message;

  const closeConfirm = () => {
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    card.style.transform = 'scale(0.85) translateY(-10px)';
  };

  okBtn.onclick = () => {
    closeConfirm();
    callback();
  };

  cancelBtn.onclick = closeConfirm;
  modal.onclick = (e) => {
    if (e.target === modal) closeConfirm();
  };

  modal.style.visibility = 'visible';
  modal.style.opacity = '1';
  setTimeout(() => {
    card.style.transform = 'scale(1) translateY(0)';
  }, 50);
}

// Override window.alert globally to use custom beautiful popup
window.alert = function(message) {
  const lowercase = message.toLowerCase();
  const isSuccess = lowercase.includes('thành công') || lowercase.includes('ok') || lowercase.includes('gửi thành công') || lowercase.includes('kết nối thành công');
  showAlert(message, isSuccess);
};

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
  row.style.gridTemplateColumns = '50px 2fr 1.5fr 3fr 50px';
  row.style.gap = '10px';
  row.style.marginBottom = '10px';
  row.style.alignItems = 'center';

  const hexVal = colorObj ? colorObj.hex : '#000000';
  const nameVal = colorObj ? colorObj.name : '';
  const imgUrl = colorObj ? colorObj.image_url : '';
  const typeVal = colorObj ? colorObj.type : 'basic';

  row.innerHTML = `
    <input type="color" class="color-hex" value="${hexVal}" style="width: 100%; height: 42px; padding: 2px; border: 1px solid var(--panel-border); border-radius: var(--radius-sm); cursor: pointer;">
    <input type="text" class="form-input color-name" value="${nameVal}" placeholder="Tên màu (VD: Đỏ Năng Động)" required style="height: 42px;">
    <select class="form-input color-type" style="height: 42px; background: #fff;">
      <option value="basic" ${typeVal === 'basic' ? 'selected' : ''}>Màu cơ bản</option>
      <option value="premium" ${typeVal === 'premium' ? 'selected' : ''}>Màu nâng cao</option>
    </select>
    <div style="display: flex; gap: 8px; align-items: center; overflow: hidden; flex: 1;">
      <label class="btn btn-outline" style="margin: 0; padding: 0 12px; font-size: 12px; height: 42px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; white-space: nowrap; font-weight: 700; border-radius: 8px; border: 1.5px solid var(--slate-200); background: var(--slate-50); color: var(--slate-700); transition: all 0.2s;" onmouseover="this.style.background='var(--slate-100)'; this.style.borderColor='var(--slate-400)';" onmouseout="this.style.background='var(--slate-50)'; this.style.borderColor='var(--slate-200)';">
        <i class="fa-solid fa-cloud-arrow-up" style="margin-right: 5px;"></i> Chọn ảnh
        <input type="file" class="color-file-input" accept="image/*" style="display: none;">
      </label>
      <span class="color-filename" style="color: var(--text-secondary); font-size: 11px; font-style: italic; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-grow: 1; max-width: 80px;">
        ${imgUrl ? 'Ảnh hiện có' : 'Chưa chọn'}
      </span>
      <div class="color-preview-container" style="display: flex; align-items: center; flex-shrink: 0;">
        ${imgUrl ? `<img class="color-preview" src="${imgUrl}" style="width: 38px; height: 38px; object-fit: contain; border-radius: 4px; border: 1px solid var(--panel-border);" data-url="${imgUrl}">` : '<span class="no-preview" style="font-size: 11px; color: var(--text-muted);">Trống</span>'}
      </div>
    </div>
    <button type="button" class="btn btn-danger btn-remove-color" style="padding: 0; height: 42px; width: 42px; display: flex; align-items: center; justify-content: center; background: #b91c1c; border-color: #b91c1c; color: white;"><i class="fa-solid fa-trash"></i></button>
  `;

  // Bind change listener for file input to show live preview
  const fileInput = row.querySelector('.color-file-input');
  const filenameSpan = row.querySelector('.color-filename');
  const previewContainer = row.querySelector('.color-preview-container');
  
  fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      if (filenameSpan) filenameSpan.textContent = file.name;
      const reader = new FileReader();
      reader.onload = function(e) {
        previewContainer.innerHTML = `<img class="color-preview" src="${e.target.result}" style="width: 38px; height: 38px; object-fit: contain; border-radius: 4px; border: 1px solid var(--panel-border);" data-url="${imgUrl || ''}">`;
      };
      reader.readAsDataURL(file);
    } else {
      if (filenameSpan) filenameSpan.textContent = imgUrl ? 'Ảnh hiện có' : 'Chưa chọn';
      if (imgUrl) {
        previewContainer.innerHTML = `<img class="color-preview" src="${imgUrl}" style="width: 38px; height: 38px; object-fit: contain; border-radius: 4px; border: 1px solid var(--panel-border);" data-url="${imgUrl}">`;
      } else {
        previewContainer.innerHTML = `<span class="no-preview" style="font-size: 11px; color: var(--text-muted);">Trống</span>`;
      }
    }
  });

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
    
    // Gọi switchTab để trỏ mặc định tới tab Dashboard Tổng Quan
    switchTab('dashboard');
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
// --- Quản Lý Tabs Điều Hướng ---
function switchTab(tabName) {
  const dashboardBtn = document.getElementById('tab-dashboard-btn');
  const carsBtn = document.getElementById('tab-cars-btn');
  const drivesBtn = document.getElementById('tab-drives-btn');
  const bannersBtn = document.getElementById('tab-banners-btn');
  const settingsBtn = document.getElementById('tab-settings-btn');
  
  const dashboardContent = document.getElementById('tab-dashboard-content');
  const carsContent = document.getElementById('tab-cars-content');
  const drivesContent = document.getElementById('tab-drives-content');
  const bannersContent = document.getElementById('tab-banners-content');
  const settingsContent = document.getElementById('tab-settings-content');

  const activeTitle = document.getElementById('active-tab-title');

  if (dashboardContent) dashboardContent.style.display = 'none';
  carsContent.style.display = 'none';
  drivesContent.style.display = 'none';
  if (bannersContent) bannersContent.style.display = 'none';
  if (settingsContent) settingsContent.style.display = 'none';

  if (dashboardBtn) dashboardBtn.classList.remove('active');
  carsBtn.classList.remove('active', 'btn-primary');
  drivesBtn.classList.remove('active', 'btn-primary');
  if (bannersBtn) bannersBtn.classList.remove('active', 'btn-primary');
  if (settingsBtn) settingsBtn.classList.remove('active', 'btn-primary');

  if (tabName === 'dashboard') {
    if (dashboardContent) dashboardContent.style.display = 'block';
    if (dashboardBtn) dashboardBtn.classList.add('active');
    if (activeTitle) activeTitle.innerText = 'Tổng Quan Hệ Thống';
    updateDashboardData();
  } else if (tabName === 'cars') {
    carsContent.style.display = 'block';
    carsBtn.classList.add('active');
    if (activeTitle) activeTitle.innerText = 'Quản Lý Danh Sách Xe';
    loadAdminCars();
  } else if (tabName === 'drives') {
    drivesContent.style.display = 'block';
    drivesBtn.classList.add('active');
    if (activeTitle) activeTitle.innerText = 'Yêu Cầu Báo Giá & Lái Thử';
    loadAdminTestDrives();
  } else if (tabName === 'banners') {
    if (bannersContent) bannersContent.style.display = 'block';
    if (bannersBtn) bannersBtn.classList.add('active');
    if (activeTitle) activeTitle.innerText = 'Quản Lý Banners Quảng Cáo';
    loadAdminBanners();
  } else if (tabName === 'settings') {
    if (settingsContent) settingsContent.style.display = 'block';
    if (settingsBtn) settingsBtn.classList.add('active');
    if (activeTitle) activeTitle.innerText = 'Cấu Hình Thông Tin Liên Hệ';
    loadAdminSettings();
  }

  // Tự động đóng Sidebar trên Mobile/Tablet khi bấm chuyển Tab
  const sidebar = document.getElementById('admin-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar && sidebar.classList.contains('active')) {
    sidebar.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
  }
}
window.switchTab = switchTab;

// Hàm bật/tắt Sidebar trên thiết bị di động
window.toggleMobileSidebar = function() {
  const sidebar = document.getElementById('admin-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar) {
    const isActive = sidebar.classList.contains('active');
    if (isActive) {
      sidebar.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
    } else {
      sidebar.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
    }
  }
};

// --- Dashboard Thống Kê & Biểu Đồ ---
let requestTypeChart = null;
let carSegmentChart = null;

async function updateDashboardData() {
  try {
    const recentRequestsEl = document.getElementById('dashboard-recent-requests');
    const recentCarsEl = document.getElementById('dashboard-recent-cars');
    
    if (recentRequestsEl) recentRequestsEl.innerHTML = '<div style="text-align: center; color: var(--slate-400); padding: 10px;">Đang tải...</div>';
    if (recentCarsEl) recentCarsEl.innerHTML = '<div style="text-align: center; color: var(--slate-400); padding: 10px;">Đang tải...</div>';

    // Đảm bảo dữ liệu được fetch
    let cars = window.loadedCars;
    if (!cars) {
      const resCars = await fetch('/api/cars');
      cars = await resCars.json();
      window.loadedCars = cars;
    }
    
    let drives = window.loadedDrives;
    if (!drives) {
      const resDrives = await fetch('/api/test-drives', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      drives = await resDrives.json();
      window.loadedDrives = drives;
    }

    let banners = window.loadedBanners;
    if (!banners) {
      try {
        const resBanners = await fetch('/api/banners');
        banners = await resBanners.json();
        window.loadedBanners = banners;
      } catch (e) {
        banners = [];
      }
    }

    // Cập nhật chỉ số KPI
    const kpiCars = document.getElementById('kpi-total-cars');
    if (kpiCars) kpiCars.innerText = cars.length;
    
    const kpiDrives = document.getElementById('kpi-total-drives');
    if (kpiDrives) kpiDrives.innerText = drives.length;
    
    const kpiPending = document.getElementById('kpi-pending-drives');
    if (kpiPending) {
      const pendingCount = drives.filter(d => d.status === 'Chờ liên hệ' || d.status === 'Đang xử lý' || d.status === 'Chờ xử lý').length;
      kpiPending.innerText = pendingCount;
    }

    const kpiBanners = document.getElementById('kpi-total-banners');
    if (kpiBanners) kpiBanners.innerText = banners ? banners.length : 0;

    // 1. Hiển thị yêu cầu gần đây (Tối đa 5 yêu cầu)
    if (recentRequestsEl) {
      const recentDrives = [...drives].reverse().slice(0, 5);
      if (recentDrives.length === 0) {
        recentRequestsEl.innerHTML = '<div style="text-align: center; color: var(--slate-400); padding: 10px;">Chưa có yêu cầu nào</div>';
      } else {
        recentRequestsEl.innerHTML = recentDrives.map(d => {
          const typeBadge = d.type === 'quote' 
            ? `<span class="badge quote" style="background-color: #ebf3fc; color: #0f53c5; border: 1px solid #d0e1f9; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">Báo Giá</span>`
            : `<span class="badge drive" style="background-color: #eafaf1; color: #2ecc71; border: 1px solid #d4f5e3; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">Lái Thử</span>`;
          return `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">
              <div>
                <span style="font-weight: 700; font-size: 13.5px; color: var(--slate-900);">${d.fullname}</span>
                <span style="font-size: 11.5px; color: var(--slate-500); margin-left: 8px;">${d.phone}</span>
                <div style="font-size: 12px; color: var(--slate-500); margin-top: 3px;">
                  Quan tâm: <strong>${d.car_name || 'Chưa chọn'}</strong>
                </div>
              </div>
              <div style="text-align: right;">
                ${typeBadge}
                <div style="font-size: 11px; color: var(--slate-400); margin-top: 4px;">
                  ${new Date(d.created_at).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 2. Hiển thị xe mới thêm (Tối đa 5 xe)
    if (recentCarsEl) {
      const recentCars = [...cars].reverse().slice(0, 5);
      if (recentCars.length === 0) {
        recentCarsEl.innerHTML = '<div style="text-align: center; color: var(--slate-400); padding: 10px;">Chưa có xe nào</div>';
      } else {
        recentCarsEl.innerHTML = recentCars.map(c => `
          <div style="display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">
            <img src="${c.image_url}" style="width: 50px; height: 35px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0;" onerror="this.src='/uploads/default-car.jpg'">
            <div style="flex-grow: 1;">
              <span style="font-weight: 700; font-size: 13.5px; color: var(--slate-900);">${c.name}</span>
              <div style="font-size: 12px; color: var(--slate-500); margin-top: 2px;">
                Phân khúc: <strong>${c.segment}</strong> | Loại: <strong>${c.type}</strong>
              </div>
            </div>
            <div style="text-align: right;">
              <span style="font-weight: 700; font-size: 13.5px; color: var(--primary-blue);">${formatVND(c.price)}</span>
            </div>
          </div>
        `).join('');
      }
    }

    // 3. Vẽ biểu đồ thống kê
    renderCharts(drives, cars);

  } catch (err) {
    console.error('Lỗi khi cập nhật Dashboard:', err);
  }
}

function renderCharts(drives, cars) {
  if (typeof Chart === 'undefined') return; // Đề phòng chưa tải xong Chart.js

  const canvas1 = document.getElementById('chart-request-types');
  const canvas2 = document.getElementById('chart-car-segments');
  if (!canvas1 || !canvas2) return;

  // Hủy biểu đồ cũ nếu đã tồn tại để tránh xung đột render
  if (requestTypeChart) requestTypeChart.destroy();
  if (carSegmentChart) carSegmentChart.destroy();
  
  // Tính toán số lượng yêu cầu
  const quoteCount = drives.filter(d => d.type === 'quote').length;
  const driveCount = drives.filter(d => d.type === 'drive').length;
  
  const ctx1 = canvas1.getContext('2d');
  requestTypeChart = new Chart(ctx1, {
    type: 'pie',
    data: {
      labels: ['Nhận báo giá', 'Đăng ký lái thử'],
      datasets: [{
        data: [quoteCount, driveCount],
        backgroundColor: ['#0f53c5', '#10b981'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: 'Plus Jakarta Sans', weight: '600' } }
        }
      }
    }
  });
  
  // Tính toán phân khúc xe
  const segments = { 'Mini': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'Khác': 0 };
  cars.forEach(c => {
    const s = c.segment || 'Khác';
    if (segments[s] !== undefined) {
      segments[s]++;
    } else {
      segments['Khác']++;
    }
  });
  
  const ctx2 = canvas2.getContext('2d');
  carSegmentChart = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: Object.keys(segments),
      datasets: [{
        label: 'Số lượng xe',
        data: Object.values(segments),
        backgroundColor: '#0f53c5',
        borderRadius: 6,
        barPercentage: 0.6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}
window.switchTab = switchTab; // Gán global để sử dụng trong onclick html

// --- Tab 1: Quản Lý Ô Tô (CRUD) ---
async function loadAdminCars() {
  try {
    const response = await fetch('/api/cars');
    if (!response.ok) throw new Error('Không thể tải danh sách xe.');
    const cars = await response.json();
    window.loadedCars = cars;
    
    // Cập nhật chỉ số KPI
    const kpiCars = document.getElementById('kpi-total-cars');
    if (kpiCars) kpiCars.innerText = cars.length;

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
  const filenameSpan = document.getElementById('car-image-filename');
  if (file) {
    if (filenameSpan) filenameSpan.textContent = file.name;
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreviewContainer.innerHTML = `<img src="${e.target.result}" alt="Preview image">`;
    };
    reader.readAsDataURL(file);
  } else {
    if (filenameSpan) filenameSpan.textContent = 'Chưa chọn tệp';
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
  
  const carFilename = document.getElementById('car-image-filename');
  if (carFilename) carFilename.textContent = 'Chưa chọn tệp';

  document.getElementById('spec-price-note').value = '';
  const specBatteryOpt = document.getElementById('spec-in-battery-options');
  if (specBatteryOpt) specBatteryOpt.value = '';
  const specPrepay = document.getElementById('spec-in-default-prepay');
  if (specPrepay) specPrepay.value = '';
  const specMonths = document.getElementById('spec-in-default-months');
  if (specMonths) specMonths.value = '';
  const specInterest = document.getElementById('spec-in-default-interest');
  if (specInterest) specInterest.value = '';
  const specFeeHnHcm = document.getElementById('spec-in-fee-hanoi-hcm');
  if (specFeeHnHcm) specFeeHnHcm.value = '';
  const specFeeProvince = document.getElementById('spec-in-fee-province');
  if (specFeeProvince) specFeeProvince.value = '';

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

  populateCopyPromoCarSelect();

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

// Helper to populate car options for copying promotions
async function populateCopyPromoCarSelect() {
  const select = document.getElementById('select-copy-promo-car');
  if (!select) return;

  select.innerHTML = '<option value="">-- Sao chép từ xe khác --</option>';

  let cars = window.loadedCars;
  if (!cars || !Array.isArray(cars) || cars.length === 0) {
    try {
      const res = await fetch('/api/cars');
      if (res.ok) {
        cars = await res.json();
        window.loadedCars = cars;
      }
    } catch (e) {
      console.error('Error fetching cars for promo select:', e);
    }
  }

  const currentCarId = document.getElementById('car-id').value;

  if (cars && Array.isArray(cars)) {
    cars.forEach(car => {
      // Exclude current car if editing
      if (currentCarId && String(car.id) === String(currentCarId)) return;
      
      const count = Array.isArray(car.promotions) ? car.promotions.length : 0;
      const opt = document.createElement('option');
      opt.value = car.id;
      opt.textContent = `${car.name} (${count} KM)`;
      select.appendChild(opt);
    });
  }
}

// Custom Popup Modal cho việc Chọn Cách Sao Chép Khuyến Mãi
function showPromoCopyModal(existingCount, targetCarName, targetCount, onChoice) {
  let modal = document.getElementById('promo-copy-choice-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'promo-copy-choice-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;
    modal.innerHTML = `
      <div id="promo-copy-choice-card" style="
        background: rgba(255, 255, 255, 0.98);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 20px;
        padding: 32px 28px;
        width: 90%;
        max-width: 440px;
        text-align: center;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        transform: scale(0.85) translateY(-10px);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      ">
        <div style="
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          background: rgba(15, 83, 197, 0.1);
          color: #0f53c5;
          box-shadow: 0 8px 16px rgba(15, 83, 197, 0.1);
        ">
          <i class="fa-solid fa-copy"></i>
        </div>
        <h4 style="
          margin: 0 0 10px;
          font-family: 'Inter', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
        ">Tùy Chọn Sao Chép Khuyến Mãi</h4>
        <p id="promo-copy-choice-msg" style="
          margin: 0 0 24px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
        "></p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button id="btn-promo-replace" style="
            background: #ef4444;
            color: #ffffff;
            border: none;
            padding: 12px 18px;
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
          ">
            <i class="fa-solid fa-arrows-rotate"></i> Ghi Đè (Thay thế toàn bộ)
          </button>
          <button id="btn-promo-append" style="
            background: #0f53c5;
            color: #ffffff;
            border: none;
            padding: 12px 18px;
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(15, 83, 197, 0.25);
          ">
            <i class="fa-solid fa-plus"></i> Thêm Nối Tiếp Vào Bên Dưới
          </button>
          <button id="btn-promo-cancel" style="
            background: #f1f5f9;
            color: #64748b;
            border: none;
            padding: 10px 18px;
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: 13.5px;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-top: 4px;
          ">Hủy bỏ</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const card = document.getElementById('promo-copy-choice-card');
  const msg = document.getElementById('promo-copy-choice-msg');
  const btnReplace = document.getElementById('btn-promo-replace');
  const btnAppend = document.getElementById('btn-promo-append');
  const btnCancel = document.getElementById('btn-promo-cancel');

  msg.innerHTML = `Đang có <strong>${existingCount}</strong> khuyến mãi trong danh sách hiện tại.<br>Bạn muốn sao chép <strong>${targetCount}</strong> khuyến mãi từ xe <strong>"${targetCarName}"</strong> theo hình thức nào?`;

  const closeModal = (choice) => {
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    card.style.transform = 'scale(0.85) translateY(-10px)';
    if (onChoice) onChoice(choice);
  };

  btnReplace.onclick = () => closeModal('replace');
  btnAppend.onclick = () => closeModal('append');
  btnCancel.onclick = () => closeModal('cancel');

  modal.onclick = (e) => {
    if (e.target === modal) closeModal('cancel');
  };

  modal.style.visibility = 'visible';
  modal.style.opacity = '1';
  setTimeout(() => {
    card.style.transform = 'scale(1) translateY(0)';
  }, 50);
}

// Bind promo copy event
const btnCopyPromo = document.getElementById('btn-copy-promo-from-car');
if (btnCopyPromo) {
  btnCopyPromo.onclick = async function() {
    const select = document.getElementById('select-copy-promo-car');
    const selectedCarId = select ? select.value : '';

    if (!selectedCarId) {
      showAlert('Vui lòng chọn 1 xe từ danh sách để sao chép khuyến mãi.', false);
      return;
    }

    try {
      const response = await fetch(`/api/cars/${selectedCarId}`);
      if (!response.ok) throw new Error('Không thể tải thông tin xe đã chọn.');
      const targetCar = await response.json();

      const promotions = targetCar.promotions || [];
      if (promotions.length === 0) {
        showAlert(`Dòng xe "${targetCar.name}" hiện chưa có chương trình khuyến mãi nào.`, false);
        return;
      }

      const promoContainer = document.getElementById('promo-list-inputs');
      const currentRows = promoContainer ? promoContainer.querySelectorAll('.promo-row') : [];

      const executeCopy = (shouldReplace) => {
        if (shouldReplace && promoContainer) {
          promoContainer.innerHTML = '';
        }
        promotions.forEach(p => {
          addPromoRow(p);
        });
        showAlert(`Đã sao chép thành công ${promotions.length} khuyến mãi từ xe "${targetCar.name}"!`, true);
        if (select) select.value = '';
      };

      if (currentRows.length > 0) {
        showPromoCopyModal(currentRows.length, targetCar.name, promotions.length, (choice) => {
          if (choice === 'replace') {
            executeCopy(true);
          } else if (choice === 'append') {
            executeCopy(false);
          }
        });
      } else {
        executeCopy(true);
      }
    } catch (err) {
      showAlert('Lỗi sao chép khuyến mãi: ' + err.message, false);
    }
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
    let safetyText = specs.safety || '';
    if (safetyText && !safetyText.includes('\n')) {
      safetyText = safetyText.split(',').map(s => s.trim()).filter(Boolean).join('\n');
    }
    document.getElementById('spec-in-safety').value = safetyText;
    const specBatteryOptions = document.getElementById('spec-in-battery-options');
    if (specBatteryOptions) {
      let batOptVal = specs.battery_options || '';
      if (Array.isArray(batOptVal)) {
        batOptVal = batOptVal.map(o => `${o.name} | ${o.price || 0}`).join('\n');
      }
      specBatteryOptions.value = batOptVal;
    }
    const specDefaultPrepay = document.getElementById('spec-in-default-prepay');
    if (specDefaultPrepay) specDefaultPrepay.value = specs.default_prepay || '';
    const specDefaultMonths = document.getElementById('spec-in-default-months');
    if (specDefaultMonths) specDefaultMonths.value = specs.default_months || '';
    const specDefaultInterest = document.getElementById('spec-in-default-interest');
    if (specDefaultInterest) specDefaultInterest.value = specs.default_interest || '';
    const specFeeHnHcm = document.getElementById('spec-in-fee-hanoi-hcm');
    if (specFeeHnHcm) specFeeHnHcm.value = specs.fee_hanoi_hcm || '';
    const specFeeProvince = document.getElementById('spec-in-fee-province');
    if (specFeeProvince) specFeeProvince.value = specs.fee_province || '';
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
    const carFilename = document.getElementById('car-image-filename');
    if (carFilename) {
      if (car.image_url) {
        carFilename.textContent = car.image_url.split('/').pop() || 'Đang sử dụng ảnh đã có';
      } else {
        carFilename.textContent = 'Chưa chọn tệp';
      }
    }

    populateCopyPromoCarSelect();

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
    const type = row.querySelector('.color-type').value;
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
      const colorObj = { name, hex, type };
      if (fileKey) {
        colorObj.fileKey = fileKey;
      } else {
        colorObj.image_url = image_url;
      }
      colors.push(colorObj);
    }
  });

  const specBatteryOptionsEl = document.getElementById('spec-in-battery-options');
  const specDefaultPrepayEl = document.getElementById('spec-in-default-prepay');
  const specDefaultMonthsEl = document.getElementById('spec-in-default-months');
  const specDefaultInterestEl = document.getElementById('spec-in-default-interest');
  const specFeeHnHcmEl = document.getElementById('spec-in-fee-hanoi-hcm');
  const specFeeProvinceEl = document.getElementById('spec-in-fee-province');

  // Tạo specifications JSON
  const specifications = {
    dimensions: document.getElementById('spec-in-dimensions').value.trim(),
    wheelbase: document.getElementById('spec-in-wheelbase').value.trim(),
    ground_clearance: document.getElementById('spec-in-clearance').value.trim(),
    drive_type: document.getElementById('spec-in-drive').value.trim(),
    charging_time: document.getElementById('spec-in-charging').value.trim(),
    safety: document.getElementById('spec-in-safety').value.trim(),
    battery_options: specBatteryOptionsEl ? specBatteryOptionsEl.value.trim() : '',
    default_prepay: specDefaultPrepayEl && specDefaultPrepayEl.value ? parseFloat(specDefaultPrepayEl.value) : null,
    default_months: specDefaultMonthsEl && specDefaultMonthsEl.value ? parseInt(specDefaultMonthsEl.value) : null,
    default_interest: specDefaultInterestEl && specDefaultInterestEl.value ? parseFloat(specDefaultInterestEl.value) : null,
    fee_hanoi_hcm: specFeeHnHcmEl && specFeeHnHcmEl.value ? parseFloat(specFeeHnHcmEl.value) : null,
    fee_province: specFeeProvinceEl && specFeeProvinceEl.value ? parseFloat(specFeeProvinceEl.value) : null,
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
  showConfirm('Bạn có chắc chắn muốn xóa mẫu xe này?', async () => {
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
  });
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
    window.loadedDrives = data;
    const drives = data;

    // Cập nhật chỉ số KPI
    const kpiDrives = document.getElementById('kpi-total-drives');
    if (kpiDrives) kpiDrives.innerText = drives.length;
    const kpiPending = document.getElementById('kpi-pending-drives');
    if (kpiPending) {
      const pendingCount = drives.filter(d => d.status === 'Chờ liên hệ' || d.status === 'Đang xử lý' || d.status === 'Chờ xử lý').length;
      kpiPending.innerText = pendingCount;
    }

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
  showConfirm('Bạn chắc chắn muốn xóa yêu cầu báo giá này?', async () => {
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
  });
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

// Xử lý xem trước tên file ảnh banner khi chọn file
if (bannerImageInput) {
  bannerImageInput.addEventListener('change', function() {
    const file = this.files[0];
    const filenameSpan = document.getElementById('banner-image-filename');
    if (file) {
      if (filenameSpan) filenameSpan.textContent = file.name;
    } else {
      if (filenameSpan) filenameSpan.textContent = 'Chưa chọn tệp';
    }
  });
}

let isEditingBanner = false;

async function loadAdminBanners() {
  if (!adminBannerList) return;
  try {
    const response = await fetch('/api/banners');
    if (!response.ok) throw new Error('Không thể tải danh sách banner.');
    const banners = await response.json();
    window.loadedBanners = banners;

    // Cập nhật chỉ số KPI
    const kpiBanners = document.getElementById('kpi-total-banners');
    if (kpiBanners) kpiBanners.innerText = banners.length;

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

    const bannerFilename = document.getElementById('banner-image-filename');
    if (bannerFilename) bannerFilename.textContent = 'Chưa chọn tệp';

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
  
  const bannerFilename = document.getElementById('banner-image-filename');
  if (bannerFilename) {
    if (banner.image_url) {
      bannerFilename.textContent = banner.image_url.split('/').pop() || 'Đang sử dụng ảnh đã có';
    } else {
      bannerFilename.textContent = 'Chưa chọn tệp';
    }
  }

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
  showConfirm('Bạn có chắc chắn muốn xóa banner này?', async () => {
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
  });
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
    
    // Tải cấu hình Thẻ Giới Thiệu
    document.getElementById('setting-intro-title').value = settings.intro_title || 'VINFAST VIỆT NAM';
    document.getElementById('setting-intro-image').value = settings.intro_image || '/uploads/banner_eco.png';
    document.getElementById('setting-intro-benefits').value = settings.intro_benefits || 
      `Giá tốt nhất khi gọi Hotline\nKý hợp đồng và giao xe tận nhà\nHỗ trợ đăng ký xe mọi miền tổ quốc\nHỗ trợ vay lên đến 85%, lãi suất cực ưu đãi\nDuyệt vay trong ngày khi Quý khách bổ sung đủ hồ sơ, hỗ trợ hồ sơ nợ xấu\nThu mua xe cũ, đổi xe mới`;

    // Tải cấu hình Telegram
    document.getElementById('setting-telegram-token').value = settings.telegram_bot_token || '';
    document.getElementById('setting-telegram-chat-id-private').value = settings.telegram_chat_id_private || '';
    document.getElementById('setting-telegram-chat-id-group').value = settings.telegram_chat_id_group || '';
  } catch (error) {
    alert(error.message);
  }
}
window.loadAdminSettings = loadAdminSettings;

// Lắng nghe thay đổi chọn file ảnh thẻ giới thiệu
const introImageFileInput = document.getElementById('setting-intro-image-file');
if (introImageFileInput) {
  introImageFileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      document.getElementById('setting-intro-image').value = `[Tải lên file: ${file.name}]`;
    }
  });
}

const adminSettingsForm = document.getElementById('admin-settings-form');
if (adminSettingsForm) {
  adminSettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('showroom_name', document.getElementById('setting-showroom-name').value.trim());
    formData.append('contact_phone', document.getElementById('setting-contact-phone').value.trim());
    formData.append('contact_email', document.getElementById('setting-contact-email').value.trim());
    formData.append('contact_hours', document.getElementById('setting-contact-hours').value.trim());
    formData.append('contact_address', document.getElementById('setting-contact-address').value.trim());
    formData.append('zalo_link', document.getElementById('setting-zalo-link').value.trim());
    formData.append('messenger_link', document.getElementById('setting-messenger-link').value.trim());
    
    // Lưu cấu hình Thẻ Giới Thiệu
    formData.append('intro_title', document.getElementById('setting-intro-title').value.trim());
    formData.append('intro_benefits', document.getElementById('setting-intro-benefits').value.trim());

    // Lưu cấu hình Telegram
    formData.append('telegram_bot_token', document.getElementById('setting-telegram-token').value.trim());
    formData.append('telegram_chat_id_private', document.getElementById('setting-telegram-chat-id-private').value.trim());
    formData.append('telegram_chat_id_group', document.getElementById('setting-telegram-chat-id-group').value.trim());
    
    const introImageInput = document.getElementById('setting-intro-image');
    // Nếu text input không bắt đầu bằng "[Tải lên file: " thì mới gửi URL text
    if (!introImageInput.value.startsWith('[Tải lên file:')) {
      formData.append('intro_image', introImageInput.value.trim());
    }

    const fileInput = document.getElementById('setting-intro-image-file');
    if (fileInput && fileInput.files[0]) {
      formData.append('intro_image_file', fileInput.files[0]);
    }

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
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
      if (!response.ok) throw new Error(data.message || 'Lỗi khi lưu cấu hình.');

      alert('Đã lưu cấu hình hệ thống thành công!');
      if (fileInput) fileInput.value = ''; // Reset file input
      loadAdminSettings();
    } catch (error) {
      alert(error.message);
    }
  });
}

// Khởi tạo chạy ban đầu
checkAuth();

// --- Tính năng Xuất dữ liệu (Excel, CSV, PDF) cho Yêu Cầu Báo Giá & Lái Thử ---

// Toggle Dropdown
window.toggleExportDropdown = function() {
  const menu = document.getElementById('export-dropdown-menu');
  if (menu) {
    const isVisible = menu.style.display === 'block';
    menu.style.display = isVisible ? 'none' : 'block';
  }
};

// Đóng dropdown khi click ngoài
document.addEventListener('click', (e) => {
  const btn = document.getElementById('btn-export-dropdown');
  const menu = document.getElementById('export-dropdown-menu');
  if (btn && menu && !btn.contains(e.target) && !menu.contains(e.target)) {
    menu.style.display = 'none';
  }
});

// Trigger Export theo định dạng
window.triggerExport = function(format) {
  const drives = window.loadedDrives || [];
  if (drives.length === 0) {
    alert('Không có dữ liệu để xuất!');
    return;
  }

  // Ẩn menu dropdown sau khi click chọn
  const menu = document.getElementById('export-dropdown-menu');
  if (menu) menu.style.display = 'none';

  if (format === 'csv') {
    exportCSV(drives);
  } else if (format === 'excel') {
    exportExcel(drives);
  } else if (format === 'pdf') {
    exportPDF(drives);
  }
};

// 1. Xuất CSV (.csv)
function exportCSV(drives) {
  let csvContent = "\uFEFF"; // UTF-8 BOM chống lỗi font tiếng Việt trong Excel
  csvContent += "Mã yêu cầu,Họ và Tên,Số điện thoại,Email,Dòng xe quan tâm,Phân loại,Địa chỉ/Showroom,Ngày hẹn lái thử,Trạng thái,Ngày gửi\n";
  
  drives.forEach(d => {
    const typeStr = d.type === 'quote' ? 'Nhận Báo Giá' : 'Đăng Ký Lái Thử';
    const dateStr = d.preferred_date ? new Date(d.preferred_date).toLocaleDateString('vi-VN') : '';
    const createdStr = d.created_at ? new Date(d.created_at).toLocaleDateString('vi-VN') : '';
    
    let detailAddress = d.address || '';
    if (d.type !== 'quote') {
      const parts = [];
      if (d.showroom) parts.push(`Showroom: ${d.showroom}`);
      if (d.province) parts.push(`Tỉnh: ${d.province}`);
      if (d.address) parts.push(`ĐC: ${d.address}`);
      detailAddress = parts.join(' - ');
    }

    const row = [
      d.id,
      `"${d.fullname.replace(/"/g, '""')}"`,
      `"${d.phone}"`,
      `"${(d.email || '').replace(/"/g, '""')}"`,
      `"${(d.car_name || 'Chưa chọn').replace(/"/g, '""')}"`,
      `"${typeStr}"`,
      `"${detailAddress.replace(/"/g, '""')}"`,
      `"${dateStr}"`,
      `"${d.status}"`,
      `"${createdStr}"`
    ].join(',');
    
    csvContent += row + "\n";
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Danh_sach_Yeu_cau_Bao_gia_Lai_thu_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 2. Xuất Excel (.xlsx) qua SheetJS loaded dynamically
function exportExcel(drives) {
  if (typeof XLSX === 'undefined') {
    // Tải động thư viện SheetJS từ CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    script.onload = () => {
      doExportExcel(drives);
    };
    document.head.appendChild(script);
  } else {
    doExportExcel(drives);
  }
}

function doExportExcel(drives) {
  const data = drives.map(d => {
    let detailAddress = d.address || '';
    if (d.type !== 'quote') {
      const parts = [];
      if (d.showroom) parts.push(`Showroom: ${d.showroom}`);
      if (d.province) parts.push(`Tỉnh/Thành: ${d.province}`);
      if (d.address) parts.push(`ĐC: ${d.address}`);
      detailAddress = parts.join(' - ');
    }

    return {
      'Mã yêu cầu': d.id,
      'Họ và Tên': d.fullname,
      'Số điện thoại': d.phone,
      'Email': d.email || 'Chưa cung cấp',
      'Dòng xe quan tâm': d.car_name || 'Chưa chọn',
      'Phân loại': d.type === 'quote' ? 'Nhận Báo Giá' : 'Đăng Ký Lái Thử',
      'Địa chỉ/Showroom': detailAddress,
      'Ngày hẹn lái thử': d.preferred_date ? new Date(d.preferred_date).toLocaleDateString('vi-VN') : '',
      'Trạng thái': d.status,
      'Ngày gửi': d.created_at ? new Date(d.created_at).toLocaleDateString('vi-VN') : ''
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Yêu Cầu");
  
  // Tự động căn chỉnh độ rộng cột
  const maxProps = [];
  data.forEach(row => {
    Object.keys(row).forEach((key, colIndex) => {
      const val = row[key] ? row[key].toString() : '';
      if (!maxProps[colIndex] || val.length > maxProps[colIndex]) {
        maxProps[colIndex] = val.length;
      }
    });
  });
  worksheet['!cols'] = maxProps.map(w => ({ wch: Math.max(w + 4, 12) }));

  XLSX.writeFile(workbook, `Danh_sach_Yeu_cau_Bao_gia_Lai_thu_${new Date().toISOString().slice(0,10)}.xlsx`);
}

// 3. Xuất PDF (.pdf) hỗ trợ tiếng Việt hoàn hảo qua Print Window
function exportPDF(drives) {
  const printWindow = window.open('', '_blank');
  
  let tableRows = '';
  drives.forEach(d => {
    let detailAddress = d.address || '';
    if (d.type !== 'quote') {
      const parts = [];
      if (d.showroom) parts.push(`Showroom: ${d.showroom}`);
      if (d.province) parts.push(`Tỉnh/Thành: ${d.province}`);
      if (d.address) parts.push(`ĐC: ${d.address}`);
      detailAddress = parts.join(' - ');
    }

    tableRows += `
      <tr>
        <td>${d.id}</td>
        <td><strong>${d.fullname}</strong></td>
        <td>${d.phone}</td>
        <td>${d.email || 'Chưa cung cấp'}</td>
        <td>${d.car_name || 'Chưa chọn'}</td>
        <td><span class="badge ${d.type}">${d.type === 'quote' ? 'Nhận Báo Giá' : 'Đăng Ký Lái Thử'}</span></td>
        <td>${detailAddress}</td>
        <td>${d.preferred_date ? new Date(d.preferred_date).toLocaleDateString('vi-VN') : ''}</td>
        <td>${d.status}</td>
        <td>${d.created_at ? new Date(d.created_at).toLocaleDateString('vi-VN') : ''}</td>
      </tr>
    `;
  });

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Báo Cáo Yêu Cầu Báo Giá & Lái Thử - VinFast</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 20px; color: #2c3e50; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0f53c5; padding-bottom: 15px; }
        .header h1 { margin: 0; color: #0f53c5; font-size: 24px; text-transform: uppercase; }
        .header p { margin: 5px 0 0; font-size: 14px; color: #7f8c8d; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
        th, td { border: 1px solid #bdc3c7; padding: 8px 10px; text-align: left; }
        th { background-color: #f2f2f2; color: #34495e; font-weight: 700; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .badge { display: inline-block; padding: 3px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; }
        .badge.quote { background-color: #ebf3fc; color: #0f53c5; border: 1px solid #d0e1f9; }
        .badge.drive { background-color: #eafaf1; color: #2ecc71; border: 1px solid #d4f5e3; }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Báo Cáo Yêu Cầu Báo Giá & Lái Thử</h1>
        <p>Ngày xuất bản: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Họ và Tên</th>
            <th>Điện thoại</th>
            <th>Email</th>
            <th>Xe quan tâm</th>
            <th>Phân loại</th>
            <th>Địa chỉ / Showroom</th>
            <th>Ngày hẹn</th>
            <th>Trạng thái</th>
            <th>Ngày gửi</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
