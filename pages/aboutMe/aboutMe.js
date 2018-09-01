// pages/aboutMe/aboutMe.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    circles: []
  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    app.log('onLoad');
  },
  call:function() {
    wx.makePhoneCall({
      phoneNumber: '4001891517',
    })
  }
})