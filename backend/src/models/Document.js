const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
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
    index: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    default: 0,
  },
  mimeType: {
    type: String,
    default: 'application/pdf',
  },
  pageCount: {
    type: Number,
    default: 1,
  },
  type: {
    type: String,
    default: 'general_document',
    index: true,
  },
  category: {
    type: String,
    default: 'General',
    index: true,
  },
  extractedData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
  fieldConfidences: {
    type: Map,
    of: Number,
    default: {},
  },
  summary: {
    type: String,
    default: '',
  },
  // Private session-scoped extracted text - never logged, used only for in-session Jarvis search
  extractedText: {
    type: String,
    default: '',
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 90,
  },
  flags: [
    {
      type: { type: String }, // 'warning', 'error', 'info', 'risk'
      field: { type: String },
      message: { type: String },
      explanation: { type: String }
    }
  ],
  status: {
    type: String,
    enum: ['Approved', 'Needs Review', 'Rejected'],
    default: 'Needs Review',
    index: true,
  },
  processingTimeMs: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Document', DocumentSchema);
