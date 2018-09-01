// components/toast/toast.js
const app = getApp();
const http = require('../../utils/http.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mode:String,
    text:String
  },

  /**
   * 组件的初始数据
   */
  attached:function() {
      console.log(this.properties.mode)
  },
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel:function() {
      //this.triggerEvent("cancel")    
    },
    formSubmit:function(e) {
      const id = (e.detail.target ? e.detail.target.id : '');
      this.triggerEvent("cancel",id)    
    }
  }
})
