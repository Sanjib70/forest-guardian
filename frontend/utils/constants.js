/* ===========================
   APP CONSTANTS
=========================== */

export const APP_NAME = "Forest Guardian";
export const APP_TAGLINE =
  "Monitoring forests, reserve forests, sanctuaries, and green ecosystems";

/* ===========================
   ROUTES
=========================== */

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  MAP: "/map",
  FOREST_DATA: "/forest-data",
  REPORT_ISSUE: "/report-issue",
  HEALTH_INDEX: "/health-index",
};

/* ===========================
   REGION TYPES
=========================== */

export const REGION_TYPES = [
  "Reserve Forest",
  "Protected Forest",
  "Wildlife Sanctuary",
  "National Park",
  "Urban Green Zone",
];

/* ===========================
   ISSUE TYPES
=========================== */

export const ISSUE_TYPES = [
  "Illegal Logging",
  "Poaching",
  "Forest Fire",
  "Land Encroachment",
  "Pollution",
  "Other",
];

/* ===========================
   THREAT LEVELS
=========================== */

export const THREAT_LEVELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

/* ===========================
   MAP DEFAULTS
=========================== */

export const MAP_CONFIG = {
  DEFAULT_CENTER: [22.9734, 78.6569], // India center
  DEFAULT_ZOOM: 5,
  MAX_ZOOM: 18,
};

/* ===========================
   LOCAL STORAGE KEYS
=========================== */

export const STORAGE_KEYS = {
  USER: "user",
  TOKEN: "token",
};

/* ===========================
   UI CONSTANTS
=========================== */

export const PAGE_SIZE = 10;

export const COLORS = {
  PRIMARY: "#166534",
  SECONDARY: "#22c55e",
  DANGER: "#dc2626",
  WARNING: "#facc15",
};

/* ===========================
   STATUS MESSAGES
=========================== */

export const MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  ERROR_GENERIC: "Something went wrong",
};
