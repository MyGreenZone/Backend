const mongoose = require('mongoose')
const Schema = mongoose.Schema
const toppingSchema = new Schema({
    name: { type: String, required: true },
    extraPrice: { type: Number, required: true, min: 1000 }
}, { timestamps: true });

const Topping = mongoose.models.Topping || mongoose.model('Topping', toppingSchema)
module.exports = Topping;