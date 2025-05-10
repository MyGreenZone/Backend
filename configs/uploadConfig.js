// utils/upload.js

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');  // Import config Cloudinary

// Cấu hình lưu trữ ảnh lên Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,  // Sử dụng cấu hình Cloudinary
  params: {
    folder: 'uploads',  // Chọn thư mục lưu trữ ảnh trên Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],  // Các định dạng ảnh được phép
  },
});

// Cấu hình multer với Cloudinary Storage
const upload = multer({ storage: storage });

module.exports = upload;
