const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  passwordHash: {
    type: String,
    default: null,
  },
  providers: [
    {
      provider: { type: String, enum: ['local', 'google', 'facebook', 'github', 'whatsapp'] },
      providerId: { type: String },
      linkedAt: { type: Date, default: Date.now }
    }
  ],
  phone: {
    type: String,
    trim: true,
    default: null,
  },
  profession: {
    type: String,
    default: 'Finance/Accounting',
  },
  customProfession: {
    type: String,
    default: '',
  },
  jarvisSettings: {
    name: { type: String, default: 'Jarvis' },
    tone: { type: String, enum: ['formal', 'friendly', 'concise', 'detailed'], default: 'friendly' },
    voice: { type: String, default: 'en-US' },
    speakingSpeed: { type: Number, default: 1.0 },
    replyLanguage: { type: String, default: 'en-US' },
    avatar: { type: String, default: 'bot-violet' },
    themeColor: { type: String, default: '#7C3AED' },
    responseLength: { type: String, enum: ['concise', 'balanced', 'thorough'], default: 'balanced' },
    autoSpeak: { type: Boolean, default: false }
  },
  defaultSessionTtlMinutes: {
    type: Number,
    default: 15,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('User', UserSchema);
