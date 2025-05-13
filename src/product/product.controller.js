const mongoose = require('mongoose')
const productService = require('./product.service')
const variantService = require('../variant/variant.service')
const productValidator = require('./product.validator')
const Topping = require('../topping/topping.schema')

const productController = {

    async createProduct(req, res) {
        const { value, error } = productValidator.validate(req.body, { abortEarly: false, convert: false })
        if (error) {
            const errors = error.details.map(err => {
                return { statusCode: 400, message: err.message, field: err.context.label }
            })
            return res.status(400).json({ statusCode: 400, success: false, error: errors })
        }

        // Check duplicate sizes
        const duplicateSizesResult = checkDuplicateSizes(value.sizes)
        if (duplicateSizesResult) {
            return res.status(400).json(duplicateSizesResult)
        }

        try {
            const productResult = await productService.createProduct(value)

            // Case 1: Error 409: Create sản phẩm trùng tên
            if (productResult.statusCode === 409) {
                return res.status(productResult.statusCode).json(productResult)
            }

            const productId = productResult.data._id;
            const productData = {
                _id: productId,
                name: productResult.data.name,
                description: productResult.data.description,
                image: productResult.data.image,
            };
            const toppingDetails = await Topping.find({ _id: { $in: value.toppingIds || [] } });

            // Tạo variant
            let variants = [];
            // Case 2: Create product không có size
            if (!value.sizes || value.sizes.length === 0) {
                const defaultVariant = await variantService.createVariant(productId, {
                    sellingPrice: value.defaultSellingPrice || 10000
                })
                variants = [defaultVariant.data];

            } else {
                const variantsResult = await variantService.createVariants(productId, value.sizes)
                variants = variantsResult.data;
            }

            return res.status(201).json({
                statusCode: 201,
                success: true,
                data: {
                    ...productData,
                    variant: variants,
                    topping: toppingDetails
                }

            })

        } catch (error) {
            console.log("Error creating product:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'Lỗi khi tạo product',
            });
        }

    },
}


const checkDuplicateSizes = (sizes) => {
    if (sizes && sizes.length > 0) {
        const sizeNames = sizes.map(size => size.size)
        const duplicates = sizeNames.filter((size, index) => {
            return sizeNames.indexOf(size) !== index
        })
        if (duplicates.length > 0) {
            return { statusCode: 400, success: false, message: `Duplicate size: ${[...new Set(duplicates)].join(', ')}` }
        }
    }
    return null

}

module.exports = productController