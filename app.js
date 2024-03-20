const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const compression = require('compression');
const helmet = require('helmet');

const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./config/passport');

const indexRouter = require('./routes/index');
const messageRouter = require('./routes/message');
const userRouter = require('./routes/user');

const app = express();

// MongoDB connection
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

// Set up rate limiter: maximum of forty requests per minute
const RateLimit = require('express-rate-limit');
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 40,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.session());
app.use(compression());
app.use(helmet());
app.use(limiter);

passport.use(passportConfig.localStrategy);
passport.serializeUser(passportConfig.serialiseFunction);
passport.deserializeUser(passportConfig.deserialiseFunction);

app.use(passportConfig.userObjectMiddleware);

app.use('/', indexRouter);
app.use('/', messageRouter);
app.use('/', userRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
