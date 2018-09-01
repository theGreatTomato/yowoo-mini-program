// pages/login/login.js
// 这个页面的作用是建立微信用户（by openId）和有屋系统用户（by手机号）的绑定关系，或者也可理解为有屋系统用户的“注册”过程
const app = getApp();
const http = require('../../utils/http.js');
const miniLogin = require('../../utils/miniLogin.js');

Page({
    data: {
        redirectUrl: '',
        cellphone: '',
        code: '',
        btnCodeText: '',
        errMsg: '',
        codeLock: false,
        loginLock: false,
    },
    onLoad: function (options) {
        app.log('onLoad');
        miniLogin.do(app);
        this.setData({
            redirectUrl: options.url,
            btnCodeText: '获取验证码'
        });
    },
    errTip(err,timeout) {
      wx.showToast({
        title: err,
        icon: 'none',
        duration: timeout
      })
    },
    cellphoneInput: function (e) {
        const that = this;
        let cell = e.detail.value.trim();
        if (cell.length >= 11) {
            cell = cell.slice(0, 11)
        }
        that.setData({
            cellphone: cell
        });
        that.phoneTest(cell)
    },
    cellphoneBlur: function () {
        this.phoneTest(this.data.cellphone)
    },
    phoneTest: function (cellphone) {
        const that = this;
        const phonePattern = /^1(3[0-9]|4[0-9]|5[0-9]|7[5678]|8[0-9])\d{8}$/;
        if (phonePattern.test(cellphone)) {
            return true
        } else {
            that.errTip('请输入正确的手机号码', 2000);
            return false
        }
    },
    codeInput: function (e) {
        const that = this;
        let code = e.detail.value.trim();
        if (code.length >= 4) {
            code = code.slice(0, 4)
        }
        that.setData({
            code: code
        });
        that.codeTest(code)
    },
    codeBlur: function () {
        this.codeTest(this.data.code)
    },
    codeTest: function (code) {
        const that = this;
        const codePattern = /^\d{4}$/;
        if (codePattern.test(code)) {
            return true
        } else {
            that.errTip('请输入四位数验证码', 2000);
            return false
        }
    },
    /**
     * 获取验证码
     */
    getCode: function () {
        const that = this;
        if (!that.data.codeLock && that.phoneTest(that.data.cellphone)) {
            that.setData({
                codeLock: true
            });
            http.post(`/service/sms/${that.data.cellphone}`,
                res => {
                    let remain = 58;
                    that.setData({
                        btnCodeText: '59s后重新获取'
                    });
                    const counter = setInterval(() => {
                        that.setData({
                            btnCodeText: `${remain}s后重新获取`
                        });
                        if (remain <= 0) {
                            clearInterval(counter);
                            that.setData({
                                btnCodeText: '重新获取',
                                codeLock: false
                            });
                        }
                        remain--;
                    }, 1000);
                },
                err => {
                    that.setData({
                        codeLock: false
                    });
                    console.log('获取验证码请求出错响应：', err)
                })

        }
    },
    login: function () {
        const that = this;
        if (!that.data.loginLock && that.phoneTest(that.data.cellphone) && that.codeTest(that.data.code)) {
            try {
                const openId = wx.getStorageSync('openId');
                if (openId && null != openId && openId.length > 0) {
                    that.setData({
                        loginLock: true
                    });
                    http.post(`/service/user/login?cellphone=${that.data.cellphone}&code=${that.data.code}&tp=minirenter&weChat=${openId}`,
                        res => {
                            console.log('系统用户登录响应:', res);
                            if (res.statusCode === 200) {
                               wx.setStorageSync('phone', that.data.cellphone);             
                                wx.setStorageSync('token', res.data.data);
                                wx.setStorageSync('isUser', true);
                                if (that.data.redirectUrl && null != that.data.redirectUrl && that.data.redirectUrl.length > 0) {
                                    wx.redirectTo({
                                        url: decodeURIComponent(that.data.redirectUrl)
                                    })
                                } else {
                                    wx.redirectTo({
                                        url: '/pages/index/index'
                                    })
                                }
                            } else {
                                that.errTip('手机号或验证码错误', 2000);
                            }
                            that.setData({
                                loginLock: false
                            })
                        },
                        err => {
                            that.setData({
                                loginLock: false
                            });
                            console.log('登录请求出错响应：', err)
                        });
                } else {
                    console.log('系统用户登录无法获取缓存的openId', openId)
                }
            } catch (err) {}
        }
    },
    formSubmit: function (e) { // 按钮点击和formId记录
        const id = (e.detail.target ? e.detail.target.id : '');
        app.addFormId(e.detail.formId, id);
        app.log(id)
    },
    link: function(e) {
      const id = e.cuttentTarget.id
      wx.navigateTo({
        url: `../${id}/${id}`,
      })
    }
});