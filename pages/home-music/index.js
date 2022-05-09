// pages/home-music/index.js
import {
  getBanners,
  getSongMenu
} from "../../service/api_music.js"
import queryRect from "../../utils/query-rect.js"
import throttle from "../../utils/throttle.js";
import {
  rankingStore,
  RANKING_MAP,
  playerStore
} from "../../store/index"

const throttleQueryRect = throttle(queryRect, 1000, {
  trailing: true
}); //处理节流

Page({

  data: {
    banners: [], //轮播图
    swiperHeight: 0, //轮播图的高度
    recommondSong: [], //推荐歌曲
    hotSongMenu: [], //热门歌单
    recommondSongMenu: [], //推荐歌单
    ranking: {
      0: {},
      2: {},
      3: {}
    }, //榜单数据(// 0 飙升 2新歌 3原创)

    currentSong: {}, //当前播放歌曲
    isPlaying:true,//播放状态
    playAnimateState:"running",//播放图片的旋转状态
  },

  onLoad(options) {
    // 获取页面数据
    this.getPageData();
    // 获取热门歌曲数据
    rankingStore.dispatch("getRankingDataAction");
    // 监听获取部分热门歌曲数据
    rankingStore.onState("hotRanking", (res) => {
      if (!res.tracks) return //初始化第一次时数据为{}
      const recommondSong = res.tracks.slice(0, 6); //截取6条数据作为推荐歌曲
      this.setData({
        recommondSong
      })
    })
    // 获取榜单数据
    rankingStore.onState("upRanking", this.getRankingHandler(0));
    rankingStore.onState("newRanking", this.getRankingHandler(2));
    rankingStore.onState("originRanking", this.getRankingHandler(3));
  },
  // ------------------------网络请求-----------------------
  getPageData() {
    // 轮播图
    getBanners().then(res => {
      // console.log(res);
      this.setData({
        banners: res.banners
      })
    })
    // 热门歌单
    getSongMenu("流行").then(res => {
      // console.log(res);
      this.setData({
        hotSongMenu: res.playlists
      })
    })
    // 推荐歌单
    getSongMenu("华语").then(res => {
      // console.log(res);
      this.setData({
        recommondSongMenu: res.playlists
      })
    })

    // 监听正在播放的的歌曲和播放状态
    playerStore.onStates(["currentSong", "isPlaying"], ({
      currentSong,
      isPlaying
    }) => {
      if (currentSong !== undefined) {
        this.setData({
          currentSong
        })
      }
      if (isPlaying !== undefined) {
        this.setData({
          isPlaying,
          playAnimateState:isPlaying ? "running" : "paused"
        })
      }
    })
  },
  // -----------------------事件处理函数-------------------
  // 1.点击了搜索框
  handleSearchClick() {
    console.log(111);
    wx.navigateTo({
      url: '/packageDetail/pages/detail-search/index',
    })
  },
  // 2.轮播图加载完
  imageLoad() {
    // 动态获取轮播图的高度
    throttleQueryRect(".swiper-image").then(res => {
      const rect = res[0];
      this.setData({
        swiperHeight: rect.height || 0
      })
    })
  },
  // 2.1点击歌曲推荐的单条歌曲，用于设置播放列表
  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index;
    playerStore.setState("playListSongs", this.data.recommondSong);
    playerStore.setState("playListIndex", index);
  },
  // 3.处理榜单监听到的数据(此处只获取3条数据)
  getRankingHandler(idx) {
    return (res) => {
      // 第一次没数据直接返回
      if (Object.keys(res).length === 0) return
      const name = res.name;
      const coverImgUrl = res.coverImgUrl;
      const playCount = res.playCount;
      const songList = res.tracks.slice(0, 3);
      const rankObj = {
        name,
        coverImgUrl,
        playCount,
        songList
      };
      const newRanking = {
        ...this.data.ranking,
        [idx]: rankObj
      };
      this.setData({
        ranking: newRanking
      })
    }
  },
  // 4.点击更多，跳转
  handleMoreClick() {
    this.navigateToDetailSongsPage("hotRanking");
  },
  // 5.点击排行榜
  handleRankingItemClick(event) {
    const idx = event.currentTarget.dataset.idx;
    const rankingName = RANKING_MAP[idx];
    this.navigateToDetailSongsPage(rankingName);
  },
  // 6.公共跳转歌曲详情页方法
  navigateToDetailSongsPage(rankingName) {
    wx.navigateTo({
      url: `/packageDetail/pages/detail-song/index?ranking=${rankingName}&type=rank`,
    })
  },
  // 7.点击跳转更多歌单详情页
  handleMoreMenuClick(event) {
    console.log(event.currentTarget.dataset.type);
    const type = event.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/packageDetail/pages/detail-menu/index?type=${type}`,
    })
  },
  // 8.播放和暂停歌曲
  handlePlayBtnClick(){
    playerStore.dispatch("changeMusicPlayStatusAction",!this.data.isPlaying);
  },
  // 9.点击播放栏
  handlePlayBarClick(){
    wx.navigateTo({
      url: `/packagePlayer/pages/music-player/index?id=${this.data.currentSong.id}`,
    })
  }
})