const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose')
const app = express();
const swaggerDocument = require('../configs/swaggerConfig');


require("./auth/user.schema")
require("./role/role.schema")
require("./otp/otp.schema")
require("./store/store.schema")
require("./image/image.schema")
require("./employee/employee.schema")
require("./category/category.schema")
require("./topping/topping.schema")
require("./product/product.schema")
require("./variant/variant.schema")
require("./voucher/voucher.schema")
require("./order/order.schema")


const authRouter = require('./auth/auth.route');
const storeRouter = require('./store/store.route');
const imageRouter = require('./image/image.route');
const employeeRouter = require('./employee/employee.route');
const categoryRouter = require('./category/category.route');
const toppingRouter = require('./topping/topping.route');
const productRouter = require('./product/product.route');
const variantRouter = require('./variant/variant.route');
const voucherRouter = require('./voucher/voucher.route');
const orderRouter = require('./order/order.route');

// https://restapirepo.onrender.com/
// mongoose.connect("mongodb://localhost:27017/MyGreenZone")
mongoose.connect("mongodb+srv://ngocdaibui99:9luzjjPyAZTUtKXF@daingoc99.ulnqr.mongodb.net/MyGreenZone")
  .then(() => console.log(">>>>>>>>>> DB Connected!!!!!!"))
  .catch((err) => console.log(">>>>>>>>> DB Error: ", err));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/v1/store', storeRouter);
app.use('/file', imageRouter);
app.use('/v1/employee', employeeRouter);
app.use('/v1/category', categoryRouter);
app.use('/v1/topping', toppingRouter);
app.use('/v1/product', productRouter);
app.use('/v1/variant', variantRouter);
app.use('/v1/voucher', voucherRouter);
app.use('/v1/order', orderRouter);

app.get('/', (req, res) => {
  res.send('Server is running!');
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});



module.exports = app
