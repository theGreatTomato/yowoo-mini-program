// components/pickerView/pickerView.js
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
    indexArray: [0,0,0],
    rangeArray: []
  },
  d:[],
  attached: function () {
    let y = [2018], m = [] ,d= []
    let date = new Date()
    for (let i = date.getMonth() + 1; i < 13; i++) {
      m.push(i)
    }
    for (let i = date.getDate(); i < 31; i++) {
      d.push(i)
    }
    let timeRange = [y, m, d]
    this.d = d
    console.log(timeRange)
    this.setData({ rangeArray: timeRange })
  },
  methods: {
    getDate:function(m) {
      let data = [] 
      console.log(m)
      if (m === 7 || m === 8 || m === 10 || m ===12) {
        for (var i = 0 ;i < 31 ; i ++) {
          data.push(i+1)
        }
      }
      else {
        console.log('11')
        for (var i = 0; i < 30; i++) {
          data.push(i+1)
        }
      }
      return data
    },  
    pickerChange: function (e) {
      console.log(e.detail.value[1],this.data.indexArray[1])
      if (e.detail.value[1] === 0) { //月份回到本月
        this.setData({ 'rangeArray[2]': this.d })
      }
      else if (e.detail.value[1] !== this.data.indexArray[1] ){//月份改变
        console.log('change month')
        var date = this.getDate(this.data.rangeArray[1][e.detail.value[1]])
        this.setData({ 'rangeArray[2]': date})
      }
      var timeval = '2018-' + this.data.rangeArray[1][e.detail.value[1]]
      timeval = timeval + '-' +  this.data.rangeArray[2][e.detail.value[2]]
      console.log(timeval)
      this.setData({ indexArray: e.detail.value })
      this.triggerEvent("change", timeval)
    },
    click: function () {
      var timeval = '2018-' + this.data.rangeArray[1][this.data.indexArray[1]]
      timeval = timeval + '-' + this.data.rangeArray[2][this.data.indexArray[2]]
      this.triggerEvent("click", timeval)
    },
    cancel: function () {
      this.triggerEvent("cancel")
    }
  }
})
