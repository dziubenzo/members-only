const Message = require('../models/Message');
const User = require('../models/User');
const isNotLoggedIn = require('../config/passport').isNotLoggedIn;

const asyncHandler = require('express-async-handler');

exports.new_message_get = [
  isNotLoggedIn,
  asyncHandler(async (req, res, next) => {
    res.render('new_message', { title: 'New Message' });
  }),
];

exports.new_message_post = asyncHandler(async (req, res, next) => {
  res.send('Create message POST');
});
