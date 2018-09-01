const app = getApp();
const http = require('../../utils/http.js');
const AllBank = require('../..//allBank.js');
Page({

  data: {
  
  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(options, 'option')
    app.log('onLoad');
    const cashAmount = options.cashAmount
    this.setData({ cashAmount: cashAmount})
  },
  formSubmit: function (e) { // 按钮点击和formId记录
    const id = (e.detail.target ? e.detail.target.id : '');
    app.addFormId(e.detail.formId, id);
  },
  nameInput:function(e) {
    this.setData({ name: e.detail.value})
  },
  cardInput:function(e) {
    this.setData({ card: e.detail.value})
  },
  priceInput:function(e) {
    this.setData({ price: e.detail.value }) 
  },
  cardblur:function() {
    const bank = this.getBankName(this.data.card) || ''
    this.setData({bank:bank})
  },
  bankInput:function(e) {
    this.setData({ bank: e.detail.value })    
  },
  getBankName:function (cardNo) {    // 获取开户行
    if(null != cardNo && cardNo != undefined && cardNo != '') {
      cardNo = cardNo.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      cardNo = cardNo.replace(/\s+/g, '');
      let binNo = '';
      const len = cardNo.length;
      if (len >= 6) {
        binNo = cardNo.slice(0, 6);
      }
      console.log(binNo, 'bin')
      let bankName = '';
      if (AllBank.allBank.hasOwnProperty(len)) {
        if (AllBank.allBank[len].hasOwnProperty(binNo)) {
          bankName = AllBank.allBank[len][binNo].name;
          return bankName
        }
      }
    }
  },

  log:function() {
    wx.navigateTo({
      url: '../priceLog/priceLog',
    })
  },
  errTip(err) {
    wx.showToast({
      title: err,
      icon:'none',
      duration:1500
    })
  },
  clickTextarea:function() {
    this.setData({onFocuPrice:true})
  },
  blur: function () {
    this.setData({ onFocuPrice: false })
  },
  /**提交 */
  click:function() {
    if (this.data.name == undefined && this.data.name == null ) {
      this.errTip('请输入名字')
    }
    else if (this.data.card == undefined && this.data.card == null) {
      this.errTip('请输入正确的卡号')
    }
    else if (this.data.bank == undefined && this.data.bank == null) {
      this.errTip('请输入正确的银行名字')            
    }
    else if (this.data.price == undefined && this.data.bank == null){
      this.errTip('请输入提现金额')                  
    }
    else {
      this.setData({ toastHidden: 'loading'})
      http.post(`/service/pay/withdrawals?cardHolderName=${this.data.name}&bankAccount=${this.data.card}&bankName=${this.data.bank}&drawAmount=${this.data.price}`,res => {
        console.log(res,'resq data')
        if(res.data.head.errcode ===0) {
          this.setData({ toastHidden: 'success' })
          setTimeout(() => {
            this.cancel()
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
        else {
          this.setData({ toastHidden: 'fail' })
          setTimeout(() => {
            this.cancel()
          }, 1500)
        }
      },err => {
        this.setData({ toastHidden:'fail'})
        setTimeout(() => {
          this.cancel()
        },1500)
      })
    }
  },
  cancel:function()  {
    this.setData({ toastHidden: null })
  }
})