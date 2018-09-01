// pages/priceLog/priceLog.js
const app = getApp();
const http = require('../../utils/http.js');

Page({

  data: {
    x: 0,
    y: 0,
    damping: 300,
    data:[]
  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(options, 'option')
    app.log('onLoad');
    const that = this
    this.setData(options)
    wx.getStorage({
      key: 'isUser',
      success: (res) => {
        if (res.data) {
          that.isLogin = true
          that.refresh(0)
        }
        else {
          wx.redirectTo({
            url: `/pages/login/login?url=${app.getCurrentPageUrl(true)}`,
          })
        }
      },
    })


    //获取屏幕信息
    wx.getSystemInfo({
      success: function (res) {
        that.windowHeight = res.windowHeight
        that.windowWidth = res.windowWidth
        let animationDistance = res.windowWidth / 750 * 100
        that.setData({
          scrollviewHeight: res.windowHeight + 'px', animationDistance: animationDistance,
        })
      }
    })
  },

  //触底刷新
  tolower: function () {
    if (this.data.data.hasOwnProperty('allProfitRecords')) {
      const list = this.data.data
      if (Array.isArray(list) && list.length > 0) {
        this.refresh(list[list.length - 1].id)
        console.log(list[list.length - 1].id)
      }
    }
  },

  //上拉刷新
  scrollTop: 0,
  scroll: function (e) {
    this.scrollTop = e.detail.scrollTop
  },
  touchstart: function (e) {
    this.startclientY = e.touches[0].clientY
  },
  touchmove: function (e) {
    console.log(e)
    if (this.scrollTop === 0 && this.startclientY - e.touches[0].clientY < 0) {
      const bottom = e.touches[0].clientY - this.startclientY
      this.setData({ y: bottom / 2 })
    }
  },
  touchend: function (e) {
    if (e.changedTouches[0].clientY - this.startclientY >= this.data.animationDistance * 3 && this.scrollTop === 0) {
      this.refresh(0)
    }
    else {
      this.setData({ y: 0 })
    }
  },

  refresh: function (id) {
    const that = this
    console.log('??')
    const url = `service/user/accountDetail/paging?settlementTypeList=-2&scrollId=${id}`
    http.get(url, resq => {
      console.log(resq,'resq')
      if (resq.data.head.errcode === 0 && resq.data.hasOwnProperty('data')) {
        if (resq.data.data.length > 0 && resq.data.data != null) {
          let mydata = resq.data.data
          const data = mydata.map((val) => {
            let statusText
            let time = val.operateTime.match(/\S+/);
            if (val.newStatus === 0) {
              statusText = '正在提现';
            }
            else if (val.newStatus === 1) {
              statusText = '已到帐'
            }
            else {
              statusText = '提现失败'
            }
            console.log(statusText, 'statusText')
            return {
              ...val,
              time: time,
              statusText: statusText
            }
          })
          that.setData({ data: this.data.data.concat(data), hasData: true,y:0 })
        }
        else {
          that.setData({y:0})
        }
      }
      else {
        that.setData({  y: 0 })
      }
    })
  }
})