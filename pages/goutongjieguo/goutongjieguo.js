
const app = getApp();
const http = require('../../utils/http.js');
Page({
  data: {
    imgUrl: '../../img/3.png',
    phone: '',
    text: '',
    range:[['是','否']],
    toastHidden: true,
    selectFalse:false
  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.setData(options)
    wx.getStorage({
      key: 'phone',
      success: (res) => {
        this.setData({ phone: res.data })
      },
    })
    wx.getStorage({
      key: 'isUser',
      success: (res) => {
        if (res.data) {
          if (options.id !== undefined) {
            http.get(`/service/v2_6/make/${options.id}`, resq => {
              console.log(resq,'resq')   
              if (resq.data.hasOwnProperty('data')) {
                this.setData(resq.data.data)
              }
            })
          }
          else {
            console.log('没有传入预订id')
          }
        }
        else {
          wx.redirectTo({
            url: `/pages/login/login?url=${app.getCurrentPageUrl(true)}`,
          })
        }
      },
    })
  },
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
    this.setData({ onSelectTime: true, show: false })
  },

//是否确定看房
  homeclick(e) {
    console.log(e,'eee')
    if( e.detail[0] === 1 ) {
      this.setData({ onSelectHome: false, index: e.detail[0], result: this.data.range[0][e.detail[0]],selectFalse:true})
    }
    else {
      this.setData({ onSelectHome: false, index: e.detail[0], result: this.data.range[0][e.detail[0]], selectFalse: false })
    }
  },
  homecancel() {
    this.setData({ onSelectHome: false })
  },
  homechange: function (e) {
    if (!this.data.onSelectHome) {
      if (e.detail[0] === 1) {
        this.setData({  index: e.detail[0], result: this.data.range[0][e.detail[0]], selectFalse: true })
      }
      else {
        this.setData({  index: e.detail[0], result: this.data.range[0][e.detail[0]], selectFalse: false })
      }
    }
  },
  select:function() {
    this.setData({ onSelectHome: true})
  },


  formSubmit: function (e) { // 按钮点击和formId记录
    const id = (e.detail.target ? e.detail.target.id : '');
    app.addFormId(e.detail.formId, id);
    app.log(id)
  }, 


  phoneinput: function (e) {
    this.setData({ phone: e.detail.value })
  },
  textinput: function (e) {
    this.setData({ text: e.detail.value })
  },

  errTip:function(err) {
    wx.showToast({
      title: err,
      icon: 'none',
      duration: 2000
    })
  },
  //提交
  click:function() {
    const that = this
    const phonePattern = /^1(3[0-9]|4[0-9]|5[0-9]|7[5678]|8[0-9])\d{8}$/;
    if (!phonePattern.test(this.data.phone) && this.data.index === 0) {
      this.errTip('请输入正确的手机号码')
    }
    else if (!this.data.hasOwnProperty('result')) {
      this.errTip('请选择是否确定看房')
    }
    else if (!this.data.hasOwnProperty('time') && this.data.index === 0) {
      this.errTip('请选择看房时间')      
    }
    else {
      let time = ''
      if (this.data.index === 0 ) {
        time = that.translationTime(that.data.time)
      }
      else {
        //let d = new Date()
       // time = d.toLocaleDateString().replace(/\//g, '-') + ' ' + d.toTimeString().match(/\S+/)
        //time = d.toLocaleDateString().replace(/\//g, '-') + ' 10:00:00'
        time = '2018-07-25 10:00:00'
      }
      console.log(time,'time')
      const data = {
        "id": this.data.id || '',
        "renterNumber": this.data.phone,
        "renterMakeTime": time,
        "renterConfirmStatus": this.data.index === '0' ? '1':'-1',
        "remark": this.data.text
      }
      console.log(data,'data,data')
      http.post(`/service/v2_6/make`,data,res => {
        console.log(res)
        if (res.data.data === 'success') {
          that.setData({ toastHidden: false })
          setTimeout(() => { that.setData({ toastHidden: true })
            wx.redirectTo({
              url: '../searchHome/searchHome'
            })
          }, 1500)
        }
        else {
          wx.showToast({
            title: res.data.errMsg || '提交失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  translationTime: function (originTime) {
    console.log(originTime)
    let date = 'originTime'.match(/\S+/)
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