const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cấu hình Cloudinary lấy từ biến môi trường
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const fs = require('fs');
const path = require('path');

/**
 * Upload file từ Buffer lên Cloudinary (Hỗ trợ Ảnh, PDF, Video)
 * @param {Buffer} fileBuffer - Dữ liệu buffer của file tải lên
 * @param {string} folder - Thư mục lưu trữ trên Cloudinary (mặc định: 'vinfast')
 * @param {string} resourceType - Loạt tài nguyên ('auto', 'image', 'raw', 'video')
 * @param {string} originalName - Tên file gốc (cho fallback lưu local)
 * @returns {Promise<string>} - Trả về đường dẫn URL an toàn (secure_url)
 */
const uploadToCloudinary = (fileBuffer, folder = 'vinfast', resourceType = 'auto', originalName = '') => {
  return new Promise((resolve, reject) => {
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: folder,
          resource_type: resourceType
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            return reject(error);
          }
          resolve(result.secure_url);
        }
      );

      uploadStream.end(fileBuffer);
    } else {
      // Local fallback nếu chưa cài biến môi trường Cloudinary
      try {
        const isPdf = originalName.toLowerCase().endsWith('.pdf');
        const targetSubDir = isPdf ? 'uploads/pdf' : 'uploads';
        const uploadDir = path.join(__dirname, '../public', targetSubDir);
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const ext = path.extname(originalName) || (isPdf ? '.pdf' : '.jpg');
        const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        const safeName = `${baseName}-${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, safeName);
        fs.writeFileSync(filePath, fileBuffer);
        resolve(`/${targetSubDir}/${safeName}`);
      } catch (err) {
        reject(err);
      }
    }
  });
};

/**
 * Trích xuất public_id của ảnh từ URL Cloudinary
 * @param {string} url - Đường dẫn URL đầy đủ của ảnh trên Cloudinary
 * @returns {string|null} - Trả về public_id hoặc null
 */
const extractPublicId = (url) => {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    
    // Loại bỏ version dạng v123456789/ nếu có ở đầu
    const pathAndExt = parts[1].replace(/^v\d+\//, '');
    
    // Loại bỏ đuôi mở rộng (.jpg, .png, ...)
    const dotIndex = pathAndExt.lastIndexOf('.');
    if (dotIndex === -1) return pathAndExt;
    
    return pathAndExt.substring(0, dotIndex);
  } catch (error) {
    console.error('Không thể trích xuất public_id từ url:', url, error);
    return null;
  }
};

/**
 * Xóa file trên Cloudinary theo URL
 * @param {string} url - URL của file cần xóa
 * @param {string} resourceType - Loại tài nguyên ('image', 'raw', 'auto')
 * @returns {Promise<boolean>} - Trả về true nếu xóa thành công
 */
const deleteFromCloudinary = async (url, resourceType = 'image') => {
  try {
    const publicId = extractPublicId(url);
    if (publicId) {
      let result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      if (result.result !== 'ok' && resourceType === 'image') {
        result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      }
      return result.result === 'ok';
    }
  } catch (error) {
    console.error('Lỗi khi xóa file trên Cloudinary:', error);
  }
  return false;
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary
};
