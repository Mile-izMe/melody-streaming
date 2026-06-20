export type LyricLine = {
  time: number; // thời gian quy ra giây
  text: string; // lời bài hát
};

export const parseLyrics = (lrc: string): LyricLine[] => {
  if (!lrc || typeof lrc !== "string") return [];

  // 1. Phá băng ký tự "\n" từ database thành ký tự xuống dòng thực sự
  const sanitizedLrc = lrc.replace(/\\n/g, "\n");
  const lines = sanitizedLrc.split(/\r?\n/);
  const parsedLines: LyricLine[] = [];

  lines.forEach((line) => {
    // 2. Regex siêu cấp: Bắt mọi thể loại [mm:ss.xx] hoặc [hh:mm:ss] hoặc [mm:ss]
    const timeRegex = /\[(\d{2}):(\d{2})(?:[:.](\d{2,3}))?\]/g;
    let match;

    // Tách phần lời bằng cách xóa các dấu thời gian
    const text = line.replace(timeRegex, "").trim();
    if (!text) return; // Nếu dòng chỉ có thời gian mà không có text thì bỏ qua

    timeRegex.lastIndex = 0;
    while ((match = timeRegex.exec(line)) !== null) {
      const p1 = parseInt(match[1], 10);
      const p2 = parseInt(match[2], 10);
      const p3 = match[3] ? parseInt(match[3], 10) : 0;

      let timeInSeconds = 0;

      // match[0] là toàn bộ block thời gian bắt được, VD: "[00:01:20]"
      if (match[0].includes(".")) {
        // Dạng chuẩn [mm:ss.xx] -> p1: phút, p2: giây, p3: mili giây
        timeInSeconds = p1 * 60 + p2 + p3 / 1000;
      } else if (match[3]) {
        // Dạng YouTube [hh:mm:ss] -> p1: giờ, p2: phút, p3: giây
        timeInSeconds = p1 * 3600 + p2 * 60 + p3;
      } else {
        // Dạng ngắn [mm:ss] -> p1: phút, p2: giây
        timeInSeconds = p1 * 60 + p2;
      }

      parsedLines.push({ time: timeInSeconds, text });
    }
  });

  // 3. Xếp lại thứ tự thời gian cho chắc ăn
  return parsedLines.sort((a, b) => a.time - b.time);
};
