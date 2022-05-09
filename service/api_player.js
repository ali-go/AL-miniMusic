import alRequest from "./index.js"
// 获取歌曲播放详情
export function getSongDetail(ids){
  return alRequest.get("/song/detail",{
    ids
  })
}
// 获取歌词详情
export function getSongLyric(id){
  return alRequest.get("/lyric",{
    id
  })
}