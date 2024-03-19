const Message = require('../models/Message');

const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
  // Get all messages, sorted newest, from DB
  const allMessages = await Message.find({})
    .populate('author')
    .sort({ date: -1 });

  res.render('index', { title: 'Messages', allMessages });
});
