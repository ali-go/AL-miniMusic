// components/song-item-v2/index.js
import { playerStore } from "../../store/player-store"
Component({
  properties: {
    item:{
      type:Object,
      value:{}
    },
    index:{
      type:Number,
      value:0
    }
  },

  data: {

  },

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
