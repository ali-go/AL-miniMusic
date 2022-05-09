// pages/home-profile/index.js
import {
  getUserInfo
} from "../../service/api_login"
Page({

  data: {
    hasUserInfo: false,
    userInfo: {}
  },

  onLoad(options) {

  },
  // -------------------------事件处理------------------
  // 1.获取用户头像信息
  async getUserProfile() {
    const {
      userInfo
    } = await getUserInfo();
    this.setData({
      userInfo,
      hasUserInfo: true
    })
  }

})