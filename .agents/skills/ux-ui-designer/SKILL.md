---
name: ux-ui-designer
description: >-
  Comprehensive UX/UI design skill for high-converting, visually stunning, and accessible web experiences.
  Use this skill whenever designing, reviewing, creating, or refactoring UI components, layouts, design systems,
  CSS styles, animations, responsive design, or user journeys for the VinFast showroom and admin dashboards.
---

# UX/UI Designer Master Skill

Skill chuyên sâu về thiết kế giao diện (UI) và trải nghiệm người dùng (UX) cho hệ thống **VinFast Showroom & Admin Dashboard**. Trang bị cho agent khả năng thẩm mỹ vượt trội, kiến trúc thiết kế hệ thống (Design System) chuẩn quốc tế, và năng lực tối ưu tỷ lệ chuyển đổi (CRO) cho ngành xe điện cao cấp.

---

## Khi Nào Kích Hoạt Skill Này?
* Khi người dùng yêu cầu làm đẹp giao diện, thiết kế trang mới, chỉnh sửa CSS/HTML/JS frontend.
* Khi thêm mới hoặc cải tiến các tính năng: Xem chi tiết xe, chọn màu xe (Color Swatches), 360-degree viewer, so sánh thông số kỹ thuật xe, biểu mẫu đăng ký lái thử, bảng tính trả góp tài chính (Loan/Installment Calculator).
* Khi nâng cấp Dashboard quản trị (Admin UI): Bảng dữ liệu, thẻ thống kê KPI, biểu đồ doanh số/lượt lái thử, quản lý xe & banner.
* Khi tối ưu hóa hiển thị trên di động (Mobile First), sửa lỗi tràn màn hình, giật lag animation hoặc cải thiện khả năng tiếp cận (Accessibility - WCAG 2.1).

---

## Quy Trình 5 Bước Chuẩn Thực Hiện UX/UI

```
[1. Phân Tích & Persona] ➔ [2. Design Tokens] ➔ [3. Component & Layout] ➔ [4. Micro-Interactions] ➔ [5. Kiểm Tra & Audit]
```

### Bước 1: Thấu Hiểu Người Dùng & Hành Trình Trải Nghiệm (User Journey)
1. **Khách hàng mua xe điện VinFast (Showroom)**:
   * **Mục tiêu**: Muốn nhìn ngắm xe một cách chân thực (ngoại thất, nội thất, màu sắc 3D), hiểu ngay các thông số cốt lõi (quãng đường 1 lần sạc, công suất, số chỗ, thời gian sạc nhanh), biết giá lăn bánh dự tính và đặt lịch lái thử nhanh nhất.
   * **Điểm chạm quan trọng (Key Touchpoints)**:
     - Hero Section truyền cảm hứng (Headline cuốn hút, video hoặc ảnh xe độ phân giải cao).
     - Bộ lọc tìm kiếm nhanh theo phân khúc (VF 3 mini, VF 5 đô thị, VF 6/7 Crossover, VF 8/9 SUV hạng sang).
     - Thẻ sản phẩm với huy hiệu pin & số km rõ nét.
     - Trang chi tiết xe trực quan: Đổi màu xe mượt mà, thông số kỹ thuật dạng bảng so sánh dễ hiểu.
     - Form đăng ký lái thử: Tối đa 4-5 trường, hỗ trợ chọn showroom gần nhất qua địa chỉ.
2. **Quản trị viên (Admin Showroom)**:
   * Cần bảng điều khiển gọn gàng, trạng thái đơn hàng/lịch lái thử phân màu trực quan (`Badge: Chờ xác nhận, Đã liên hệ, Đã lái thử`).
   * Tác vụ nhanh: 1-click duyệt/hủy, tìm kiếm tức thì, thêm/sửa xe với preview ảnh trực tiếp.

---

### Bước 2: Ứng Dụng Design System & Tokens
Luôn sử dụng biến CSS từ bộ token có sẵn trong [design-tokens.md](./references/design-tokens.md):
* **Màu sắc**:
  * Chủ đạo: `--color-brand-primary: #1464F4` (VinFast Cobalt Blue).
  * Nền tối/Điểm nhấn sang trọng: `--color-brand-deep: #0A2540`.
  * Hiệu ứng công nghệ: `--color-brand-cyan: #00D2FF`.
  * Bề mặt kính: `--color-surface-glass: rgba(255, 255, 255, 0.85)` kết hợp `backdrop-filter: blur(16px)`.
* **Typography**:
  * Phông chữ: `'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif`.
  * Hierarchy tương phản cao, phân biệt rõ tiêu đề lớn và thông số kỹ thuật.
