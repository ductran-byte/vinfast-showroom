# Responsive Design & Accessibility (WCAG 2.1 AA)

Quy chuẩn tối ưu hóa trải nghiệm trên mọi thiết bị và đảm bảo khả năng tiếp cận cao nhất cho VinFast Showroom.

---

## 1. Hệ Thống Điểm Ngắt (Responsive Breakpoints)

| Ký hiệu | Độ rộng màn hình | Thiết bị mục tiêu | Hành vi Layout |
| :--- | :--- | :--- | :--- |
| `xs` / `sm` | `< 640px` | Điện thoại di động (iPhone, Samsung) | 1 cột, Menu Drawer/Hamburger, Sticky Bottom CTA |
| `md` | `640px - 1024px` | Máy tính bảng (iPad, Galaxy Tab) | 2 cột sản phẩm, bảng so sánh cuộn ngang mượt |
| `lg` | `1024px - 1280px`| Laptop thông thường | 3 cột xe, thanh điều hướng đầy đủ |
| `xl` / `2xl`| `> 1280px` | Màn hình máy bàn, iMac Retina | Container giới hạn 1280px - 1440px căn giữa |

---

## 2. Thiết Kế Công Thái Học Cho Ngón Tay (Touch Ergonomics)
* **Khu vực chạm tối thiểu (Touch Target)**:
  * Tất cả nút bấm, link điều hướng, icon đóng mở phải có kích thước tối thiểu `44px x 44px`.
  * Khoảng cách giữa hai nút liền kề tối thiểu `8px` để tránh bấm nhầm.
* **Vùng ngón cái (Thumb Zone)**:
  * Đặt các nút quan trọng nhất ("Đăng ký lái thử", "Gọi tư vấn") ở cạnh dưới màn hình trên mobile thông qua thanh `sticky-bottom-bar`.

---

## 3. Khả Năng Tiếp Cận (WCAG 2.1 Level AA)

1. **Độ tương phản màu sắc (Contrast Ratio)**:
   * Chữ thông thường: Độ tương phản giữa chữ và nền tối thiểu `4.5 : 1`.
   * Chữ lớn (>= 18px bold hoặc 24px regular): Tối thiểu `3.0 : 1`.
   * Các icon chỉ báo và viền input form: Tối thiểu `3.0 : 1`.
2. **Khả năng điều hướng bằng bàn phím (Keyboard Accessibility)**:
   * Phím `Tab` phải di chuyển tuần tự qua các phần tử tương tác một cách logic.
   * Focus Ring rõ nét:
     ```css
     :focus-visible {
       outline: 2px solid var(--color-primary);
       outline-offset: 3px;
     }
     ```
   * Phím `ESC` phải đóng được mọi Modal đang mở.
3. **Thẻ ngữ nghĩa & ARIA**:
   * Ảnh xe phải có `alt` mô tả (ví dụ: `alt="VinFast VF 8 màu đỏ Crimson Red"`).
   * Nút icon phải có `aria-label` (ví dụ: `aria-label="Đóng bảng đăng ký"`).

---

## 4. Tôn Trọng Sở Thích Người Dùng (User Preferences)

```css
/* Tắt animation nếu người dùng bật chế độ giảm chuyển động trên thiết bị */
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
