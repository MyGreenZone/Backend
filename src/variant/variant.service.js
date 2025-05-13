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
    }

}
module.exports = variantService