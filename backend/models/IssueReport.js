import mongoose from 'mongoose';

const issueReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    type: {
      type: String,
      enum: ['illegal_logging', 'pollution', 'wildfire', 'poaching', 'other'],
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },

    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved'],
      default: 'open'   // ✅ ADD THIS
    },

    images: [String],

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

/* 🌍 Geospatial index */
issueReportSchema.index({ location: '2dsphere' });

export default mongoose.model('IssueReport', issueReportSchema);
