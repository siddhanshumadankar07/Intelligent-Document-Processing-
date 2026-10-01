const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // MongoDB automatic TTL deletion
  },
  status: {
    type: String,
    enum: ['active', 'ended', 'expired'],
    default: 'active',
    index: true,
  },
  endedAt: {
    type: Date,
    default: null,
  }
});

module.exports = mongoose.model('Session', SessionSchema);
