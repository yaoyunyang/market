// miniprogram/pages/introduction/introduction.js
var app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: null,
    openid: null,
    from_: null,
    show_tabber: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //把对象类型解析
    const one = JSON.parse(decodeURIComponent(options.the_one))
    console.log("==传递给详情页的数据==")
    console.log(one)
    let that = this
    if (one.campus == 1) {
      one.campus = "八里台校区"
    } else {
      one.campus = "津南校区"
    }
    if (one.sex_fit == 3) {
      one.sex_fit = "全部"
    } else if (one.sex_fit == 2) {
      one.sex_fit = "男士"
    } else {
      one.sex_fit = "女士"
    }
    let a = one.creatTime.slice(0, 10)
    let b = one.creatTime.slice(11, 19)
    let c = a + '\n' + b
    one.creatTime = c
    that.setData({
      details: one,
      openid: app.globalData.myopenid,
      from_: options.from_
    })
    console.log(that.data.from_)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {
    console.log('==弹出框蒙层截断touchmove事件==')
  },
  hide_tabber: function() {
    let that = this;
    that.setData({
      show_tabber: false
    });
  },
  close_the_tabber:function(){
    let that = this;
    that.setData({
      show_tabber: false
    });
  },
  //显示底部弹出
  show_the_tabber:function(){
    let that = this
    that.setData({
      show_tabber : true
    })
  },
  //重新编辑
  to_release_page:function(res){
    let that = this
    console.log(res)
    let orderJsonStr = JSON.stringify(res.currentTarget.dataset.goods)
    wx.navigateTo({
      url: '../release/release?goods=' + encodeURIComponent(orderJsonStr)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //预览图片
  preview: function(res) {
    console.log(res)
    let that = this;
    wx.previewImage({
      urls: [that.data.details.goods_photo[res.currentTarget.dataset.index]]
    })
  },
  //删除发布
  delete_release: function(res) {
    let that = this
    console.log('==删除点击传递过来的参数==')
    console.log(res)
    console.log(res.currentTarget.dataset.fileids)
    if (res.currentTarget.dataset.fileids) {
      let fileids = res.currentTarget.dataset.fileids
      let id = res.currentTarget.dataset._id
      let goods_name = res.currentTarget.dataset.goods_name
      let nickname = res.currentTarget.dataset.nickname
      let creatTime = res.currentTarget.dataset.creatTime
      wx.showModal({
        title: '提示',
        content: '是否确认删除',
        success(res) {
          if (res.confirm) {
            //是否自己删除的时候更新关注内容
            let arr = wx.getStorageSync('attention_cookies')
            if (arr.indexOf(id) != -1) {
              let index = arr.indexOf(id)
              arr.splice(index, 1)
              wx.setStorageSync('attention_cookies', arr)
            }
            //将删除的名字和物品名存入另一个集合
            db.collection('delete_goods').add({
              data:{
                goods_name: goods_name,
                nickname:nickname,
                new_id: id,
                creatTime: creatTime
              }
            })
            //删除云存储
            wx.cloud.deleteFile({
              fileList: fileids,
              success: res => {
                // handle success
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 1000
                })
                console.log('==删除成功==')
                console.log(res.fileList)
              },
              fail: err => {
                console.log('==删除失败==')
                console.log(err)

                // handle error
              }
            })
            //删除数据库
            db.collection('goods').doc(id).remove({
              success(res) {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } else if (res.cancel) {
            console.log(res)
          }
        }
      })

    } else {
      wx.showToast({
        title: '网络延迟\n稍后再式',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      that.setData({
        show_tabber: false
      })
    }
  },

  // 详情页关注
  collection:function(){
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
      
      // 点赞存储到本地缓存
      let cookies = wx.getStorageSync('attention_cookies') || []
      let cloud_id = that.data.details._id
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
              details: local_data[a]
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
              details: local_data[a]
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
  }
})