// order.schema.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { MODEL_NAMES } = require('../../constants');
const { required } = require('joi');

const orderSchema = new Schema({
    deliveryMethod: { type: String, enum: ['pickup', 'delivery'], required: true },
    fulfillmentDateTime: { type: Date, required: true },
    totalPrice: { type: Number, required: true, default: 0 },
    paymentMethod: { type: String, enum: ['online', 'cod'], required: true },
    consigneeName: { type: String },
    consigneePhone: { type: String },
    shippingAddress: { type: String },
    store: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.STORE, required: true },
    owner: { type: String },
    voucher: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.VOUCHER },
    orderItems: [{
        variant: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.VARIANT, required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true, default: 1000 },
        toppingItems: [
            {
                topping: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.TOPPING, required: true },
                quantity: { type: Number, required: true, default: 1 },
                price: { type: Number, required: true, default: 1000 },
            }
        ]
    }],
    latitude: { type: String },
    longitude: { type: String }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model(MODEL_NAMES.ORDER, orderSchema)
module.exports = Order