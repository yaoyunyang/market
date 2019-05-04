
var app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attention_num: 0,
    star_path: '../../images/attention_icon/Star.png',
    products_homepage: null,
    is_attention: false
  },


  //点击关注
  attention_event: function (res) {
    let that = this;
    if (!app.globalData.userInfo) {
      wx.switchTab({
        url: '../mine/mine',
      })
      wx.showToast({
        title: '请先进行登陆',
        icon: 'none',
        duration: 2000
      })
      console.log('==没有登陆，跳转我的页面==')
    }
    else {
      console.log('==关注事件返回值==')
      console.log(res)
      // 点赞存储到本地缓存
      let cookies = wx.getStorageSync('attention_cookies') || []
      let cloud_id = that.data.products_homepage[res.currentTarget.dataset.index]._id
      let newmessage = []
      let add = 0
      for (var j in cookies) {
        if (cookies[j] == cloud_id) {
          add = 1
          break
        }
      }
      if (add == 1) {//说明已经点过赞,取消赞  
        let n = 0;
        for (var i in cookies) {
          if (cookies[i] != cloud_id) {
            newmessage[n] = cookies[i];
            n++
          }
        }
        wx.setStorageSync('attention_cookies', newmessage);//删除取消赞的id 
        //更新本地缓存 和页面数据
        let local_data = wx.getStorageSync('goods_cookies')
        for (let a in local_data) {
          if (local_data[a]._id == cloud_id) {
            local_data[a].is_show = false
            local_data[a].attention_num -= 1
            that.setData({
              products_homepage: local_data
            })
            wx.setStorageSync('goods_cookies', local_data)
            break
          }
        }
        wx.cloud.callFunction({
          name: 'attention_sub',
          data: {
            docid: cloud_id
          }, success: function (res) {
            console.log('==关注量减一成功==')
            console.log(res)
          }, fail: function (res) {
            console.log('==关注量减一失败==')
            console.log(res)
          }
        })
        wx.showToast({
          title: '取消收藏',
          icon: 'success',
          mask: true,
          duration: 1000
        })
      }
      else {
        cookies.unshift(cloud_id)
        wx.setStorageSync('attention_cookies', cookies)
        //更新本地缓存 和页面数据
        let local_data = wx.getStorageSync('goods_cookies')
        for (let a in local_data) {
          if (local_data[a]._id == cloud_id) {
            local_data[a].is_show = true
            local_data[a].attention_num += 1
            that.setData({
              products_homepage: local_data
            })
            wx.setStorageSync('goods_cookies', local_data)
            break
          }
        }
        wx.cloud.callFunction({
          name: 'attention_plus',
          data: {
            docid: cloud_id
          }, success: function (res) {
            console.log('==关注量加一成功==')
            console.log(res)
          }, fail: function (res) {
            console.log('==关注量加一失败==')
            console.log(res)
          }
        })
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          mask: true,
          duration: 1000
        })

      }


    }
  },

  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    let that = this
    console.log('==显示==首页==')

    that.get_data_from_cloud()
  },

  //从云端获取适合本地的数据
  get_data_from_cloud: function () {
    let that = this
    db.collection('goods').orderBy('attention_num', 'desc').limit(10).get({
      success(res) {
        console.log('==数据库中的数据==')
        console.log(res.data)
        let local_data = res.data
        let local_attention = wx.getStorageSync('attention_cookies')
        for (let a in local_data) {
          for (let b in local_attention) {
            if (local_data[a]._id == local_attention[b]) {
              local_data[a].is_show = true
              break
            }
          }
        }
        wx.setStorageSync('goods_cookies', local_data)
        that.setData({
          products_homepage: local_data
        })
        console.log('==更新后的数据==')
        console.log(that.data.products_homepage)
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('==加载==首页==')
    app.editTabbar();
   

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('==准备==首页==')
  },




  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('==隐藏==首页==')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('==卸载==首页==')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('==下拉刷新事件==首页==')
    let that = this
    that.get_data_from_cloud()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('==上拉触底事件==首页==')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log('==用户分享==首页==')
  },
  //预览图片
  //预览图片
  // preview: function (res) {
  //   let that = this;
  //   wx.previewImage({
  //     urls: [that.data.products_homepage[res.currentTarget.dataset.index].goods_photo[0]]
  //   })
  // },
  to_introduction: function (res) {
    let that = this
    console.log(res)
    let orderJsonStr = JSON.stringify(that.data.products_homepage[res.currentTarget.dataset.index])
    wx.navigateTo({
      url: '../introduction/introduction?the_one=' + encodeURIComponent(orderJsonStr) + '&from_=' + res.currentTarget.dataset.from_
    })
  }
})