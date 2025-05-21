const Variant = require('./variant.schema')
const Product = require('../product/product.schema')
const variantService = {
    async createVariant(productId, requestBody, enableValidate = false) {
        if (enableValidate) {
            const product = await Product.findById(productId)
            if (!product) return { statusCode: 404, success: false, message: 'Product not found' }

            const variant = await Variant.findOne({ productId, size: requestBody.size })
            if (variant) return { statusCode: 400, success: false, message: 'This variant name has been existed' }
        }

        const newVariant = await Variant.create({ ...requestBody, productId })
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

    async patchVariant(variantId, requestBody) {
        const variant = await Variant.findById(variantId)
        if (!variant) {
            return { statusCode: 404, success: false, message: 'Variant not found' }
        }
        // So sánh để xác định có cập nhật gì không
        const isSameSize = requestBody.size === variant.size;
        const isSamePrice = requestBody.sellingPrice === variant.sellingPrice;
        const isSameActive = requestBody.active === variant.active;

        if (isSameSize && isSamePrice && isSameActive) {
            return {
                statusCode: 400,
                success: false,
                message: 'No changes detected.'
            };
        }

        const duplicatedVariant = await Variant.findOne({
            productId: variant.productId,
            size: requestBody.size,
            _id: { $ne: variantId }
        });

        if (duplicatedVariant) return { statusCode: 400, success: false, message: 'This variant name has been existed' }

        if ('size' in requestBody) variant.size = requestBody.size;
        if ('sellingPrice' in requestBody) variant.sellingPrice = requestBody.sellingPrice;
        if ('active' in requestBody) variant.active = requestBody.active;


        await variant.save()

        return { statusCode: 200, success: true, message: 'Patched variant successfully', data: variant }
    },

    async getVariantDetail(variantId) {
        const detail = await Variant.findById(variantId).lean().populate('productId')

        if (!detail) {
            return { statusCode: 404, success: false, message: 'Variant not found' }
        }
        const data = { ...detail, product: detail.productId }
        delete (data.productId)
        return { statusCode: 200, success: true, message: 'Get variant detail successfully', data }
    }




}
module.exports = variantService