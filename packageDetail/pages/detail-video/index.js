// pages/detail-video/index.js
import {
  getMVURL,
  getMVDetail,
  getRelatedVideo
} from "../../../service/api_video"
Page({
  data: {
    mvURLInfo: {},
    mvDetail: {},
    relatedVideos: [],
    // 测试弹幕数据
    danmuList: [{
      text: '第 1s 出现的弹幕',
      color: '#ff0000',
      time: 1
    }, {
      text: '第 3s 出现的弹幕',
      color: '#ff00ff',
      time: 3
    }],
  },
  onLoad(options) {
    console.log(options);
    this.getPageData(options.id);
  },
  // 1.获取数据
  getPageData(id) {
    // mv的url
    getMVURL(id).then(res => {
      this.setData({
        mvURLInfo: res.data
      })
    })
    // mv详情
    getMVDetail(id).then(res => {
      this.setData({
        mvDetail: res.data
      })
    })
    // 相关视频
    getRelatedVideo(id).then(res => {
      this.setData({
        relatedVideos: res.data
      })
    })
  },
  onReady() {

  },
  onShow() {

  },
  onHide() {

  },

  onUnload() {

  },
  onPullDownRefresh() {

  },
  onReachBottom() {

  },
  onShareAppMessage() {

  }
})