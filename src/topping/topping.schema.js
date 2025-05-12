const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { MODEL_NAMES } = require('../../constants')
const toppingSchema = new Schema({
    name: { type: String, required: true },
    extraPrice: { type: Number, required: true, min: 1000 },
    active: { type: Boolean, default: true }
}, { timestamps: true });

const Topping = mongoose.models.Topping || mongoose.model(MODEL_NAMES.TOPPING, toppingSchema)
module.exports = Topping;