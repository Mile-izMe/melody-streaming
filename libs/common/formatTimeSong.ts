export const formatTimeSong = (duration: number): string => {
  if (isNaN(duration) || duration < 0) {
    return "0:00";
  }
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
