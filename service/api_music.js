import alRequest from "./index"
// 首页的music接口
// 1.获取轮播图
export function getBanners() {
  return alRequest.get("/banner", {
    type: 1
  })
}

// 2.获取歌曲排行
export function getRankings(idx) {
  return alRequest.get("/top/list", {
    idx
  })
}

// 3.获取歌单分类
export function getSongMenu(cat = "全部", limit = 6, offset = 0) {
  return alRequest.get("/top/playlist",{
    cat,
    limit,
    offset
  })
}
// 4.获取歌单歌曲的详情
export function getSongMenuDetail(id){
  return alRequest.get("/playlist/detail/dynamic",{
    id
  })
}