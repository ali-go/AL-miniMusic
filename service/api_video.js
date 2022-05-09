// 对home-video模块的接口进行二次封装，为了页面调用处更加的简洁，对比较固定的内容在此处封装好。
import alRequest from "./index"

// 1.获取topmv数据接口
export function getTopMV(offset, limit = 10) {
  return alRequest.get("/top/mv", {
    offset,
    limit
  })
}
// 2.获取mv播放地址
export function getMVURL(id) {
  return alRequest.get("/mv/url", {
    id
  })
}
// 3.获取mv详情
export function getMVDetail(mvid) {
  return alRequest.get("/mv/detail", {
    mvid
  })
}
// 4.获取mv、相关视频
export function getRelatedVideo(id) {
  return alRequest.get("/related/allvideo", {
    id
  })
}