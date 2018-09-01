// components/price/price.js
const app = getApp();
Component({
  properties: {

  },

  data: {
    priceArray :['不限', '500-1000元', '1000-2000元', '2000-3000元', '3000-5000元', '5000-8000元','8000以上'],
    selectIndex:0,
    isiPhone:false,
    firstClick:true,
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
    minprice: function (e) {
      this.setData({ minprice: e.detail.value })
    },
    maxprice: function (e) {
      this.setData({ maxprice: e.detail.value })
    },
    formSubmit: function (e) {
      const id = (e.detail.target ? e.detail.target.id : '');
      app.addFormId(e.detail.formId, id);
      app.log(id)
      let minprice = parseInt(this.data.minprice)
      let maxprice = parseInt(this.data.maxprice)
      if (minprice && minprice < 0) {
        this.setData({ minprice: '', maxprice: '' })
        this.errTip('最小金额 < 0')
      }
      else if (maxprice && maxprice < 0) {
        this.setData({ minprice: '', maxprice: '' })
        this.errTip('最大金额 < 0')
      }
      else if ((minprice || minprice == 0)  && !maxprice) {
        this.triggerEvent("handleSelectPrice", minprice + '元以上' )
      }
      else if ((!minprice || minprice == 0)  && maxprice) {
        this.triggerEvent("handleSelectPrice", maxprice + '元以下')
      }
      else if (maxprice <= minprice) {
        this.errTip('最大金额 < 最小金额')
      }
      else if (minprice && maxprice && maxprice >= minprice) {
        this.setData({ selectIndex: null })
        this.triggerEvent("handleSelectPrice", minprice + '-' + maxprice + '元')
      }
    },
    click: function (e) {
      const i =  parseInt(e.currentTarget.id)
      this.setData({ minprice: null, maxprice:null,selectIndex:i})
      if(i === 0 ) {
        this.triggerEvent("handleSelectPrice")              
      }else {
        this.triggerEvent("handleSelectPrice", this.data.priceArray[i])      
      }
    },
    none: function () {
    },
    cancel: function () {
      this.triggerEvent("handleSelectPrice", 'cancel')      
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
        if (this.onFocus !== true) {
          this.setData({ firstClick: true })
        }
      }, 300)
    },
    handleClickMinInput: function () {
      this.setData({ onClickMinInput: true, onClickMaxInput: false })
    },
    handleClickMaxInput: function () {
      this.setData({ onClickMaxInput: true, onClickMinInput: false })
    },
    errTip: function (err) {
      wx.showToast({
        title: err,
        icon: 'none',
        duration: 2000
      })
    },
  },
})
