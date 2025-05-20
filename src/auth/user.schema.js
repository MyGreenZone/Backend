
const mongoose = require("mongoose");
const { MODEL_NAMES } = require("../../constants");

const Schema = mongoose.Schema
const userSchema = new Schema({
  phoneNumber: { type: String, default: null },
  email: { type: String, default: null },
  gender: { type: String, default: null },
  avatar: { type: String, default: null },
  verifyPhoneNumber: { type: Boolean, default: false },
  verifyMail: { type: Boolean, default: false },
  seed: { type: Number, default: 0 }, 
  code: {
    type: String, default: function () {
      // Tạo mã ví dụ như: G + thời gian hoặc random
      const random = Math.floor(100000000 + Math.random() * 900000000);
      return `G${random}`;
    }
  },
  firstName: { type: String, default: null },
  lastName: { type: String, default: 'Khách vãng lai' },
  roles: [{ type: Schema.Types.ObjectId, ref: MODEL_NAMES.ROLE }]
});


const User = mongoose.models.User || mongoose.model(MODEL_NAMES.USER, userSchema);
module.exports = User;