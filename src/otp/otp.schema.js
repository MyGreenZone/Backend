const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { MODEL_NAMES } = require('../../constants')


const otpSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER, required: true },
    type: { type: String, default: 'login' },
    code: { type: String, required: true },
    expired: { type: Date, required: true }
}, { timestamps: true });

const Otp = mongoose.models.Otp || mongoose.model(MODEL_NAMES.OTP, otpSchema)
module.exports = Otp
