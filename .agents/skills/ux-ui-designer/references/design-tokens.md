# VinFast Design System Tokens

Hệ thống biến thiết kế chuẩn (Design Tokens) tối ưu cho dự án VinFast Showroom và Admin Dashboard.

---

## 1. Bảng Màu Sắc (Color Tokens)

### 1.1. Màu Thương Hiệu (Brand & Accent)
```css
:root {
  /* VinFast Electric Cobalt - Màu biểu tượng của xe điện VinFast */
  --color-primary: #1464F4;
  --color-primary-hover: #0F53C5;
  --color-primary-active: #0A3EA1;
  --color-primary-light: #EBF2FE;
  --color-primary-glow: rgba(20, 100, 244, 0.25);

  /* Deep Luxury Navy - Thể hiện đẳng cấp xe sang */
  --color-navy-900: #051026;
  --color-navy-800: #0A1C3E;
  --color-navy-700: #102A5C;
  --color-navy-600: #193E84;

  /* Cyber Cyan - Điểm nhấn công nghệ tương lai */
  --color-cyan-glow: #00D2FF;
  --color-cyan-tint: rgba(0, 210, 255, 0.12);

  /* Gradients */
  --grad-primary: linear-gradient(135deg, #1464F4 0%, #00368A 100%);
  --grad-electric: linear-gradient(135deg, #00D2FF 0%, #1464F4 100%);
  --grad-dark-luxury: linear-gradient(180deg, #0A1C3E 0%, #051026 100%);
  --grad-surface-subtle: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
}
```

### 1.2. Màu Trung Tính & Bề Mặt (Neutrals & Surfaces)
```css
:root {
  --color-bg-base: #F8FAFC;
  --color-bg-alt: #F1F5F9;
  --color-surface-white: #FFFFFF;
  --color-surface-muted: #F8FAFC;
  --color-surface-elevated: #FFFFFF;

  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.82);
  --glass-border: rgba(255, 255, 255, 0.7);
  --glass-border-dark: rgba(15, 23, 42, 0.08);
  --glass-blur: blur(16px);

  /* Text & Typography */
  --text-main: #0F172A;       /* Slate 900 */
  --text-secondary: #334155;  /* Slate 700 */
  --text-muted: #64748B;      /* Slate 500 */
  --text-inverse: #FFFFFF;    /* Pure White */
  --text-link: #1464F4;

  /* Semantic Feedback */
  --color-success: #10B981;
  --color-success-bg: #ECFDF5;
  --color-warning: #F59E0B;
  --color-warning-bg: #FFFBEB;
  --color-danger: #EF4444;
  --color-danger-bg: #FEF2F2;
  --color-info: #0284C7;
  --color-info-bg: #F0F9FF;
}
```

---

## 2. Hệ Thống Typography (Font Scale)
Sử dụng phông chữ hình học hiện đại: `'Plus Jakarta Sans'`, `'Inter'`, sans-serif.

```css
:root {
  /* Font Family */
  --font-sans: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Fluid Size Scale (Clamp cho mượt từ mobile lên desktop) */
  --text-display: clamp(2.5rem, 5vw + 1rem, 3.75rem); /* 40px - 60px */
  --text-h1: clamp(2rem, 3.5vw + 0.5rem, 2.75rem);    /* 32px - 44px */
  --text-h2: clamp(1.5rem, 2.5vw + 0.5rem, 2rem);     /* 24px - 32px */
  --text-h3: clamp(1.25rem, 1.8vw + 0.25rem, 1.5rem); /* 20px - 24px */
  --text-h4: 1.25rem;                                 /* 20px */
  --text-body-lg: 1.125rem;                           /* 18px */
  --text-body: 1rem;                                  /* 16px */
  --text-body-sm: 0.875rem;                           /* 14px */
  --text-caption: 0.75rem;                            /* 12px */

  /* Font Weights */
  --fw-light: 300;
  --fw-normal: 400;
  --fw-medium: 500;
  --fw-semibold: 600;
  --fw-bold: 700;
  --fw-extrabold: 800;

  /* Line Heights */
  --lh-tight: 1.15;
  --lh-snug: 1.3;
  --lh-normal: 1.5;
  --lh-relaxed: 1.65;
}
```

---

## 3. Khoảng Cách & Lưới (Spacing & Layout Grid)
Áp dụng hệ thống lưới 8-point:

```css
:root {
  --space-2xs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;

  /* Container Max Width */
  --container-max: 1280px;
  --container-wide: 1440px;
  --container-pad: clamp(16px, 4vw, 32px);
}
```

---

## 4. Bán Kính Bo Tròn (Border Radius)
```css
:root {
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-full: 9999px;
}
```

---

## 5. Đổ Bóng & Ánh Sáng Nổi (Elevation & Shadows)
```css
:root {
  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.05);
  --shadow-sm: 0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05);
  --shadow-md: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04);
  --shadow-lg: 0 20px 25px -5px rgba(15, 23, 42, 0.09), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
  --shadow-xl: 0 25px 50px -12px rgba(15, 23, 42, 0.15);
  
  /* Neon & Electric Glows */
  --shadow-glow-blue: 0 8px 25px rgba(20, 100, 244, 0.28);
  --shadow-glow-cyan: 0 8px 25px rgba(0, 210, 255, 0.35);
  --shadow-card-hover: 0 20px 40px -15px rgba(10, 37, 64, 0.12);
}
```

---

## 6. Chuyển Động & Động Lực Học (Transitions & Easing)
```css
:root {
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);     /* Cực êm, mượt chuẩn Apple / Tesla */
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1); /* Nẩy nhẹ */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  --duration-instant: 150ms;
  --duration-normal: 250ms;
  --duration-smooth: 400ms;
  --duration-slow: 600ms;
}
```
