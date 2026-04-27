/**
 * Calculate parking duration in minutes between two dates
 */
const calculateDuration = (entryTime, exitTime) => {
  const entry = new Date(entryTime);
  const exit = new Date(exitTime);
  const diffMs = exit - entry;
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  return diffMinutes;
};

/**
 * Format duration from minutes into human-readable string
 */
const formatDuration = (minutes) => {
  if (minutes < 1) return "Less than a minute";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${hours} hour${hours > 1 ? "s" : ""} ${mins} minute${mins > 1 ? "s" : ""}`;
};

module.exports = { calculateDuration, formatDuration };
