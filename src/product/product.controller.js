const mongoose = require('mongoose')
const productService = require('./product.service')
const variantService = require('../variant/variant.service')
const productValidator = require('./product.validator')
const productController = {

    async createProduct(req, res) {
        const { value, error } = productValidator.validate(req.body, { abortEarly: false, convert: false })
        if (error) {

            const errors = error.details.map(err => {
                return { statusCode: 400, message: err.message, field: err.context.label }
            })

            return res.status(400).json({
                statusCode: 400,
                success: false,
                error: errors
            })
        }
        try {
            const productResult = await productService.createProduct(value)

            if (productResult.statusCode === 409) {
                return res.status(productResult.statusCode).json(productResult)
            } else {
                if (!value.sizes || value.sizes.length === 0) {
                    const defaultVariant = await variantService.createVariant(
                        productResult.data._id,
                        { sellingPrice: value.defaultSellingPrice || 10000 }
                    )
                    return res.status(defaultVariant.statusCode).json(defaultVariant)
                }
                const variantsResult = await variantService.createVariants(
                    productResult.data._id,
                    value.sizes
                )
                return res.status(variantsResult.statusCode).json(variantsResult)
            }

        } catch (error) {
            console.log("Error creating product:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Lỗi khi tạo product',
            });
        }



    }
}

module.exports = productController