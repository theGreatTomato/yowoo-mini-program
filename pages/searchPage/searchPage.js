// pages/searchPage/searchPage.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  data: {
    searchVal:null
  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(options, 'option')
    this.setData({ cityId: options.cityId, city: options.city})
  },

  change: function(e) {
    const that = this
    console.log(e.detail.value)
    this.setData({ searchVal: e.detail.value})
    http.get(`/service/v2_4/regionSearch?key=${e.detail.value}&cityId=${this.data.cityId}`
    ,res => {
      if (res.data.data && Array.isArray(res.data.data)) {
        const resultArr = res.data.data.map((val) => {
          let typeName = '小区';
          if(val.searchType === 1) {
            typeName = '行政区'
          }
          else if (val.searchType === 2) {
            typeName = '商圈'
          }
          else if (val.searchType === 3) {
            typeName = '地铁站'
          }
          return {
            ...val,
            typeName:typeName
          }
        })
        that.setData({ resultArr: resultArr})
      } 
    })
  },
  clear: function() {
    this.setData({ searchVal: null})
  },
  formSubmit: function(e) {
    const id = (e.detail.target ? e.detail.target.id : '');
    app.log(id)
    app.addFormId(e.detail.formId, id);
  },
  click:function(e) {
    const obj = this.data.resultArr[e.currentTarget.id]
    console.log(obj,'obj')
    const url = `../searchHome/searchHome?searchName=${obj.name}&lat=${obj.latitude}&lon=${obj.longitude}&city=${this.data.city}&searchType=${obj.searchType}`
    wx.redirectTo({
      url: url,
    })
  }
})