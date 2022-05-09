// 对登录的微信小程序自带的回调函数接口进行封装
import {
  alLoginRequest
} from "../service/index"
// 1.获取code
export function getLoginCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 1000,
      success: res => {
        const code = res.code;
        resolve(code);
      },
      fail: err => {
        reject(err)
      }
    })
  })
}
// 2.获取绑定openid的token(服务器根据code去腾讯服务器请求openid，并处理后返回token，并不会返回openid)
export function codeToToken(code) {
  return alLoginRequest.post("/login", {
    code
  })
}
// 3.核对token是否过期
export function checkToken() {
  return alLoginRequest.post("/auth", {}, true)
}
// 4.核对session是否过期
export function checkSession() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        resolve(true);
      },
      fail() {
        reject(false);
      }
    })
  })
}
// 5.获取用户头像
export function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      lang: "zh_CN",
      desc: '你好，阿离！',
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err);
      }
    })
  })
}