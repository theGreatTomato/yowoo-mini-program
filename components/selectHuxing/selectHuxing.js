// components/selectHuxing/selectHuxing.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    HuxingArray:['不限','单间','一室一厅','二室一厅','三室一厅','三室两厅','四室两厅','五室两厅'],        
    selectIndex: 0

  },

  /**
   * 组件的方法列表
   */
  methods: {
    click:function(e) {
      const i = parseInt(e.currentTarget.id)
      this.setData({selectIndex:i})
      if(i === 0) {
        this.triggerEvent("handleSelectHuxing")        
      }
      else{
        this.triggerEvent("handleSelectHuxing", this.data.HuxingArray[i])        
      }
    },
    none:function() {
      console.log('none')
    },
    cancel: function() {
      this.triggerEvent("handleSelectHuxing", 'cancel')      
    }
  }
})
