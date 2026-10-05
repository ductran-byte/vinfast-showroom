# VinFast Showroom - Agent Instructions & UX/UI Standards

Quy định chung cho các AI Coding Agents khi làm việc trên kho mã nguồn **VinFast Showroom**.

---

## 1. UX/UI First Rule
Bất cứ khi nào tạo mới hoặc chỉnh sửa giao diện HTML/CSS/JS:
1. Tuân thủ tuyệt đối quy chuẩn tại [`.agents/rules/ux-ui-guidelines.md`](.agents/rules/ux-ui-guidelines.md).
2. Tận dụng bộ công cụ và hướng dẫn trong skill [`ux-ui-designer`](.agents/skills/ux-ui-designer/SKILL.md).
3. Đảm bảo tỷ lệ tương phản WCAG 2.1 AA, không để phát sinh tràn ngang trên mobile, kích thước vùng chạm tối thiểu 44px x 44px.
4. Sử dụng animation mượt mà (GPU accelerated với `transform` và `opacity`, bezier `cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 2. Workspace Skills Có Sẵn
* `.agents/skills/ux-ui-designer/SKILL.md`
* `.agents/skills/responsive-mobile-first/SKILL.md`
* `.agents/skills/design-system-audit/SKILL.md`
