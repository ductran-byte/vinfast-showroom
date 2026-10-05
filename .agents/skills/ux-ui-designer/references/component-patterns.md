# Component Patterns & Blueprints

Tập hợp mẫu thành phần (UI Components) chuẩn hoá cho hệ sinh thái VinFast Showroom & Admin Dashboard.

---

## 1. Thẻ Xe Điện Thông Minh (EV Car Card Pattern)

```html
<div class="ev-card" data-car-id="vf7">
  <!-- Top Badges -->
  <div class="ev-card-badges">
    <span class="badge-tag badge-ev"><i class="fa-solid fa-bolt"></i> EV 100%</span>
    <span class="badge-tag badge-range">450 km / sạc</span>
  </div>

  <!-- Car Visual -->
  <div class="ev-card-image">
    <img src="/uploads/vf7.png" alt="VinFast VF 7" loading="lazy">
    <div class="ev-card-glow"></div>
  </div>

  <!-- Content -->
  <div class="ev-card-content">
    <div class="ev-card-header">
      <h3 class="car-name">VinFast VF 7</h3>
      <span class="car-segment">C-SUV Đẳng Cấp</span>
    </div>

    <!-- Quick Specs Grid -->
    <div class="car-specs-grid">
      <div class="spec-item">
        <span class="spec-label">Công suất</span>
        <span class="spec-val">349 hp</span>
      </div>
      <div class="spec-item">
        <span class="spec-label">Tăng tốc 0-100</span>
        <span class="spec-val">5.8 s</span>
      </div>
      <div class="spec-item">
        <span class="spec-label">Dẫn động</span>
        <span class="spec-val">AWD 2 Cầu</span>
      </div>
    </div>

    <!-- Pricing & Actions -->
    <div class="ev-card-footer">
      <div class="price-box">
        <span class="price-label">Giá từ</span>
        <span class="price-amount">850.000.000 ₫</span>
      </div>
      <div class="action-btns">
        <a href="/car.html?id=vf7" class="btn-detail">Chi Tiết</a>
        <button onclick="openTestDriveModal('VF 7')" class="btn-primary-sm">Lái Thử</button>
      </div>
    </div>
  </div>
</div>
```

---

## 2. Bộ Chọn Màu Xe Đổi Trực Quan (Interactive Color Swatches)

```html
<div class="color-picker-group">
  <div class="color-picker-header">
    <span class="picker-label">Màu ngoại thất:</span>
    <span class="picker-current-name" id="current-color-name">Xanh VinFast Blue</span>
  </div>

  <div class="color-swatches" role="radiogroup" aria-label="Chọn màu xe">
    <button class="swatch-btn active" data-color="blue" data-name="Xanh VinFast Blue" style="--swatch-color: #1464F4;" aria-label="Xanh VinFast Blue"></button>
    <button class="swatch-btn" data-color="white" data-name="Trắng Brahminy White" style="--swatch-color: #F8FAFC; border: 1px solid #CBD5E1;" aria-label="Trắng"></button>
    <button class="swatch-btn" data-color="black" data-name="Đen Jet Black" style="--swatch-color: #0F172A;" aria-label="Đen"></button>
    <button class="swatch-btn" data-color="crimson" data-name="Đỏ Crimson Red" style="--swatch-color: #DC2626;" aria-label="Đỏ"></button>
    <button class="swatch-btn" data-color="silver" data-name="Bạc Desat Silver" style="--swatch-color: #94A3B8;" aria-label="Bạc"></button>
  </div>
</div>
```

---

## 3. Biểu Mẫu Đăng Ký Lái Thử Chuẩn UX (High-Converting Form)

* **Nguyên tắc**: Tối thiểu số trường nhập để giảm độ ma sát (Friction).
* **Trường bắt buộc**:
  1. Họ và tên (`Họ tên người lái`)
  2. Số điện thoại di động (Auto format `09xx xxx xxx`)
  3. Dòng xe muốn trải nghiệm (Select dropdown có hình ảnh xe thu nhỏ)
  4. Địa điểm Showroom / Tỉnh thành
  5. Ngày & Khung giờ mong muốn

---

## 4. Bảng Quản Trị KPI & Data Table (Admin UX Patterns)

### 4.1. Thẻ Thống Kê Nhanh (Metric Stat Cards)
```html
<div class="stat-card">
  <div class="stat-icon-wrapper bg-blue-light">
    <i class="fa-solid fa-car-side text-blue"></i>
  </div>
  <div class="stat-info">
    <span class="stat-title">Lượt Đăng Ký Lái Thử</span>
    <h3 class="stat-value">128 <span class="stat-trend positive">+14%</span></h3>
    <span class="stat-desc">Tính trong 30 ngày qua</span>
  </div>
</div>
```

### 4.2. Bảng Dữ Liệu (Modern Table Pattern)
* Hàng lẻ hàng chẵn xen kẽ hoặc hover highlight êm dịu.
* Nhãn trạng thái rõ ràng:
  * `<span class="badge-status status-pending">Chờ xác nhận</span>`
  * `<span class="badge-status status-confirmed">Đã duyệt</span>`
  * `<span class="badge-status status-completed">Đã hoàn thành</span>`
  * `<span class="badge-status status-cancelled">Đã hủy</span>`
* Thao tác dòng: Nút Xem, Sửa, Xóa có Tooltip và Xác nhận trước khi xóa.
