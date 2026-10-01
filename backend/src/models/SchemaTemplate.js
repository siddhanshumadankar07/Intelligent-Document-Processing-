const mongoose = require('mongoose');

const SchemaTemplateSchema = new mongoose.Schema({
  documentType: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  fields: [
    {
      key: { type: String, required: true },
      label: { type: String, required: true },
      type: { type: String, enum: ['string', 'number', 'date', 'array', 'boolean'], default: 'string' },
      required: { type: Boolean, default: false },
      default: { type: mongoose.Schema.Types.Mixed }
    }
  ],
  validationRules: [
    {
      rule: { type: String, required: true },
      description: { type: String, required: true }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('SchemaTemplate', SchemaTemplateSchema);
