
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const userSchema = new Schema({
    phoneNumber: { type: String },
    email: { type: String },
    gender: { type: String },
    avatar: { type: String },
    verifyPhoneNumber: { type: Boolean, default: false },
    verifyMail: { type: Boolean, default: false },
    seed: { type: Number, default: 0 }, // <== Thêm default
    code: { type: String, default: function () {
      // Tạo mã ví dụ như: G + thời gian hoặc random
      const random = Math.floor(100000000 + Math.random() * 900000000);
      return `G${random}`;
    }},
    firstName: { type: String },
    lastName: { type: String },
    roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }]
  });
  

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;