const Image = require('./image.schema')
const AuthMiddleWare = require('../../middleware/auth')
const uploadSingleFile = async (req, res) => {
    try {
        const { phoneNumber, role } = req.user
        const user = await AuthMiddleWare.authorize(phoneNumber, role)
        if (!user) return res.status(401).json({ statusCode: 401, success: false, message: 'Unauthorized' })

        if (!req.file) {
            return res.status(400).json({ statusCode: 400, message: 'No file uploaded' });
        }

        // Lưu ảnh vào DB
        const newImage = await Image.create({ url: req.file.path });

        // Trả về phản hồi thành công
        return res.status(201).json({
            statusCode: 201,
            message: 'File uploaded successfully',
            url: newImage.url
        });

    } catch (error) {
        console.log('Upload error:', error); // <-- Log rõ ràng
        return res.status(500).json({ statusCode: 500, message: 'Error uploading file', error: error.message });
    }
};


module.exports = { uploadSingleFile }
