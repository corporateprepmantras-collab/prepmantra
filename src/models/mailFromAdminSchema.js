const mongoose = require('mongoose');

const mailFromAdminSchema = new mongoose.Schema(
  {
    smtp: {
      type: String,
      trim: true,
      default: null
    },
    mailEngine: {
      type: String,
      trim: true,
      default: null
    },
    smtpHost: {
      type: String,
      required: true,
      trim: true
    },
    smtpPort: {
      type: Number,
      required: true,
      min: 1,
      max: 65535
    },
    encryption: {
      type: String,
      enum: ['SSL', 'TLS', 'STARTTLS', 'None'],
      default: 'None'
    },
    smtpUsername: {
      type: String,
      required: true,
      trim: true
    },
    smtpPassword: {
      type: String,
      required: true,
      select: false
    },
    formEmail: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      }
    },
    formName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

// Optional index
mailFromAdminSchema.index({ formEmail: 1 });

// Prevent model overwrite in dev
const MailFromAdmin = mongoose.models.MailFromAdmin || mongoose.model('MailFromAdmin', mailFromAdminSchema);

module.exports = MailFromAdmin;
