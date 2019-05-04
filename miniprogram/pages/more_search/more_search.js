// miniprogram/pages/more_searach/more_search.js
const db = wx.cloud.database()
var app = getApp()
var from_start = 20
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectitems1:
      [{
        "id": "0",
        "text": "热度排序"
      }, {
        "id": "1",
        "text": "最新发布"
      }],
    selectitems2:
      [{
        "id": "0",
        "text": "八里台校区"
      }, {
        "id": "1",
        "text": "津南校区"
      }],
    selectitems3:
      [{
        "id": "0",
        "text": "女士"
      }, {
        "id": "1",
        "text": "男士"
      }, {
        "id": "3",
        "text": "全部"
      }],
    products_more_search: null,
    sorts: 'attention_num',
    sex_fit: null,
    campus: null,
    a: {},
    goods_sorts: null,
    goods_name: ""
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
      let cloud_id = that.data.products_more_search[res.currentTarget.dataset.index]._id
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
        let local_data = wx.getStorageSync('goods_cookies')||[]
        for (let a in local_data) {
          if (local_data[a]._id == cloud_id) {
            local_data[a].is_show = false
            local_data[a].attention_num -= 1
            that.setData({
              products_more_search: local_data
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
        let local_data = wx.getStorageSync('goods_cookies')||[]
        for (let a in local_data) {
          if (local_data[a]._id == cloud_id) {
            local_data[a].is_show = true
            local_data[a].attention_num += 1
            that.setData({
              products_more_search: local_data
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
      //现更改data，然后再把它存入云
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

  get_data_from_cloud: function () {
    from_start = 20
    let that = this
    console.log(that.data.a)
    console.log('==调用加载物品函数==')
    //显示物品信息
    db.collection('goods').orderBy(that.data.sorts, 'desc').where(that.data.a).limit(from_start).get({
      success(res) {
        console.log('==加载物品成功==搜索页==')
        let local_data = res.data
        let local_attention = wx.getStorageSync('attention_cookies')||[]
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
          products_more_search: local_data
        })
        console.log('==更新后的数据==')
        console.log(that.data.products_more_search)
      
      }
    });
  },
  get_more_data_from_cloud: function () {
    let that = this
    console.log(that.data.a)
    console.log('==调用加载物品函数==')
    //显示物品信息
    db.collection('goods').orderBy(that.data.sorts, 'desc').where(that.data.a).limit(from_start).skip(from_start).get({
      success(res) {
        console.log('==加载物品成功==搜索页==')
        let local_data = res.data
        let local_attention = wx.getStorageSync('attention_cookies') || []
        for (let a in local_data) {
          for (let b in local_attention) {
            if (local_data[a]._id == local_attention[b]) {
              local_data[a].is_show = true
              break
            }
          }
        }
        that.data.products_more_search.push.apply(that.data.products_more_search, local_data)
        that.setData({
          products_more_search: that.data.products_more_search
        })
        wx.setStorageSync('goods_cookies', that.data.products_more_search)
        console.log('==更新后的数据==')
        console.log(that.data.products_more_search)
      }
    });
  },
  

  //新热程度排序
  hot_new_sort: function (res) {
    console.log('==新热程度排序==')
    console.log(res)
    let that = this
    if (res.detail.nowText == '最新发布') {
      that.setData({
        sorts: 'creatTime'
      })}
      else{
      that.setData({
        sorts: 'attention_num'
      })
      }
      wx.startPullDownRefresh()
  },
  //校区筛选
  campus: function (res) {
    console.log('==校区筛选==');
    console.log(res)
    let that = this
    if (res.detail.nowIdx == 0) {
      that.data.a.campus = 1
      that.setData({
        campus: 1
      })
    }
    else {
      that.data.a.campus = 2
      that.setData({
        campus: 2
      })
    };
    wx.startPullDownRefresh();
  },
  //性别筛选
  sex_fit: function (res) {
    console.log('==性别筛选==')
    console.log(res.detail)
    let that = this
    if (res.detail.nowIdx == 2) {
      that.data.a.sex_fit = 3
      that.setData({
        sex_fit: 3
      })
    }
    else if (res.detail.nowIdx == 0) {
      that.data.a.sex_fit = 1
      that.setData({
        sex_fit: 1
      })
    }
    else {
      that.data.a.sex_fit = 2
      that.setData({
        sex_fit: 2
      })
    };

    wx.startPullDownRefresh();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('==加载==搜索页==')
    console.log('==more_search页面传递的参数==')
    console.log(options.name)
    let that = this;
    if (options.name) {
      that.data.a.goods_sorts = options.name
      that.setData({
        goods_sorts: options.name,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('==准备==搜索页==')
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
    console.log('==下拉刷新事件==搜索页==')
    let that = this
    that.get_data_from_cloud()
    wx.stopPullDownRefresh();
    console.log("==刷新完成==")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    that.get_more_data_from_cloud()
    from_start += 20
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //搜索名字
  search_name: function (res) {
    console.log('==输入的内容如下：==')
    console.log(res.detail.value)
    let that = this;
    that.data.a.goods_name = db.RegExp({
      regexp: res.detail.value,
      options: 'i',
    })
      that.data.goods_name=db.RegExp({
        regexp: res.detail.value,
        options: 'i',
      })

    that.get_data_from_cloud()
  },
  //预览图片
  // preview: function (res) {
  //   let that = this;
  //   wx.previewImage({
  //     urls: [that.data.products_more_search[res.currentTarget.dataset.index].goods_photo[0]]
  //   })
  // },
  //进入详情页面
  to_introduction: function (res) {
    let that = this
    console.log(res)
    let orderJsonStr = JSON.stringify(that.data.products_more_search[res.currentTarget.dataset.index])
    wx.navigateTo({
      url: '../introduction/introduction?the_one=' + encodeURIComponent(orderJsonStr) + '&from_=' + res.currentTarget.dataset.from_
    })
  }
})