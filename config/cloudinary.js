const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cấu hình Cloudinary lấy từ biến môi trường
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload file từ Buffer lên Cloudinary
 * @param {Buffer} fileBuffer - Dữ liệu buffer của file ảnh tải lên
 * @param {string} folder - Thư mục lưu trữ trên Cloudinary (mặc định: 'vinfast')
 * @returns {Promise<string>} - Trả về đường dẫn URL ảnh an toàn (secure_url)
 */
const uploadToCloudinary = (fileBuffer, folder = 'vinfast') => {
  return new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return reject(new Error('Chưa cấu hình các khóa Cloudinary trong file .env'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
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
 * Xóa ảnh trên Cloudinary theo URL
 * @param {string} url - URL của ảnh cần xóa
 * @returns {Promise<boolean>} - Trả về true nếu xóa thành công
 */
const deleteFromCloudinary = async (url) => {
  try {
    const publicId = extractPublicId(url);
    if (publicId) {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    }
  } catch (error) {
    console.error('Lỗi khi xóa ảnh trên Cloudinary:', error);
  }
  return false;
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary
};
