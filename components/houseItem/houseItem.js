// components/zoneItem/zoneItem.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      data:Object
    },
    attached:function() {
      let data = this.properties.data;
      let renterType = data.renterType === 1 ? '整租' :'合租'
      let area = data.area ? data.area :'' 
      console.log(data,'data,data')
      let imgUrl = data.imgUrl ? data.imgUrl : '../../img/3.png'
      let orientation;
      switch (data.orientation) {
        case 1:
          orientation ='朝东'
          break
        case 2:
          orientation = '朝西'
          break
        case 3:
          orientation = '朝南'
          break
        case 4:
          orientation = '朝北'
          break
        case 14:
          orientation = '东北'
          break
        case 13:
          orientation = '东南'
          break
        case 24:
          orientation = '西北'
          break
        case 23:
          orientation = '西南'
          break
        case 66:
          orientation = '南北通'
          break
        default:
          orientation = null
          break
      }
      let info = renterType 
      if(orientation != undefined || orientation != null) {
        info = info + " | " + orientation
      }
      if(area !== '') {
        this.setData({hasArea : true})
        info = info + " | " + area + "m"
      }
      let waiterInfo = ''
      if (data.houseResourceType === 1) {
        waiterInfo = '物业管家：' + data.waiterName
      }
      else if (data.houseResourceType === 2) {
        waiterInfo = '公寓管家：' + data.waiterName
      }
      else {
        waiterInfo = '真实租客转租'
      }
      this.setData({ 
                     houseResourceType: data.houseResourceType,
                     estateName: data.estateName, 
                     waiterInfo: waiterInfo, 
                     price: data.price, 
                     info:info,
                     id:data.id,
                     imgUrl:imgUrl,
                     houseName:data.houseName})
    },
    data: {
        imgUrl: '../../img/3.png',
        estateName: '中华府',
        info: '整租 | 朝南 | 23m'
    },

    methods: {
      click:function(e) {
        this.triggerEvent('click', e.currentTarget.id)
      }
    }
})

