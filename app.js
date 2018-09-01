//app.js
const http = require('./utils/http.js');
const miniLogin = require('./utils/miniLogin.js');

App({
    onLaunch: function () {
        miniLogin.do(this);
    },
    getCurrentPageUrl: function (needOptions) {
        const pages = getCurrentPages();   //获取加载的页面
        console.log(pages,'currentpage')
        const currentPage = pages[pages.length - 1];   //获取当前页面的对象
        let url = '/' + currentPage.route;
        if (needOptions && JSON.stringify(currentPage.options) !== '{}') {
            let params = [];
            for (let k in currentPage.options) {
                if (currentPage.options.hasOwnProperty(k)) {
                    params.push(`${k}=${currentPage.options[k]}`)
                }
            }
            url = url + '?' + params.join('&')
        }
        return encodeURIComponent(url)
    },
    log: function (id) { // 页面访问日志记录
        const openId = wx.getStorageSync('openId');
        const data = {
            action: `${openId}@minirenter#${id}`,
            pageUrl: this.getCurrentPageUrl()
        };
        http.post('/service/accessLog', data)
    },
    addFormId: function (formId, id) { // 小程序formId记录
        const openId = wx.getStorageSync('openId');
        if (formId && null != formId && formId.trim().length > 0 &&
            openId && null != openId && openId.trim().length > 0) {
            let url = `/service/v2_4/miniProgram/minirenter/${openId.trim()}/formId/${formId.trim()}?target=${this.getCurrentPageUrl()}`;
            if (id && null != id && id.trim().length > 0) {
                url = `${url}%23${id.trim()}`
            }
            http.post(url)
        }
    },
    miniLoginCallBack: [],
    userInfoReadyCallback: null,
    TXtoBD: function(lon, lat) {
      const x = lon, y = lat;
      const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * Math.PI);
      const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * Math.PI);
      const bd_lon = z * Math.cos(theta) + 0.0065;
      const bd_lat = z * Math.sin(theta) + 0.006;
      return { lon: bd_lon, lat: bd_lat };
    },
    BDtoTX:function(lon, lat) {
      const x_pi = 3.14159265358979324 * 3000.0 / 180.0;
      const x = lon - 0.0065;
      const y = lat - 0.006;
      let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
      const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
      const tx_lon = z * Math.cos(theta);
      const tx_lat = z * Math.sin(theta);
      return { lon: tx_lon, lat:tx_lat};  
    },
    cityDefaultLocation:[
      {
        name:'深圳',
        lon: 114.025974,
        lat: 22.546054 
      },
      {
        name: '惠州',
        lon: 114.410658, 
        lat: 23.11354 
      }
    ],
    objToUrl: function (obj) {
      let url = '' ;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const element = obj[key];
          if (element !== [] && Array.isArray(element)) {
            for (let i = 0; i < element.length; i++) {
              url = url + key + '=' + element[i] + '&'             
            }
          }
          else if (element !== null && element !== '' && element !== undefined) {
            url = url + key + '=' + element + '&'
          }
        }
      }
      url = url.slice(0, url.length - 1)
      return url
    }
});