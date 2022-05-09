export function parseLyric(lyricString) {
  const lyricInfos = [];
  const timeRegExp = /\[(\d{2}):(\d{2}).(\d{2,3})\]/
  const lyricStrings = lyricString.split("\n")
  for (const lineString of lyricStrings) {
    // [00:00.000] 作词 : 唐恬
    // console.log(lineString);
    // 1.获取时间
    const timeResult = timeRegExp.exec(lineString);
    if (!timeResult) continue
    const minute = timeResult[1] * 60 * 1000;
    const second = timeResult[2] * 1000;
    const milliSecond = timeResult[3].length === 2 ? timeResult[3] * 10 : timeResult[3] * 1;
    const time = minute + second + milliSecond
    // 2.获取歌词文
    const text = lineString.replace(timeRegExp, "");
    lyricInfos.push({
      time,
      text
    });
  }
  return lyricInfos
}