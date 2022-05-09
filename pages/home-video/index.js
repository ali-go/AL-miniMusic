// pages/home-video/index.js
// import alRequest from "../../service/index"
import {
  getTopMV
} from "../../service/api_video"

Page({
  data: {
    topMVs: [], // mv视频资源
    hasMore: true, //标识是否还有视频资源
  },
  onLoad(options) {
    // 1.获取topmv的数据
    this.getTopMVData(0);
  },
  // 封装topMV网络请求的方法
  async getTopMVData(offset) {
    if (!this.data.hasMore && offset !== 0) return
    const res = await getTopMV(offset);
    let result = [];
    if (offset === 0) {
      result = res.data;
      wx.stopPullDownRefresh()
    } else {
      result = [...this.data.topMVs, ...res.data];
    }
    this.setData({
      topMVs: result,
      hasMore: res.hasMore
    })
  },
  // 处理video的点击
  handleVideoItemClick(event) {
    const id = event.currentTarget.dataset.item.id;
    // console.log(id);
    wx.navigateTo({
      url: '/packageDetail/pages/detail-video/index?id=' + id,
    })
  },
  // 下拉
  onPullDownRefresh() {
    this.getTopMVData(0)
  },
  // 触底
  onReachBottom() {
    this.getTopMVData(this.data.topMVs.length);
  },
})