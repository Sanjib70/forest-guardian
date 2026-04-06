import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const env = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database
  MONGO_URI: process.env.MONGO_URI,

  // Auth (future-ready)
  JWT_SECRET: process.env.JWT_SECRET || "default_secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};

// Basic validation (important)
if (!env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env file");
  process.exit(1);
}

export default env;
