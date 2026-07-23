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
    showNotification('Không tìm thấy mã dòng xe.', false);
    window.location.href = '/';
    return;
  }

  try {
    const response = await fetch(`/api/cars/${carId}`);
    if (!response.ok) throw new Error('Không thể tải chi tiết dòng xe.');
    currentCar = await response.json();

    // Hydrate Basic Info
    document.getElementById('page-title').innerText = `${currentCar.name} - Thông số kỹ thuật & Bảng giá lăn bánh`;
    document.getElementById('detail-name').innerText = currentCar.name;
    document.getElementById('detail-img').src = currentCar.image_url;

    // Hydrate Detailed Description (Quill HTML)
    const descContainer = document.getElementById('detail-description');
    if (descContainer) {
      if (currentCar.description && currentCar.description !== '<p><br></p>') {
        descContainer.innerHTML = currentCar.description;
        document.getElementById('introduction-section').style.display = 'block';
      } else {
        descContainer.innerHTML = '';
        document.getElementById('introduction-section').style.display = 'none';
      }
    }

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
    const safetyEl = document.getElementById('spec-safety');
    if (safetyEl) {
      const safetyRaw = specs.safety || 'Hệ thống phanh ABS, EBD, Cân bằng điện tử';
      const items = safetyRaw.split(/\r?\n|,/).map(s => s.trim()).filter(Boolean);
      if (items.length > 1) {
        safetyEl.innerHTML = items.map(item => `<div style="line-height: 1.6; margin-bottom: 4px; display: flex; align-items: flex-start; gap: 6px;"><span style="color: var(--accent-color); font-weight: 700;">•</span><span>${item}</span></div>`).join('');
      } else if (items.length === 1) {
        safetyEl.innerText = items[0];
      } else {
        safetyEl.innerText = 'Đang cập nhật';
      }
    }

    // Build Visualizer Color Dots (Basic vs Premium)
    const basicContainer = document.getElementById('detail-color-dots-basic');
    const premiumContainer = document.getElementById('detail-color-dots-premium');
    if (basicContainer && premiumContainer) {
      basicContainer.innerHTML = '';
      premiumContainer.innerHTML = '';

      const colors = specs.colors || [
        { name: 'Màu tiêu chuẩn', hex: '#0f53c5', image_url: currentCar.image_url, type: 'basic' }
      ];

      document.getElementById('selected-color-name').innerText = colors[0].name;

      let hasPremium = false;

      colors.forEach((color, index) => {
        const isPremium = color.type === 'premium' || (color.name && color.name.includes('/ Nóc')) || (color.name && color.name.toLowerCase().includes('nâng cao'));
        
        const dot = document.createElement('div');
        dot.className = `${isPremium ? 'color-dot-premium' : 'color-dot-new'} ${index === 0 ? 'active' : ''}`;
        
        // Use background for gradients, otherwise backgroundColor
        if (color.hex.startsWith('linear-gradient') || color.hex.startsWith('radial-gradient')) {
          dot.style.background = color.hex;
        } else {
          dot.style.backgroundColor = color.hex;
        }
        
        dot.title = color.name;
        dot.onclick = function() {
          document.querySelectorAll('.color-dot-new, .color-dot-premium').forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
          document.getElementById('detail-img').src = color.image_url;
          document.getElementById('selected-color-name').innerText = color.name;
        };

        if (isPremium) {
          hasPremium = true;
          premiumContainer.appendChild(dot);
        } else {
          basicContainer.appendChild(dot);
        }
      });

      // Show/Hide premium headers depending on availability
      const premiumHeader = document.querySelector('.color-section-title:nth-of-type(2)');
      const premiumDivider = document.getElementById('color-premium-divider');
      if (!hasPremium) {
        if (premiumHeader) premiumHeader.style.display = 'none';
        if (premiumDivider) premiumDivider.style.display = 'none';
        if (premiumContainer) premiumContainer.style.display = 'none';
      } else {
        if (premiumHeader) premiumHeader.style.display = 'block';
        if (premiumDivider) premiumDivider.style.display = 'block';
        if (premiumContainer) premiumContainer.style.display = 'flex';
      }
    }

    // Render Version Pricing Table
    const versionsBody = document.getElementById('detail-versions-body');
    if (versionsBody) {
      versionsBody.innerHTML = '';

      const versions = specs.versions || [
        { name: `${currentCar.name} Tiêu Chuẩn`, base_price: parseFloat(currentCar.price), promo_price: parseFloat(currentCar.price) * 0.95 }
      ];

      versions.forEach(v => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="version-name">${v.name}</td>
          <td class="base-price">${formatVND(v.base_price)}</td>
          <td class="promo-price">${formatVND(v.promo_price)}</td>
        `;
        versionsBody.appendChild(tr);
      });
    }

    // Update promotion title
    const promoTitle = document.getElementById('promo-car-title');
    if (promoTitle) {
      // Avoid duplication if the car name already contains 'VinFast'
      const upperName = currentCar.name.toUpperCase();
      if (upperName.startsWith('VINFAST')) {
        promoTitle.innerText = `🎁 ƯU ĐÃI ${upperName} ALL NEW MỚI NHẤT:`;
      } else {
        promoTitle.innerText = `🎁 ƯU ĐÃI VINFAST ${upperName} ALL NEW MỚI NHẤT:`;
      }
    }

    // Render dynamic promotions list
    const promoItemsContainer = document.getElementById('promo-list-items');
    if (promoItemsContainer) {
      const promotions = currentCar.promotions || [];
      if (promotions.length > 0) {
        promoItemsContainer.innerHTML = promotions.map(p => `
          <div class="promo-item" style="display: flex; align-items: flex-start; gap: 8px; padding: 8px 0; border-bottom: 1px dashed rgba(15, 83, 197, 0.15); font-size: 13px; font-weight: 500; color: #1e272e;">
            <span style="color: #a90303;">🎁</span>
            <span>${p}</span>
          </div>
        `).join('');
      } else {
        promoItemsContainer.innerHTML = `
          <div style="font-size: 13px; color: var(--text-muted); text-align: center; padding: 20px 0;">
            Chưa có thông tin chương trình khuyến mãi.
          </div>
        `;
      }
    }

    // Render price note
    const detailPriceNote = document.getElementById('detail-price-note');
    if (detailPriceNote) {
      if (specs.price_note) {
        detailPriceNote.innerText = specs.price_note;
        detailPriceNote.className = 'detail-price-note-highlight';
        detailPriceNote.style.display = 'inline-block';
      } else {
        detailPriceNote.innerText = '';
        detailPriceNote.className = '';
        detailPriceNote.style.display = 'none';
      }
    }

    // Populate Test Drive Model Name
    document.getElementById('td-car-name-display').value = currentCar.name;

    // Load User Header Profile (if logged in)
    checkUserLogin();

    // Init Calculator Labels & Logic
    initCalculator();

    // Init Location Selects
    initLocations();

    // Load dynamic settings (Hotline phone numbers, Zalo, Messenger links)
    loadSystemSettings();

    // Hide page loader once loaded
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 400);
    }

  } catch (err) {
    console.error('Error hydrating page details:', err);
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.remove();
    }
    showNotification('Có lỗi xảy ra khi tải dữ liệu dòng xe.', false);
    window.location.href = '/';
  }
}

// Function to load dynamic contact settings from settings table
async function loadSystemSettings() {
  try {
    const response = await fetch('/api/settings');
    let settings = {};
    if (response.ok) {
      settings = await response.json();
    }

    // Resolve contact phone (car-specific or fallback to global settings)
    let phone = '0964.269.988';
    if (currentCar && currentCar.specifications && currentCar.specifications.contact_phone) {
      phone = currentCar.specifications.contact_phone;
    } else if (settings.contact_phone) {
      phone = settings.contact_phone;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    
    // Update promo hotline buttons
    const promoPhoneBtn = document.getElementById('promo-phone-btn');
    if (promoPhoneBtn) {
      promoPhoneBtn.innerText = `📞 ${phone}`;
      promoPhoneBtn.href = `tel:${cleanPhone}`;
    }
    const vinfastPhoneBtn = document.getElementById('vinfast-phone-btn');
    if (vinfastPhoneBtn) {
      vinfastPhoneBtn.innerText = `📞 ${phone}`;
      vinfastPhoneBtn.href = `tel:${cleanPhone}`;
    }
    
    // Update floating contact buttons
    const floatingPhone = document.querySelector('.floating-contact .phone');
    if (floatingPhone) {
      floatingPhone.href = `tel:${cleanPhone}`;
      floatingPhone.title = `Hotline gọi hỗ trợ (${phone})`;
    }
    const floatingZalo = document.querySelector('.floating-contact .zalo');
    if (floatingZalo && settings.zalo_link) {
      floatingZalo.href = settings.zalo_link;
    }
    const floatingMessenger = document.querySelector('.floating-contact .messenger');
    if (floatingMessenger && settings.messenger_link) {
      floatingMessenger.href = settings.messenger_link;
    }

    // Cập nhật động Thẻ Giới Thiệu (VINFAST VIỆT NAM)
    const cardTitleEl = document.getElementById('vinfast-card-title');
    if (cardTitleEl && settings.intro_title) {
      cardTitleEl.innerText = settings.intro_title;
    }
    
    const cardImageEl = document.getElementById('vinfast-card-image');
    if (cardImageEl && settings.intro_image) {
      cardImageEl.src = settings.intro_image;
    }

    const cardListEl = document.getElementById('vinfast-card-list');
    if (cardListEl && settings.intro_benefits) {
      const benefits = settings.intro_benefits.split('\n').map(item => item.trim()).filter(item => item.length > 0);
      if (benefits.length > 0) {
        cardListEl.innerHTML = benefits.map(b => `
          <li style="display: flex; align-items: flex-start; gap: 8px; font-size: 13px; line-height: 1.4;">
            <span style="color: #ffdd59;">•</span>
            <span>${b}</span>
          </li>
        `).join('');
      }
    }
  } catch (err) {
    console.error('Lỗi khi tải cấu hình hệ thống:', err);
  }
}

// CTA Trigger Functions & Quote Modal Logic
let allCarsList = null;

async function populateQuoteCarSelect() {
  const selectEl = document.getElementById('quote-car-select');
  if (!selectEl) return;
  
  if (!allCarsList) {
    try {
      const response = await fetch('/api/cars');
      if (response.ok) {
        allCarsList = await response.json();
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách xe cho báo giá:', err);
    }
  }
  
  if (allCarsList) {
    selectEl.innerHTML = '<option value="">-- Chọn dòng xe --</option>' +
      allCarsList.map(car => `<option value="${car.id}">${car.name}</option>`).join('');
  }
}

async function openQuoteModal() {
  const modal = document.getElementById('quote-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Load cars list and auto-select current car
    await populateQuoteCarSelect();
    const selectEl = document.getElementById('quote-car-select');
    if (selectEl && currentCar) {
      selectEl.value = currentCar.id;
    }
    
    // Autofill user profile if logged in
    const profileStr = localStorage.getItem('userProfile');
    const quoteName = document.getElementById('quote-name');
    const quotePhone = document.getElementById('quote-phone');
    if (profileStr) {
      const profile = JSON.parse(profileStr);
      if (quoteName) {
        quoteName.value = profile.fullname || '';
        quoteName.readOnly = true;
      }
      if (quotePhone) {
        quotePhone.value = profile.phone || '';
        quotePhone.readOnly = true;
      }
    } else {
      if (quoteName) {
        quoteName.value = '';
        quoteName.readOnly = false;
      }
      if (quotePhone) {
        quotePhone.value = '';
        quotePhone.readOnly = false;
      }
    }
  }
}

function closeQuoteModal() {
  const modal = document.getElementById('quote-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function triggerGiftCta() {
  openQuoteModal();
}

function triggerQuoteCta() {
  openQuoteModal();
}

// Close and submit event handlers for quote modal
document.addEventListener('click', (e) => {
  const closeBtn = e.target.closest('#quote-modal-close');
  const modal = document.getElementById('quote-modal');
  if (closeBtn && modal) {
    closeQuoteModal();
  }
  if (e.target === modal) {
    closeQuoteModal();
  }
});

const quoteForm = document.getElementById('quote-form');
if (quoteForm) {
  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const car_id = document.getElementById('quote-car-select').value;
    const fullname = document.getElementById('quote-name').value.trim();
    const phone = document.getElementById('quote-phone').value.trim();
    const address = document.getElementById('quote-address').value.trim();
    
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
      
      showNotification(data.message || 'Gửi yêu cầu báo giá thành công! Chúng tôi sẽ liên hệ bạn sớm.', true);
      quoteForm.reset();
      closeQuoteModal();
    } catch (error) {
      showNotification(error.message, false);
    }
  });
}

// Expose to window scope
window.triggerGiftCta = triggerGiftCta;
window.triggerQuoteCta = triggerQuoteCta;

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

  if (!selectBatteryOpt || !currentCar) return;

  const specs = currentCar.specifications || {};

  // Hydrate custom battery options if provided for this car
  const batOptRaw = specs.battery_options;
  if (batOptRaw && typeof batOptRaw === 'string' && batOptRaw.trim()) {
    selectBatteryOpt.innerHTML = '';
    const lines = batOptRaw.split('\n').map(l => l.trim()).filter(Boolean);
    lines.forEach(line => {
      const parts = line.split('|');
      const name = parts[0].trim();
      const priceDiff = parts[1] ? parseFloat(parts[1].trim()) || 0 : 0;
      const opt = document.createElement('option');
      opt.value = priceDiff;
      opt.dataset.price = priceDiff;
      opt.textContent = name;
      selectBatteryOpt.appendChild(opt);
    });
  } else {
    // Default 2 options based on segment
    let defaultBuyPrice = 110000000;
    const seg = currentCar.segment;
    if (seg === 'Mini' || seg === 'A') defaultBuyPrice = 80000000;
    else if (seg === 'B' || seg === 'C') defaultBuyPrice = 110000000;
    else defaultBuyPrice = 150000000;

    selectBatteryOpt.innerHTML = `
      <option value="0" data-price="0">Thuê Pin (Giá mua xe rẻ hơn)</option>
      <option value="${defaultBuyPrice}" data-price="${defaultBuyPrice}">Mua Đứt Pin (Trọn gói kèm xe)</option>
    `;
  }

  // Hydrate default slider values if configured
  if (sliderPrepay && specs.default_prepay) {
    sliderPrepay.value = specs.default_prepay;
  }
  if (sliderMonths && specs.default_months) {
    sliderMonths.value = specs.default_months;
  }
  if (sliderInterest && specs.default_interest) {
    sliderInterest.value = specs.default_interest;
  }

  function updateLabels() {
    if (lblPrepay && sliderPrepay) lblPrepay.innerText = `${sliderPrepay.value}%`;
    if (lblMonths && sliderMonths) lblMonths.innerText = `${sliderMonths.value} tháng (${sliderMonths.value / 12} năm)`;
    if (lblInterest && sliderInterest) lblInterest.innerText = `${sliderInterest.value}%`;
  }

  function calculate() {
    if (!currentCar) return;

    const basePrice = parseFloat(currentCar.price);
    
    // Battery addition price from selected option
    let batteryPrice = 0;
    if (selectBatteryOpt && selectBatteryOpt.options.length > 0) {
      const selectedOpt = selectBatteryOpt.options[selectBatteryOpt.selectedIndex];
      if (selectedOpt) {
        batteryPrice = parseFloat(selectedOpt.dataset.price || selectedOpt.value) || 0;
      }
    }

    const carPrice = basePrice + batteryPrice;

    // Rolling fees estimation in Vietnam (Registration fee = 0%)
    const plateFee = 20000000;
    const registrationInspection = 340000;
    const roadMaintenanceFee = 1560000;
    const insuranceMandatory = 480000;
    const rollingFees = plateFee + registrationInspection + roadMaintenanceFee + insuranceMandatory;

    const rollingPrice = carPrice + rollingFees;

    // Prepayment amount
    const prepayPercent = parseInt(sliderPrepay.value) / 100;
    const prepayAmount = carPrice * prepayPercent + rollingFees;
    
    // Loan amount
    const loanAmount = carPrice * (1 - prepayPercent);

    // Monthly payment calculation
    const months = parseInt(sliderMonths.value);
    const yearlyInterest = parseFloat(sliderInterest.value) / 100;
    const monthlyInterest = yearlyInterest / 12;

    const monthlyPrincipal = loanAmount / months;
    const monthlyInterestPayment = loanAmount * monthlyInterest;
    const totalFirstMonth = monthlyPrincipal + monthlyInterestPayment;

    // Render results
    const elRolling = document.getElementById('calc-rolling-price');
    const elPrepay = document.getElementById('calc-prepay-amount');
    const elLoan = document.getElementById('calc-loan-amount');
    const elMonthly = document.getElementById('calc-monthly-payment');

    if (elRolling) elRolling.innerText = formatVND(rollingPrice);
    if (elPrepay) elPrepay.innerText = `${formatVND(prepayAmount)} (${sliderPrepay.value}%)`;
    if (elLoan) elLoan.innerText = formatVND(loanAmount);
    if (elMonthly) elMonthly.innerText = formatVND(totalFirstMonth);
  }

  // Bind Listeners
  [selectBatteryOpt, sliderPrepay, sliderMonths, sliderInterest].forEach(el => {
    if (!el) return;
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
  const tdForm = document.getElementById('detail-test-drive-form');
  const statusMsg = document.getElementById('td-status-msg');

  if (!tdForm) return;

  // Submit test drive form
  tdForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!currentCar) return;

    const fullname = document.getElementById('td-name').value.trim();
    const phone = document.getElementById('td-phone').value.trim();
    const address = document.getElementById('td-address').value.trim();
    const preferred_date = document.getElementById('td-date').value;

    const requestBody = {
      car_id: currentCar.id,
      fullname: fullname,
      phone: phone,
      address: address,
      preferred_date: preferred_date,
      type: 'drive'
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
        showNotification(data.message || 'Đăng ký lái thử thành công! Chúng tôi sẽ sớm liên hệ lại.', true);
        tdForm.reset();
      } else {
        throw new Error(data.message || 'Lỗi khi gửi yêu cầu đăng ký.');
      }
    } catch (err) {
      statusMsg.style.background = 'rgba(239, 68, 68, 0.15)';
      statusMsg.style.color = '#b91c1c';
      statusMsg.innerText = err.message || 'Lỗi kết nối mạng.';
      showNotification(err.message || 'Lỗi kết nối mạng.', false);
    }
  });
}

// Run on page load
document.addEventListener('DOMContentLoaded', initCarDetailPage);

// --- Logic Đăng Nhập / Đăng Ký Khách Hàng (Car Detail Page) ---

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
    if (loginBtn) loginBtn.classList.add('btn-primary');
    if (registerBtn) registerBtn.classList.remove('btn-primary');
    if (loginContent) loginContent.style.display = 'block';
    if (registerContent) registerContent.style.display = 'none';
  } else {
    if (loginBtn) loginBtn.classList.remove('btn-primary');
    if (registerBtn) registerBtn.classList.add('btn-primary');
    if (loginContent) loginContent.style.display = 'none';
    if (registerContent) registerContent.style.display = 'block';
  }
}
window.switchAuthTab = switchAuthTab;

// Gửi Form Đăng Nhập
const userLoginForm = document.getElementById('user-login-form');
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
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', data.admin.username);
        showAuthMsg('Đăng nhập Quản Trị thành công! Đang chuyển hướng...', true);
        setTimeout(() => {
          window.location.href = '/admin.html';
        }, 800);
        return;
      }

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

// Gửi Form Đăng Ký
const userRegisterForm = document.getElementById('user-register-form');
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
  } else {
    if (btnLoginTrigger) btnLoginTrigger.style.display = 'inline-flex';
    if (userHeaderProfile) userHeaderProfile.style.display = 'none';
    
    if (tdName) {
      tdName.value = '';
      tdName.readOnly = false;
    }
    if (tdPhone) {
      tdPhone.value = '';
      tdPhone.readOnly = false;
    }
  }
}

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

// Kiểm tra phiên đăng nhập khi tải trang
checkUserSession();
