import { rankingStore ,playerStore} from "../../../store/index.js";
import { getSongMenuDetail } from "../../../service/api_music.js"
// pages/detail-song/index.js
Page({
  data: {
    ranking:"",//当前榜单类型
    songInfo:{},//榜单的数据,
    type:"",//是榜单还是歌单进入
  },
  onLoad(options) {
    const type = options.type;
    this.setData({
      type
    })
    console.log(type);
    if(type === "menu"){
      const id = options.id;
      getSongMenuDetail(id).then(res=>{
        this.setData({
          songInfo:res.playlist
        })
      })
    }else if(type === "rank"){
      const ranking = options.ranking;
      this.setData({
        ranking
      })
      // 1.获取数据
      rankingStore.onState(ranking,this.getRankingDataHandler)
    }
  },
  // 事件处理
  // 1.处理数据的方法
  getRankingDataHandler(res){
    console.log(res);
    this.setData({
      songInfo:res
    })
    console.log(this.data.songInfo);
  },
  // 2.点击歌曲推荐的单条歌曲，用于设置播放列表
  handleSongItemClick(event){
    const index = event.currentTarget.dataset.index;
    playerStore.setState("playListSongs",this.data.songInfo.tracks);
    playerStore.setState("playListIndex",index);
  },
  onUnload() {
    if(this.data.ranking){
      rankingStore.offState(this.data.ranking,this.getRankingDataHandler)
    }
  },

})