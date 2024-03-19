const User = require('../models/User');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const isLoggedIn = require('../config/passport').isLoggedIn;
const isNotLoggedIn = require('../config/passport').isNotLoggedIn;
const isMember = require('../config/passport').isMember;
const isAdmin = require('../config/passport').isAdmin;

exports.sign_up_get = [
  isLoggedIn,
  asyncHandler(async (req, res, next) => {
    res.render('sign_up', { title: 'Sign Up' });
  }),
];

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

exports.log_in_get = [
  isLoggedIn,
  asyncHandler(async (req, res, next) => {
    res.render('log_in', { title: 'Log In' });
  }),
];

exports.log_in_post = [
  passport.authenticate('local', {
    successRedirect: '/',
    failWithError: true,
  }),

  // Show login page with error if login attempt unsuccessful
  (err, req, res, next) => {
    const errorArray = [{ msg: 'Login failed. Please try again.' }];
    res.render('log_in', { title: 'Log In', errors: errorArray });
    return;
  },
];

exports.log_out = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      res.render('error', {
        message: 'Logout error. Please try again',
      });
      return;
    }
    res.redirect('/');
  });
});

exports.become_member_get = [
  isNotLoggedIn,
  isMember,
  asyncHandler(async (req, res, next) => {
    res.render('become_member', { title: 'Become Member' });
  }),
];

exports.become_member_post = [
  // Validate and sanitise answer
  body('answer', 'Wrong answer! Tip: the answer is 6, but not quite.')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom((value) => {
      return value.toString() === process.env.MEMBER_CORRECT_ANSWER.toString();
    }),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    const userID = req.user._id;

    // Render the page again with sanitised values and error messages if there are errors
    if (!errors.isEmpty()) {
      res.render('become_member', {
        title: 'Become Member',
        errors: errors.array(),
      });
      return;
    } else {
      // Update user permissions and redirect to Home
      await User.findByIdAndUpdate(userID, { is_member: true });
      res.redirect('/');
    }
  }),
];

exports.become_admin_get = [
  isNotLoggedIn,
  isAdmin,
  asyncHandler(async (req, res, next) => {
    res.send('Become admin GET');
  }),
];

exports.become_admin_post = asyncHandler(async (req, res, next) => {
  res.send('Become admin POST');
});
