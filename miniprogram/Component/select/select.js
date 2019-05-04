// Componet/Componet.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propArray: {
      type: Array,
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    selectShow: false, //初始option不显示
    select_color: "gray",
    newname: "热度排序",
    items_color: "gray"
  },
  /**
   * 组件的方法列表
   */
  methods: {　　　 //option的显示与否
    selectToggle: function() {
      var nowShow = this.data.selectShow; //获取当前option显示的状态
      if (this.data.select_color == "gray") {
        this.setData({
          selectShow: !nowShow,
          select_color: "black"
        })
      } else {
        this.setData({
          selectShow: !nowShow,
          select_color: "gray"
        })
      }
    },
    //设置内容
    setText: function(e) {
      var nowData = this.properties.propArray; //当前option的数据是引入组件的页面传过来的，所以这里获取数据只有通过this.properties
      console.log("==自定义组件==点击事件返回内容==")
      console.log(e)
      var nowIdx = e.target.dataset.index; //当前点击的索引
      var nowText = nowData[nowIdx].text; //当前点击的内容
      this.triggerEvent('hot_new', {
        nowText
      })
      this.setData({
        selectShow: false,
        newname: nowText,
        select_color: "gray"
      })
    }
  }
})