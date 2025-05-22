// delivery.schema.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { MODEL_NAMES } = require('../../constants')

const deliverySchema = new Schema({
    employee: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.EMPLOYEE, required: true },
    order: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.ORDER, required: true },
    isCompleted: { type: Boolean, required: true, default: false }
}, { timestamps: true });


const Delivery = mongoose.models.Delivery || mongoose.model(MODEL_NAMES.DELIVERY, deliverySchema)
module.exports = Delivery