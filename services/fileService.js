const Image = require('../models/imageSchema')
const uploadSingleFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({statusCode: 400, message: 'No file uploaded' });
        }

        // Lưu ảnh vào DB
        const newImage = await Image.create({ url: req.file.path });

        // Trả về phản hồi thành công
        return res.status(200).json({
            statusCode: 200,
            message: 'File uploaded successfully',
            url: newImage.url
        });

    } catch (error) {
        console.log('Upload error:', error); // <-- Log rõ ràng
        return res.status(500).json({ statusCode: 500, message: 'Error uploading file', error: error.message });
    }
};


module.exports = { uploadSingleFile }
