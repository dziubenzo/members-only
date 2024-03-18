const Message = require('../models/Message');
const User = require('../models/User');

const asyncHandler = require('express-async-handler');

exports.create_message_get = asyncHandler(async (req, res, next) => {
  res.send('Create message GET');
});

exports.create_message_post = asyncHandler(async (req, res, next) => {
  res.send('Create message POST');
});
