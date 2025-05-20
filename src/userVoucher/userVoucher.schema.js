const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { MODEL_NAMES, DeliveryMethod, OrderStatus, PaymentMethod } = require('../../constants');
const userVoucherSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER, required: true },
    voucherId: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.VOUCHER, required: true },
    exchangedAt: { type: Date, required: true }
}, { timestamps: true });

const UserVoucher = mongoose.models.UserVoucher || mongoose.model(MODEL_NAMES.USER_VOUCHER, userVoucherSchema)
module.exports = UserVoucher


