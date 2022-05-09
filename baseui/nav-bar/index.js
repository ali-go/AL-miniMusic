// baseui/nav-bar/index.js
Component({
  options:{
    // 有多个插槽必须设置
    multipleSlots:true
  },
  properties: {
    title:{
      type:String,
      value:"默认标题"
    }
  },
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,//状态栏高度
    navBarHeight:getApp().globalData.navBarHeight,//导航栏高度
  },
  methods: {
    // 点击返回
    handleLeftClick(){
      this.triggerEvent("click")
    }
  }
})