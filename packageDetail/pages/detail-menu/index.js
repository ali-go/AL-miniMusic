// pages/detail-menu/index.js
import {
  getSongMenu
} from "../../../service/api_music.js"
Page({
  data: {
    type: "", //当前歌单的类型
    menuList: {}, //歌单数据
  },
  onLoad(options) {
    const type = options.type;
    getSongMenu(type, 1000, 0).then(res => {
      console.log(res);
      this.setData({
        menuList: res.playlists
      })
    })
  },
  // 1.点击歌单，跳转
  handleMenuItemClick(event){
    const item = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/packageDetail/pages/detail-song/index?id=${item.id}&type=menu`,
    })
  },
  onUnload() {

  },
})