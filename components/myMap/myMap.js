// components/myMap/myMap.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lat:Number,
    lon:Number
  },
  attached: function() {
    console.log(this.properties,'this.properties')
    const lat = this.properties.lat
    const lon = this.properties.lon
    const circles = [
      {
        latitude: lat,
        longitude: lon,
        color: '#fe5f5f',
        fillColor: '#fe5f5f',
        radius: 8,
      },
      {
        latitude: lat,
        longitude: lon,
        color: '#fe5f5f',
        fillColor: '#00000000',
        radius: 65,
        strokeWidth: 1
      }
    ]
    this.setData({ circles: circles,lon:lon,lat:lat })
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
