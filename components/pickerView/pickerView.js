// components/pickerView/pickerView.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rangeArray:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    indexArray:[0],
    rangeArray:[]
  },
  attached:function() {
    this.setData({ rangeArray: this.properties.rangeArray })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    pickerChange: function (e) {
      console.log(e.detail.value)
      this.triggerEvent("change", e.detail.value)      
      this.setData({ indexArray:e.detail.value})
    },
    click:function() {
      this.triggerEvent("click", this.data.indexArray)
    },
    cancel: function () {
      this.triggerEvent("cancel")
    }
  }
})
