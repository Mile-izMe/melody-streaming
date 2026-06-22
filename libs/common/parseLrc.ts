export type LyricLine = {
  time: number; // time by ms
  text: string; // lyrics
};

export const parseLyrics = (lrc: string): LyricLine[] => {
  if (!lrc || typeof lrc !== "string") return [];

  // 1. Make "\n" from database into real new line character. Some LRC files might have "\\n" instead of actual new lines.
  const sanitizedLrc = lrc.replace(/\\n/g, "\n");
  const lines = sanitizedLrc.split(/\r?\n/);
  const parsedLines: LyricLine[] = [];

  lines.forEach((line) => {
    // 2. Regex: All types [mm:ss.xx] or [hh:mm:ss] or [mm:ss]
    const timeRegex = /\[(\d{2}):(\d{2})(?:[:.](\d{2,3}))?\]/g;
    let match;

    // Split lyrics by removing time stamps
    const text = line.replace(timeRegex, "").trim();
    if (!text) return; // If the line only contains time stamps and no text, skip it

    timeRegex.lastIndex = 0;
    while ((match = timeRegex.exec(line)) !== null) {
      const p1 = parseInt(match[1], 10);
      const p2 = parseInt(match[2], 10);
      const p3 = match[3] ? parseInt(match[3], 10) : 0;

      let timeInSeconds = 0;

      // match[0] is the time block captured, e.g., "[00:01:20]"
      if (match[0].includes(".")) {
        // Standard format [mm:ss.xx] -> p1: minutes, p2: seconds, p3: milliseconds
        timeInSeconds = p1 * 60 + p2 + p3 / 1000;
      } else if (match[3]) {
        // YouTube format [hh:mm:ss] -> p1: hours, p2: minutes, p3: seconds
        timeInSeconds = p1 * 3600 + p2 * 60 + p3;
      } else {
        // Short format [mm:ss] -> p1: minutes, p2: seconds
        timeInSeconds = p1 * 60 + p2;
      }

      parsedLines.push({ time: timeInSeconds, text });
    }
  });

  // 3. Sort the lyrics by time
  return parsedLines.sort((a, b) => a.time - b.time);
};
