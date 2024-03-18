const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  last_name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 32,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  is_member: {
    type: Boolean,
    default: false,
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
});

// Virtual for user's full name
UserSchema.virtual('full_name').get(function () {
  return `${this.first_name} ${this.last_name}`;
});

// Virtual for user's status (Non-Member, Member, Admin)
UserSchema.virtual('status').get(function () {
  if (this.is_admin) {
    return 'Admin';
  } else if (this.is_member) {
    return 'Member';
  } else {
    return 'Non-Member';
  }
});

module.exports = mongoose.model('User', UserSchema);
