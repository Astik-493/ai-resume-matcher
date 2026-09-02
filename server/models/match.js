const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  jobDescription: { type: String, required: true },
  resumeSnippet: { type: String, required: true },
  matchScore: { type: Number, required: true },
  missingKeywords: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', matchSchema);
