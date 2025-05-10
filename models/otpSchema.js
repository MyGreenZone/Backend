const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Interface IOtpRequest không thể sử dụng trong CommonJS, bạn có thể thay thế bằng cách sử dụng loại dữ liệu thông qua kiểu Schema.
const otpSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, default: 'login' },
    code: { type: String, required: true },
    expired: { type: Date, required: true }
}, { timestamps: true });

const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema)
module.exports = Otp
