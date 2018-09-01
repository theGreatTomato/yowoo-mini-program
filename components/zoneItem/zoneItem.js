// components/zoneItem/zoneItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
      imgUrl:'../../img/3.png',
      name:'中华府',
      trafficDesc:'距5号线803米',
      productCount:10
  },
  attached:function() {
    console.log(this.properties.data,'this.properties.data')
    this.setData(this.properties.data)
  },
  methods: {
    click:function(e) {
      this.triggerEvent('onClick', e.currentTarget.id)
    }
  }
})
