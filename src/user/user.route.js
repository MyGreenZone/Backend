const express = require('express');
const userRouter = express.Router();
const userController = require('./user.controller');
const AuthMiddleWare = require('../middlewares/auth.middleware');



router.get('/profile', AuthMiddleWare.authorize, userController.getProfile);

module.exports = router;
