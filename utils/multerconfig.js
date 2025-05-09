const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/configCloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'greenzone_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

module.exports = upload;
