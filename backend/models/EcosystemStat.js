import mongoose from "mongoose";

const ecosystemStatSchema = new mongoose.Schema(
  {
    // Reference to forest / green region
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForestRegion",
      required: true,
    },

    // Type of region (denormalized for fast queries)
    regionType: {
      type: String,
      enum: [
        "Reserve Forest",
        "Protected Forest",
        "Wildlife Sanctuary",
        "National Park",
        "Urban Green Zone",
      ],
      required: true,
    },

    // Environmental metrics
    forestCoverPercentage: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    biodiversityIndex: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    carbonStock: {
      type: Number, // in tons
      default: 0,
    },

    airQualityIndex: {
      type: Number, // AQI
      default: null,
    },

    waterAvailabilityIndex: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    // Risk assessment
    threatLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },

    // Data source & tracking
    dataSource: {
      type: String,
      default: "Manual Entry",
    },

    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries (important)
ecosystemStatSchema.index({ region: 1, recordedAt: -1 });

const EcosystemStat = mongoose.model(
  "EcosystemStat",
  ecosystemStatSchema
);

export default EcosystemStat;