* **Đổ bóng & Ánh sáng (Shadow & Glow)**:
  * Không dùng shadow đen đặc rẻ tiền. Dùng shadow nhiều tầng mờ tự nhiên (`box-shadow: 0 10px 30px -5px rgba(10, 37, 64, 0.08)`).
  * Nút bấm có viền sáng nhẹ hoặc ánh hào quang tinh tế (`box-shadow: 0 4px 20px rgba(20, 100, 244, 0.25)`).

---

### Bước 3: Thiết Kế & Cấu Trúc Component Cao Cấp
Chi tiết các mẫu thành phần trong [component-patterns.md](./references/component-patterns.md):
1. **Car Card (Thẻ xe)**:
   * Ảnh xe trong suốt nổi trên nền gradient nhẹ.
   * Khối tag huy hiệu EV nổi bật (Ví dụ: `Pin: 450 km`, `Sạc siêu nhanh 10-70% 24 phút`).
   * Hiển thị giá niêm yết và nút phụ "Chi tiết" cùng nút chính "Lái thử".
2. **Bộ chọn màu xe (Color Swatches)**:
   * Vòng tròn màu có viền active nổi bật, tooltip tên màu (ví dụ: Trắng ngọc trai, Đỏ Crimson, Xanh Brahminy).
   * Khi đổi màu xe, ảnh xe chuyển tiếp mượt (fade cross transition), không bị giật hay trắng hình.
3. **Modal Đăng Ký Lái Thử**:
   * Thiết kế phân tầng nổi bật với nền tối mờ (overlay `rgba(5, 16, 38, 0.6)`).
   * Trường nhập liệu có Floating Label hoặc Icon bên trái, phản hồi tức thì khi người dùng gõ.
4. **Bảng Tính Trả Góp (Installment Calculator)**:
   * Thanh trượt (Slider) kéo tỉ lệ trả trước (20% - 80%) và thời hạn vay (1 - 8 năm).
   * Số tiền trả hàng tháng nhảy mượt theo thời gian thực (real-time calculation).

---

### Bước 4: Vi Tương Tác & Chuyển Động Điện Ảnh (Micro-interactions)
Xem hướng dẫn chi tiết trong [micro-interactions.md](./references/micro-interactions.md):
* **Physics-based Hover**:
  ```css
  .interactive-card {
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
  }
  .interactive-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 35px -10px rgba(15, 83, 197, 0.15);
  }
  ```
* **Shimmer Skeleton Loading**:
  * Khi đang fetch dữ liệu xe hoặc danh sách đơn lái thử, hiển thị khung xương chuyển động sóng bạc, không để màn hình trắng hay trống rỗng.
* **Toast Notification Tự Động**:
  * Thay thế triệt để `window.alert()` bằng Toast mượt mà có tiến trình chạy thời gian (Progress bar countdown).

---

### Bước 5: Kiểm Tra & Đánh Giá Chất Lượng (Quality Audit)
Trước khi bàn giao bất kỳ giao diện nào cho người dùng, đối chiếu với [audit-checklist.md](./references/audit-checklist.md):
1. [ ] **Màu sắc**: Không có mã màu thô (không có `color: red; background: blue;`).
2. [ ] **Responsive**: Kiểm tra hiển thị chuẩn ở 3 breakpoint: Mobile (375px - 414px), Tablet (768px - 1024px), Desktop (1280px+).
3. [ ] **Touch Target**: Tất cả nút bấm trên mobile >= 44x44px, khoảng cách ngón tay bấm không bị bấm nhầm.
4. [ ] **Tương phản**: Đạt chuẩn WCAG 2.1 AA (Tỷ lệ tương phản chữ/nền >= 4.5:1).
5. [ ] **Hiệu năng**: Không gây Reflow/Repaint liên tục khi cuộn trang; chuyển động dùng GPU-accelerated (`transform`, `opacity`).

---

## Tài Liệu Tham Khảo Kèm Theo (References)
* [Design Tokens Specification](./references/design-tokens.md): Bảng biến màu, cỡ chữ, khoảng cách, bóng đổ.
* [VinFast Brand Identity System](./references/vinfast-brand-system.md): Ngôn ngữ thương hiệu xe điện VinFast.
* [Micro-Interactions & Motion Guide](./references/micro-interactions.md): Mã nguồn và quy chuẩn chuyển động.
* [Component Patterns & Blueprints](./references/component-patterns.md): Bản thiết kế mẫu các khối chức năng.
* [Responsive & Mobile Ergonomics](./references/responsive-accessibility.md): Hướng dẫn UX di động và tính dễ tiếp cận.
* [UX/UI Audit Checklist](./references/audit-checklist.md): Danh mục 25 tiêu chí nghiệm thu giao diện.
