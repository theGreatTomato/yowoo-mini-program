// pages/searchHome/searchHome.js
const app = getApp();
const http = require('../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    top:'0rpx',
    city:'深圳',
    zoneList:[],
    bottom:'-100rpx',
    scrollTop:0,
    isrefreshing:false,
    scrollTopMoreThan200rpx:false,
    isSelecting:false,
    onSelectZone: false,
    onSelecPrice: false,
    onSelectHuxing:false,
    onSelectMore:false,
    hasData:true,
    scrollIntoView:'',
    x:0,
    y:0,
    damping:300,
    firstEnter: true,
  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(options, 'option')
    var that = this
    app.log('onLoad');
    //获取屏幕的长宽
    wx.getSystemInfo({
      success: function (res) {
        that.windowHeight = res.windowHeight 
        that.windowWidth = res.windowWidth
        let scrollviewHeight = res.windowHeight - res.windowWidth/750*100 + 'px'
        let animationDistance = res.windowWidth / 750 * 100 
        that.setData({
          scrollviewHeight: scrollviewHeight, animationDistance: animationDistance,
          selectorHeight: res.windowHeight - 2 * animationDistance +'px',
          bottom: -1 * animationDistance + 'px'
        })
      }
    })
    if (options.city) {
      //更换城市 或者 搜索时 就会到这里执行
      that.setData({ city:options.city,lat:options.lat,lon:options.lon})
      that.refreshData.lon = options.lon
      that.refreshData.lat = options.lat
      that.getCityId(options.city)   
    }
    else {
      //第一次进入时 在这里执行
     //根据当前定位获取cityname 如果不是惠州是默认是深圳
     wx.getLocation({
        type:'gcj02',
        success: function(res) {
          let bd = app.TXtoBD(res.longitude,res.latitude)
          app.userLocation = {
            lat:bd.lat,
            lon:bd.lon,
            city:'深圳'
          }
          that.refreshData['lat'] = bd.lat
          that.refreshData['lon'] = bd.lon
          //test坐标 {"lng":114.410658,"lat":23.11354} 惠州坐标
          wx.request({
            url: 'https://api.map.baidu.com/geocoder/v2/?ak=A63e90def3d0f5488ab9032056429a0d&callback=renderReverse&location=' + bd.lat + ',' + bd.lon + '&output=json',
            data: {},
            header: {
              'Content-Type': 'application/json'
            }, 
            success:function(res) {
              console.log(res,'res')
              var reg = /\(.*\)/
              const json = res.data.match(reg)
              const data = json[0].slice(1,json[0].length-1)
              const city = JSON.parse(data).result.addressComponent.city
              if(city ==='惠州市') {
                console.log(that.data.districtArray)
                that.setData({ city: '惠州', districtArray: null, metroArray:null})
                that.getCityId('惠州')
                app.userLocation.city = '惠州'
              }
              else {
                that.getCityId(that.data.city)                
              }
            },
            fail:function() {
              console.log('获取城市名失败，默认加载深圳')
              that.getCityId('深圳')
            }
          })
        },
        fail:function() {
          console.log('用户定位失败，默认加载深圳')
          that.getCityId('深圳')
        }
      })
    }
   
  },

  ///getCityId
  getCityId: function(cityname) {
    //设置更新的cityname
    this.refreshData.city = cityname
    this.refresh()  
    http.get(`/service/city/name?cityName=${cityname}`, res => {
      this.cityId = res.data.data[0].id
      this.setData({ cityId: this.cityId })
      this.getDistrict(res.data.data[0].id)
      this.getMetro(res.data.data[0].id)
    }, err => console.log('获取城市id出错'))
  },
  //根据城市名获取区
  getDistrict:function (cityId) {
    const that = this
    http.get(`service/district?cityId=${cityId}`,res => {
      const districtArray = res.data.data.map((val) => {
        return {
          districtId :val.id,
          districtName:val.name,
          lon:val.longitude,
          lat:val.latitude
        }
      })
      this.setData({ districtArray:districtArray})
    })
  },

  //根据城市获取地铁
  getMetro: function(cityId) {
    const that = this
    http.get(`service/queryStation?cityId=${cityId}`, res => {
      res.data.data ? that.setData({ metroArray: res.data.data }) : that.setData({ metroArray: [] })
    })
  },

  toupper:function(e) {
    console.log('toupper')
    //this.setData({ refresh:true})
  },
  tolower: function (e) {
    //console.log(this.data.zoneList[this.data.zoneList.length - 1].id,'id')
    
      this.refresh(this.data.zoneList[this.data.zoneList.length-1].id)
  },
  scrollTop : 0,
  scroll: function (e) {
    //这个是自下往上滑
    this.scrollTop=e.detail.scrollTop
    if (e.detail.deltaY < 0 && !this.up && !this.onAnimation) {
      this.up = true
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease',
      })
      animation = animation.translateY(-this.data.animationDistance).step()
      let selectorHeight = this.windowHeight - this.data.animationDistance + 'px'
      this.setData({ animationData: animation.export(), selectorHeight: selectorHeight  })
    }
    //这个是自上往下滑
    if (e.detail.deltaY > 0 && this.up && !this.onAnimation) {
      this.up = false
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease',
      })
      animation = animation.translateY(0).step()
      let selectorHeight = this.windowHeight - 2 * this.data.animationDistance + 'px'
      this.setData({ animationData: animation.export(), selectorHeight: selectorHeight })
    }
    
    //判断要不要加载底部的定向找房view
    if (e.detail.scrollTop > this.data.animationDistance * 2) {
      this.setData({ scrollTopMoreThan200rpx:true })
    }
    else {      
      this.setData({ scrollTopMoreThan200rpx: false })
    }
  },
  select: function (e) {
    if (e.currentTarget.id === 'zone') {
      this.setData({ onSelectZone: !this.data.onSelectZone, onSelectPrice: false, onSelectHuxing: false, onSelectMore:false })
    }
    else if (e.currentTarget.id === 'price') {
      this.setData({ onSelectPrice: !this.data.onSelectPrice, onSelectZone: false, onSelectHuxing: false, onSelectMore: false  })      
    } 
    else if (e.currentTarget.id === 'Huxing') {
      this.setData({ onSelectHuxing: !this.data.onSelectHuxing, onSelectPrice: false, onSelectZone: false,  onSelectMore: false })
    }
    else if (e.currentTarget.id === 'more') {
      this.setData({ onSelectMore: !this.data.onSelectMore, onSelectPrice: false, onSelectZone: false, onSelectHuxing: false })
    }
    else {
      console.log("无法识别这个id ")
    }
    this.setData({ isSelecting:!this.data.isSelecting})
  },
  //选择区域时的函数
  handleSelectZone: function(zoneVal) {
    const prevVal = this.data.zoneVal
    this.setData({isSelecting:false})
    if (zoneVal.detail !== null && zoneVal.detail) {
      this.setData({ zoneVal: zoneVal.detail, onSelectZone: false })
    }
    else {
      this.setData({ zoneVal:null,onSelectZone: false })      
    }
    //if zoneVal改变了  更新 
    if (prevVal !== zoneVal.detail) {
      this.refreshData.zone = null
      this.refreshData.district = null
      this.refreshData.traffic = null
      console.log(zoneVal.detail,'zoneVal.detail')
      if (zoneVal.detail != undefined ) {
        this.refreshData[zoneVal.detail.type] = zoneVal.detail.name
        if (zoneVal.detail.districtName) {
          this.refreshData['district'] = zoneVal.detail.districtName
        }
      }
      this.refresh()
    }
  },
  handleSelectPrice:function(priceVal) {
    this.setData({ isSelecting: false,y:0 })       
    if (priceVal.detail ==='cancel') {
      this.setData({  onSelectPrice: false })
    }
    else { 
      const prevVal = this.data.priceVal
      //加载新的进去
      if (priceVal.detail !== null && priceVal.detail) {
        this.setData({ priceVal: priceVal.detail, onSelectPrice: false })
      }
      else {
        this.setData({ priceVal: null, onSelectPrice: false })
      }
      //if priceVal改变了  更新
      if (prevVal !== priceVal.detail) {
        console.log(priceVal.detail,'priceVal')
        if (priceVal.detail === '不限' || priceVal.detail === undefined ||priceVal.detail === null) {
          this.refreshData.lowerPrice = null
          this.refreshData.upperPrice = null
        }
        else {
          let priceArr = priceVal.detail.split('-') 
          console.log(priceArr,'priceVal')
          if (priceArr[0].match('以下')) {
            this.refreshData.lowerPrice = 0
            this.refreshData.upperPrice = priceArr[0] ? parseInt(priceArr[0]) : null
            console.log(this.refreshData.upperPrice, 'priceVal')
          }
          else {
            this.refreshData.lowerPrice = priceArr[0] ? parseInt(priceArr[0]) : null
            this.refreshData.upperPrice = priceArr[1] ? parseInt(priceArr[1]) : null
          }
        }
        this.refresh()
      }
    }
  },
  //房型选择 函数
  handleSelectHuxing: function (HuxingVal) {
    this.setData({ isSelecting: false })
    if (HuxingVal.detail === 'cancel') {
      this.setData({ onSelectHuxing: false })
    }
    else {
      const prevVal = this.data.HuxingVal
      //加载新的进去
      if (HuxingVal.detail !== null && HuxingVal.detail) {
        this.setData({ HuxingVal: HuxingVal.detail, onSelectHuxing: false })
      }
      else {
        this.setData({ HuxingVal: null, onSelectHuxing: false })
      }
      //if HuxingVal改变了  更新
      if (prevVal !== HuxingVal.detail) {
        this.refreshData.houseName = HuxingVal.detail
        this.refresh()
      }
    }
  },
  //选择更多时
  handleSelectMore: function (moreVal) {

    this.setData({ isSelecting: false })
    if (moreVal.detail === 'cancel') {
      this.setData({ onSelectMore: false })
    }
    else {
      //加载新的进去
      if (moreVal.detail !== null && moreVal.detail != undefined) {
        this.setData({ moreVal: moreVal.detail, onSelectMore: false })
        this.refreshData.hasElevator = moreVal.detail.diantiVal
        this.refreshData.renterType = moreVal.detail.chuzuval
        this.refreshData.orientation = moreVal.detail.chaoxiangArray
        this.refresh()
      }
      else {
        this.setData({ moreVal: null, onSelectMore: false })
        this.refreshData.hasElevator = null
        this.refreshData.renterType = null
        this.refreshData.orientation = null
        this.refresh()
      }
    }
  },
  //这个是用来更新数据的 作用类似于this.data  不用this.setData的原因是异步 
  refreshData:{ },
  refresh:function(zoneId) {
    //zoneId 就是判断传进来的id 0为下拉刷新，其他是加载更多
    if (this.refreshData.hasOwnProperty('lon') && this.refreshData.hasOwnProperty('lat')) {
      console.log(this.refreshData, '  this.refreshData  res.data.data')
      let url = '/service/v2_6/product/lbs/estate?' + app.objToUrl(this.refreshData);
      if(zoneId !==null && zoneId !==undefined && zoneId) {
        url = url + `&scrollId=${zoneId}`
      }
      wx.showNavigationBarLoading()
      console.log(url, 'this.refreshData url data.data')
      http.get(url,res => {
        console.log(res.data.data,'res.data.data')
        this.data.firstEnter === false ? '': this.setData({firstEnter:false}) 
        let zoneList = []
        if (zoneId !== undefined && zoneId !== 0) {
           zoneList = this.data.zoneList.concat(res.data.data)
        }
        else {
           zoneList = res.data.data
        }
        if(Array.isArray(zoneList)) {
          if(zoneList.length > 0) {
            this.setData({ zoneList: zoneList, y: 0, hasData: false, scrollTopMoreThan200rpx:false },() => {
              this.setData({hasData:true})
            })
          }
          else {
            this.setData({ zoneList: zoneList, y: 0, hasData: false, scrollTopMoreThan200rpx:true })
          }
        }

        wx.hideNavigationBarLoading()
      },err => {
        wx.hideNavigationBarLoading()
        this.setData({ y: 0 })
        console.log('获取小区信息失败')
      })
    }
    else {
      console.log('没有获得坐标值')
    }
  },
  handleZoneItem:function(e) {
    console.log(e.detail,'detail')
    console.log(this.data)
    let url = '../homeList/homeList?' + app.objToUrl(this.refreshData)+'&eid='+e.detail
    console.log(url,'url')
    wx.navigateTo({
      url: url,
    })
  } ,
  touchstart: function (e) {
    this.startclientY = e.touches[0].clientY
  },
  touchmove:function(e) {
    if (this.scrollTop === 0 && this.startclientY - e.touches[0].clientY < 0) {
      const bottom = e.touches[0].clientY - this.startclientY 
      this.setData({y:bottom/2})
    }
  },
  touchend: function (e) {
    if (e.changedTouches[0].clientY - this.startclientY >= this.data.animationDistance * 3 && this.scrollTop === 0) {
      this.refresh(0)
    }
    else {
      this.setData({ y: 0 })      
    }
  },
  onPullDownRefresh() {
    console.log('refresh')
  },
  fabu:function() {
    wx.navigateTo({
      url: '../helpMe/helpMe',
    })
  },
  errTip: function (err) {
    wx.showToast({
      title: err,
      icon: 'none',
      duration: 2000
    })
  },
})