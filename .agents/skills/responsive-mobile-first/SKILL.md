---
name: responsive-mobile-first
description: >-
  Specialized skill for mobile-first frontend design, touch ergonomics, fluid typography,
  and responsive layouts for smartphones and tablets. Use this skill when optimizing pages
  for mobile, fixing horizontal scrolling, creating mobile menus, or designing mobile CTA bars.
---

# Responsive & Mobile-First Frontend Skill

Skill chuyên biệt về tối ưu hóa hiển thị, công thái học ngón tay cái (Thumb-zone UX) và hiệu năng trên thiết bị di động (iPhone, iPad, Android).

---

## Các Tình Huống Kích Hoạt
* Khi giao diện trên điện thoại bị vỡ, tràn viền hoặc xuất hiện thanh cuộn ngang khó chịu.
* Khi thiết kế Menu Mobile (Drawer / Hamburger / Bottom Navigation).
* Khi tối ưu hóa bảng thông số kỹ thuật xe để xem mượt trên màn hình dọc 375px - 414px.
* Khi thêm thanh Sticky Bottom CTA bar (Đăng ký lái thử, Gọi ngay) cho khách hàng lướt web trên di động.

---

## 4 Nguyên Tắc Cốt Lõi Cho Mobile UX

### 1. Vùng Chạm Tối Thiểu 44x44px (Touch Ergonomics)
Mọi phần tử bấm được (nút, icon, liên kết) phải đảm bảo:
```css
.clickable-item {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation; /* Tắt độ trễ 300ms double-tap */
}
```

### 2. Triệt Tiêu Thanh Cuộn Ngang (Zero Horizontal Overflow)
Bảo vệ toàn trang không bị giật ngang:
```css
html, body {
  max-width: 100%;
  overflow-x: hidden;
}

/* Ảnh tự co giãn */
img, svg, video {
  max-width: 100%;
  height: auto;
}
```

### 3. Thanh Chuyển Đổi Nhanh Đáy Màn Hình (Mobile Sticky CTA)
Trên di động, nút chuyển đổi cao nhất là thanh bám đáy:
```html
<div class="mobile-sticky-action-bar">
  <a href="tel:1900232389" class="btn-call-hotline" aria-label="Gọi hotline">
    <i class="fa-solid fa-phone"></i>
  </a>
  <button onclick="openTestDriveModal()" class="btn-mobile-primary">
    <i class="fa-solid fa-calendar-check"></i> Đăng Ký Lái Thử
  </button>
</div>
```

```css
@media (max-width: 768px) {
  .mobile-sticky-action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(16px);
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
    z-index: 1050;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }
}
```

### 4. Bảng So Sánh Thông Số Dạng Thẻ Trên Mobile
Thay vì ép người dùng cuộn một bảng ngang dài ngoằng, hãy chuyển bảng thành các thẻ Accordion gập mở hoặc thẻ so sánh từng dòng xe trực quan.
