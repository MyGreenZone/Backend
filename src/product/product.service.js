const Product = require('./product.schema')
const productService = {
    async createProduct(data) {
        const existing = await Product.findOne({ name: data.name })
        if (existing) {
            return { statusCode: 409, success: false, message: 'This product name has been existed' }
        }
        const newProduct = await Product.create(data)
        return { statusCode: 201, success: true, message: 'Created product successfully', data: newProduct }
    }
}

module.exports = productService