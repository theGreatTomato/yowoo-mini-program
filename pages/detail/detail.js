// pages/homeList/homePage.js
const app = getApp();
const http = require('../../utils/http.js');

Page({
  data: {
    images : [],
    firstEnter:true,
  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    const id = options.id
    app.log('onLoad');
    this.houseId = options.id
    this.onShowGetData = false
    //确定用户是否登录

    let url = `/service/v2_6/product/${id}`;
    wx.getStorage({
      key: 'isUser',
      success: (res) => {
        console.log(res,'res')
        this.isLogin = res.data
        if (res.data === true) {
          this.getData(url)
        }
        else {
          wx.redirectTo({
            url: `/pages/login/login?url=${app.getCurrentPageUrl(true)}`,
          })
        }
      },
      fail: err => {
        wx.redirectTo({
          url: `/pages/login/login?url=${app.getCurrentPageUrl(true)}`,
        })
      }
    })
  },

  onShow() {
    if(this.onShowGetData == true ) {
      let url = `/service/v2_6/product/${this.houseId}`;
      this.getData(url)
    }
  },
  onHide() {
    this.onShowGetData = true
  },
  getData(url) {
    http.get(url, res => {
      this.setData({ firstEnter: false })
      console.log(res.data.data, 'res.data.data')
      let data = res.data.data
      if (data.depositMonths === '' || data.depositMonths === null || data.depositMonths < 0) {
        data.depositMonths = 0
      }
      if (data.depositMonths === 0) {
        data.depositMonths = '免押'
      }
      else {
        data.depositMonths = '押' + this.numToWord(data.depositMonths)
      }
      if (data.payMonths === '' || data.payMonths === null || data.payMonths < 0) {
        data.payMonths = 1
      }
      data.payMonths = '付' + this.numToWord(data.payMonths)
      data.orientation = this.transOrientation(data.orientation)
      data.furniture = this.transFurniture(data.furniture)
      data.location = app.BDtoTX(data.longitude, data.latitude)
      this.setData({
        id: data.id,
        estateName: data.estateName || '',
        houseName: data.houseName || '',
        renterType: data.renterType || '',
        orientation: data.orientation || '',
        area: data.area || '',
        price: data.price || '',
        waiterName: data.waiterName || '',
        houseResourceType: data.houseResourceType || '',
        creatorCellphone: data.creatorCellphone || '',
        address: data.address || '',
        lon: data.location.lon || '',
        lat: data.location.lat || '',
        depositMonths: data.depositMonths || '',
        payMonths: data.payMonths || '',
        hasElevator: data.hasElevator || '',
        waiterId: data.waiterId || '',
        appointmentId: data.appointmentId || '',
        appointmentTime: data.appointmentTime ? data.appointmentTime.toLocaleString() : '',
        furniture: data.furniture || ''
      })
      if (data.furniture === [] || data.furniture == '' || data.furniture == undefined) {
        this.setData({ hiddenFurniture: true })
      }
      if (data.hasOwnProperty('images')) {
        if (Array.isArray(data.images) && data.images !== []) {
          this.setData({ images: data.images, showImages: true })
        }
        else {
          this.setData({ images: ['../../img/3.png'], showImages: true })
        }
      }
      else {
        this.setData({ images: ['../../img/3.png'], showImages: true })
      }
    }, err => {
      console.log('没有获取房间详情')
      this.setData({ images: ['../../img/3.png'], showImages: true })
    })
  },

  numToWord:function(num) {
    let word = '';
    switch(num){
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
  transOrientation: function (orientation) {
    let orientationWord;
    switch(orientation) {
      case 1: 
        orientationWord = '东'
        break;
      case 2:
        orientationWord = '西'
        break;
      case 3:
        orientationWord = '南'
        break;
      case 4:
        orientationWord = '北'
        break;
      case 14:
        orientationWord = '东北'
        break;
      case 13:
        orientationWord = '东南'
        break;
      case 24:
        orientationWord = '西北'
        break;
      case 23:
        orientationWord = '西南'
        break;
      case 66:
        orientationWord = '南北通'
        break;
      default:
      break
    }
    return orientationWord
  },
  //0:其他,1:水表,2:电表,3:燃气表,4:有线电视网,11:床,12:冰箱,13:电视,14:洗衣机,15:空调,16:抽油烟机,17:灶具,18:热水器,19:消毒柜,20:微波炉,21:烤箱,22:茶几,23:餐桌,24:椅子,25:电视柜,26:衣柜,27:鞋柜,28:沙发,29:书架,30:梳妆台,31:马桶,32:水池,33:镜子,34:浴缸,35:淋浴设施,36:鱼缸

  transFurniture :function(arr) {
    if (!Array.isArray(arr) || arr === []) {
      return []
    }
    else {
      let newArr = arr.map((val) => {
        let newVal;
        switch(val) {
          case 0:
            newVal = '其他'
            break
          case 1:
            newVal = '水表'
            break
          case 2:
            newVal = '电表'
            break
          case 3:
            newVal = '燃气表'
            break
          case 4:
            newVal = '有线电视网'
            break
          case 11:
            newVal = '床'
            break
          case 12:
            newVal = '冰箱'
            break
          case 13:
            newVal = '电视'
            break
          case 14:
            newVal = '洗衣机'
            break
          case 15:
            newVal = '空调'
            break
          case 16:
            newVal = '抽油烟机'
            break
          case 17:
            newVal = '灶具'
            break
          case 18:
            newVal = '热水器'
            break
          case 19:
            newVal = '消毒柜'
            break
          case 20:
            newVal = '微波炉'
            break
          case 21:
            newVal = '烤箱'
            break
          case 22:
            newVal = '茶几'
            break
          case 23:
            newVal = '餐桌'
            break
          case 24:
            newVal = '椅子'
            break
          case 25:
            newVal = '电视柜'
            break
          case 26:
            newVal = '衣柜'
            break
          case 27:
            newVal = '鞋柜'
            break
          case 28:
            newVal = '沙发'
            break
          case 29:
            newVal = '书架'
            break
          case 30:
            newVal = '梳妆台'
            break
          case 31:
            newVal = '马桶'
            break
          case 32:
            newVal = '水池'
            break
          case 33:
            newVal = '镜子'
            break
          case 34:
            newVal = '浴缸'
            break
          case 35:
            newVal = '淋浴设施'
            break
          case 36:
            newVal = '鱼缸'
            break
          case 37:
            newVal = '桌椅'
            break
          default:
            break
        }
        return newVal
      })
      return newArr;
    }
  },
  //联系管家
  connect:function() {
    const productId = this.data.id
   if(this.isLogin) {
     var waiterId = this.data.waiterId || 0
     http.post(`/service/v2_6/virtual?called=${waiterId}&productId=${productId}`, res => {
       if (res.data.data === '用户不存在') {
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
   }
   else {
     wx.redirectTo({
       url: `/pages/login/login?url=${app.getCurrentPageUrl(true)}`,
     })
   }
  },

  //联系对方
  call:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.creatorCellphone //仅为示例，并非真实的电话号码
    })
  },

  //预约
  yuyue: function() {
    const data = {
      productId: this.data.id,
      estateName: this.data.estateName,
      houseName: this.data.houseName,
      price: this.data.price,
      images:this.data.images[0],
      waiterId: this.data.waiterId,
    }
    const url = app.objToUrl(data)
    console.log(url)
    wx.navigateTo({
      url: `../heshikanfang/heshikanfang?${url}`,
    })
  },
  linkToSchedule:function() {
    wx.navigateTo({
      url:'../schedule/schedule'
    })
  }
})