import {
  HYEventStore
} from "hy-event-store"
import {
  parseLyric
} from "../utils/parse-lyric.js"
import {
  getSongDetail,
  getSongLyric
} from "../service/api_player"
// 存储全局播放api
// const audioContext = wx.createInnerAudioContext();
const audioContext = wx.getBackgroundAudioManager(); //使用带后台播放的

// 创建歌曲的状态数据
const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true,//标识是第一次播放（用于设计第一次的监听播放）
    isStoping:false, //后台关闭了当前歌曲的播放

    id: 0, //歌曲id
    durationTime: 0, //歌曲的总时间
    currentSong: {}, //歌曲信息
    lyrics: [], //歌词信息

    currentTime: 0, //歌曲当前播放的时间
    currentLyricText: "", //当前歌词
    currentLyricIndex: 0, //当前的歌词索引（上一次，用于当歌词索引没变时不更新setData）

    playModeIndex: 0, // 0：循环播放 1：单曲循环 2：随机播放
    isPlaying: false, //是否播放暂停

    playListSongs:[],//当前播放列表
    playListIndex:0,//当前播放的在列表中的索引

  },
  actions: {
    // 1.获取歌曲歌词网络请求数据
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      if(ctx.id == id && !isRefresh){
        // 如果暂停的进去播放
        this.dispatch("changeMusicPlayStatusAction",true);
        return
      }
      ctx.id = id;
      // (1)清空上一首的数据
      ctx.isPlaying = true; //播放
      ctx.durationTime = 0;
      ctx.currentSong = {};
      ctx.lyrics = [];
      ctx.currentTime = 0;
      ctx.currentLyricText = "";
      ctx.currentLyricIndex = 0;

      // (2)根据id请求数据
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0];
        ctx.durationTime = res.songs[0].dt;
        audioContext.title = res.songs[0].name;
      })
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric;
        const lyrics = parseLyric(lyricString); // 处理歌词
        ctx.lyrics = lyrics;
      })
      // (3)播放对应id的歌曲
      audioContext.stop(); //每次播放前先停播上一首歌曲
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      audioContext.title = id; //title是getBackgroundAudioManager的比天字段
      audioContext.autoplay = true; //设置初始化默认加载后自动播放

      // (4)监听audioContext的一些事件(初始化执行一次，后续会回调监听)
      if(ctx.isFirstPlay){
        this.dispatch("setupAudioContextListenerAction");
        ctx.isFirstPlay = false;
      }
    },
    // 2.监听audioContext的播放(只需要初始化调用一次，后续会默认回调这个监听器)
    setupAudioContextListenerAction(ctx) {
      // (1)监听播放：保证后续切换进度条时监听到切换后音频流解码完成可以播放，调用play进行播放
      audioContext.onCanplay(() => {
        //暂停状态时监听到可播放时不播放（如暂停切换进度）
        if(!ctx.isPlaying) return; 
        audioContext.play();
      })
      // (2)监听时间变化：监听歌曲播放时间的更新
      audioContext.onTimeUpdate(() => {
        // 1.获取当前时间
        const currentTime = audioContext.currentTime * 1000;
        // 2.根据当前时间修改currentTime
        ctx.currentTime = currentTime;
        // 3.根据当前的时间搜索当前的歌词
        let i = 0
        for (; i < ctx.lyrics.length; i++) {
          const lyricInfo = ctx.lyrics[i];
          if (currentTime < lyricInfo.time) {
            break;
          }
        }
        // 获取当前索引
        let currentLyricIndex = i - 1 >= 0 ? i - 1 : i;
        // 获取的索引和当前索引一致则不更新歌词
        if (ctx.currentLyricIndex !== currentLyricIndex) {
          const currentLyricInfo = ctx.lyrics[currentLyricIndex];
          ctx.currentLyricText = currentLyricInfo.text;
          ctx.currentLyricIndex = currentLyricIndex;
        }
      })
      // (3)监听播放完成：继续播下一首
      audioContext.onEnded(()=>{
        this.dispatch("handleNewMusicAction");
      }),
      // (4)监听音乐暂停和播放和停止
      audioContext.onPlay(()=>{
        ctx.isPlaying = true;
        console.log(ctx.isPlaying);
      }),
      audioContext.onPause(()=>{
        ctx.isPlaying = false;
        console.log(ctx.isPlaying);
      }),
      audioContext.stop(()=>{
        ctx.isPlaying = false;
        // 停止的时候会清空audioContext的数据，如果再次播放需手动赋值原先的数据
        ctx.isStoping = true;
      })
    },
    // 3.切换播放暂停
    changeMusicPlayStatusAction(ctx,isPlaying = true) {
      ctx.isPlaying = isPlaying;
      // 如果停止播放的前提下点击播放，重新开始(停止时会清空audioContext所有数据)
      if(ctx.isPlaying && ctx.isStoping){
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`;
        audioContext.title = ctx.currentSong.name;
        audioContext.startTime = ctx.currentTime / 1000;
        ctx.isStoping = false;
      }
      ctx.isPlaying ? audioContext.play() : audioContext.pause();
    },
    // 4.切换上一首和下一首歌曲
    handleNewMusicAction(ctx,isNext = true){
      // 先清空上一首的数据
      ctx.isPlaying = true; //播放
      ctx.durationTime = 0;
      ctx.currentSong = {};
      ctx.lyrics = [];
      ctx.currentTime = 0;
      ctx.currentLyricText = "";
      ctx.currentLyricIndex = 0;
        
      // (1)获取当前播放在列表中的索引
      let index = ctx.playListIndex;
      // 2.根据不同模式获取播放的索引
      switch(ctx.playModeIndex){
        case 0: // 循环播放
        index = isNext ? (index + 1) : (index -1);
        if(index === -1) index = ctx.playListSongs.length - 1;
        if(index === ctx.playListSongs?.length) index = 0;
        break;
        case 1: // 单曲播放
        break;
        case 2: // 随机播放
        let randomIndex = index;
        // 防止随机切换到同一首
        while(randomIndex === index){
          randomIndex = Math.floor(Math.random() * ctx.playListSongs.length)
        }
        index = randomIndex;
        break;
      }
      // 3.获取歌曲
      let currentSong = ctx.playListSongs[index];
      if(!currentSong){
        currentSong = ctx.currentSong
      }else{
        // 记录最新的索引
        ctx.playListIndex = index;
      }
      // 4.播放新的歌曲（为了保证单曲循环切换重播，做个标识）
      this.dispatch("playMusicWithSongIdAction",{ id: currentSong.id, isRefresh:true })
    },
    // 5.在hide状态下切换播放状态，不会进行各种回调(此处手动获取改变isPlaying，但是暂时无法解决主页图片滚动一致的问题，因此目前只在show的瞬间才执行改变)
    handleHideAction(ctx){
      const status = audioContext.paused;
      ctx.isPlaying = !status;
    },
  }
})

export {
  audioContext,
  playerStore
}