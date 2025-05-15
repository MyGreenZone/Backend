const productService = require('./product.service')
const { baseProductValidator, patchProductValidator } = require('./product.validator')
const mongoose = require('mongoose')

const productController = {

    async createProduct(req, res) {
        const { value, error } = baseProductValidator.validate(req.body, { abortEarly: false, convert: false })
        if (error) {
            const errors = error.details.map(err => {
                return { statusCode: 400, message: err.message, field: err.context.label }
            })
            return res.status(400).json({ statusCode: 400, success: false, error: errors })
        }

        try {
            const result = await productService.createProduct(value);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.log("Error creating product:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Lỗi khi tạo product',
            });
        }
    },

    async getProductDetail(req, res) {
        const { productId } = req.params
        if (!productId) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Missing productId' })
        }

        try {
            const result = await productService.getProductDetail(productId);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.log("Error get product detail:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Error get product detail'
            });
        }
    },

    async getAllProducts(req, res) {
        try {
            const result = await productService.getAllProducts()
            return res.status(result.statusCode).json(result)
        } catch (error) {
            console.log("Error get all products", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Error get all products'
            });
        }
    },

    async patchProduct(req, res) {
        const { productId } = req.params
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Sai định dạng productId' })
        }
        const { value, error } = patchProductValidator.validate(req.body, { abortEarly: false, convert: false })
        if (error) {
            const errors = error.details.map(err => {
                return { statusCode: 400, message: err.message, field: err.context.label }
            })
            return res.status(400).json({ statusCode: 400, success: false, error: errors })
        }

        try {
            const result = await productService.patchProduct(productId, value)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            console.log("Error patch product:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Lỗi khi cập nhật product',
            });
        }
    }
}




module.exports = productController