const Variant = require('./variant.schema')
const variantService = {
    async createVariant(productId, data) {
        const newVariant = await Variant.create({ ...data, productId })
        return { statusCode: 201, success: true, message: 'Created variant successfully', data: newVariant }
    },

    async createVariants(productId, variants) {
        const dataWithProductId = variants.map(variant => {
            return { ...variant, productId }
        })
        const newVariants = await Variant.insertMany(dataWithProductId)
        return {
            statusCode: 201,
            success: true,
            message: 'Created variants successfully',
            data: newVariants
        }
    },

    async patchVariant(variantId, data) {
        const patchedVariant = await Variant.findByIdAndUpdate(
            variantId,
            data,
            { new: true, runValidators: true, timestamps: true }
        )

        if (!patchedVariant) {
            return { statusCode: 404, success: false, message: 'Variant not found' }
        }
        return { statusCode: 200, success: true, message: 'Patched variant successfully', data: patchedVariant }
    },

    async getVariantDetail(variantId) {
        const detail = await Variant.findById(variantId).lean().populate('productId')

        if (!detail) {
            return { statusCode: 404, success: false, message: 'Variant not found' }
        }
        const data = { ...detail, product: detail.productId }
        delete(data.productId)
        return { statusCode: 200, success: true, message: 'Get variant detail successfully', data }
    }

   


}
module.exports = variantService