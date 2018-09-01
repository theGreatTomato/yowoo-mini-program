// pages/homeList/homePage.js
const app = getApp();
const http = require('../../utils/http.js');

Page({
  data: {
    hasHomeData: false,
    homeList:[],
    selectSortId:0,
    sortList:[
      { content: '综合排序', id: 0 },
      { content: '最新发布', id: 1 },
      { content: '价格(从低到高)', id: 2 },
      { content: '价格(从高到低)', id: -2 },
      { content: '面积(从小到大)', id: 3 },
      { content: '面积(从大到小)',id:-3},
    ],
    selectSort:false
  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(options, 'option')
    options.lat = null
    options.lon = null
    this.refreshData = options
    this.refresh()    
  },
  refresh() {
    let url = '/service/v2_6/product?' + app.objToUrl(this.refreshData)
    console.log(this.refreshData,'data')
    http.get(url, res => {
      console.log(res.data.data,'data')
      this.setData({hasHomeData: false})
      this.setData({ homeList: res.data.data },() => {
        this.setData({ hasHomeData: true })
      })
    }, err => {
      console.log('房源列表返回出错')
    }) 
  },

  clickSortButton:function() {
    this.setData({selectSort:true})
  },
  cancel: function() {
    this.setData({ selectSort: false })    
  },
  onSort:function(e) {
    console.log(this.data.selectSortId)
    const id = e.currentTarget.id
    this.refreshData.sort = id
    this.setData({ selectSortId: id, selectSort: false})
    this.refresh()
  },
  houseDetail:function(e) {
    let url = '../detail/detail?id='+e.detail
    wx.navigateTo({
      url: url,
    }) 
  }
})