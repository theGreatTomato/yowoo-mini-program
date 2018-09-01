// components/equipment/equipment.js
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
    firstRowData:[]
  },
  attached: function() {
    let data
    if (this.properties.data != null && Array.isArray(this.properties.data)) {
      data = this.properties.data.map((val, i) => {
        let className = ''
        switch (val) {
          case '床' : 
            className='chuang'
            break;
          case '衣柜':
            className = 'yigui'
            break;
          case '桌椅':
            className = 'zhuoyi'
            break;
          case '电视':
            className = 'dianshi'
            break;
          case '空调':
            className = 'kongtiao'
            break;
          case '热水器':
            className = 'reshuiqi'
            break;
          case '微波炉':
            className = 'weibolu'
            break;
          case '电冰箱':
            className = 'dianbingxiang'
          case '冰箱':
            className = 'dianbingxiang'
            break;
          case '洗衣机':
            className = 'xiyiji'
            break;
          case '灶具':
            className = 'meiqilu'
            break;
          case '沙发':
            className = 'shafa'
            break;
          case '抽油烟机':
            className = 'chouyouyanji'
            break;
          default:
            break;
        }
        return {
          index:i,
          name:val,
          className:className
        }
      })
    }
    let firstRowHaveData = false
    if(data.length > 10) {
      this.setData({ firstRowData: data.splice(0, 5)})
      firstRowHaveData = true      
    }
    if (data.length > 5) {
      if (firstRowHaveData) {
        this.setData({ secondRowData: data.splice(0, 5) })        
      }
      else {
        this.setData({ firstRowData: data.splice(0, 5) })        
      }
    }
    if(data.length < 5) {
      let len = data.length
      for (let i = 0; i < 5 - len ; i++) {
        data.push({})
      }
    }
    this.setData({data:data})
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
