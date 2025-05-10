// middleware/auth.js

const jwt = require('jsonwebtoken');
const config = require("../configs/envConfig");
// Middleware kiểm tra JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Lấy token từ header Authorization

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, config.SECRETKEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;  // Gắn thông tin người dùng vào request để có thể sử dụng ở các bước tiếp theo
    next();
  });
};

module.exports = authenticateJWT;
