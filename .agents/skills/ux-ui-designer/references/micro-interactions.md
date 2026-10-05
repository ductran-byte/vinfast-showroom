# Micro-Interactions & Motion Design Guide

Bộ công thức chuyển động (Motion Recipes) mượt mà 60fps chuẩn điện ảnh, tối ưu hóa phần cứng GPU cho VinFast Showroom.

---

## 1. Nút Bấm Đẳng Cấp (Luxury Button Physics)

### 1.1. Nút Bấm Chính (Electric Glow Button)
```css
.btn-electric {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 600;
  color: #FFFFFF;
  background: linear-gradient(135deg, #1464F4 0%, #00368A 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(20, 100, 244, 0.25);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, box-shadow;
}

.btn-electric::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: skewX(-20deg);
  transition: left 0.6s ease;
}

.btn-electric:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(20, 100, 244, 0.45);
}

.btn-electric:hover::after {
  left: 140%;
}

.btn-electric:active {
  transform: translateY(0) scale(0.98);
}
```

---

## 2. Thẻ Xe Nổi Bật (Car Card Hover Physics)

```css
.car-card {
  position: relative;
  background: #FFFFFF;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 24px;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.4s ease;
  overflow: hidden;
}

.car-card .car-image-container img {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.car-card:hover {
  transform: translateY(-8px);
  border-color: rgba(20, 100, 244, 0.3);
  box-shadow: 0 20px 40px -10px rgba(10, 37, 64, 0.12),
              0 0 20px rgba(20, 100, 244, 0.08);
}

.car-card:hover .car-image-container img {
  transform: scale(1.05);
}
```

---

## 3. Khung Xương Tải Trang (Shimmer Skeleton Loader)

Tuyệt đối không để màn hình trống rỗng khi đang gọi API. Dùng hiệu ứng khung xương:

```css
@keyframes shimmerWave {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #F1F5F9 25%,
    #E2E8F0 50%,
    #F1F5F9 75%
  );
  background-size: 200% 100%;
  animation: shimmerWave 1.8s infinite cubic-bezier(0.4, 0, 0.6, 1);
  border-radius: 8px;
}

.skeleton-text {
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-img {
  width: 100%;
  height: 220px;
  border-radius: 16px;
}
```

---

## 4. Modal Trượt Mượt Chuẩn Mobile & Desktop

```css
/* Backdrop */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 16, 38, 0.65);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              visibility 0.3s ease;
  z-index: 2000;
}

.modal-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* Modal Content Card */
.modal-card {
  background: #FFFFFF;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(5, 16, 38, 0.25);
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  transform: translateY(30px) scale(0.96);
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.35s ease;
}

.modal-overlay.active .modal-card {
  transform: translateY(0) scale(1);
  opacity: 1;
}
```

---

## 5. Toast Thông Báo Góc Màn Hình (Toast Notification Stack)

```javascript
function showToast(message, type = 'success', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info');
  const color = type === 'success' ? '#10B981' : (type === 'error' ? '#EF4444' : '#1464F4');

  toast.innerHTML = `
    <div style="
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border-left: 4px solid ${color};
      padding: 14px 20px;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
      font-family: inherit;
      font-size: 14px;
      color: #0F172A;
      animation: slideInToast 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    ">
      <i class="fa-solid ${icon}" style="color: ${color}; font-size: 18px;"></i>
      <span style="font-weight: 500;">${message}</span>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
```
