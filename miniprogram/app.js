
App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    console.log("==启动小程序==")
    let that = this
    wx.hideTabBar();
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      console.log('==wx.cloud==')
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.cloud.init({
        traceUser: true,
      })
    }
    wx.cloud.callFunction({
      name: 'login',
      success(res) {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '加载成功',
          icon: "success",
          mask: true,
          duration: 2000
        })

        that.globalData.myopenid = res.result.openid
        console.log('====获取用户openid====' + that.globalData.myopenid)
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '网络故障\n无法加载',
          icon: 'none',
          duration: 3000,
          mask: true
        })
      }
    })
    setInterval(that.has_changed, 30000) 
  },
  has_changed: function () {
    let that = this
    const db = wx.cloud.database()
    db.collection('goods').get({
      success(res) {
        console.log('==has_changed被执行==')
        let temp_data = res.data
        let temp_id = []
        for (let a in temp_data) {
          temp_id.push(temp_data[a]._id)
        }
        console.log('==数据库中的_id==')
        console.log(temp_id)
        let attention_data = wx.getStorageSync("attention_cookies") || []
        console.log(attention_data)
        if (attention_data.length != 0) {
          for (let b in attention_data) {
            if (temp_id.indexOf(attention_data[b]) == -1) {
              console.log('==收藏被删除==')

              attention_data.splice(b, 1)
              wx.setStorageSync('attention_cookies', attention_data)
          
              that.globalData.red_point = true
              that.globalData.red_point_cancle = true
              
              console.log(that.globalData.red_point)
            }
          }
        }
      }
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    wx.hideTabBar();
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },
  /** 设置底部标签栏 */
  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },

  globalData: {
    /** 底部标签 */
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#979795",
      "selectedColor": "#1c1c1b",
      "list": [{
        "pagePath": "/pages/homepage/homepage",
        "iconPath": "icon/icon_home.png",
        "selectedIconPath": "icon/icon_home_HL.png",
        "text": "首 页"
      },
      {
        "pagePath": "/pages/search/search",
        "iconPath": "icon/icon_search.png",
        "selectedIconPath": "icon/icon_search_HL.png",
        "text": "搜 索"
      },
      {
        "pagePath": "/pages/release/release",
        "iconPath": "icon/icon_release.png",
        "isSpecial": true,
        "text": "发 布"
      },
      {
        "pagePath": "/pages/notice/notice",
        "iconPath": "icon/icon_notice.png",
        "selectedIconPath": "icon/icon_notice_HL.png",
        "text": "消 息"
      },
      {
        "pagePath": "/pages/mine/mine",
        "iconPath": "icon/icon_mine.png",
        "selectedIconPath": "icon/icon_mine_HL.png",
        "text": "我 的"
      }
      ]
    },
    userInfo: null,
    myopenid: null,
    products: null,
    red_point: false,
    red_point_cancle: false
  },

})