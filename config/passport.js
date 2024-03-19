const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Local strategy
exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false);
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

// Serialise function
exports.serialiseFunction = (user, done) => {
  done(null, user.id);
};

// Deserialise function
exports.deserialiseFunction = async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
};

// Make user object available in views by default
exports.userObjectMiddleware = (req, res, next) => {
  res.locals.user = req.user;
  next();
};

// Redirect to Home when logged in
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    next();
  }
};

// Redirect to Home when NOT logged in
exports.isNotLoggedIn = (req, res, next) => {
  if (req.isUnauthenticated()) {
    res.redirect('/');
  } else {
    next();
  }
};
