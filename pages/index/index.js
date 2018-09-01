//index.js
//获取应用实例
const app = getApp();
const http = require('../../utils/http.js');

Page({
    data: {
        loginText: '',
        userInfo: {},
        hasUserInfo: false,
        isUser: false,
        toastHidden: true,
    },
    cacheUserInfo: function (userInfo) { // 写userInfo缓存
        if (userInfo) {
            try {
                wx.setStorageSync('userInfo', userInfo)
            } catch (err) {}
            this.setData({
                userInfo: userInfo,
                hasUserInfo: true
            });
            const openId = wx.getStorageSync('openId');
            if (openId && null != openId && openId.trim().length > 0) {
                http.post(`/service/v2_4/miniProgram/minirenter/userInfo/${openId.trim()}`, userInfo) // 将微信用户信息更新到服务端
            }
            if (app.userInfoReadyCallback && null != app.userInfoReadyCallback &&
                typeof app.userInfoReadyCallback === 'function') { // 如果有获取用户信息回调，则调用
                app.userInfoReadyCallback(userInfo)
            }
        }
    },
    onLoad: function (options) {
      wx.showShareMenu({
        withShareTicket: true
      })
      /*wx.navigateTo({
        url: '../goutongjieguo/goutongjieguo?houseId=xxx&id=47489427000000106',
      })*/
     /*wx.navigateTo({
       url: '../helpMe/helpMe',
      })*/
      /*wx.navigateTo({
        url: '../pages/feedback/feedback?houseId=666&makeLookHouseId=47489427000000106',
      })*/
      console.log(options, 'option')
        app.log('onLoad');
        const that = this;
        // 取是否已注册缓存
        if (wx.getStorageSync('isUser')) {
            that.setData({
                loginText: '获取用户信息',
                isUser: true
            })
        } else {
            that.setData({
                loginText: '一键注册'
            })
        }
        // 由于登录是异步调用，所以将isUser更新逻辑加入回调列表，避免无法调用到
        app.miniLoginCallBack.push((token, openId, isUser) => {
            if (isUser) {
                that.setData({
                    loginText: '获取用户信息',
                    isUser: true
                })
            } else {
                that.setData({
                    loginText: '一键注册'
                })
            }
        });
        const userInfo = wx.getStorageSync('userInfo');
        // 取userInfo缓存
        if (userInfo) {
            that.setData({
                userInfo: userInfo,
                hasUserInfo: true
            })
        } else if (!wx.canIUse('button.open-type.getUserInfo')) {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    this.cacheUserInfo(res.userInfo)
                }
            })
        }
    },
    getUserInfo: function (e) { // 获取用户信息授权按钮点击处理
        this.cacheUserInfo(e.detail.userInfo)
    },
    checkLogin: function () {
        if (!this.data.isUser) {
            if (this.data.hasUserInfo) { // 如果已有用户信息，即已授权未“注册”，直接跳手机号登录页面
                wx.redirectTo({
                    url: `/pages/login/login?url=${app.getCurrentPageUrl(true)}`,
                })
            } else { // 否则，将页面跳转加入获取用户回调中，即实现先授权再“注册”
                app.userInfoReadyCallback = () => {
                    wx.redirectTo({
                        url: `/pages/login/login?url=${app.getCurrentPageUrl(true)}`,
                    })
                }
            }
        }
    },
    formSubmit: function (e) { // 按钮点击和formId记录
        const id = (e.detail.target ? e.detail.target.id : '');
        app.addFormId(e.detail.formId, id);
        app.log(id)
    },
    //跳转页面
    link: function(e) {
      console.log(e.currentTarget.id)
      wx.navigateTo({
        url: `../${e.currentTarget.id}/${e.currentTarget.id}`,
      })
    },
    //退出登录
    loginOut: function (e) {
      const id = (e.detail.target ? e.detail.target.id : '');
     app.addFormId(e.detail.formId, id);
      app.log(id)
      wx.clearStorage()
      wx.reLaunch({
        url: '../index/index',
      })
    },
  service:function() {
    wx.makePhoneCall({
      phoneNumber: '4001891517' //仅为示例，并非真实的电话号码
    })
  }
});
 