// tabBarComponent/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
        "backgroundColor": "#ffffff",
        "color": "#979795",
        "selectedColor": "#1c1c1b",
        "list": [
          {
            "pagePath": "/pages/homepage/homepage",
            "iconPath": "icon/icon_home.png",
            "selectedIconPath": "icon/icon_home_HL.png",
            "text": "首页"
          },
          {
            "pagePath": "/pages/search/search",
            "iconPath": "icon/icon_search.png",
            "selectedIconPath": "icon/icon_search_HL.png",
            "text": "搜索"
          },
          {
            "pagePath": "/pages/release/release",
            "iconPath": "icon/icon_release.png",
            "isSpecial": true,
            "text": "发布"
          },
          {
            "pagePath": "/pages/notice/notice",
            "iconPath": "icon/icon_notice.png",
            "selectedIconPath": "icon/icon_notice_HL.png",
            "text": "消息"
          },
          {
            "pagePath": "/pages/mine/mine",
            "iconPath": "icon/icon_mine.png",
            "selectedIconPath": "icon/icon_mine_HL.png",
            "text": "我的"
          }
        ]
      }
    }
  }
})