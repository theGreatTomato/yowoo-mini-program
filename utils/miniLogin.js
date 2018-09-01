const http = require('./http.js');

const doMiniLogin = app => {
    // 小程序检查登录
    console.log('检查登录');
    wx.checkSession({ // 小程序API检查登录状态
        success: () => { // 登录状态有效
            console.log('有效的登录状态');
            try {
                const token = wx.getStorageSync('token');
                if (token && token != null && token.length > 0) {
                    console.log('取缓存中的登录凭据');
                    if (app.miniLoginCallBack.length > 0) { // 如果登录成功回调列表不为空，循环调用回调函数
                        for (let item of app.miniLoginCallBack) {
                            if (typeof (item) === 'function') {
                                item(token)
                            }
                        }
                        app.miniLoginCallBack = [] // 清空登录成功回调列表
                    }
                } else { // 缓存中无登录凭据，重新登录
                    console.log('未缓存token');
                    miniLogin()
                }
            } catch (e) {
                console.log(e)
            }
        },
        fail: () => { //登录态过期，重新登录
            console.log('登录状态失效');
            miniLogin()
        }
    });

    // 小程序登录
    const miniLogin = () => {
        console.log('小程序登录');
        wx.login({
            success: res => { // 小程序登录API调用成功后，请求后台小程序登录服务
                console.log('小程序登录响应：', res);
                http.post(`/service/v2_4/miniProgram/login?code=${res.code}&tp=minirenter`,
                    res => {
                        console.log('小程序登录成功响应：', res);
                        if (res.data.data) {
                            const token = res.data.data.token;
                            const openId = res.data.data.openId;
                            const isUser = res.data.data.user;
                            try { // 写token缓存
                                wx.setStorageSync('token', token);   // 当isUser为否时，是小程序登录凭据，当isUser为真时，即为系统用户登录凭据
                                wx.setStorageSync('openId', openId);
                                wx.setStorageSync('isUser', isUser)  // 是否已注册
                            } catch (e) {
                            }
                            if (app.miniLoginCallBack.length > 0) { // 如果登录成功回调列表不为空，循环调用回调函数
                                for (let item of app.miniLoginCallBack) {
                                    if (typeof (item) === 'function') {
                                        item(token, openId, isUser)
                                    }
                                }
                                app.miniLoginCallBack = [] // 清空登录成功回调列表
                            }
                        }
                    },
                    err => {
                        console.log('小程序登录出错响应：', err)
                    });
            }
        })
    }
};

module.exports = {
    do: doMiniLogin
};