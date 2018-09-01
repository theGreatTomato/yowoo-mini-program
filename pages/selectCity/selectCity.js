// pages/selectCity/selectCity.js
const app = getApp();

Page({
  data: {
  
  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(options, 'option')
    this.setData({ locationCity: app.userLocation.city, selectCity: options.city })    
    app.log('onLoad');
  },
  shenzhen:function() {
    if (this.data.selectCity === '深圳') {
      wx.navigateBack({
        delta: 1
      })
    }
    else {
      let lat,lon
      if (app.userLocation.city === '深圳'){
        lat = app.userLocation.lat
        lon = app.userLocation.lon
      }
      else {
        lat = app.cityDefaultLocation[0].lat
        lon = app.cityDefaultLocation[0].lon
      }
      wx.redirectTo({
        url: `../searchHome/searchHome?city=深圳&lat=${lat}&lon=${lon}`,
      })
    }
  },
  huizhou: function () {
    if (this.data.selectCity === '惠州') {
      wx.navigateBack({
        delta: 1
      })
    }
    else {
      let lat, lon
      if (app.userLocation.city === '惠州') {
        lat = app.userLocation.lat
        lon = app.userLocation.lon
      }
      else {
        lat = app.cityDefaultLocation[1].lat
        lon = app.cityDefaultLocation[1].lon
      }
      wx.redirectTo({
        url: `../searchHome/searchHome?city=惠州&lat=${lat}&lon=${lon}`,
      })
    }
  },
  onPullDownRefresh() {
    console.log('refresh')
  },
  back:function() {
    if (this.data.selectCity === this.data.locationCity) {
      wx.navigateBack({
        delta: 1
      })
    }
    else {
      wx.redirectTo({
        url: `../searchHome/searchHome?city=${app.userLocation.city}&lat=${app.userLocation.lat}&lon=${app.userLocation.lon}`,
      })
    }
  },
})