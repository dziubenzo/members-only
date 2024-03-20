const Message = require('../models/Message');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const isNotLoggedIn = require('../config/passport').isNotLoggedIn;
const mustBeAdmin = require('../config/passport').mustBeAdmin;

exports.new_message_get = [
  isNotLoggedIn,
  asyncHandler(async (req, res, next) => {
    res.render('new_message', { title: 'New Message' });
  }),
];

exports.new_message_post = [
  // Validate and sanitise both new message form fields
  body('title', 'Title field must contain between 3 and 64 characters.')
    .trim()
    .isLength({ min: 3, max: 64 })
    .escape(),

  body('content', 'Content field must contain between 3 and 160 characters.')
    .trim()
    .isLength({ min: 3, max: 160 }),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    const title = req.body.title;
    const content = req.body.content;

    // Create new message
    // Take user from the user object
    const message = new Message({
      author: req.user._id,
      title: title,
      content: content,
    });

    // Render the page again with sanitised values and error messages if there are errors
    if (!errors.isEmpty()) {
      res.render('new_message', {
        title: 'New Message',
        message,
        errors: errors.array(),
      });
      return;
    } else {
      // Save message and redirect to Home
      await message.save();
      res.redirect('/');
    }
  }),
];

exports.delete_message = [
  mustBeAdmin,
  asyncHandler(async (req, res, next) => {
    // Delete message based on URL parameter
    // Redirect to Home
    await Message.findByIdAndDelete(req.params.id);
    res.redirect('/');
  }),
];
