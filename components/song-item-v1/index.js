// components/song-item-v1/index.js
import { playerStore } from "../../store/player-store"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 1.点击歌曲跳转播放页
    handleSongItemClick(){
      const id = this.properties.item.id;
      wx.navigateTo({
        url: `/packagePlayer/pages/music-player/index?id=${id}`,
      })
      // 对歌曲的数据请求和其他操作
      playerStore.dispatch("playMusicWithSongIdAction", { id });
    }
  }
})