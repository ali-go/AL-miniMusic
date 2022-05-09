// pages/detail-search/index.js
import {
  getSearchHot,
  getSearchSuggest,
  getSearchResult
} from "../../../service/api_search"
import debounce from "../../../utils/debounce.js"
import stringToNodes from "../../../utils/string2nodes"
import { playerStore } from "../../../store/player-store"
// 防抖处理输入查询
const debounceGetSearchSuggest = debounce(getSearchSuggest);
Page({

  data: {
    hotKeyWords: [], //热词
    suggestSongs: [], //搜索的建议歌曲
    searchValue:"",//搜索词
    suggestSongNodes:[],//处理搜索出来的歌曲节点(用于匹配输入值的部分特殊样式标识)
    resultSongs:[],//查询歌曲
  },

  onLoad(options) {
    this.getPageData();
  },
  // 1.获取初始化网络请求
  getPageData() {
    // 获取热门搜索关键词
    getSearchHot().then(res => {
      this.setData({
        hotKeyWords: res.result.hots
      })
    })
  },
  // 2.输入框改变请求建议
  handleSearchChange(event) {
    // (1).处理关键词
    const searchValue = event.detail;
    // (2).保存关键词
    this.setData({
      searchValue
    })
    // (3).判断关键词为空时处理逻辑
    if (!searchValue.length) {
      this.setData({
        suggestSongs:[],
        resultSongs:[],
      })
      // console.log("情况",this.data.suggestSongs,this.data.suggestSongNodes,this.data.suggestSongs);
      // console.log(!this.data.searchValue.length && !this.data.suggestSongs.length);
      return;
    };
    // (4).获取根据关键词搜索的建议歌曲
    debounceGetSearchSuggest(searchValue).then(res => {
      // 1.获取建议数据
      const suggestSongs = res.result.allMatch;
      // 防止请求发起后又清空输入框，导致请求异步响应后依旧赋值suggestSongs
      if(!this.data.searchValue.length){
        return;
      }
      this.setData({ suggestSongs });
      this.setData({ resultSongs:[] });//防止选择歌曲后继续输入不显示搜索建议
      // 2.处理搜索建议的node节点，用于rich-text富文本组件
      const suggestKeywords = suggestSongs.map(item=>item.keyword);
      const suggestSongNodes = [];//存储处理后的节点数据
      for(const keyword of suggestKeywords){
        const notes = stringToNodes(keyword,searchValue);
        suggestSongNodes.push(notes);
      }
      this.setData({
        suggestSongNodes
      })
    })
  },
  // 3.回车查询歌曲
  handleSearchAction(){
    getSearchResult(this.data.searchValue).then(res=>{
      console.log(res);
      const resultSongs = res.result.songs;
      this.setData({
        resultSongs
      })
    })
  },
  // 4.点击搜索建议查询歌曲
  handleSuggestItemClick(event){
    const index = event.currentTarget.dataset.index;
    const keywords = this.data.suggestSongs[index].keyword;
    this.setData({
      searchValue:keywords
    })
    this.handleSearchAction(keywords);
  },
  // 5.点击热词搜索歌曲
  handleTagItemClick(event){
    const index = event.currentTarget.dataset.index;
    const keywords = this.data.hotKeyWords[index].first;
    this.setData({
      searchValue:keywords
    })
    this.handleSearchAction(keywords);
  },
  // 6.点击歌曲，用于设置播放列表
    handleSongItemClick(event){
      const index = event.currentTarget.dataset.index;
      playerStore.setState("playListSongs",this.data.resultSongs);
      playerStore.setState("playListIndex",index);
    },
  onUnload() {

  },
})