const User = require('../models/User');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.sign_up_get = asyncHandler(async (req, res, next) => {
  // TODO: Redirect to Home if user is authenticated

  res.render('sign_up', { title: 'Sign Up' });
});

exports.sign_up_post = [
  // Validate and sanitise all sign up form fields
  body('username', 'Username field must contain between 3 and 32 characters.')
    .trim()
    .isLength({ min: 3, max: 32 })
    .escape(),

  body(
    'first_name',
    'First name field must contain between 2 and 100 characters.'
  )
    .trim()
    .isLength({ min: 2, max: 100 })
    .escape(),

  body(
    'last_name',
    'Last name field must contain between 2 and 100 characters.'
  )
    .trim()
    .isLength({ min: 2, max: 100 })
    .escape(),

  body('password', 'Password field must contain between 3 and 100 characters.')
    .trim()
    .isLength({ min: 3, max: 100 })
    .escape(),

  body('confirm_password', 'Passwords do not match.').custom(
    (value, { req }) => {
      return value.toString() === req.body.password.toString();
    }
  ),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    let newUser;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const username = req.body.username;
    const password = req.body.password;

    // Hash password asynchronously
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check for errors
    if (!hashedPassword) {
      res.render('error', {
        message: 'Something went wrong while creating a user. Please try again',
      });
      return;
      // Create new user with hashed password
    } else {
      newUser = new User({
        first_name: first_name,
        last_name: last_name,
        username: username,
        password: hashedPassword,
      });
    }

    // Render the page again with sanitised values and error messages if there are errors
    if (!errors.isEmpty()) {
      res.render('sign_up', {
        title: 'Sign Up',
        newUser,
        errors: errors.array(),
      });
      return;
    } else {
      // Check if the user with the same username already exists
      const userExists = await User.findOne({ username: username }).exec();

      // Render the form again with relevant error message
      if (userExists) {
        // Create custom error array for use in the template
        const errorArray = [{ msg: 'Username already taken.' }];

        res.render('sign_up', {
          title: 'Sign Up',
          newUser,
          errors: errorArray,
        });
        return;
      } else {
        // Save user and redirect to Home
        await newUser.save();
        res.redirect('/');
      }
    }
  }),
];

exports.log_in_get = asyncHandler(async (req, res, next) => {
  // TODO: Redirect to Home if user is authenticated

  res.render('log_in', { title: 'Log In' });
});

exports.log_in_post = [
  passport.authenticate('local', {
    successRedirect: '/',
    failWithError: true,
  }),

  // Show login page with error if login attempt unsuccessful
  (err, req, res, next) => {
    const errorArray = [{ msg: 'Login failed. Please try again.' }];
    res.render('log_in', { errors: errorArray });
    return;
  },
];

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
