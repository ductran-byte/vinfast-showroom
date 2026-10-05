# VinFast Showroom - Dự Án & Bộ Quy Chuẩn Thiết Kế

Chào mừng bạn đến với dự án **VinFast Showroom & Admin Dashboard**. Toàn bộ mã nguồn và tài liệu thiết kế trong dự án này được thiết lập theo tiêu chuẩn chất lượng cao nhất cho trải nghiệm người dùng ngành ô tô điện thông minh.

---

## 1. Tổng Quan Dự Án
* **Loại dự án**: Nền tảng Showroom trực tuyến trưng bày & giới thiệu xe điện VinFast, đặt lịch lái thử, tính toán tài chính trả góp và Dashboard quản trị.
* **Tech Stack**:
  * **Backend**: Node.js, Express.js, MySQL (mysql2), JWT, Multer, Cloudinary.
  * **Frontend**: Vanilla HTML5, Modern CSS3 (Design Tokens, Glassmorphism, CSS Grid/Flexbox), Vanilla JavaScript (ES6+), FontAwesome Icons, Google Fonts (Plus Jakarta Sans & Inter).
* **Môi trường chạy**: `npm run dev` (Nodemon server trên cổng `http://localhost:3000` hoặc cổng cấu hình trong `.env`).

---

## 2. Tiêu Chuẩn UX/UI Bắt Buộc (UI/UX Standards)
Mọi chỉnh sửa hoặc bổ sung giao diện (Frontend) đều phải tuân thủ nghiêm ngặt bộ quy chuẩn UX/UI:

* **Quy chuẩn cốt lõi**: Xem tài liệu [UX/UI Guidelines](.agents/rules/ux-ui-guidelines.md).
* **Màu sắc chủ đạo**:
  * Xanh Cobalt VinFast EV: `#1464F4`
  * Nền tối sang trọng (Luxury Navy): `#051026` & `#0A1C3E`
  * Bề mặt sáng: `#F8FAFC` & `#FFFFFF`
  * Hiệu ứng kính: `backdrop-filter: blur(16px)`
* **Nguyên tắc tương tác**:
  * Tuyệt đối không dùng `alert()` trình duyệt. Luôn dùng Toast notification.
  * Không dùng màu thuần cẩu thả (`red`, `green`, `blue`). Sử dụng CSS Variables trong design tokens.
  * Mọi nút bấm, link trên mobile phải đạt chuẩn tối thiểu `44px x 44px`.
  * Ảnh tải về phải có trạng thái Skeleton hoặc placeholder mượt mà.

---

## 3. Danh Sách Kỹ Năng Agent (Workspace Skills)
Dự án được tích hợp sẵn bộ 3 Workspace Skills chuyên sâu:

1. **[ux-ui-designer](.agents/skills/ux-ui-designer/SKILL.md)**: Kỹ năng tổng thể về thiết kế UI/UX, bản sắc thương hiệu VinFast, micro-interactions, component patterns và quy trình kiểm thử 25 tiêu chí.
2. **[responsive-mobile-first](.agents/skills/responsive-mobile-first/SKILL.md)**: Kỹ năng chuyên sâu tối ưu hiển thị trên điện thoại, công thái học ngón tay cái và thanh điều hướng bám đáy (Sticky CTA).
3. **[design-system-audit](.agents/skills/design-system-audit/SKILL.md)**: Kỹ năng kiểm định, chạy script quét lỗi UX/UI và tái cấu trúc CSS cứng về Design Tokens.

---

## 4. Công Cụ Hỗ Trợ
Chạy script kiểm tra chất lượng UX/UI tự động:
```bash
node .agents/skills/ux-ui-designer/scripts/audit-ui.js
```
