const mongoose = require('mongoose')
const variantService = require('./variant.service')
const variantValidator = require('./variant.validator')

const variantController = {
    async patchVariant(req, res) {
        const { variantId } = req.params
        if (!mongoose.Types.ObjectId.isValid(variantId)) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Sai định dạng variantId' })
        }
        const { value, error } = variantValidator.validate(req.body, { abortEarly: false, convert: false })

        if (error) {
            const errors = error.details.map(err => {
                return { statusCode: 400, message: err.message, field: err.context.label }
            })
            return res.status(400).json({ statusCode: 400, success: false, error: errors })
        }

        try {
            const result = await variantService.patchVariant(variantId, value)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            console.log("Error patch variant:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Lỗi khi cập nhật variant',
            });
        }
    },

    async getVariantDetail(req, res) {
        const { variantId } = req.params
        if (!mongoose.Types.ObjectId.isValid(variantId)) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Sai định dạng variantId' })
        }

        try {
            const result = await variantService.getVariantDetail(variantId)
            return res.status(result.statusCode).json(result)
        } catch (error) {
            console.log("Error get variant detail:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Lỗi khi get variant detail',
            });
        }
    }
}

module.exports = variantController