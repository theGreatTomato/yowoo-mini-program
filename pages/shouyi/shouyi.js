// pages/shouyi/shouyi.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    x: 0,
    y: 0,
    damping: 300,
    data:{}
  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(options, 'option')
    app.log('onLoad');
    const that = this;
    this.onShowGetData = false
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({userInfo:res.data})
      },
    })
    wx.getStorage({
      key: 'isUser',
      success: (res) => {
         if (res.data === true) {
            this.getData()
          }
          else {
            wx.redirectTo({
              url: `/pages/login/login?url=${app.getCurrentPageUrl(true)}`,
            })
          }
      }
    })
    //获取屏幕信息
    wx.getSystemInfo({
      success: function (res) {
        that.windowHeight = res.windowHeight
        that.windowWidth = res.windowWidth
        let scrollviewHeight = res.windowHeight - res.windowWidth / 750 * 700 + 'px'
        let animationDistance = res.windowWidth / 750 * 100
        that.setData({
          scrollviewHeight: scrollviewHeight, animationDistance: animationDistance,
        })
      }
    })
  },

  onShow() {
    if (this.onShowGetData === true) {
      this.getData()
    }
  },
  onHide() {
    this.onShowGetData = true
  },
  getData() {
    const that = this
    http.get(`/service/v2_1/product/earningRecord`, resq => {
      if (resq.data.hasOwnProperty('data')) {
        if (resq.data.data.hasOwnProperty('allProfitRecords')) {
          let testdata = resq.data.data
          const newAllProfitRecords = testdata.allProfitRecords.map((val) => {
            let desc, time, type
            desc = val.description.split('，')
            desc = desc.length > 0 ? desc[desc.length - 1] : ''
            time = val.operateTime.match(/\S+/)
            time = time[0].replace(/\-/g, '/')
            type = that.settlementTypeToWord(val.settlementType)
            return {
              ...val,
              desc: desc,
              time: time,
              type: type
            }
          })
          testdata.allProfitRecords = newAllProfitRecords
          that.setData({ data: testdata })
        }
        else {
          that.setData({ data: resq.data.data })
        }
      }
      else {
        console.log('没有传入预订id')
      }
    })
  },
  //结算类型
  settlementTypeToWord: function (num) {
    if(num === 1) {
      return '充值'
    }
    else if (num === 2) {
      return '押金'
    } 
    else if (num === 3 ) {
      return '佣金'
    }
    else if (num === 4) {
      return '租金'
    }
    else if (num === 5) {
      return '安装费'
    }
    else if (num === 6) {
      return '物业费'
    }
    else if (num === 7) {
      return '推荐租客奖励'
    }
    else if (num === 8) {
      return '用户信息完善服务费'
    }
    else if (num === 9) {
      return '奖金'
    }
    else if (num === -1) {
      return '消费'
    }
    else if (num === -2) {
      return '提现'
    }
  },


  formSubmit: function (e) { // 按钮点击和formId记录
    const id = (e.detail.target ? e.detail.target.id : '');
    app.addFormId(e.detail.formId, id);
    app.log(id)
  },
  tixian:function() {
    wx.navigateTo({
      url: '../tixian/tixian?cashAmount='+ this.data.data.cashAmount ,
    })
  },
  //触底刷新
  tolower:function() {
    if (this.data.data.hasOwnProperty('allProfitRecords') ) {
      const list = this.data.data.allProfitRecords
      if (Array.isArray(list) && list.length >0) {
        this.refresh(list[list.length-1].id)
        console.log(list[list.length - 1].id)
      }
    }
  },
  //上拉刷新
  scrollTop:0,
  scroll:function(e) {
    this.scrollTop = e.detail.scrollTop
  },
  touchstart: function (e) {
    this.startclientY = e.touches[0].clientY
  },
  touchmove: function (e) {
    console.log(e)
    if (this.scrollTop === 0 && this.startclientY - e.touches[0].clientY < 0) {
      const bottom = e.touches[0].clientY - this.startclientY
      console.log(bottom,'bbb')
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

  refresh:function(id) {
    const that = this
    http.get(`/service/v2_1/product/earningRecord?scrollId=${id}`, resq => {
      if (resq.data.hasOwnProperty('data') && resq.data.data.hasOwnProperty('allProfitRecords')) {
        try {
          const newAllProfitRecords = resq.data.data.allProfitRecords.map((val) => {
            let desc, time, type
            desc = val.description.split('，')
            desc = desc.length > 0 ? desc[desc.length - 1] : ''
            time = val.operateTime.match(/\S+/)
            time = time[0].replace(/\-/g, '/')
            type = that.settlementTypeToWord(val.settlementType)
            return {
              ...val,
              desc: desc,
              time: time,
              type: type
            }
          })
          this.setData({ y: 0 })
          resq.data.data.allProfitRecords = newAllProfitRecords
          that.setData({ data: that.data.data.concat(resq.data.data) })
        }
        catch(err){
          this.setData({ y: 0 })
          console.log(err)
        }
      }
      else {
        this.setData({ y: 0 })
        console.log('无新数据')
      }
    })
  }
})