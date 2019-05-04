// miniprogram/pages/mine/mine.js
var app = getApp()
var info = null
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    red_point: app.globalData.red_point,
    tabbar: {},
    isshow1: true,
    isshow2: false,
    products_mine: null,
    //用于获取的页面用户头像和昵称
    userNickname: "请先点击头像进行登陆",
    userAvatar: 'user-unlogin.png',
    storage_data: []
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('==加载==我的页面==')
    app.editTabbar();
    // 获取用户信息   编译后不再需要，弹框
    console.log('==路由到我的页面时传递的参数==')
    console.log(options)



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('==准备==我的页面==')
  },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    console.log('==显示==我的页面==')
    let that = this
    that.setData({
      red_point: app.globalData.red_point
    })
    if (app.globalData.userInfo) {
      that.setData({
        userNickname: app.globalData.userInfo.nickName,
        userAvatar: app.globalData.userInfo.avatarUrl,
      })
    }

    if (that.data.isshow1) {
      console.log('==此时为发布页面==')
      that.get_data_from_cloud()
    }
    else {
      console.log('==此时为收藏页面==')
      that.update_goods_collection(0, that, wx.getStorageSync('attention_cookies'), that.data.storage_data)
    }
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('==隐藏==我的页面==')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('==卸载==我的页面==')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('==下拉刷新==我的页面==')
    let that = this
    if (that.data.isshow1) {
      console.log('==此时为发布页面==')
      that.get_data_from_cloud()
    }
    else {
      console.log('==此时为收藏页面==')
      
      that.update_goods_collection(0, that, wx.getStorageSync('attention_cookies'), that.data.storage_data)
    }
    wx.stopPullDownRefresh();
  },

  //点击关注
  attention_event: function (res) {
    let that = this;
    console.log('==关注事件返回值==')
    console.log(res)
    // 点赞存储到本地缓存
    let cookies = wx.getStorageSync('attention_cookies') || []
    let cloud_id = that.data.products_mine[res.currentTarget.dataset.index]._id
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
            products_mine: local_data
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
            products_mine: local_data
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
        mask:true,
        duration: 1000
      })
    }
    if (that.data.isshow2) {
      console.log('==此时为收藏页面==')
      that.update_goods_collection(0, that, wx.getStorageSync('attention_cookies'), that.data.storage_data)
      // wx.startPullDownRefresh()
    }

  },
  //加载图品函数
  get_data_from_cloud: function () {
    let that = this
    if (app.globalData.userInfo) {
      console.log('==调用发布物品更新函数==')
      wx.cloud.callFunction({
        name: 'get_mine_data',
        data: {
          openid: app.globalData.myopenid
        },
        success(res) {
          console.log('==数据库中的数据==')
          console.log(res.result.data)
          let local_data = res.result.data
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
            products_mine: local_data
          })
          console.log('==更新后的数据==')
          console.log(that.data.products_mine)
        }
      })

    } else {
      if (app.globalData.myopenid)
      {wx.showToast({
        title: '请先点击头像进行登陆',
        icon: 'none',
        duration: 1000
      })}
    }
  },
  //加载收藏物品
  update_goods_collection: function (i, that, storage, arr) {
    console.log(that.data.storage_data)
    console.log(arr)
    console.log(storage)
    console.log('==数据的数量==')
    console.log(storage.length)
    console.log(storage[i])
    if (storage.length != 0) {
      if (app.globalData.userInfo) {
        console.log('==调用收藏物品更新函数==')
        wx.cloud.callFunction({
          name: 'get_collection_data',
          data: {
            id: storage[i]
          },
          success(res) {
            console.log('==成功找到一条记录：==')
            console.log(res.result.data[0])
            if (!res.result.data[0]) {
              console.log('==执行删除==')
              console.log('==云数据库中该记录已被删除==')
              let array = wx.getStorageSync('attention_cookies')
              if (array.indexOf(storage[i]) != -1) {
                let index = arr.indexOf(storage[i])
                array.splice(index, 1)
                wx.setStorageSync('attention_cookies', array)
                storage = wx.getStorageSync('attention_cookies')
              }
            }
            else {
              let local_data = res.result.data[0]
              let local_attention = wx.getStorageSync('attention_cookies')
              for (let b in local_attention) {
                if (local_data._id == local_attention[b]) {
                  local_data.is_show = true
                  break
                }
              }

              console.log(local_data)
              arr[i] = local_data
              console.log('==arr中的值==')
              console.log(arr)
              i += 1
            }
            if (storage.length != 0) {
              if (i < storage.length) {
                that.update_goods_collection(i, that, storage, arr)
              } else {
                console.log('==递归结束==')
                console.log(arr)
                that.setData({
                  products_mine: arr,
                  storage_data : []
                })
                wx.setStorageSync('goods_cookies', arr)
                console.log('此时的：products_mine')
                console.log(that.data.products_mine)
                wx.stopPullDownRefresh()
              }
            } else {
              that.setData({
                products_mine: null
              })
            }
          },
          fail(err) {
            console.log(err)
          }
        });

      } else {
        wx.showToast({
          title: '请先点击头像进行登陆',
          icon: 'none',
          duration: 1000
        })
      }
    }
    else {
      that.setData({
        products_mine: null
      })
    }
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

  },
  showBorder1: function () {
    let that = this
    that.setData({
      isshow1: true,
      isshow2: false
    })
    wx.startPullDownRefresh()
  },
  showBorder2: function () {
    let that = this
    that.setData({
      isshow2: true,
      isshow1: false,    
    })
    console.log(that.data.storage_data)
    console.log('==进入收藏页面==')
    wx.startPullDownRefresh()
  },
  //!this.logged???
  onGetUserInfo: function (e) {
    let that = this;
    wx.showLoading({
      title: '登陆中',
      mask:true
    })
    console.log("==登陆前用户信息如下==")
    console.log(app.globalData.userInfo)
    if (app.globalData.myopenid){
    if (!app.globalData.userInfo &&e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      //wx.setStorageSync('Nickname', e.detail.userInfo.nickName)
      //wx.setStorageSync('Avatar', e.detail.userInfo.avatarUrl)
      console.log("==点击头像==app.userInfo赋值==")
      that.setData({

        userNickname: e.detail.userInfo.nickName,
        userAvatar: e.detail.userInfo.avatarUrl,
      })
      wx.hideLoading()
      wx.showToast({
        title: '登陆成功',
        mask: true,
        duration: 1000
      })
      console.log("==登陆后用户信息如下==")
      console.log(app.globalData.userInfo)
      console.log("==点击头像==logged登陆==")
      wx.startPullDownRefresh()
    }else{
      wx.hideLoading()
      wx.showToast({
        title: '已登陆',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }}else{
      wx.hideLoading()
      wx.showToast({
        title: '登陆失败',
        icon: 'none',
        duration: 3000,
        mask: true
      })
    }
  },

  //预览图片
  // preview:function(res){
  //   let that = this;
  //   wx.previewImage({
  //     urls: [that.data.products_mine[res.currentTarget.dataset.index].goods_photo[0]]
  //   })
  // }
  to_introduction: function (res) {
    let that = this
    console.log(res)
    console.log(that.data.products_mine[res.currentTarget.dataset.index])
    let orderJsonStr = JSON.stringify(that.data.products_mine[res.currentTarget.dataset.index]);
    wx.navigateTo({
      url: '../introduction/introduction?the_one=' + encodeURIComponent(orderJsonStr)
     + '&from_=' + res.currentTarget.dataset.from_
    })
  }

})