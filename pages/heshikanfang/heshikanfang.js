// pages/heshikanfang/heshikanfang.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  data: {
    imgSrc : '../../img/3.png',
    phone:'',
    text:'',
    maxlength:11,
    range:[['是','否']],
    index:0,
    toastHidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(options,'option')
    this.setData(options)
    wx.getStorage({
      key: 'phone',
      success: (res) => {
        this.setData({phone:res.data})
      },
    })
  },

  //time
  timeclick(e) {
    this.setData({ onSelectTime: false, show: true, timeIndex: e.detail[0], time: e.detail })
  },
  timecancel() {
    this.setData({ onSelectTime: false, show: true })
  },
  timechange: function (e) {
    console.log(e.detail, 'index')
    if (!this.data.onSelectTime) {
      this.setData({ timeIndex: e.detail[0], time: e.detail })
    }
  },
  selectTime() {
    this.setData({ onSelectTime: true, })
  },

//是否确定
  homeclick(e) {
    console.log(e,'eee')
    this.setData({ onSelectHome: false,  index: e.detail[0], home: e.detail })
  },
  homecancel() {
    this.setData({ onSelectHome: false,  })
  },
  homechange: function (e) {
    if (!this.data.onSelectHome) {
      this.setData({ index: e.detail[0], home: e.detail })
    }
  },
  select() {
    this.setData({ onSelectHome: true,  })
  },



  formSubmit: function (e) { // 按钮点击和formId记录
    const id = (e.detail.target ? e.detail.target.id : '');
    app.addFormId(e.detail.formId, id);
    app.log(id)
  }, 
  input:function(e) {
    this.setData({phone:e.detail.value})
  },
  textinput:function(e) {
    this.setData({text:e.detail.value})
  },
  click:function() {
    console.log('提交')
    const that = this
    const phonePattern = /^1(3[0-9]|4[0-9]|5[0-9]|7[5678]|8[0-9])\d{8}$/;
    if (!phonePattern.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 2000
      })
    }
    else if (!this.data.hasOwnProperty('time')) {
      wx.showToast({
        title: '请输入期望看房日期',
        icon: 'none',
        duration: 2000
      })
    }
    else{
      //设置手机号码
      wx.setStorage({
        key: 'phone',
        data: this.data.phone,
      })


      let time = that.translationTime(that.data.time)
      const data = {
        "renterNumber": this.data.phone,
        "waiterId": this.data.waiterId,
        "renterMakeTime": time 
      }
      if(that.data.text !== '') {
        data.remark = that.data.text
      }
      http.post(`/service/v2_6/make?productId=${this.data.productId}`, data ,res => {
        if(res.data.data ==='success') {
          console.log(data,'传入的data')
          that.setData({ toastHidden:false })
          setTimeout(() => { that.setData({ toastHidden: true })
            wx.navigateBack({
              delta: 1
            })
          },1500)
        }
        else {
          wx.showToast({
            title: res.data.errMsg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    } 
  },
  translationTime:function(originTime) {
    let date = originTime.match(/\S+/, '')
    date = date[0].split('-')
    if (date[1] !== undefined) {
      date[1] = date[1].length > 1 ? date[1] : '0' + date[1]
    }
    if (date[2] !== undefined) {
      date[2] = date[2].length > 1 ? date[2] : '0' + date[2]
    }
    date = date.join('-')
    let time = this.data.time.match(/\s\S+/)
    time = time[0].replace(/\s/g, '')
    time = time.split(':')
    if (time[0] !== undefined) {
      time[0] = time[0].length > 1 ? time[0] : '0' + time[0]
    }
    if (time[1] !== undefined) {
      time[1] = time[1].length > 1 ? time[1] : '0' + time[1]
    }
    if (time[2] !== undefined) {
      time[2] = time[2].length > 1 ? time[2] : '0' + time[2]
    }
    time = time.join(':')
    time = date + ' ' + time
    return time
  }
})