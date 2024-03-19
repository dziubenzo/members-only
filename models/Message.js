const mongoose = require('mongoose');
const formatDistanceToNow = require('date-fns').formatDistanceToNow;

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 64,
  },
  content: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 160,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Virtual for time distance to now
MessageSchema.virtual('time_distance').get(function () {
  return formatDistanceToNow(this.date, {
    addSuffix: true,
    includeSeconds: true,
  });
});

module.exports = mongoose.model('Message', MessageSchema);
