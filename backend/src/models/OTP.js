const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  phoneOrEmail: {
    type: String,
    required: true,
    index: true,
  },
  hashedCode: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // Automatically deleted after expiry (5 minutes)
  },
  attempts: {
    type: Number,
    default: 0,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('OTP', OTPSchema);
