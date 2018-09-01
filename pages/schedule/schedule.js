// pages/schedule/schedule.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:[],
    hasData:false,
    len:0,
    firstEnter : true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(options, 'option')
    app.log('onLoad');
    const that = this
    wx.getStorage({
      key: 'isUser',
      success: function(res) {
        if(res.data) {
          http.get(`/service/v2_6/make`,resq => {
            if (resq.data.hasOwnProperty('data')) {
              console.log(resq.data,'resq')
              if (Array.isArray(resq.data.data) && resq.data.data !== []) {
                const len = resq.data.data.length
                resq.data.data = resq.data.data.map((item) => {
                  if (item.latitude && item.longitude) {
                    const location = app.BDtoTX(item.longitude,item.latitude)
                    return {
                      ...item,
                      location:location
                    } 
                  }
                })
                console.log(resq.data.data,'resq.data.data')
                that.setData({ data: resq.data.data, hasData: true, len: len, firstEnter: false })}
            }
            that.setData({ firstEnter: false })
          })
        }
        else {
        wx.redirectTo({
          url: `/pages/login/login?url=${app.getCurrentPageUrl(true)}`,
        })
        }
      },
      fail:function(err) {
        wx.redirectTo({
          url: `/pages/login/login?url=${app.getCurrentPageUrl(true)}`,
        })
      }
    })
  },
  formSubmit: function (e) { // 按钮点击和formId记录
    const id = (e.detail.target ? e.detail.target.id : '');
    app.addFormId(e.detail.formId, id);
    app.log(id)
  },
  linkTo:function() {
    wx.navigateTo({
      url: '../searchHome/searchHome',
    })
  },
  connect:function(e) {
    const waiterId = this.data.data[e.currentTarget.id].waiterId || 0
    console.log(waiterId,'war')
    const productId = this.data.data[e.currentTarget.id].productId
    console.log(e, waiterId)
    http.post(`/service/v2_6/virtual?called=${waiterId}&productId=${productId}`, res => {
      if(res.data.data === '用户不存在') {
        http.post(`/service/v2_6/virtual?called=${0}&productId=${productId}`, resq => {
          wx.makePhoneCall({
            phoneNumber: resq.data.data //仅为示例，并非真实的电话号码
          })
        })
      }
      else {
        wx.makePhoneCall({
        phoneNumber: res.data.data //仅为示例，并非真实的电话号码
        })
      }
      })
  },
  jilu:function(e) {
    console.log(e,'eeee')
    wx.navigateTo({
      url: '../feedback/feedback?makeLookHouseId=' + e.currentTarget.id
    })
  },

  linkToZuyue: function (e) {
    const index = Number(e.currentTarget.id)
    const obj = this.data.data[index]
    const url = `../yuyue/yuyue?` + app.objToUrl(obj)
    wx.navigateTo({
      url: url
    })
  }
})