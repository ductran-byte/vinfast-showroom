/**
 * VinFast UX/UI Automated Audit Script
 * Quét toàn bộ mã nguồn HTML/JS/CSS để phát hiện các lỗi UX/UI thường gặp.
 * Chạy lệnh: node .agents/skills/ux-ui-designer/scripts/audit-ui.js
 */

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../../../../public');

function auditHtmlFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const issues = [];

  // 1. Kiểm tra viewport
  if (!content.includes('name="viewport"')) {
    issues.push('Thiếu thẻ <meta name="viewport"> tối ưu responsive trên di động.');
  }

  // 2. Kiểm tra alt attribute trên thẻ img
  const imgTags = content.match(/<img[^>]*>/gi) || [];
  let missingAlt = 0;
  imgTags.forEach(tag => {
    if (!tag.includes('alt=') || tag.includes('alt=""') || tag.includes("alt=''")) {
      missingAlt++;
    }
  });
  if (missingAlt > 0) {
    issues.push(`Có ${missingAlt} thẻ <img> thiếu thuộc tính alt mô tả hình ảnh (WCAG).`);
  }

  // 3. Kiểm tra inline styles thô chưa tối ưu
  const rawColorStyles = (content.match(/style="[^"]*(color:\s*red|color:\s*green|color:\s*blue)[^"]*"/gi) || []).length;
  if (rawColorStyles > 0) {
    issues.push(`Có ${rawColorStyles} đoạn inline style dùng màu thuần cẩu thả thay vì biến token.`);
  }

  // 4. Kiểm tra nút bấm thiếu aria-label nếu chỉ có icon
  const iconOnlyBtns = (content.match(/<button[^>]*>\s*<i[^>]*><\/i>\s*<\/button>/gi) || [])
    .filter(tag => !tag.includes('aria-label='));
  if (iconOnlyBtns.length > 0) {
    issues.push(`Có ${iconOnlyBtns.length} nút chỉ chứa icon thiếu thuộc tính aria-label.`);
  }

  return { fileName, issues };
}

function auditJsFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const issues = [];

  // Kiểm tra việc sử dụng alert thô
  const alertMatches = content.match(/alert\s*\(/g) || [];
  if (alertMatches.length > 0) {
    issues.push(`Đang sử dụng ${alertMatches.length} lần window.alert(). Hãy thay thế bằng Toast notification.`);
  }

  return { fileName, issues };
}

console.log('='.repeat(60));
console.log('🚗 KIỂM TRA CHẤT LƯỢNG UX/UI DỰ ÁN VINFAST SHOWROOM');
console.log('='.repeat(60));

// Quét HTML
const htmlFiles = ['index.html', 'car.html', 'admin.html'];
htmlFiles.forEach(file => {
  const fullPath = path.join(publicDir, file);
  if (fs.existsSync(fullPath)) {
    const res = auditHtmlFile(fullPath);
    console.log(`\n📄 Tệp [${res.fileName}]:`);
    if (res.issues.length === 0) {
      console.log('  ✅ Tuyệt vời! Không phát hiện lỗi UX/UI cơ bản.');
    } else {
      res.issues.forEach(iss => console.log(`  ⚠️  ${iss}`));
    }
  }
});

// Quét JS
const jsFiles = ['app.js', 'car-detail.js', 'admin.js'];
jsFiles.forEach(file => {
  const fullPath = path.join(publicDir, 'js', file);
  if (fs.existsSync(fullPath)) {
    const res = auditJsFile(fullPath);
    console.log(`\n⚡ Tệp JS [${res.fileName}]:`);
    if (res.issues.length === 0) {
      console.log('  ✅ Giao diện không dùng popup thô.');
    } else {
      res.issues.forEach(iss => console.log(`  ⚠️  ${iss}`));
    }
  }
});

console.log('\n' + '='.repeat(60));
console.log('👉 Hoàn tất kiểm tra. Xem hướng dẫn sửa tại .agents/skills/ux-ui-designer/references/');
console.log('='.repeat(60));
