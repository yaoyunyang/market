// miniprogram/pages/cancle_goods/cancle_goods.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    has_cancled: null,
  },
  //从云端获取删除的数据
  get_data_from_cancle:function(res){
    let that = this
    db.collection('delete_goods').orderBy('creatTime', 'desc').get({
      success(res) {
        let temp=[]
        let data = res.data
        console.log(that.data.has_cancled)
        let attention = wx.getStorageSync('attention_cookies')
        for(let a in attention){
          for(let b in data){
            if(data[b].new_id == attention[a]){
              temp.push(data[b])
              break
            }
          }
        }
        if(temp.length != 0){
        that.setData({
          has_cancled:temp
        })}

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let that = this

    that.get_data_from_cancle()
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