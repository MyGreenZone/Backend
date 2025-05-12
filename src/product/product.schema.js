
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { MODEL_NAMES } = require("../../constants");


const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: MODEL_NAMES.CATEGORY }],
    toppingIds: [{ type: Schema.Types.ObjectId, ref: MODEL_NAMES.TOPPING }],
}, { timestamps: true });
const Product = mongoose.models.Product || mongoose.model(MODEL_NAMES.PRODUCT, productSchema);
module.exports = Product;
