// components/selectMore/selectMore.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  attached: function() {
  },
  data: {
    chaoXiangList: ['朝东', '朝西', '朝南', '朝北', '东南', '东南', '东南', '西北','南北'],
    chaoXiangVal:'',
    chuzuVal:'',
    diantiVal:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickChaoXiang:function (e) {
      const i = parseInt(e.currentTarget.id)
      let dataObj = {}
      let key = 'select'+i
      dataObj[key] = this.data[key] ? !this.data[key] : true
      this.setData(dataObj)
      //chaoXiangVal以 '012...'string形式存
      const hasVal = this.data.chaoXiangVal.indexOf(i+'')
      const cxVal = this.data.chaoXiangVal
      console.log('cxVal: ', cxVal, ' hasVal:',  hasVal)
      if (hasVal >= 0) {
        let newVal = cxVal.slice(0, hasVal) + cxVal.slice(hasVal + 1, cxVal.length)
        this.setData({ chaoXiangVal: newVal})
        console.log('newVal: ',newVal)
      }
      else {
        let newVal = cxVal + i;
        this.setData({ chaoXiangVal: newVal })        
        console.log('newVal: ',newVal)
      }
    },
    zhengzu:function() {
      this.setData({ chuzuVal:'整租'})
    },
    hezu: function () {
      this.setData({ chuzuVal: '合租' })
    },
    youdianti: function () {
      this.setData({ diantiVal: '有电梯' })
    },
    wudianti: function () {
      this.setData({ diantiVal: '无电梯' })
    },
    noLimitChaoXiang:function() {
      let dataObj = {}
      for(let i = 0; i < 9 ; i++) {
        let key = 'select'+i
        dataObj[key] = false
      }
      this.setData(dataObj)
      this.setData({ chaoXiangVal: '' })
    },
    noLimitChuzu: function() {
      this.setData({ chuzuVal: '' })      
    },
    noLimitDianti:function() {
      this.setData({ diantiVal: '' })            
    },
    resetting:function() {
      this.noLimitChuzu()
      this.noLimitChaoXiang()
      this.noLimitDianti()
    },
    formSubmit:function(e) {
      const id = (e.detail.target ? e.detail.target.id : '');
      app.addFormId(e.detail.formId, id);
      app.log(id)
      //传数据
      const cxList = this.data.chaoXiangList
      const chaoVal = this.data.chaoXiangVal
      if (!chaoVal && !this.data.diantiVal && !this.data.chuzuVal) {
        this.triggerEvent("handleSelectMore")
      }
      else {
        //把str的朝向变成array的朝向  格式为['向东','向西'...]
        const cxValArray = chaoVal.split('').map((val) => {
          return cxList[parseInt(val)]
        })
        const more = {
          chaoxiangArray: cxValArray,
          diantiVal:this.data.diantiVal,
          chuzuval: this.data.chuzuVal
        }
        this.triggerEvent("handleSelectMore", more)        

      }
    },
    cancel() {
      this.triggerEvent("handleSelectMore", 'cancel')              
    },
    none() {
    }
  }
})
