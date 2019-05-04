// miniprogram/pages/publish/publish.js
var app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    red_point: app.globalData.red_point,
    switchChecked: false,
    changecolor1: "gray",
    changecolor2: "black",
    selectArray: [{
      "id": "0",
      "text": "图书"
    }, {
      "id": "1",
      "text": "电子产品"
    }, {
      "id": "2",
      "text": "服饰鞋包"
    }, {
      "id": "3",
      "text": "服务"
    }, {
      "id": "4",
      "text": "校外"
    }, {
      "id": "5",
      "text": "美妆运动"
    }, {
      "id": "6",
      "text": "水果生鲜"
    }, {
      "id": "7",
      "text": "其他"
    }],
    showModal1: false,
    showModal2: false,
    is_show_add_icon: true,
    campus: 2,
    text_introduction: null,
    choose_product_images: [],
    classification_name: null,
    sex_fit: null,
    goods_price: null,
    num_on_icon: "价格",
    goods_name_on_icon: '名称',
    all_color: "rgb(234, 234, 245)",
    woman_color: "rgb(234, 234, 245)",
    man_color: "rgb(234, 234, 245)",
    userAvatar: null,
    userNickname: null,
    goods_name: null,
    is_new: 0,
    new_color: "#d8d8d8",
    goods_photo_paths: [],
    temp_text: "",
    classification_name_on_card: "分类",
    tempid: null,
    number: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (!app.globalData.userInfo) {
      wx.switchTab({
        url: '../mine/mine',
      })
      console.log('==没有登陆，跳转我的页面==')
    } else {
      that.setData({
        userAvatar: app.globalData.userInfo.avatarUrl,
        userNickname: app.globalData.userInfo.nickName,
      })
      console.log('==已经登陆，无需点击==')
    }
    console.log("==重新编辑==")
    console.log(options)
    if (options.goods) {
      console.log(JSON.parse(decodeURIComponent(options.goods)))
      const temp = JSON.parse(decodeURIComponent(options.goods))
      that.setData({
        number: temp.goods_photo.length,
        choose_product_images: temp.goods_photo,
        goods_photo_paths: temp.goods_photo,
        text_introduction: temp.text_introduction,
        classification_name: temp.goods_sorts,
        goods_price: temp.price,
        goods_name: temp.goods_name,
        goods_name_on_icon: temp.goods_name,
        num_on_icon: "¥" + temp.price,
        attention_num: temp.attention_num,
        userAvatar: temp.avatarurl,
        is_new: temp.is_new,
        userNickname: temp.nickname,
        temp_text: temp.text_introduction,
        classification_name_on_card: temp.goods_sorts,
        tempid: temp._id,

      })
      if (temp.campus == "津南校区") {
        that.setData({
          campus: 1
        })
        that.change_color2();
      }
      else {
        that.setData({
          campus: 2
        })
        that.change_color1();
      }
      if (temp.sex_fit == "全部") {
        that.all()
        that.setData({
          sex_fit: 3
        })
      }
      else if (temp.sex_fit == "男士") {
        that.man()
        that.setData({
          sex_fit: 2
        })
      }
      else {
        that.woman()
        that.setData({
          sex_fit: 1
        })
      }
      if (temp.is_new == 1) {
        that.setData({
          switchChecked: true,
          new_color: "#000000"
        })
      }
    }
    else {
      console.log('==未进行重新编辑==')
    }

  },



  /**
   * 弹窗
   */
  showDialogBtn1: function () {
    this.setData({
      showModal1: true
    })
  },
  showDialogBtn2: function () {
    this.setData({
      showModal2: true
    })
  },



  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () { console.log('==弹出框蒙层截断touchmove事件==') },
  /**
   * 隐藏模态对话框
   */
  hideModal1: function () {
    let that = this;
    that.setData({
      showModal1: false
    });
  },
  hideModal2: function () {
    let that = this;
    that.setData({
      showModal2: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel1: function () {
    let that = this;
    that.hideModal1();
  },
  onCancel2: function () {
    let that = this;
    that.hideModal2();
  },
  /**
   * 对话框确认按钮点击事件，      同时设置价格显示
   */
  onConfirm1: function () {
    this.hideModal1();
    let that = this;
    if ((that.data.num_on_icon != '价格') && (that.data.num_on_icon.indexOf("¥") == -1)) {
      that.setData({
        num_on_icon: "¥" + that.data.num_on_icon,
        goods_price: that.data.goods_price
      })
    }
  },
  onConfirm2: function () {
    this.hideModal2();
    let that = this;
    that.setData({
      goods_name: that.data.goods_name,
      goods_name_on_icon: that.data.goods_name_on_icon
    })
  },
  //价格设置
  inputChange1: function (e) {
    let that = this;
    that.setData({
      num_on_icon: e.detail.value,
      goods_price: e.detail.value
    })


  },
  inputChange2: function (e) {
    let that = this;
    that.data.goods_name_on_icon = e.detail.value;
    that.data.goods_name = e.detail.value;
  },

  //是否全新宝贝
  is_new: function (res) {
    let that = this
    console.log('==is new ? :' + res.detail.value + '==')
    if (res.detail.value) {
      that.setData({
        is_new: 1,
        new_color: "#000000"
      })
    } else {
      that.setData({
        is_new: 0,
        new_color: "#d8d8d8"
      })
    }
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
    console.log('==上次的结果==')
    console.log(that.data.choose_product_images)
    console.log(that.data.goods_photo_paths)
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
    wx.stopPullDownRefresh()
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


  //设置产品描述
  text_inrotduct: function (e) {
    let that = this;
    console.log(e)
    that.setData({
      text_introduction: e.detail.value
    })
  },

  //校区选择改变颜色
  change_color1: function () {
    if (this.data.campus == 2) {
      this.setData({
        changecolor1: "black",
        changecolor2: "gray",
        campus: 1
      })
    }
  },
  change_color2: function () {
    if (this.data.campus == 1) {
      this.setData({
        changecolor2: "black",
        changecolor1: "gray",
        campus: 2
      })
    }
  },
  //点击图片实现预览效果
  preview: function (res) {
    let that = this;
    wx.previewImage({
      urls: [that.data.choose_product_images[res.currentTarget.dataset.index]],
    })
  },
  //选择图片
  choose_images: function () {
    let that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        let images = that.data.choose_product_images

        if (images.length + res.tempFilePaths.length <= 9) {
          images.push.apply(images, res.tempFilePaths)
          if (images.length == 9) {

            that.setData({
              choose_product_images: images,
              is_show_add_icon: false
            })
          } else {
            that.setData({
              choose_product_images: images
            })

          }
        } else {
          wx.showToast({
            title: '一次性最多上传9张图片',
            'icon': 'none',
            duration: 30000
          })
        }
        console.log("==选择图片" + that.data.choose_product_images + '==')
        console.log(that.data.temp)

      },
      fail: e => {
        console.error(e)
      },
      complete: e => {
        wx.hideLoading();
      }
    })
  },
  //分类选择
  classificate: function (e) {
    let that = this;
    that.setData({
      classification_name: e.detail.nowText,
      classification_name_on_card: e.detail.nowText
    })
    console.log('==分类：' + that.data.classification_name + '==')
  },

  //适用人群 全部：3  女士：1 男生：2
  all: function () {
    let that = this;
    that.setData({
      all_color: "skyblue",
      woman_color: "ghostwhite",
      man_color: "ghostwhite",
      sex_fit: 3
    })
  },
  woman: function () {
    let that = this;
    that.setData({
      all_color: "ghostwhite",
      woman_color: "skyblue",
      man_color: "ghostwhite",
      sex_fit: 1
    })
  },
  man: function () {
    let that = this;
    that.setData({
      all_color: "ghostwhite",
      woman_color: "ghostwhite",
      man_color: "skyblue",
      sex_fit: 2
    })
  },

  upload: function (i, that, tempFilePaths, arr) {
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    if (tempFilePaths.length != i) {
      let length = tempFilePaths.length
      console.log('==tempfilepaths==')
      console.log(tempFilePaths)
      console.log(arr)
      console.log(i)
      // let goods_photo_paths = []

      const filePath = tempFilePaths[i]
      const name = Math.random() * 1.0E18
      const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          console.log('==上传成功的图片云id：' + res.fileID)
          console.log('[上传文件] 成功：', res)
          arr[i] = res.fileID
          i += 1
          if (i < length) {
            that.upload(i, that, tempFilePaths, arr)
          }
          else {
            console.log('==递归结束==')
            console.log(that.data.goods_photo_paths)
            that.uploaddata()
          }
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '上传失败',
            duration: 1000
          })
        }

      })
    }
    else{
      that.uploaddata()
    }

  },
  //上传数据
  uploaddata: function () {
    let that = this
    console.log('==确认发布的图片==' + that.data.goods_photo_paths)
    if (that.data.goods_photo_paths
      && that.data.text_introduction
      && that.data.classification_name
      && that.data.sex_fit
      && that.data.goods_price
      && that.data.goods_name) {
      console.log('===开始向数据库上传数据===')
      console.log(that.data.goods_photo_paths)
      console.log('==执行==')
      const db = wx.cloud.database()
      if (!that.data.tempid) {
        db.collection('goods').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            nickname: that.data.userNickname,
            avatarurl: that.data.userAvatar,
            text_introduction: that.data.text_introduction,
            goods_photo: that.data.goods_photo_paths,
            campus: that.data.campus,
            goods_sorts: that.data.classification_name,
            price: that.data.goods_price,
            sex_fit: that.data.sex_fit,
            is_new: that.data.is_new,
            goods_name: that.data.goods_name,
            creatTime: util.formatTime(new Date()),
            attention_num: 0
          },
          success(res) {
            wx.hideLoading()
            wx.switchTab({
              url: '../mine/mine',
            })
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 1000
            })
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            console.log(res)
          },
          fail(res) {
            wx.hideLoading()
            wx.showToast({
              title: '发布失败',
              icon: 'none',
              duration: 1000
            })
           console.log(res) }
        })
      }
      else {
        db.collection('goods').doc(that.data.tempid).update({
          data: {
            nickname: that.data.userNickname,
            avatarurl: that.data.userAvatar,
            text_introduction: that.data.text_introduction,
            goods_photo: that.data.goods_photo_paths,
            campus: that.data.campus,
            goods_sorts: that.data.classification_name,
            price: that.data.goods_price,
            sex_fit: that.data.sex_fit,
            is_new: that.data.is_new,
            goods_name: that.data.goods_name,
            creatTime: util.formatTime(new Date()),
            attention_num: that.data.attention_num
          },
          success(res) {
            wx.hideLoading()
            wx.switchTab({
              url: '../mine/mine',
            })
            wx.showToast({
              title: '更改成功',
              icon: 'success',
              duration: 1000
            })
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            console.log(res)
          },
          fail(res) { console.log(res) }

        })
      }

    }
    else {
      wx.cloud.deleteFile({
        fileList: that.data.goods_photo_paths,
        success: res => {
          // handle success
          console.log('==信息不完整，删除上传的图片==')
          console.log(res.fileList)
        },
        fail: err => {
          // handle error
        }
      })
      wx.showToast({
        title: '信息不完整,无法发布',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    }
  },
  //确认发布

  confirm_release: function () {
    let that = this
    if (!that.data.tempid) {
      console.log('==非重新编辑==')
      console.log(that.data.choose_product_images)
      if (that.data.choose_product_images.length != 0) { that.upload(0, that, that.data.choose_product_images, that.data.goods_photo_paths) }
      else {
        wx.showToast({
          title: '信息不完整,无法发布',
          icon: 'none',
          duraion: 2000,
          mask: true
        })
      }
    }
    else {
      console.log("==重新编辑==")
      that.upload(that.data.number, that, that.data.choose_product_images, that.data.goods_photo_paths)

    }
  }
})