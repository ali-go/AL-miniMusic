// 动态获取组件的rect位置尺寸位置信息
export default function (selector) {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery();
    query.select(selector).boundingClientRect();
    query.exec(res => {
      resolve(res)
    })
  })
}