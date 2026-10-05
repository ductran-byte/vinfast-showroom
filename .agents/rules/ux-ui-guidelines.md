# UX/UI & Frontend Design Guidelines

Quy chuẩn thiết kế giao diện (UI) và trải nghiệm người dùng (UX) bắt buộc áp dụng cho toàn bộ dự án **VinFast Showroom & Admin Dashboard**.

---

## 1. Triết Lý Thiết Kế (Design Philosophy)
* **Luxury Automotive & High-Tech EV**: Đẳng cấp xe điện hiện đại, sang trọng, tinh tế. Mang lại cảm giác công nghệ tương lai (dynamic, aerodynamic, cutting-edge).
* **Trải nghiệm mượt mà (60 FPS)**: Mọi chuyển động (hover, click, modal, drawer) phải dùng CSS transitions tối ưu GPU (`transform`, `opacity`) với cubic-bezier mượt mà.
* **Không thiết kế sơ sài**: Nghiêm cấm tạo giao diện MVP thô ráp, thiếu tương tác, màu sắc mặc định của trình duyệt. Mọi thành phần đều phải đạt chuẩn thương mại cao cấp.

---

## 2. Hệ Thống Màu Sắc & Thương Hiệu VinFast (Color System)
| Token / Vai trò | Giá trị Hex / HSL | Ứng dụng |
| :--- | :--- | :--- |
| `--color-brand-primary` | `#1464F4` | Màu xanh điện tử chủ đạo VinFast EV, CTA chính, active state |
| `--color-brand-deep` | `#0A2540` / `#001E50` | Xanh hải quân đậm, header, footer, card nền tối sang trọng |
| `--color-brand-cyan` | `#00D2FF` | Ánh sáng cyan high-tech, gradient highlight, EV glowing effect |
| `--color-bg-base` | `#F8FAFC` | Nền sáng trung tính, nhẹ nhàng cho mắt |
| `--color-surface` | `#FFFFFF` | Thẻ card, modal, panel bề mặt |
| `--color-surface-glass` | `rgba(255, 255, 255, 0.82)` | Hiệu ứng kính mờ (Backdrop Blur 16px) |
| `--color-text-main` | `#0F172A` | Tiêu đề, chữ chính (đảm bảo độ tương phản > 7:1) |
| `--color-text-muted` | `#64748B` | Mô tả phụ, nhãn thông số, caption |
| `--color-success` | `#10B981` | Đặt lịch thành công, xe có sẵn |
| `--color-warning` | `#F59E0B` | Cảnh báo pin, trạng thái chờ duyệt |
| `--color-danger` | `#EF4444` | Hủy lịch, xóa dữ liệu, cảnh báo lỗi |

> **Quy tắc vàng về màu sắc**: Tuyệt đối không dùng màu thuần như `red`, `blue`, `green`, `black`. Luôn sử dụng CSS variables trong hệ thống tokens.

---

## 3. Typography & Phân Cấp Thị Giác (Visual Hierarchy)
* **Font chữ**: Sử dụng `Plus Jakarta Sans` và `Inter`.
* **Phân cấp**:
  * `H1 (Hero Title)`: 40px – 56px, `font-weight: 800`, line-height: 1.15.
  * `H2 (Section Title)`: 28px – 36px, `font-weight: 700`, line-height: 1.25.
  * `H3 (Card Title / Car Name)`: 20px – 24px, `font-weight: 700`.
  * `Body Text`: 15px – 16px, `font-weight: 400 - 500`, line-height: 1.6.
  * `Caption / Specs Label`: 12px – 13px, `font-weight: 600`, letter-spacing: 0.5px.
* **Quy chuẩn đọc lướt (Scannability)**: Sử dụng badge tags (EV, SUV, 7 Chỗ, Pin 82kWh) giúp người mua xe nắm bắt thông số chỉ trong 3 giây.

---

## 4. Vi Tương Tác & Chuyển Động (Micro-interactions & Physics)
1. **Nút bấm (Buttons)**:
   * Hover: Dịch chuyển nhẹ `transform: translateY(-2px)`, đổ bóng phát sáng (`box-shadow: 0 8px 24px rgba(20, 100, 244, 0.3)`).
   * Active / Click: Thu nhỏ tinh tế `transform: scale(0.98)` phản hồi lực bấm.
   * Loading: Hiển thị spinner đồng bộ màu sắc hoặc hiệu ứng sóng.
2. **Thẻ xe (Car Cards)**:
   * Hiệu ứng kính mờ kết hợp viền sáng nhẹ (`border: 1px solid rgba(255, 255, 255, 0.6)`).
   * Khi hover thẻ xe: Ảnh xe zoom nhẹ `transform: scale(1.04)`, bóng nổi mượt mà.
3. **Modal & Popup**:
   * Xuất hiện mượt từ dưới lên kèm hiệu ứng fade-in (`cubic-bezier(0.16, 1, 0.3, 1)`).
   * Đóng bằng phím `ESC`, click ngoài backdrop, hoặc nút đóng nổi bật.
4. **Thông báo (Toasts)**:
   * Không dùng `alert()` mặc định của trình duyệt. Luôn dùng Toast notification góc màn hình có icon, màu trạng thái và tự biến mất sau 3-4s.

---

## 5. Tối Ưu Hóa Trải Nghiệm Mobile (Mobile Ergonomics)
* **Touch Target**: Mọi nút bấm, link, icon điều hướng tối thiểu `44px x 44px`.
* **Sticky Bottom CTA**: Trên điện thoại, màn hình chi tiết xe phải có thanh CTA cố định đáy màn hình (ví dụ: Nút "Đăng ký lái thử" + "Nhận báo giá").
* **Không cuộn ngang bất ngờ**: `overflow-x: hidden` trên toàn trang. Mọi bảng thông số xe phức tạp trên mobile phải hỗ trợ vuốt thẻ (swipe) hoặc toggle so sánh.

---

## 6. Hướng Dẫn Biểu Mẫu (Forms & Booking UX)
* Nhập liệu đăng ký lái thử / tư vấn phải rõ ràng, phân nhóm hợp lý (Họ tên, SĐT, Chọn dòng xe, Chọn ngày giờ, Showroom gần nhất).
* Real-time Validation: Hiển thị lỗi hoặc tích xanh ngay khi người dùng nhập đúng định dạng số điện thoại/email.
* Placeholder có ví dụ cụ thể, nhãn (label) luôn hiển thị để không gây mất phương hướng.

---

## 7. Tiêu Chuẩn Dashboard Quản Trị (Admin UX)
* Thanh điều hướng trực quan, hiển thị trạng thái active rõ nét.
* Bảng dữ liệu có phân trang, bộ lọc tìm kiếm nhanh, badge màu phân biệt trạng thái đơn đặt cọc / lái thử (`Chờ xử lý`, `Đã xác nhận`, `Đã lái thử`, `Đã hủy`).
* Nút thao tác nhạy cảm (Xóa xe, Hủy lịch) phải có popup xác nhận an toàn kèm cảnh báo rõ ràng.
