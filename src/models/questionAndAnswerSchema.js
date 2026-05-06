const mongoose = require('mongoose');

const questionAndAnswerSchema = new mongoose.Schema({
  serialNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  examCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamCode',
    required: true,
  },
  question: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  answer: {
    type: String,
    required: true,
    trim: true,
  },
  isSample: {
    type: Boolean,
    required: true,
    default: false,
  },
  status: {
    type: String,
    enum: ['unpublish', 'publish'],
    required: true,
    default: 'unpublish',
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Prevent model overwrite in development
const QuestionAndAnswer = mongoose.models.QuestionAndAnswer || mongoose.model('QuestionAndAnswer', questionAndAnswerSchema);

module.exports = QuestionAndAnswer;
