// pages/index/index.js
const app = getApp();
const http = require('../../utils/http.js');

Page({

  data: {
    toastHidden:true,
    textareaLength:0,
    maxHeight:'40rpx',
    description:'',
    y:'40rpx',
    show:true,
    error:'',
    disable:true,
    cityIndex:0,
    cityRange: [['深圳', '惠州']],
    onSelectCity:false,
    price:'',
    onSelectHuxing:false,
    HuxingIndex: 0,
    HuxingRange: [['单间', '一室一厅', '两室一厅', '三室一厅', '三室两厅', '四室两厅', '五室两厅']],
    timeRange:[], 
    onSelectTime:false,
    timeIndex:[],
    rentIndex: 0,
    rentRange: [['是', '否']],
    onSelectRent: false,
    rootmate:0,
    rootmateRange:[['不限','男','女']],
    onSelectRootmate: false,
    sex:0,
    sexRange: [['男', '女']],
    onSelectSex: false,
    city:'深圳',
    isHidden:true,
  },

  onLoad: function (options) {
    /*wx.navigateTo({
      url: '../searchHome/searchHome',
    })*/
    this.getCityId('深圳')
    //this.debug();
  },
  debug:function() {
    const text = '我是测试我是测试 我是测试 我是测试我是测试我是测试我是测试 我是测试 我是测试我是测试我是测试我是测试 我是测试 我是测试我是测试'
    this.setData({ zoneValue :text},() => {
      setTimeout(() => {
        this.setData({zoneValue:''})
      },50)
    })
  },
  getCityId: function (cityname) {
    http.get(`/service/city/name?cityName=${cityname}`, res => {
      const cityId = res.data.data[0].id
      console.log(cityId)
      this.setData({ cityId: cityId })
    }, err => console.log('获取城市id出错'))
  },
 /* onReady: function () {
    this.pickerView = this.selectComponent("#pickerView");
    let y = [2018],m = [],d= []
    let date = new Date()
    for (let i = date.getMonth() + 1;i < 13 ;i++ ){
      m.push(i)
    }
    for (let i = date.getDate(); i < 32; i++){
      d.push(i)
    }
    let timeRange = [y,m,d]
    this.setData({ timeRange: timeRange })
  },*/

  click(e) {
    this.setData({ onSelectCity: false, show:true,cityIndex: e.detail[0] })
    this.getCityId(this.data.cityRange[0][e.detail[0]])
  },
  cancel() {
    this.setData({ onSelectCity: false, show: true})    
  },
  change:function(e) {
    if (!this.data.onSelectCity) {
      this.setData({cityIndex: e.detail[0] })
      this.getCityId(this.data.cityRange[0][e.detail[0]])      
    }
  },
  selectCity() {
    this.setData({ onSelectCity: true, show: false })
  },
  lineChange:function(e) {
    console.log(e.detail,'eee')
    if (e.detail.lineCount > 2){
      this.setData({ maxHeight: (e.detail.lineCount ) * 40 + 'rpx', height: (e.detail.lineCount) * 40 + 20 + 'rpx'})
    }
    else {
      this.setData({
        maxHeight: e.detail.height + 'px'})
    }
    this.setData({
      maxHeight: (e.detail.height + 5) +'px'
    })
  },
  //价格
  selectPrice() {
    this.setData({ onSelectPrice: true, show: false })
  }, 
  pricecancel:function() {
    this.setData({ onSelectPrice: false, show: true})  
  },
  priceclick:function(e) {
    console.log(e.detail,'index')
    this.setData({ price: e.detail, onSelectPrice: false, show: true})
  },
  //选择户型
  Huxingclick(e) {
    let Huxing = this.data.HuxingRange[0][e.detail[0]]
    this.setData({ onSelectHuxing: false, show: true, HuxingIndex: e.detail[0],Huxing:Huxing })
  },
  Huxingcancel() {
    this.setData({ onSelectHuxing: false, show: true })
  },
  Huxingchange: function (e) {
    console.log(e.detail,'index')
    if (!this.data.onSelectHuxing) {
      let Huxing = this.data.HuxingRange[0][e.detail[0]]
      this.setData({ HuxingIndex: e.detail[0], Huxing: Huxing })
    }
  },
  selectHuxing() {
    this.setData({ onSelectHuxing: true, show: false })
  },
  //time 时间
  timeclick(e) {
    this.setData({ onSelectTime: false, show: true, timeIndex: e.detail[0], time: e.detail })
  },
  timecancel() {
    this.setData({ onSelectTime: false, show: true })
  },
  timechange: function (e) {
    console.log(e.detail, 'index')
    if (!this.data.onSelectTime) {
      /*let time = this.data.timeRange[0][e.detail[0]] + '-' + this.data.timeRange[1][e.detail[1]] + '-' + this.data.timeRange[2][e.detail[2]]*/
      this.setData({ timeIndex: e.detail[0], time: e.detail })
    }
  },
  selectTime() {
    this.setData({ onSelectTime: true,show:false })
  },
  //rent 合租
  rentclick(e) {
    let rent = this.data.rentRange[0][e.detail[0]]
    this.setData({ onSelectRent: false, show: true, rentIndex: e.detail[0], rent: rent })
  },
  rentcancel() {
    this.setData({ onSelectRent: false, show: true })
  },
  rentchange: function (e) {
    console.log(e.detail, 'index')
    if (!this.data.onSelectRent) {
      let rent = this.data.rentRange[0][e.detail[0]]
      this.setData({ rentIndex: e.detail[0], rent: rent })
    }
  },
  selectRent() {
    this.setData({ onSelectRent: true, show: false })
  },
  //rootmate
  rootmateclick(e) {
    let rootmate = this.data.rootmateRange[0][e.detail[0]]
    this.setData({ onSelectRootmate: false, show: true, rootmateIndex: e.detail[0], rootmate: rootmate })
  },
  rootmatecancel() {
    this.setData({ onSelectRootmate: false, show: true })
  },
  rootmatechange: function (e) {
    console.log(e.detail, 'index')
    if (!this.data.onSelectRootmate) {
      let rootmate = this.data.rootmateRange[0][e.detail[0]]
      this.setData({ rootmateIndex: e.detail[0], rootmate: rootmate })
    }
  },
  selectRootmate() {
    this.setData({ onSelectRootmate: true, show: false })
  },

  //sex
  sexclick(e) {
    let sex = this.data.sexRange[0][e.detail[0]]
    this.setData({ onSelectSex: false, show: true, sexIndex: e.detail[0], sex: sex })
  },
  sexcancel() {
    this.setData({ onSelectSex: false, show: true })
  },
  sexchange: function (e) {
    console.log(e.detail, 'index')
    if (!this.data.onSelectSex) {
      let sex = this.data.sexRange[0][e.detail[0]]
      this.setData({ sexIndex: e.detail[0], sex: sex })
    }
  },
  selectSex() {
    this.setData({ onSelectSex: true, show: false })
  },

  textareaInput(e) {
    this.setData({ textareaLength: e.detail.cursor, description:e.detail.value})
  },
  zoneInput(e) {
    console.log(this.data.maxHeight)
    this.setData({ zoneValue: e.detail.value })
  },
 
  formSubmit(e) {
    let formdata = e.detail.value
    const id = (e.detail.target ? e.detail.target.id : '');
    app.addFormId(e.detail.formId, id);
    app.log(id)
    let {price,Huxing,time,rent,sex,rootmate} = this.data
    if(formdata.phone == '') {
      this.setData({error:'您没有输入手机号码'})
      setTimeout(() => this.setData({error:''}),2000)
    }
    else if (!this.phoneTest(formdata.phone)) {
      console.log(formdata.phone,'formdata.phone')
    }
    else if (formdata.zone == '') {
      this.setData({ error: '您没有输入地址' })
      setTimeout(() => this.setData({ error: '' }), 2000)
    }
    else if (price == '') {
      this.setData({ error: '您没有选择价格范围' })
      setTimeout(() => this.setData({ error: '' }), 2000)
    }
    else if (Huxing == '' || Huxing == undefined ) {
      this.setData({ error: '您没有选择期待户型' })
      setTimeout(() => this.setData({ error: '' }), 2000)
    }
    else if (time == '' || time ==undefined ) {
      this.setData({ error: '您没有选择入住时间' })
      setTimeout(() => this.setData({ error: '' }), 2000)
    }
    else if (rent == '' || rent== undefined ) {
      this.setData({ error: '您没有选择是否合租' })
      setTimeout(() => this.setData({ error: '' }), 2000)
    }
    else if (formdata.other == '') {
      this.setData({ error: '您没有选择其他要求' })
      setTimeout(() => this.setData({ error: '' }), 2000)
    }
    else if (rent === '是' && (rootmate == undefined || sex == undefined)) {
      if(rootmate == '' || rootmate == undefined) {
        this.setData({ error: '您没有选择是否舍友性别' })
        setTimeout(() => this.setData({ error: '' }), 2000)
      }
      else if (sex == '' || sex == undefined) {
        this.setData({ error: '您没有选择您的性别' })
        setTimeout(() => this.setData({ error: '' }), 2000)
      }
    }
    else{
      console.log('elsesles')
      let data = {}
      data.cityName = this.data.city
      data.cityId = this.data.cityId
      data.name = this.data.zoneValue ? this.data.zoneValue+'' : ''
      let price = this.data.price.split('-')
      if (price[0] !== undefined && price[0] && price[0] !=='不限') {
        if(price[0].match('以下')){
          data.price = 0
          data.priceMax = parseInt(price[0])
        }
        else {
          data.price= parseInt(price[0])
        }
        }
      if (price[1] !== undefined && price[1]) {
        data.priceMax = parseInt(price[1])
      }
      data.layout = this.data.Huxing
      data.checkInTime = this.translationTime(this.data.time)
      data.cellphone = formdata.phone
      if(sex === '男') {
        data.sex = 1
      }
      else if(sex === '女') {
        data.sex = 2
      }
      else {
        data.sex = 0
      }
      if(rootmate === '男') {
        data.mateSex = 1
      }
      else if (sex === '女') {
        data.mateSex = 2
      }
      else {
        data.mateSex = 0
      }
      data.description = this.data.description ? this.data.description+'':''
      data.share = this.data.rentIndex === 0? true:false
      console.log(data, 'data.data')
      http.post(`/service/estate/addEstateDemand`,data,res => {
        console.log(res,'res upload')
        this.setData({ toastHidden:false })
        wx.redirectTo({
          url: '../searchHome/searchHome',
        })
        setTimeout(() => {
          this.setData({ toastHidden: true })
        },1000)
      },err => {
        console.log('上传失败')
      })
    }
  },
  areatextfocus:function() {
    this.setData({ y:'240rpx'})
    wx.pageScrollTo({
      scrollTop: 280,
      duration: 100
    })
  },
  areatextblur:function() {
    this.setData({ y: '40rpx' })
  },
  phoneTest: function (cellphone) {
    const that = this;
    const phonePattern = /^1(3[0-9]|4[0-9]|5[0-9]|7[5678]|8[0-9])\d{8}$/;
    if (phonePattern.test(cellphone)) {
      return true
    } else {
      this.setData({ error: '您输入的手机号码有误' })
      setTimeout(() => this.setData({ error: '' }), 2000)
      return false
    }
  },
  firstTextareaFouces:function() {
    this.setData({ textAreaOnFoces:true})
  },
  firstTextareaBlur:function() {
    this.setData({ textAreaOnFoces:false })
  },


  translationTime: function (originTime) {
    let date = originTime.match(/\S+/)
    date = date[0].split('-')
    if (date[1] !== undefined) {
      date[1] = date[1].length > 1 ? date[1] : '0' + date[1]
    }
    if (date[2] !== undefined) {
      date[2] = date[2].length > 1 ? date[2] : '0' + date[2]
    }
    date = date.join('-')
    return date
  }
})
