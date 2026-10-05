# VinFast Brand Identity & Luxury Automotive UX

Quy chuẩn nhận diện thương hiệu VinFast áp dụng cho Showroom kỹ thuật số, Trang chi tiết xe và Bảng quản trị.

---

## 1. Bản Sắc Thương Hiệu VinFast (Brand Pillars)

1. **Tinh Thần Việt Nam - Đẳng Cấp Toàn Cầu**:
   * Biểu tượng chữ **V** sải cánh vươn cao (cánh chim Lạc Việt / VinFast / Victory).
   * Phong cách thiết kế hiện đại bắt tay cùng các studio lừng danh thế giới (Pininfarina, Torino Design).
2. **Kỷ Nguyên Xe Điện Thông Minh (Smart EV Future)**:
   * Ngôn ngữ thiết kế khí động học (Aerodynamic), đường nét sắc sảo, dải đèn LED cánh chim đặc trưng cả trước và sau xe.
   * Giao diện website phải toát lên tính "High-Tech", "Eco-friendly" và "Luxury".

---

## 2. Màu Sắc Ngoại Thất Chuẩn Của Các Dòng Xe VinFast
Khi tạo bộ chọn màu xe (Color Picker / Swatches), bắt buộc sử dụng đúng bảng mã màu và tên gọi chính hãng:

| Tên Màu Tiếng Việt | Tên Quốc Tế | Mã Màu CSS (Hex) | Dòng Xe Điển Hình |
| :--- | :--- | :--- | :--- |
| **Trắng Ngọc Trai** | Brahminy White | `#F3F4F6` (Viền `#D1D5DB`) | VF 3, VF 5, VF 6, VF 7, VF 8, VF 9 |
| **Đen Huyền Bí** | Jet Black | `#111827` | VF 7, VF 8, VF 9 |
| **Bạc Ánh Kim** | Desat Silver | `#9CA3AF` | VF 8, VF 9 |
| **Xanh Biển Sâu** | Deep Ocean Blue | `#0E3A6C` | VF 6, VF 7, VF 8, VF 9 |
| **Xanh VinFast** | VinFast Blue | `#1464F4` | Tất cả dòng xe (Màu nhận diện) |
| **Đỏ Quyến Rũ** | Crimson Red | `#C2182B` | VF 6, VF 7, VF 8 |
| **Xám Bão Táp** | Neptune Grey | `#4B5563` | VF 7, VF 8 |
| **Vàng Nắng Mới** | Future Yellow | `#F59E0B` | VF 3, VF 5 Plus |
| **Hồng Cá Tính** | Rose Pink | `#F472B6` | VF 3 |

---

## 3. Quy Chuẩn Trải Nghiệm Trang Chi Tiết Xe (Car Detail UX)

### 3.1. Trình Xem Xe 360 Độ (360 Interactive Viewer)
* **Góc Nhìn & Chiều Xoay**:
  * Tối thiểu 16 - 36 khung hình mượt mà khi xoay ngang (`yaw rotation`).
  * Có biểu tượng bàn tay kéo / mũi tên 360 độ chỉ dẫn trực quan cho khách hàng mới.
  * Tự động xoay chậm (Auto-rotate ambient 3rpm) khi người dùng chưa chạm vào, và tạm dừng ngay khi chạm tay kéo.
* **Tải Ảnh Thông Minh**:
  * Preload trước ảnh góc chính diện và các góc 45 độ, các góc còn lại tải ngầm (lazy sequence) để không làm đơ trang.

### 3.2. Bộ Chọn Màu Xe & Mâm Xe (Configurator UX)
* Nút tròn chọn màu đường kính tối thiểu `36px`, có hiệu ứng bóng đổ và vòng viền kép (`ring ring-offset`) khi được chọn.
* Khi đổi màu:
  * Ảnh xe chuyển mờ dần (Opacity crossfade 200ms) để không bị nhấp nháy trắng.
  * Tên màu và mã màu cập nhật tức thì bên cạnh tiêu đề ("Màu: Xanh VinFast Blue").

### 3.3. Thẻ Thông Số Kỹ Thuật Nhanh (Hero Quick Specs)
Luôn đặt 4 thông số mấu chốt ngay dưới tên xe:
1. **Quãng đường 1 lần sạc** (Ví dụ: `450 km (NEDC)`).
2. **Công suất tối đa** (Ví dụ: `300 kW / 402 hp`).
3. **Tăng tốc 0-100 km/h** (Ví dụ: `5.5 giây`).
4. **Thời gian sạc nhanh** (Ví dụ: `10% - 70% trong 24 phút`).

### 3.4. Bảng So Sánh Phiên Bản (Eco vs Plus)
* Trực quan hóa bằng bảng sticky header.
* Điểm khác biệt lớn (kích thước mâm xe, số mô tơ điện, công nghệ trợ lái nâng cao ADAS level 2) phải được highlight màu xanh thương hiệu.
