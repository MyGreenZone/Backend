const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { MODEL_NAMES } = require("../../constants");
const voucherSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    code: { type: String, required: true, unique: true },
    voucherType: { type: String, enum: ['global', 'store'], required: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true },
    requiredPoints: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {type: String, required: true, default: 'active'}
}, { timestamps: true });

const Voucher = mongoose.models.Voucher || mongoose.model(MODEL_NAMES.VOUCHER, voucherSchema);
module.exports = Voucher;

