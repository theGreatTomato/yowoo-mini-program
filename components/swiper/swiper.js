// components/swiper/swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectIndex:0,
    left: 0
  },
  attached: function() {
    console.log(this.properties)
    console.log('aaa')
    this.setData({ imgUrls:this.properties.data })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    change: function(e) {
      this.setData({ selectIndex: e.detail.current, left: e.detail.current*100+'%'})
    }
  }
})
