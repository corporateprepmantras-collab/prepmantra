const mongoose = require('mongoose');

const sampleDownloadSchema = new mongoose.Schema({
  examCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamCode',
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Invalid email address'
    }
  },
  date: {
    type: Date,
    default: Date.now
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Prevent model overwrite in Next.js dev mode
const SampleDownload = mongoose.models.SampleDownload || mongoose.model('SampleDownload', sampleDownloadSchema);

module.exports = SampleDownload;
