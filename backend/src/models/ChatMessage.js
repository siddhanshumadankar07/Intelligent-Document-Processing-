const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  citations: [
    {
      documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
      documentName: { type: String },
      page: { type: Number, default: 1 },
      snippet: { type: String }
    }
  ],
  actionExecuted: {
    action: { type: String },
    details: { type: mongoose.Schema.Types.Mixed },
    status: { type: String, enum: ['pending_confirmation', 'confirmed', 'cancelled', 'completed'] }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
