// components/priceSection/priceSection.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    price:String,
    maxHeight:String
  },
  attached:function(){
    let index = -1
    if (this.properties.price === '') {
      this.setData({ priceIndex: [0] })
    }
    else{
      this.data.priceArray[0].forEach((val,i) => {
        if(val === this.properties.price) {
          index = i
        }
      })
      if(index >=0 ){
        this.setData({priceIndex:[index]})
      }
    }
    console.log(this.properties.maxHeight)
    if (this.properties.maxHeight === '') {
      console.log('underfined maxHeight ,默认 400rpx')
      this.setData({maxHeight:'400rpx'})
    }
    else{
      console.log('derfined')      
      this.setData({ maxHeight: this.properties.maxHeight})
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    priceArray: [['不限', '500以下', '500-1000元', '1000-2000元', '2000-3000元', '3000-5000元', '5000-8000元', '8000以上']],
    bottom: 0,
    isiPhone: false,
    firstClick: true,
  },
  attached: function () {
    wx.getSystemInfo({
      success: (res) => {
        console.log(res, 'res')
        if (res.model.match('iPhone')) {
          this.setData({ isiPhone: true })
        }
        else {
          this.setData({ isiPhone: false })
        }
      }
    })
  },


  methods: {
    pricechange:function(e) {
      console.log(e.detail)
    },
    priceclick:function(e) {
      this.triggerEvent("priceclick", this.data.priceArray[0][e.currentTarget.id])
    },
    pricecancel:function(e) {
      this.triggerEvent("pricecancel")      
    },
    minprice:function(e) {
      this.setData({ minprice: e.detail.value})
    },
    maxprice:function(e) {
      this.setData({ maxprice: e.detail.value })
    },
    
    sure:function(e) {
      let minprice = parseInt(this.data.minprice)
      let maxprice = parseInt(this.data.maxprice)
      console.log(maxprice, minprice,'minprice')

      if (minprice && minprice < 0) {
        this.setData({ minprice: '', maxprice:''})
        this.errTip('最小金额 < 0')
      }
        else if (maxprice && maxprice <= 0) {
        this.setData({ minprice: '', maxprice: '' })
          
        this.errTip('最大金额 < 0')
      }
      else if (minprice && maxprice && maxprice >= minprice ) {
        this.triggerEvent("priceclick", minprice + '-'+ maxprice+ '元')
      }
      else if ((!minprice || minprice == 0) && maxprice) {
        this.triggerEvent("priceclick", maxprice + '元以下')
      }
      else if ((minprice || minprice == 0)&& !maxprice) {
        console.log(minprice, 'start')
        this.triggerEvent("priceclick", minprice + '元以上')
      }
      else if (maxprice <= minprice) {
        this.errTip('最大金额 < 最小金额')
      }
    },
    noevent: function (e) {
      console.log('no event')
    },
    focus: function () {
      this.onFocus = true
      clearTimeout(this.t)
      if (this.data.firstClick === true) {
        this.setData({ firstClick: false })
      }
    },
    blur: function () {
      this.onFocus = false
      this.t = setTimeout(() => {
        if(this.onFocus !== true) {
          this.setData({ firstClick:true })
        }
      },300)
    },
      /*this.onFocus = false
      console.log(this.data.bottom, '0ms')
      setTimeout(() => {
        console.log(this.data.bottom,'50ms')
        if (this.onFocus === true) {
          this.setData({ bottom: 0 },() => {
            setTimeout(() => {
              this.setData({ bottom: '15rpx' })
            },100)
          })
        }
        else {
          this.setData({ bottom: 0 })
        }
      },50)*/
    handleClickMinInput:function() {
        this.setData({ onClickMinInput: true, onClickMaxInput: false })
    },
    handleClickMaxInput:function(){
        this.setData({ onClickMaxInput: true, onClickMinInput: false })
    },
    errTip: function (err) {
      wx.showToast({
        title: err,
        icon: 'none',
        duration: 2000
      })
    },
  }
})
