// components/zone/zone.js
const http = require('../../utils/http.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    metro:Array,
    district:Array
  },


  attached: function() {
    console.log('attached')
    console.log(this.properties.metro,'metro')
    const that = this
    if (this.properties.district.length > 0) {
      this.properties.district.map((val,i) => {
        http.get(`service/queryZone?distrctId=${val.districtId}`, res => {
          //console.log(res.data.data)
          let dataObj = this.data.districtArray
          dataObj[i].zoneArray = res.data.data;
          that.setData(dataObj)
        })
      })
    }
    this.setData({ districtArray:this.properties.district})
    if (this.properties.metro.length > 0) {
      this.setData({ metroArray: this.properties.metro })      
    }
  },
  data: {
    isSelectDistrict:true,
    col2All:true,
    isSelectMetro:false,
    metroArray:null,
    districtArray:null,
    zoneArray:null,
    selectDistrictIndex:null,
    selectMetroIndex:null,
    selectStationIndex:null,
    selectZoneIndex:null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectDistrict: function() {
      this.setData({
        isSelectDistrict:true,
        isSelectMetro: false,
        isSelectStation: false,
        selectDistrictIndex: null,
        selectMetroIndex: null,
        selectStationIndex: null,
        selectZoneIndex: null,               
      })
    },
    selectMetro:function() {
      this.setData({
        isSelectMetro: true,
        isSelectDistrict:false,
        isSelectZone:false,
        selectDistrictIndex: null,
        selectMetroIndex: null,
        selectStationIndex: null,
        selectZoneIndex: null,
      })
    },
    //选择哪个区
    selectDistrictNum: function(e) {
      const that = this 
      const index = e.currentTarget.id
      const zoneArray = that.data.districtArray[index].zoneArray      
      this.setData({ selectDistrictIndex: index, col2All: false, isSelectZone: true, zoneArray: zoneArray, col3All: false, selectZoneIndex: null, selectStationIndex: null, })
    },
    //选择哪条线
    selectMetroNum:function(e) {
      this.setData({ selectMetroIndex: e.currentTarget.id, col2All: false, isSelectStation: true, col3All: false, selectZoneIndex: null, selectStationIndex: null,  })
      //获取地铁站名
    },
    //点第二行的'全部'
    col2All:function() {
      console.log(this.data.districtArray)
      this.setData({ col2All: true, selectDistrictIndex: -1, selectMetroIndex:-1,zoneArray:[]})
      //相当于没选
      this.triggerEvent('handleSelectZone')
    },
    //点第三行的'全部'
    col3All:function() {
      this.setData({ col3All: true, selectZoneIndex: -1, selectStationIndex: -1 })
      //选中某条线路或某个区
      const distIndex = this.data.selectDistrictIndex
      if (distIndex !== null && distIndex.length > 0){
        let i = parseInt(distIndex)
        console.log(this.data.districtArray[i],'this.data.districtArray[i]')
        let data = {
          name:this.data.districtArray[i].districtName,
          lon:this.data.districtArray[i].lon,
          lat:this.data.districtArray[i].lat,
          type:'district'    
        }
        this.triggerEvent('handleSelectZone', data )       
      }
      else {
        this.triggerEvent('handleSelectZone')
      }
    },
    //具体某个商圈
    selectzonetNum:function(e) {
      const id = e.currentTarget.id
      const i = parseInt(id.slice(4,id.length))
      const dirt = this.data.districtArray
      const distIndex = this.data.selectDistrictIndex
      this.setData({ col3All: false, selectZoneIndex: id})
      let data = {
        name: dirt[distIndex].zoneArray[i].name,
        lon: dirt[distIndex].zoneArray[i].longitude,
        lat: dirt[distIndex].zoneArray[i].latitude,
        districtName: dirt[distIndex].districtName,
        type: 'zone'    
      }
      this.triggerEvent('handleSelectZone',  data)    
    },
    //具体某个站名
    selectStationNum:function(e) {
      const id = e.currentTarget.id 
      const i = parseInt(id.slice(7, id.length))
      const metro = this.data.metroArray
      const metroIndex = this.data.selectMetroIndex
      this.setData({ col3All: false, selectStationIndex: id, })  
      let data = {
        name: metro[metroIndex].subwayStationInfoList[i].name,
        lon: metro[metroIndex].subwayStationInfoList[i].longitude,
        lat: metro[metroIndex].subwayStationInfoList[i].latitude,
        type: 'traffic'    
      }
      this.triggerEvent('handleSelectZone', data)  
    }
  } 
})
