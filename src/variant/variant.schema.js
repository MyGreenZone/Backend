const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { MODEL_NAMES } = require("../../constants");

const variantSchema = new Schema({
    size: { type: String, required: true, default: 'M' },
    sellingPrice: { type: Number, required: true, default: 10000 },
    active: { type: Boolean, default: true },
    productId: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.PRODUCT }

}, { timestamps: true });
const Variant = mongoose.models.Variant || mongoose.model(MODEL_NAMES.VARIANT, variantSchema);
module.exports = Variant;