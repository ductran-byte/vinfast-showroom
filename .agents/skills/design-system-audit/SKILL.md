---
name: design-system-audit
description: >-
  Specialized skill to audit existing HTML, CSS, and JS files for design inconsistencies,
  accessibility flaws, broken layouts, hardcoded colors, and lack of visual polish.
  Use this skill when running a UX/UI checkup or refactoring legacy CSS to design tokens.
---

# Design System & UI Audit Skill

Skill kiểm định, phát hiện lỗi thiết kế và hướng dẫn tái cấu trúc (refactor) mã nguồn frontend về hệ thống Design Tokens thống nhất.

---

## Các Bước Kiểm Định Nhanh

### 1. Chạy Script Kiểm Tra Tự Động
Chạy script kiểm tra trong terminal:
```bash
node .agents/skills/ux-ui-designer/scripts/audit-ui.js
```

### 2. Quét & Thay Thế Màu Cứng (Hardcoded Colors Refactor)
Tìm kiếm các mã màu viết thẳng trong CSS hoặc inline style và chuyển đổi:
* Thay `#1464F4` hoặc `#0f53c5` ➔ `var(--color-primary)`
* Thay `#ffffff` ➔ `var(--color-surface)`
* Thay `#f8fafc` ➔ `var(--color-bg-base)`
* Thay `#0f172a` hoặc `#1e293b` ➔ `var(--text-main)`
* Thay `#64748b` ➔ `var(--text-muted)`

### 3. Kiểm Tra Điểm Tiếp Cận (Accessibility Check)
* Đảm bảo tất cả thẻ `<img>` có thuộc tính `alt`.
* Đảm bảo tất cả `<button>` không có chữ đều có thuộc tính `aria-label`.
* Đảm bảo các modal có thể tắt bằng nút 'X' và phím `ESC`.

### 4. Kiểm Tra Trạng Thái Rỗng & Tải Dữ Liệu (Empty & Loading States)
* Khi danh sách xe chưa tải xong: Có Skeleton mờ ảo thay vì màn hình trắng.
* Khi không tìm thấy xe theo bộ lọc: Hiển thị minh họa "Không tìm thấy xe phù hợp" kèm nút "Đặt lại bộ lọc".
