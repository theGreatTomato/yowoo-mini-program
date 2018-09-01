// pages/feedback/feedback.js
const app = getApp();
const http = require('../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    range:[['满意','一般','不满意']],
    onSelect:false,
    hasData1:'',
    hasdata2:'',
    text:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.log('onLoad');
    console.log(options,'opt')
    const that = this
    wx.getStorage({
      key: 'isUser',
      success:  (res) => {
        if (res.data) {
          if (options.makeLookHouseId !== undefined) {
            console.log('makeId is ', options.makeLookHouseId)
            this.setData({ makeId: options.makeLookHouseId}) 
            http.get(`/service/v2_6/make/feedback?makeId=${options.makeLookHouseId}`, resq => {
              if (resq.data.hasOwnProperty('data')) {
                this.setData({ 
                  hasData1: resq.data.data.houseFeedback,
                  hasData2: resq.data.data.serviceFeedback
                  })
                if (resq.data.data.hasOwnProperty('houseRemark')) {
                    this.setData({ text: resq.data.data.houseRemark})
                  }
              }
            })
          }
          else {
            console.log('没有传入 makeId ')
          }
        }
        else {
          wx.redirectTo({
            url: `/pages/login/login?url=${app.getCurrentPageUrl(true)}`,
          })
        }
      },
      fail:function() {
        wx.redirectTo({
          url: `/pages/login/login?url=${app.getCurrentPageUrl(true)}`,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  onselect : '',
  data1:function () {
    console.log('data1')
    this.setData({ onSelect:true})
    this.onselect = 'hasData1'
  },
  data2:function() {
    console.log('data1')
    this.setData({ onSelect: true })
    this.onselect = 'hasData2'
  },
  click:function(e) {
    const obj = {}
    obj[this.onselect] = this.data.range[0][e.detail]
    this.setData(obj)
    this.setData({ onSelect: false })  
  },
  formSubmit: function (e) { // 按钮点击和formId记录
    const id = (e.detail.target ? e.detail.target.id : '');
    app.addFormId(e.detail.formId, id);
    app.log(id)
  },
  change:function(e) {
    if(this.data.onSelect === false) {
      const obj = {}
      obj[this.onselect] = this.data.range[0][e.detail]
      this.setData(obj)
      this.setData({ onSelect: false })
    }
  } ,
  cancel:function() {
    this.setData({ onSelect: false})
  },
  input:function(e) {
    console.log(e)
    this.setData({text:e.detail.value})
  },
  onSubmit:function() {
    console.log(this.data)
    if(this.data.hasData1 !== ''&& this.data.hasData2 !== '') {
      let data = {
        makeLookHouseId:this.data.makeId,
        houseFeedback: this.data.hasData1,
        serviceFeedback:this.data.hasData2
      }
      if(this.data.text !== ''){
        data.houseRemark = this.data.text
      }
      console.log(data,'datadata')
      http.post(`/service/v2_6/make/feedback`,data,res => {
        console.log(res,'res data')
        if(res.data.data === 'success') {
          this.setData({ toastHidden:'success'})
          setTimeout(() => {
            this.setData({ toastHidden: null })
            wx.redirectTo({
              url: '../schedule/schedule',
            })
          }, 1500)
        }
        else {
          this.setData({ toastHidden: 'fail' })
        }
      })
    }
  },
  successToastClick() {
    this.setData({ toastHidden: null })
    wx.redirectTo({
      url: '../schedule/schedule',
    })
  },
  failToastClick() {
    this.setData({ toastHidden: null })
  }
})