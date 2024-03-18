const mongoose = require('mongoose');

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

// Virtual for formatted date
MessageSchema.virtual('date_formatted').get(function () {
  return 'TODO';
});

module.exports = mongoose.model('Message', MessageSchema);
