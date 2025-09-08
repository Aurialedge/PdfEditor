const mongoose = require('mongoose');

const extractedDataSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  keyPoints: [{
    type: String
  }],
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    type: String,
    default: 'Unknown'
  },
  originalText: {
    type: String,
    required: true
  },
  metadata: {
    model: String,
    timestamp: Date,
    charactersProcessed: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
extractedDataSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create text index for search functionality
extractedDataSchema.index({
  title: 'text',
  summary: 'text',
  originalText: 'text'
});

const ExtractedData = mongoose.model('ExtractedData', extractedDataSchema);

module.exports = ExtractedData;
