// pages/zuyue/zuyue.js
const app = getApp();
const http = require('../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasData:false,
    data:[],
    firstEnter:true
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
        if (res.data) {
          http.get(`/service/v2_3/order/list`,res => {
            this.setData({ firstEnter:false })
            if (res.data.data !== [] && Array.isArray(res.data.data)) {
              let data = res.data.data.map((val) => {
                let payMonths, depositMonths,y,m
                if (val.depositMonths === '' || val.depositMonths === null || val.depositMonths < 0) {
                   depositMonths = 0
                }
                if (val.depositMonths === 0) {
                   depositMonths = '免押'
                }
                else {
                   depositMonths = '押' + this.numToWord(val.depositMonths)
                }
                if (val.payMonths === '' || val.payMonths === null || val.payMonths < 0) {
                   payMonths = 1
                }
                payMonths = '付' + this.numToWord(val.payMonths)
                let pay = depositMonths + payMonths
                y = parseInt(val.periods / 12) > 0 ? val.periods / 12 + '年':'' ;
                m = parseInt(val.periods % 12) > 0 ? val.periods % 12 + '月' : '';
                let qixian = y+m
                return {
                  ...val,
                  pay:pay,
                  qixian: qixian
                }
              })
              console.log(data,'datadata')
              this.setData({data:data,hasData:true})
            }
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
    wx.redirectTo({
      url: '../searchHome/searchHome',
    })
  },
  linkToZuyue:function(e) {
    const data = this.data.data[e.currentTarget.id]
    const url = app.objToUrl(data)
    wx.navigateTo({
      url: '../zuyue/zuyue?' + url,
    })
  },
  numToWord: function (num) {
    let word = '';
    switch (num) {
      case 1:
        word = '一';
        break;
      case 2:
        word = '二';
        break;
      case 3:
        word = '三';
        break;
      case 4:
        word = '四';
        break;
      case 5:
        word = '五';
        break;
      case 6:
        word = '六';
        break;
      case 7:
        word = '七';
        break;
      case 8:
        word = '八';
        break;
      default:
        break
    }
    return word
  },
})