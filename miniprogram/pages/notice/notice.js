// miniprogram/pages/message/message.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    red_point_cancle:app.globalData.red_point_cancle,
    tabbar: {},
    show_contact:false
  },
  to_cancle_goods:function(){
    let that = this;
    app.globalData.red_point_cancle=false
    wx.navigateTo({
      url: '../cancle_goods/cancle_goods',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
  },
  //商品变动暂不支持
  // temp_not_supported:function(){
  //   wx.showToast({
  //     title: '暂不支持该功能',
  //     icon:"none",
  //     mask:true,
  //     duration:1000
  //   })
  // },
  //联系客服
  contact:function(){
    wx.showModal({
      title: '联系客服',
      content: 'NKscycy@163.com',
      showCancel: false,
      confirmColor: "#000"
    })
    
  },
  //跳转好物推荐
  to_recommandation:function(){
    wx.navigateTo({
      url: "../recommandation/recommandation",
    })
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.red_point = false
    if (!app.globalData.userInfo) {
      wx.switchTab({
        url: '../mine/mine',
      })
      console.log('==没有登陆，跳转我的页面==')
    } 
    let that = this
    that.setData({
      red_point_cancle: app.globalData.red_point_cancle
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})