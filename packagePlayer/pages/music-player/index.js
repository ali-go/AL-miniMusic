// pages/music-player/index.js
import {
  audioContext
} from "../../../store/index.js"
import {
  playerStore
} from "../../../store/index.js"

const playModeNames = ["order", "repeat", "random"]; //播放模式

Page({
  data: {
    id: "", //歌曲id
    durationTime: 0, //歌曲的总时间
    lyrics: [], //歌词
    currentSong: {}, //歌曲信息

    currentTime: 0, //歌曲当前播放的时间
    currentLyricText: "", //当前歌词
    currentLyricIndex: 0, //当前的歌词索引（上一次，用于当歌词索引没变时不更新setData）

    playModeIndex: 0, //播放模式
    playModeName: "order",

    isPlaying: false, //播放暂停
    playingName: "pause",

    lyricScrollTop: 0, //歌词滚动的高度
    sliderValue: 0, //进度条值
    isSliderChanging: false, //标识正在拖动进度条

    currentPage: 0, //当前是歌曲还是歌词页
    contentHeight: 0, //内容的高度
    isMusicLyric: true, //是否显示歌词（小屏不显示）

  },

  onLoad(options) {
    const id = options.id;
    this.setData({
      id
    });
    // 1.获取数据
    this.setupPlayerStoreListener();
    // 2.动态计算高度
    const globalData = getApp().globalData;
    const screenHeight = globalData.screenHeight;
    const statusBarHeight = globalData.statusBarHeight;
    const navBarHeight = globalData.navBarHeight;
    const contentHeight = screenHeight - statusBarHeight - navBarHeight;
    const deviceRadio = globalData.deviceRadio;
    this.setData({
      contentHeight,
      isMusicLyric: deviceRadio >= 2,
    });
  },

  // ------------------------------事件处理----------------------------------
  // 1.切换页
  handleSwiperChange(event) {
    const currentPage = event.detail.current;
    this.setData({
      currentPage
    });
  },
  // 2.点击进度条
  handleSliderChange(event) {
    // 1.计算进度条sliderValue值
    const sliderValue = event.detail.value;
    // 2.计算歌曲当前播放时间
    const currentTime = this.data.durationTime * sliderValue / 100;
    // 3.暂停原currentTime位置的播放，及在新的currentTime位置开始播放(seek接收的是秒单位)
    // audioContext.pause();
    audioContext.seek(currentTime / 1000);
    this.setData({
      // currentTime,
      sliderValue,
      isSliderChanging: false, //重置拖动标识
    })
  },
  // 3.拖动进度条(放开后会调用上面的切换进度条的事件)
  handleSlideChanging(event) {
    // 拖动过程需保证
    // 1.当前时间变化
    const currentTime = event.detail.value * this.data.durationTime / 100;
    // 2.歌曲播放不变，进度条不闪现（拖动时监听歌曲进度中不改变时间和进度条）
    this.setData({
      currentTime,
      isSliderChanging: true
    })
  },
  // 4.返回
  handleBackClick() {
    wx.navigateBack();
  },
  // 5.切换播放模式
  handleModeBtnClick() {
    // 计算新的播放模式
    let playModeIndex = this.data.playModeIndex + 1;
    if (playModeIndex === 3) playModeIndex = 0
    // 设置playStore新的playModeIndex
    playerStore.setState("playModeIndex", playModeIndex);
  },
  // 6.切换播放暂停
  handlePlayBtnClick() {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying);
  },
  // 7.切到上一首
  handlePrevBtnClick() {
    playerStore.dispatch("handleNewMusicAction", false)
  },
  // 8.切到下一首
  handleNextBtnClick() {
    playerStore.dispatch("handleNewMusicAction")
  },
  // -------------------------------监听状态管理中歌曲歌词信息------------------------
  setupPlayerStoreListener() {
    // 1.监听 currentSong / durationTime / lyrics 信息
    playerStore.onStates(["currentSong", "durationTime", "lyrics"], ({
      currentSong,
      durationTime,
      lyrics
    }) => {
      if (currentSong !== undefined) {
        this.setData({
          currentSong
        })
      }
      if (durationTime !== undefined) {
        this.setData({
          durationTime
        })
      }
      if (lyrics !== undefined) {
        this.setData({
          lyrics
        })
      }
    })
    // 2.监听 currentTime / currentLyricText / currentLyricIndex 信息
    playerStore.onStates(["currentTime", "currentLyricText", "currentLyricIndex"], ({
      currentTime,
      currentLyricText,
      currentLyricIndex,
    }) => {
      if (currentTime !== undefined && !this.data.isSliderChanging) {
        // 根据currentTime变化更新sliderValue进度条
        const sliderValue = currentTime / this.data.durationTime * 100;
        this.setData({
          currentTime,
          sliderValue
        })
      }
      if (currentLyricIndex !== undefined) {
        this.setData({
          lyricScrollTop: currentLyricIndex * 35,
          currentLyricIndex
        })
      }
      if (currentLyricText !== undefined) {
        this.setData({
          currentLyricText
        })
      }
    })
    // 3.监听playModeIndex / 
    playerStore.onStates(["playModeIndex", "isPlaying"], ({
      playModeIndex,
      isPlaying
    }) => {
      if (playModeIndex !== undefined) {
        this.setData({
          playModeIndex,
          playModeName: playModeNames[playModeIndex]
        })
      }
      if (isPlaying !== undefined) {
        this.setData({
          isPlaying,
          playingName: isPlaying ? "pause" : "resume"
        })
      }
    })
  },
  onUnload() {

  },
})