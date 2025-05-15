const Product = require('./product.schema');
const Category = require('../category/category.schema')
const Topping = require('../topping/topping.schema');
const Variant = require('../variant/variant.schema');
const mongoose = require('mongoose');
const variantService = require('../variant/variant.service');

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


const productService = {
    async createProduct(data) {
        // Check duplicate sizes
        const duplicateResult = checkDuplicateSizes(data.sizes);
        if (duplicateResult) {
            return duplicateResult;
        }

        // Check trùng tên
        const existing = await Product.findOne({ name: data.name });
        if (existing) {
            return {
                statusCode: 409,
                success: false,
                message: 'This product name has been existed'
            };
        }

        // Tạo product
        const newProduct = await Product.create(data);
        const productId = newProduct._id;

        // Lấy topping detail
        const toppingDetails = await Topping.find({
            _id: { $in: data.toppingIds || [] }
        });

        // Tạo variants
        let variants = [];
        if (!data.sizes || data.sizes.length === 0) {
            const defaultVariant = await variantService.createVariant(productId, {
                sellingPrice: data.sellingPrice || 10000
            });
            variants = [defaultVariant.data];
        } else {
            const variantsResult = await variantService.createVariants(productId, data.sizes);
            variants = variantsResult.data;
        }

        return {
            statusCode: 201,
            success: true,
            message: 'Created product successfully',
            data: {
                _id: productId,
                name: newProduct.name,
                description: newProduct.description,
                image: newProduct.image,
                sellingPrice: newProduct.sellingPrice,
                createdAt: newProduct.createdAt,
                updatedAt: newProduct.updatedAt,
                variant: variants,
                topping: toppingDetails
            }
        };
    },


    async getProductDetail(productId) {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return { statusCode: 400, success: false, message: 'Invalid product ID' };
        }

        const product = await Product.findById(productId);
        if (!product) {
            return { statusCode: 404, success: false, message: 'Product not found' };
        }

        const toppings = await Topping.find({ _id: { $in: product.toppingIds || [] } });
        const variants = await Variant.find({ productId });

        return {
            statusCode: 200,
            success: true,
            message: 'Get product detail successfully',
            data: {
                _id: product._id,
                name: product.name,
                description: product.description,
                image: product.image,
                sellingPrice: product.sellingPrice,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                variant: variants,
                topping: toppings
            }
        };
    },


    async getAllProducts() {

        const categories = await Category.find({}).lean()

        const data = await Promise.all(
            categories.map(async cate => {

                const products = await Product.find({ categoryIds: { $in: [cate._id] } }).lean();
                const productData = products.map(product => {
                    return {
                        _id: product._id,
                        name: product.name,
                        description: product.description,
                        image: product.image,
                        sellingPrice: product.sellingPrice,
                        createdAt: product.createdAt,
                        updatedAt: product.updatedAt,
                    }

                })
                return { ...cate, products: productData }
            })
        )

        return { statusCode: 200, success: true, message: 'Get all product successfully', data: data }
    },

    async getLatestProducts(limit = 10, page = 1) {

        const skip = (page - 1) * limit;
        const totalDocs = await Product.countDocuments();
        const totalPages = Math.ceil(totalDocs / limit);

        const latestProducts = await Product.find()
            .sort({ createdAt: 'descending' })
            .skip(skip)
            .limit(limit)
            .lean();

        // Lấy categories tương ứng từng sản phẩm
        const data = await Promise.all(
            latestProducts.map(async (product) => {
                const categories = await Category.find({ _id: { $in: product.categoryIds || [] } }).lean();

                return {
                    _id: product._id,
                    name: product.name,
                    description: product.description,
                    image: product.image,
                    sellingPrice: product.sellingPrice,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                    categories,
                };
            })
        );

    
        return {
            statusCode: 200,
            success: true,
            message: 'Get latest product successfully',
            data: {
                page,
                limit,
                totalDocs,
                totalPages,
                docs: data,
            },
        };
    },


    async patchProduct(productId, data) {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return { statusCode: 400, success: false, message: 'Sai định dạng productId' }
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, data, { new: true, runValidators: true }).lean()
        if (!updatedProduct) {
            return { statusCode: 404, success: false, message: 'Product not found' }
        }

        const toppings = await Topping.find({ _id: { $in: updatedProduct.toppingIds || [] } });
        const variants = await Variant.find({ productId });

        return {
            statusCode: 200,
            success: true,
            message: 'Updated product successfully',
            data: {
                _id: updatedProduct._id,
                name: updatedProduct.name,
                description: updatedProduct.description,
                image: updatedProduct.image,
                sellingPrice: updatedProduct.sellingPrice,
                createdAt: updatedProduct.createdAt,
                updatedAt: updatedProduct.updatedAt,
                variant: variants,
                topping: toppings
            }
        };
    }
}



module.exports = productService