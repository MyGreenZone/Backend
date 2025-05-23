// order.schema.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { MODEL_NAMES, DeliveryMethod, OrderStatus, PaymentMethod } = require('../../constants');


const orderSchema = new Schema({
    deliveryMethod: { type: String, enum: DeliveryMethod.getValues(), required: true },
    fulfillmentDateTime: { type: Date, required: true },
    status: { type: String, enum: OrderStatus.getValues(), required: true, default: OrderStatus.AWAITING_PAYMENT.value },
    note: { type: String },
    totalPrice: { type: Number, required: true, default: 0, min: 0 },
    shippingFee: { type: Number, required: true, default: 0 },
    paymentMethod: { type: String, enum: PaymentMethod.getValues(), required: true },
    consigneeName: { type: String },
    consigneePhone: { type: String },
    shippingAddress: { type: String },

    cancelReason: { type: String },

    latitude: { type: String },
    longitude: { type: String },

    pendingConfirmationAt: { type: Date, default: null },
    readyForPickupAt: { type: Date, default: null },
    shippingOrderAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },

    owner: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER, default: null },
    shipper: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.EMPLOYEE, default: null },
    creator: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.EMPLOYEE, default: null },
    store: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.STORE, required: true },
    voucher: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.VOUCHER, default: null },
    paymentStatus: { type: String, enum: ['success', 'failed', 'cancelled'] },
    transactionId: { type: String },
    orderItems: [{
        variant: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.VARIANT, required: true },
        quantity: { type: Number, required: true, default: 1, min: 1 },
        price: { type: Number, required: true, default: 1000, min: 0 },
        toppingItems: [
            {
                topping: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.TOPPING, required: true },
                quantity: { type: Number, required: true, default: 1, min: 1 },
                price: { type: Number, required: true, default: 1000, min: 0 },
            }
        ]
    }],

}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model(MODEL_NAMES.ORDER, orderSchema)
module.exports = Order