// components/song-menu-area/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "默认标题"
    },
    // 热门歌单
    hotSongMenu: {
      type: Array,
      value: []
    }
  },

  data: {

  },

  methods: {
    // 1.点击歌单，跳转
    handleMenuItemClick(event){
      const item = event.currentTarget.dataset.item;
      wx.navigateTo({
        url: `/packageDetail/pages/detail-song/index?id=${item.id}&type=menu`,
      })
    },
    // 2.点击更多
    handleMoreMenuClick(){
      this.triggerEvent("handleMore")
    }
  }
})