var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
var logger = require('morgan');
const cors = require('cors');


require("./models/userSchema")
require("./models/roleSchema")
require("./models/otpSchema")
require("./models/storeSchema")
require("./models/imageSchema")
require("./models/employeeSchema")


// config mongoose
const mongoose = require('mongoose')

// connect database
// https://restapirepo.onrender.com/

mongoose.connect("mongodb://localhost:27017/MyGreenZone")
// mongoose.connect("mongodb+srv://ngocdaibui99:9luzjjPyAZTUtKXF@daingoc99.ulnqr.mongodb.net/MyGreenZone")
  .then(() => console.log(">>>>>>>>>> DB Connected!!!!!!"))
  .catch((err) => console.log(">>>>>>>>> DB Error: ", err));

const authRouter = require('./routes/authRoutes');
const storeRouter = require('./routes/storeRoutes');
const fileRouter = require('./routes/fileRoutes');
const employeeRouter = require('./routes/employeeRoutes');


var app = express();

// swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./configs/swaggerConfig');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/auth', authRouter);
app.use('/v1/store', storeRouter);
app.use('/file', fileRouter);
app.use('/v1/employee', employeeRouter);



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
  res.render('error');
});

module.exports = app
