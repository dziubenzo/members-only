const User = require('../models/User');

const asyncHandler = require('express-async-handler');

exports.sign_up_get = asyncHandler(async (req, res, next) => {
  // TODO: Redirect to Home if user is authenticated

  res.render('sign_up');
});

exports.sign_up_post = asyncHandler(async (req, res, next) => {
  res.send('Sign up POST');
});

exports.log_in_get = asyncHandler(async (req, res, next) => {
  res.send('Log in GET');
});

exports.log_in_post = asyncHandler(async (req, res, next) => {
  res.send('Log in POST');
});

exports.become_member_get = asyncHandler(async (req, res, next) => {
  res.send('Become member GET');
});

exports.become_member_post = asyncHandler(async (req, res, next) => {
  res.send('Become member POST');
});

exports.become_admin_get = asyncHandler(async (req, res, next) => {
  res.send('Become admin GET');
});

exports.become_admin_post = asyncHandler(async (req, res, next) => {
  res.send('Become admin POST');
});
