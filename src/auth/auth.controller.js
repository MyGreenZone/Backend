
// authController.js
const User = require('./user.schema')
const Otp = require('../otp/otp.schema')
const authService = require('./auth.service')
const { ROLE } = require('../../constants')
const jwt = require('jsonwebtoken');
const config = require("../../configs/envConfig");
const { employeeLoginValidator } = require('./auth.validator')
const generateOtpCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const authController = {
  async sendOtp(req, res) {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res.status(400).json({ success: false, message: 'Phone number is required' });
      }

      // Kiểm tra số điện thoại có hợp lệ không (thêm validation cho phoneNumber nếu cần)
      const phoneRegex = /^[0-9]{10}$/; // Đây là ví dụ về regex kiểm tra số điện thoại (có thể thay đổi cho phù hợp)
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ success: false, message: 'Invalid phone number format' });
      }

      // Kiểm tra xem người dùng đã tồn tại hay chưa
      let user = await User.findOne({ phoneNumber });

      if (!user) {
        // Nếu người dùng chưa tồn tại, tạo mới và gán role mặc định là 'Customer'
        user = await User.create({ phoneNumber, roles: ['681c8c3c5ef65cec792c1056'] });
      }

      // Tạo mã OTP
      const code = generateOtpCode(); // Hàm này sẽ tạo một mã OTP ngẫu nhiên
      const expiredAt = new Date(Date.now() + 10 * 60 * 1000); // OTP hết hạn sau 10 phút

      // Lưu thông tin OTP vào database
      const otp = await Otp.create({
        user: user._id,
        type: 'login',
        code,
        expired: expiredAt
      });

      // Đây là nơi bạn có thể tích hợp dịch vụ gửi OTP qua SMS (như Twilio, Nexmo, v.v.)
      console.log(`Send OTP ${code} to ${phoneNumber}`);

      // Trả về phản hồi thành công
      return res.status(201).json({
        statusCode: 201,
        success: true,
        message: 'Sent OTP successfully',
        data: {
          user: user._id,
          type: 'login',
          code,
          expired: expiredAt,
          _id: otp._id,
          __v: otp.__v
        }
      });
    } catch (error) {
      console.log('Send OTP error:', error);
      return res.status(500).json({ statusCode: 500, success: false, message: 'Internal server error' });
    }
  },

  async verifyOtp(req, res) {
    try {
      const { phoneNumber, code } = req.body;

      if (!phoneNumber || !code) {
        return res.status(400).json({ success: false, message: 'Phone number and code are required' });
      }

      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const otp = await Otp.findOne({
        user: user._id,
        code,
        type: 'login',
        expired: { $gt: new Date() } // chưa hết hạn
      });

      if (!otp) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP code' });
      }

      // Xóa OTP sau khi dùng
      await Otp.deleteOne({ _id: otp._id });

      // Tạo token
      const accessToken = jwt.sign(
        {
          typeToken: 'accessToken',
          id: user._id,
          phoneNumber,
          role: ROLE.CUSTOMER.value
        },
        config.SECRETKEY,
        { expiresIn: '10d' } // 864000s
      );

      const refreshToken = jwt.sign(
        { typeToken: 'refreshToken', phoneNumber },
        config.SECRETKEY,
        { expiresIn: '30d' } // 2592000s
      );

      return res.status(201).json({
        statusCode: 201,
        success: true,
        data: {
          user,
          token: {
            accessToken: {
              token: accessToken,
              expiresIn: 864000
            },
            refreshToken: {
              token: refreshToken,
              expiresIn: 2592000
            }
          }
        }
      });
    } catch (error) {
      console.log('Verify OTP error:', error);
    }
  },

  async register(req, res) {
    try {
      // Lấy token từ header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authorization token missing' });
      }

      const token = authHeader.split(' ')[1];

      // Giải mã token
      let payload;
      try {
        payload = jwt.verify(token, config.SECRETKEY);
      } catch (err) {
        return res.status(401).json({ statusCode: 401, success: false, message: 'Invalid or expired token' });
      }

      const phoneNumber = payload.phoneNumber;
      if (!phoneNumber) {
        return res.status(400).json({ statusCode: 400, success: false, message: 'Invalid token: missing phone number' });
      }

      const user = await User.findOne({ phoneNumber }).populate('roles');
      if (!user) {
        return res.status(404).json({ statusCode: 404, success: false, message: 'User not found' });
      }

      const { firstName, lastName, email, dateOfBirth, gender } = req.body;

      if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
        return res.status(400).json({ statusCode: 400, success: false, message: 'lastName is required' });
      }

      // Cập nhật thông tin
      user.lastName = lastName;
      if (firstName !== undefined) user.firstName = firstName;
      if (email !== undefined) user.email = email;
      if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
      if (gender !== undefined) user.gender = gender;

      await user.save();

      // Tạo access token mới sau khi cập nhật
      const accessToken = jwt.sign(
        { typeToken: 'accessToken', phoneNumber },
        config.SECRETKEY,
        { expiresIn: '10d' }
      );

      const refreshToken = jwt.sign(
        { typeToken: 'refreshToken', phoneNumber },
        config.SECRETKEY,
        { expiresIn: '30d' }
      );

      return res.status(201).json({
        statusCode: 201,
        success: true,
        data: {
          user,
          token: {
            accessToken: {
              token: accessToken,
              expiresIn: '864000s'
            },
            refreshToken: {
              token: refreshToken,
              expiresIn: '2592000s'
            }
          }
        }
      });

    } catch (error) {
      console.log('Register error:', error);
      return res.status(500).json({ statusCode: 500, success: false, message: 'Internal server error' });
    }
  },

  async getProfile(req, res) {
    try {
      // Lấy token từ header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ statusCode: 401, success: false, message: 'Authorization token missing' });
      }

      const token = authHeader.split(' ')[1];

      // Giải mã token
      let payload;
      try {
        payload = jwt.verify(token, config.SECRETKEY);
      } catch (err) {
        return res.status(401).json({ statusCode: 401, success: false, message: 'Invalid or expired token' });
      }

      const phoneNumber = payload.phoneNumber;
      if (!phoneNumber) {
        return res.status(400).json({ statusCode: 400, success: false, message: 'Invalid token: missing phone number' });
      }

      // Tìm người dùng theo số điện thoại
      const user = await User.findOne({ phoneNumber }).populate('roles');
      if (!user) {
        return res.status(404).json({ statusCode: 404, success: false, message: 'User not found' });
      }

      // Trả về thông tin người dùng
      return res.status(200).json({
        statusCode: 200,
        success: true,
        data: user
      });

    } catch (error) {
      console.log('Get profile error:', error);
      return res.status(500).json({ statusCode: 500, success: false, message: 'Internal server error' });
    }
  },


  async employeeLogin(req, res) {
    const { value, error } = employeeLoginValidator.validate(req.body, { abortEarly: false, convert: false });
    if (error) {
      const errors = error.details.map(err => ({
        message: err.message,
        field: err.context.label
      }));
      return res.status(400).json({
        statusCode: 400,
        success: false,
        error: errors,
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      });
    }
    try {

      const result = await authService.employeeLogin(value)
      return res.status(result.statusCode).json({
        ...result,
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      })
    } catch (error) {
      console.log('Employee login error', error);
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: `Employee login error ${error}`,
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      });
    }
  }


}

module.exports = authController
