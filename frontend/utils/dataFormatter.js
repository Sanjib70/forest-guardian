/* ===========================
   DATA FORMATTERS
=========================== */

/**
 * Format percentage values
 * Example: 72 -> "72%"
 */
export const formatPercentage = (value) => {
  if (value === null || value === undefined) return "N/A";
  return `${value}%`;
};

/**
 * Format area in square kilometers
 * Example: 4264 -> "4,264 km²"
 */
export const formatArea = (area) => {
  if (!area) return "N/A";
  return `${area.toLocaleString()} km²`;
};

/**
 * Capitalize first letter
 * Example: "reserve forest" -> "Reserve forest"
 */
export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Convert threat level to color class
 */
export const getThreatColor = (level) => {
  switch (level) {
    case "High":
      return "text-red-600";
    case "Medium":
      return "text-yellow-600";
    case "Low":
      return "text-green-600";
    default:
      return "text-gray-500";
  }
};

/**
 * Format date to readable string
 * Example: "2025-01-09T10:30:00Z" -> "09 Jan 2025"
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Normalize region data from backend
 * Makes sure frontend always gets same structure
 */
export const normalizeRegion = (region) => {
  return {
    id: region.id || region._id,
    name: region.name || "Unknown Region",
    type: region.type || "Unknown",
    area: region.area || 0,
    forestCover: region.forest_cover_percentage || 0,
    biodiversityIndex: region.biodiversity_index || 0,
    threatLevel: region.threat_level || "Low",
  };
};

/**
 * Convert array safely
 */
export const safeArray = (data) => {
  return Array.isArray(data) ? data : [];
};
