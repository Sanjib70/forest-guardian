import mongoose from 'mongoose';

const forestDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

    treeCount: {
      type: Number,
      min: 0,
    },

    animalSightings: [
      {
        species: String,
        count: Number,
        timestamp: Date,
      },
    ],

    fireIncidents: [
      {
        severity: {
          type: String,
          enum: ['low', 'medium', 'high'],
        },
        area: Number,
        timestamp: Date,
        status: {
          type: String,
          enum: ['active', 'contained', 'extinguished'],
          default: 'active',
        },
      },
    ],

    rainfall: {
      type: Number,
      min: 0,
    },

    temperature: {
      type: Number,
    },

    humidity: {
      type: Number,
      min: 0,
      max: 100,
    },

    notes: {
      type: String,
      maxlength: 500,
    },

    zone: {
      type: String,
      enum: ['conservation', 'recreation', 'protected', 'restricted'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🌍 Geospatial index
forestDataSchema.index({ location: '2dsphere' });

export default mongoose.model('ForestData', forestDataSchema);
