
Component({
  properties: {
  },
  data: {
    indexArray: [0, 0, 0],
    rangeArray: []
  },
  d: [],
  attached: function () {
    let d = new Date()
    let dateArr = [],todayH = []
    let h = [
      '6点', '7点', '8点', '9点', '10点', '11点', '12点', '13点', '14点', '15点', '16点', '17点', '18点', '19点', '20点', '21点', '22点', '23点',
    ]
    let m = ['00','05','10','15','20','25','30','35','40','45','50','55']
    if (d.getHours() >= 22) {
      d.setDate(d.getDate() + 1)
      todayH = h
    }
    else if (d.getHours() <= 5) {
      todayH = h
    }
    else {
      let hourNow = d.getHours()
      console.log(hourNow,'hourNow')
      todayH = h.slice(hourNow - 5 ,h.length)
    }
    for(let i =0; i < 7; i++) {
      let item = this.translateMandD(d.getMonth(), d.getDate()) +'('+ this.translateW(d.getDay())+')'
      dateArr.push(item)
      d.setDate(d.getDate() + 1)
    }
    this.weekendRange = [dateArr, h, m]
    this.todayRange = [dateArr,todayH,m]
    this.setData({ rangeArray: this.todayRange })
  },
  methods: {
    translateW: function (w) {
       switch(w) {
        case 0:
           w = '周日'
          break
        case 1:
           w = '周一'
          break
        case 2:
           w = '周二'
          break
        case 3:
           w = '周三'
          break
        case 4:
           w = '周四'
          break
        case 5:
           w = '周五'
          break
        case 6:
          w = '周六'
          break
        default:
          break
      }
      return w
    },
    translateMandD:function(m,d) {
      return m+1+'-' + d
    },
    pickerChange:function(e) {
      if (e.detail.value[0] === 0) {
        this.setData({ rangeArray: this.todayRange })
      }
      else {
        this.setData({ rangeArray: this.weekendRange})
      }
      this.setData({ indexArray:e.detail.value})
      let timeval = '2018-' + this.data.rangeArray[0][this.data.indexArray[0]].match(/[0-9\-]+/) + ' '
      timeval = timeval + parseInt(this.data.rangeArray[1][this.data.indexArray[1]]) + ':'
      timeval = timeval + this.data.rangeArray[2][this.data.indexArray[2]] + ":00"
      this.triggerEvent("change", timeval)
    },
    click: function () {
      let timeval = '2018-' + this.data.rangeArray[0][this.data.indexArray[0]].match(/[0-9\-]+/) + ' '
      timeval = timeval + parseInt(this.data.rangeArray[1][this.data.indexArray[1]]) + ':'
      timeval = timeval + this.data.rangeArray[2][this.data.indexArray[2]] + ":00"
      this.triggerEvent("click", timeval)
    },
    cancel: function () {
      this.triggerEvent("cancel")
    }
  }
})
