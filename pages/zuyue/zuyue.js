// pages/zuyue/zuyue.js
const app = getApp();
const http = require('../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(options, 'option')
    app.log('onLoad');
    const that = this
    wx.getStorage({
      key: 'isUser',
      success: (res) => {
        if (res.data === true) {
          this.isLogin = true
          if (options.hasOwnProperty('billId')) {
            http.get(`/service/v2_6/order?billId=${options.billId}`, resq => {
              if(resq.data.hasOwnProperty('data')) {
                console.log('模版消息 返回的数据', resq, 'billId:', options.billId)
                this.setData(resq.data.data)
              }
              else {
                console.log('billId 有误')
              }
            })
          }
          else {
            this.setData(options)
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
  formSubmit: function (e) { // 按钮点击和formId记录
    const id = (e.detail.target ? e.detail.target.id : '');
    app.addFormId(e.detail.formId, id);
    app.log(id)
  },
  paynow:function() {
    const that = this
    if(this.isLogin) {
      http.post(`/service/v2_6/pay/minirenter?desc=${this.data.productName}租客服务费&billId=${this.data.renterBillId}`, 
        res => {
        const payObj = res.data.data;
         // 直接取预支付返回的签名对象
        console.log(payObj)
        payObj.success = function (resp) {
          that.setData({toastHidden:'success'})
          setTimeout(() => {
            that.setData({ toastHidden: null})
            wx.redirectTo({
              url: '../zuyueList/zuyueList',
            })
          },2000)
        };
        payObj.fail = function (err) {
          that.setData({ toastHidden: 'fail' })
          setTimeout(() => {
            that.setData({ toastHidden: null })
          }, 2000)
        };
        wx.requestPayment(payObj) // 小程序调起支付
      })
    }
  },
  cancel:function(e) {
    const id = (e.detail ? e.detail : '');
    app.addFormId(e.detail.formId, id);
    app.log(id)
    this.setData({ toastHidden: null })    
  },
  successCancel:function(e) {
    this.cancel()
    wx.redirectTo({
      url: '../zuyueList/zuyueList',
    })
  }
})