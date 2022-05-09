import {
  TOKEN_KEY
} from '../constants/token-const';
// 对接口通过类进行整体封装
const BASE_URL = "http://123.207.32.32:9001"; //普通请求
const LOGIN_BASE_URL = "http://123.207.32.32:3000"; //登录请求
const token = wx.getStorageSync(TOKEN_KEY);

// 封装类
class ALRequest {
  constructor(URL, authHeader = {}) {
    this.URL = URL;
    this.authHeader = authHeader;
  }
  request(url, method, isAuth = false, params, header = {}) {
    // 根据是否需要权限标识加请求头（需要权限就把实例化时的header和请求的header合并，不需要的话直接拿请求的header）
    const finalHeader = isAuth ? {
      ...this.authHeader,
      ...header
    } : header
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.URL + url,
        method: method,
        data: params,
        header: finalHeader,
        success: res => resolve(res.data),
        // fail: err => reject(err)
        fail: reject
      })
    })
  }
  get(url, data, isAuth = false, header) {
    return this.request(url, "GET", isAuth, data, header);
  }
  post(url, data, isAuth = false, header) {
    return this.request(url, "POST", isAuth, data, header);
  }
}
const alRequest = new ALRequest(BASE_URL); //普通请求
export default alRequest;
export const alLoginRequest = new ALRequest(LOGIN_BASE_URL, {
  token
}); //登录请求