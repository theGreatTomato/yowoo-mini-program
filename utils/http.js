const serviceHost = 'https://test.yowootech.com';

const request = req => { // 统一给请求添加host、时间戳、登录凭据处理
    if (!req || null == req || typeof req !== 'object' ||
        !req.hasOwnProperty('url') || typeof req.url !== 'string' || req.url.trim().length === 0) {
        return;
    }
    if (req.data && typeof req.data === 'function') {
        req.fail = req.success;
        req.success = req.data;
        req.data = null
    }
    let url = req.url.trim();
    if (!/^(http|https):\/\//ig.test(url)) {
        url = serviceHost + (url.indexOf('/') === 0 ? url : '/' + url)
    }
    if (!/(&t=|\?t=)\d+/ig.test(url)) {
        url = url + (url.indexOf('?') >= 0 ? '&t=' : '?t=') + new Date().getTime()
    }
    if (!req.hasOwnProperty('method') || typeof req.method !== 'string' || req.method.trim().length === 0) {
        req.method = 'GET'
    }
    req.method = req.method.trim().toUpperCase();
    if (!req.hasOwnProperty('success') || typeof req.success !== 'function') {
        req.success = undefined
    }
    if (!req.hasOwnProperty('fail') || typeof req.fail !== 'function') {
        req.fail = undefined
    }
    const token = wx.getStorageSync('token');
    if (!req.hasOwnProperty('header') || typeof req.header !== 'object') {
        req.header = {
            'content-type': 'application/json',
        };
        if (token && null != token) {
            req.header['Auth'] = token
        }
    } else {
        if (!req.header.hasOwnProperty('content-type')) {
            req.header['content-type'] = 'application/json'
        }
        if (!req.header.hasOwnProperty('Auth') && token && null != token) {
            req.header['Auth'] = token
        }
    }

    const wxReq = {
        url: url,
        header: req.header,
        method: req.method,
        success: req.success,
        fail: req.fail
    };
    if (req.data && null != req.data) {
        wxReq.data = req.data
    }
    console.log('发送请求：', wxReq);
    wx.request(wxReq)
};

module.exports = {
    request: request,
    get: (url, success, fail) => {
        return request({
            url: url,
            method: 'GET',
            success: success,
            fail: fail
        })
    },
    delete: (url, success, fail) => {
        return request({
            url: url,
            method: 'DELETE',
            success: success,
            fail: fail
        })
    },
    post: (url, data, success, fail) => {
        return request({
            url: url,
            data: data,
            method: 'POST',
            success: success,
            fail: fail
        })
    },
    put: (url, data, success, fail) => {
        return request({
            url: url,
            data: data,
            method: 'PUT',
            success: success,
            fail: fail
        })
    }
};