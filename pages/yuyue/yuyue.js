const app = getApp();
const http = require('../../utils/http.js');

Page({

  
  data: {
    data:[]
  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(options, 'option')
    if(options.id !== undefined ) {
      this.setData(options)
    }
  },
  formSubmit: function (e) { // 按钮点击和formId记录
    const id = (e.detail.target ? e.detail.target.id : '');
    app.addFormId(e.detail.formId, id);
    app.log(id)
  }, 
  click:function(e) {
    console.log(e.currentTarget.id)
    console.log(this.data.data[e.currentTarget.id])
  }
})