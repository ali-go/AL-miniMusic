// app.js
import {
  getLoginCode,
  codeToToken,
  checkToken,
  checkSession
} from "./service/api_login"
import {
  TOKEN_KEY
} from "./constants/token-const"
import {playerStore} from "./store/player-store"
App({
  // 全局变量
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navBarHeight: 44, //自定义的navbar高度
    deviceRadio: 0
  },
  async onLaunch() {
    // 1.获取设备信息
    const info = wx.getSystemInfoSync();
    this.globalData.screenWidth = info.screenWidth; //屏幕宽度
    this.globalData.screenHeight = info.screenHeight; //屏幕高度
    this.globalData.statusBarHeight = info.statusBarHeight; //状态栏高度
    // 获取屏幕高宽比（用于设置是否显示歌词）
    const deviceRadio = info.screenHeight / info.screenWidth;
    this.globalData.deviceRadio = deviceRadio;

    // 2.让用户默认进行登录
    const token = wx.getStorageSync(TOKEN_KEY);
    // 核对token是否过期
    const checkResult = await checkToken();
    // 判断session是否有效
    const isSessionEcpire = await checkSession();
    // 没有token或token过期或session_key过期都需要重新登录
    if (!token || checkResult.errorCode || !isSessionEcpire) {
      this.loginAction();
    }
  },
  // 登录
  async loginAction() {
    // (1)获取code值
    const code = await getLoginCode();
    // (2)将code发送服务器获取关联了openid的token
    const result = await codeToToken(code);
    const token = result.token;
    wx.setStorageSync(TOKEN_KEY, token);
  },
  onShow(){
    // 监听后台切换播放状态时切回前台，改变播放图标状态
    playerStore.dispatch("handleHideAction");
  }
})