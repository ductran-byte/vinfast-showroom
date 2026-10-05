# 25-Point UX/UI Quality Audit Checklist

Danh mục kiểm tra chất lượng giao diện và trải nghiệm người dùng trước khi bàn giao sản phẩm hoặc tính năng.

---

## I. Thẩm Mỹ & Nhận Diện Thương Hiệu (Visual Design & Brand)
- [ ] **1. Bản sắc VinFast**: Sử dụng đúng tông màu xanh Cobalt `#1464F4` và xanh hải quân `#051026`, logo và huy hiệu EV rõ ràng.
- [ ] **2. Không dùng màu cẩu thả**: Không có bất kỳ màu thuần (`red`, `blue`, `green`, `black`). Toàn bộ mã màu phải lấy từ Design Tokens.
- [ ] **3. Typography phân cấp rõ**: Tiêu đề H1, H2, H3, Body, Caption có sự khác biệt rõ rệt về kích thước và độ đậm.
- [ ] **4. Lưới và căn chỉnh**: Tất cả khoảng lề (padding, margin, gap) tuân thủ hệ số lưới 8px (`8, 16, 24, 32, 48px`).
- [ ] **5. Đổ bóng mượt mà**: Sử dụng đổ bóng nhiều tầng tự nhiên, không dùng viền đen thô hoặc bóng đục.

---

## II. Vi Tương Tác & Phản Hồi (Micro-interactions & Feedback)
- [ ] **6. Trạng thái nút bấm**: Nút có đầy đủ các trạng thái `default`, `hover`, `active`, `disabled`, `loading`.
- [ ] **7. Chuyển động êm ái**: Tất cả transition sử dụng `cubic-bezier(0.16, 1, 0.3, 1)` từ 200ms đến 400ms.
- [ ] **8. Khung xương (Skeleton)**: Khi fetch API có khung xương chuyển động sóng bạc, không để khoảng trống vô hồn.
- [ ] **9. Toast Notifications**: Thay thế toàn bộ popup `alert()` bằng Toast thanh lịch ở góc màn hình.
- [ ] **10. Hiệu ứng Hover Card**: Thẻ xe khi hover có độ nẩy nhẹ (`translateY(-6px)`), hình ảnh zoom êm dịu.

---

## III. Trải Nghiệm Mobile & Responsive (Mobile First)
- [ ] **11. Không cuộn ngang**: Toàn trang không phát sinh thanh cuộn ngang ngoài ý muốn trên màn hình nhỏ.
- [ ] **12. Touch Target >= 44px**: Tất cả nút, link, icon đóng/mở đều vừa vặn với ngón tay người dùng.
- [ ] **13. Menu điều hướng**: Hamburger menu mượt mà, dễ bấm, đóng mở không giật.
- [ ] **14. Sticky CTA Mobile**: Trang xem xe trên mobile có thanh cố định đáy màn hình để liên hệ/đặt lịch nhanh.
- [ ] **15. Bảng thông số linh hoạt**: Bảng so sánh xe trên mobile cuộn ngang có chỉ báo vuốt hoặc xếp dạng thẻ dọc.

---

## IV. Biểu Mẫu & Tỷ Lệ Chuyển Đổi (Form & CRO)
- [ ] **16. Tinh gọn trường nhập**: Biểu mẫu đăng ký lái thử chỉ giữ lại các trường quan trọng nhất.
- [ ] **17. Validation trực quan**: Báo lỗi ngay tại chỗ (inline feedback) khi người dùng nhập sai định dạng SĐT.
- [ ] **18. Trực quan hóa giá cả**: Giá xe có dấu phân cách hàng nghìn rõ ràng (ví dụ: `850.000.000 ₫`).
- [ ] **19. Bộ chọn màu trực quan**: Đổi màu xe kèm hiệu ứng chuyển mượt, tên màu thay đổi tương ứng.
- [ ] **20. Bảng tính trả góp**: Kéo thả slider phản hồi giá trị tiền trả hàng tháng theo thời gian thực.

---

## V. Tiếp Cận & Hiệu Năng (Accessibility & Performance)
- [ ] **21. Tương phản WCAG AA**: Chữ trên nền đạt tỷ lệ tương phản >= 4.5:1.
- [ ] **22. Alt Text cho ảnh**: Tất cả ảnh xe có thẻ `alt` mô tả chính xác tên xe và màu sắc.
- [ ] **23. Bàn phím thân thiện**: Di chuyển bằng phím Tab có vòng focus sáng rõ (`focus-visible`).
- [ ] **24. Đóng Modal tiện lợi**: Có thể đóng Modal bằng phím `ESC` hoặc click ngoài vùng nền.
- [ ] **25. Tối ưu GPU 60fps**: Các animation chỉ tác động vào `transform` và `opacity`.
