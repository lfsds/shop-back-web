<template>
  <div class="entMonior">
    <a-row :gutter="10">
      <a-col :span="span" class="map-card" >
        <a-card class="treeData" size="small" bordered :title="false" style="overflow: auto;">
          <a-tree
            v-if="treeData&&!close"
            selectable
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            @select="onSelect"
            :treeData="treeData"
          />
        </a-card>
        <div class="map-btn" @click="closeMap"><a-icon v-if="!close" type="left" /><a-icon v-else type="right" /></div>
        <div v-if="close" class="mapMb"></div>
      </a-col>
      <a-col :span="close?23:20">
        <a-card size="small" bordered :title="false" v-if="tabsShow">
          <a-card size="small" bordered :title="false" style="margin-bottom: 20px">
            <div style="font-size: 14px;font-weight: 600;margin-bottom: 10px ">{{ name }}</div>
            <div class="info"><span class="label">地址</span><span class="value">{{dz}}</span><span class="label">所属行业</span><span class="value">{{sshy}}</span></div>
            <div class="info"><span class="label">企业负责人</span><span class="value">暂无数据</span><span class="label">产污监测点</span><span class="value">{{cw}}</span></div>
            <div class="info"><span class="label">电气负责人</span><span class="value">暂无数据</span><span class="label">污处监测点</span><span class="value">{{wc}}</span></div>
            <div class="info"><span class="label">安环负责人</span><span class="value">暂无数据</span><span class="label">监测点</span><span class="value">{{jcd}}</span></div>
          </a-card>
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :scroll="{ x: 900}"
          >
          </a-table>
        </a-card>
        <div class="card-container">
          <a-tabs type="card">
            <a-tab-pane tab="实时数据" key="1">
              <div class="mqtt" v-if="!tabsShow">
                <div class="title">
                  <span class="status">当前状态:</span>
                  <span class="time">数据更新时间:</span>
                </div>
                <div class="items">
                  <div class="item">
                    <div class="left loadPic">
                      <img src="../../../public/static/img/loadPic.png" alt="">
                      <span>电压</span>
                    </div>
                    <div class="right loadPic">
                      <span>A相电压:0V</span>
                      <span>B相电压:0V</span>
                      <span>C相电压:0V</span>
                    </div>
                  </div>
                  <div class="item">
                    <div class="left powerPic">
                      <img src="../../../public/static/img/powerPic.png" alt="">
                      <span>功率</span>
                    </div>
                    <div class="right powerPic">
                      <span>有功功率:0kw</span>
                      <span>无功功率:0kVar</span>
                      <span>功率因数:0</span>
                    </div>
                  </div>
                  <div class="item">
                    <div class="left amperePic">
                      <img src="../../../public/static/img/amperePic.png" alt="">
                      <span>电流</span>
                    </div>
                    <div class="right amperePic">
                      <span>A相电流:0A</span>
                      <span>B相电流:0A</span>
                      <span>C相电流:0A</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="query" style="position: absolute;right: 0;top: 5px;">
                  时间间隔(分):
                  <a-select v-model="queryParam.interval" style="width:80px;margin-right: 20px;" @change="changeInterval">
                    <a-select-option value="15">15</a-select-option>
                    <a-select-option value="30">30</a-select-option>
                    <a-select-option value="45">45</a-select-option>
                  </a-select>
                  时间:
                  <a-date-picker 
                    @change="onChange" 
                    style="width: 120px"
                    :format="format"
                    v-model="date"
                    :mode="mode"
                    :allowClear="false"
                    />
              </div>
              <div class="echarts" style="background: #fff;">
                <div id="lineEcharts1" v-show="lineEcharts1Show" style="height: 300px;"></div>
                <div v-show="!lineEcharts1Show" style="height: 300px;display: flex;justify-content: center;align-items: center;" >暂无数据</div>
                <div id="lineEcharts2" v-show="lineEcharts2Show" style="height: 300px;"></div>
                <div v-show="!lineEcharts1Show" style="height: 300px;display: flex;justify-content: center;align-items: center;" >暂无数据</div>
              </div>
              <div class="more">
                <div class="title">
                  <span>如需查看更多参数图表,请点击右侧更多参数按钮</span>
                  <a-select v-model="queryParam.more" @change="changeMore">
                    <a-select-option value="0">更多参数</a-select-option>
                    <a-select-option value="1">电流</a-select-option>
                    <a-select-option value="2">电压</a-select-option>
                  </a-select>
                </div>
                <div class="echart" v-if="isMoreShow" >
                  <div id="moreEcharts">111</div>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import industrys from '@/assets/js/json-data2'
  import {queryOrgTreeList} from '@/api/api'
  import echarts from 'echarts';
  import moment from 'moment';
  import mqtt from "mqtt"
  var client
  export default {
    name: 'realTime',
    data(){
      return{
        name:'',
        dz: '',
        sshy: '',
        cw: '',
        wc: '',
        jcd: '',
        jcdName: '',
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:70,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title: '监测点名称',
            dataIndex: 'device_name',
          },
          {
            title: '类别',
            dataIndex: 'device_type',
          },
          {
            title: '状态',
            dataIndex: 'device_status',
          },
          {
            title: '功率启停阈值',
            dataIndex: 'threshold',
          },
        ],
        dataSource: [],
        treeData: [],
        expandedKeys: [],
        autoExpandParent: true,
        allKeys:[],
        selectedKeys: [],
        defaultExpandedKeys: [],
        span: 4,
        close: false,
        jcdId:'',
        // echarts
        tabsShow:true,
        queryParam:{
          date:moment(new Date()).format('YYYY-MM-DD'),
          interval:'15',
          equipmentId:'',
          more:'0'
        },
        date:moment(new Date()),
        mode:'date',
        format:'YYYY-MM-DD',
        lineEcharts1Show:true,
        lineEcharts2Show:true,
        // 更多参数
        isMoreShow:false,
        option:{
          color: ['#ff7f50'],
          title:{
            text:"111",
            textStyle:{
              fontSize:12
            },
            right:20,
            top:20
          },
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
              type: 'category',
              data: [],
              axisLine:{
                  lineStyle:{
                      color:"#48b",
                      width:2
                  }
              },
              axisLabel:{
                  color:"#000",
                  formatter :function(params){
                    return moment(params).format('HH:mm')
                  }
              },
              splitLine:{
                  show:true
              }
          },
          yAxis: {
              type : 'value',
              name:"电量 (kWh)",
              nameTextStyle:{
                  color:"#4488bb"
              },
              axisTick: {
                  show:false
              },
              axisLine:{
                  lineStyle:{
                      color:"#48b",
                      width:2
                  }
              },
              axisLabel:{
                  color:"#000"
              },
              splitLine:{
                  show:true
              }
          },
          dataZoom: [
            {
              type: 'inside'
            }
          ],
          series: [{
              data: [],
              type: 'bar',
              areaStyle: {}
          }]
        },
        option1:{
          color: ['#ff7f50'],
          title:{
            text:"111",
            textStyle:{
              fontSize:12
            },
            right:20,
            top:20
          },
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
              type: 'category',
              data: [],
              axisLine:{
                  lineStyle:{
                      color:"#48b",
                      width:2
                  }
              },
              axisLabel:{
                  color:"#000",
                  formatter :function(params){
                    return moment(params).format('HH:mm')
                  }
              },
              splitLine:{
                  show:true
              }
          },
          yAxis: {
              type : 'value',
              name:"电量 (kWh)",
              nameTextStyle:{
                  color:"#4488bb"
              },
              axisTick: {
                  show:false
              },
              axisLine:{
                  lineStyle:{
                      color:"#48b",
                      width:2
                  }
              },
              axisLabel:{
                  color:"#000"
              },
              splitLine:{
                  show:true
              }
          },
          dataZoom: [
            {
              type: 'inside'
            }
          ],
          series: [{
              data: [],
              type: 'line',
              areaStyle: {}
          },{
              data: [],
              type: 'line',
              areaStyle: {}
          },{
              data: [],
              type: 'line',
              areaStyle: {}
          }]
        },
        // 链接mqtt获取实时数据
        time:'',
        snList:[
          {sn:'Ia',unit:'A',name:'电流A相',value:''},
          {sn:'Ib',unit:'A',name:'电流B相',value:''},
          {sn:'Ic',unit:'A',name:'电流C相',value:''},
          {sn:'Pt',unit:'kW',name:'总有功',value:''},
          {sn:'Ept',unit:'kWh',name:'总正向有功',value:''},
          {sn:'Ua',unit:'V',name:'电压A相',value:''},
          {sn:'Ub',unit:'V',name:'电压B相',value:''},
          {sn:'Uc',unit:'V',name:'电压C相',value:''},
          {sn:'RS',unit:'',name:'设备运行状态',value:''},
        ]
      }
    },
    created() {
      this.init()
    },
    mounted() {
      this.getEchartsData()
    },
    methods:{
      moment,
      init(){
        if(this.$route.query.id){
          const url1 = "/vEntDevice/getEntDeviceById?entId=" + this.$route.query.id
          httpAction(url1,{},"get").then((res)=>{
            if(res.success){
              const datas = res.result
              this.name = datas.name
              this.dz = datas.address?datas.address:'暂无数据'
              this.sshy = datas.industry?datas.industry:'暂无数据'
              this.cw = datas.pCount
              this.wc = datas.cCount
              this.jcd = datas.tCount
              this.dataSource = res.result.monitorList
            }
          })
        }
        let url = "/baseEnterprise/queryAllTree"
        getAction(url,{
          id:this.$route.query.id
        }).then((res)=>{
          if(res.success){
            this.treeData = this.changeField(res.result)
            this.expandedKeys = this.allKeys
          }
        })
      },
      // 获取折线图数据
      getEchartsData(){
        getAction('/vEntDevice/getEntCurves',{
          enterpriseId:this.$route.query.id,
          date:this.queryParam.date,
          equipmentId:this.queryParam.equipmentId,
          interval:this.queryParam.interval,
          type:this.queryParam.more
        }).then((res)=>{
          if(res.success){
            // 功率
            if(res.result.ratePeakList && res.result.ratePeakList.length>0){
              this.lineEcharts1Show = true
              this.option.series[0].type = 'line'
              for (let i = 0; i < res.result.ratePeakList.length; i++) {
                this.option.xAxis.data[i] = res.result.ratePeakList[i].time
                this.option.series[0].data[i] = this.toFixed3(res.result.ratePeakList[i].value)
              }
              this.setEcharts(true,'lineEcharts1',1)
            }else{
              this.lineEcharts1Show = false
            }
            // 电量
            if(res.result.curveList && res.result.curveList.length>0){
              this.lineEcharts2Show = true
              this.option.series[0].type = 'bar'
              for (let i = 0; i < res.result.ratePeakList.length; i++) {
                this.option.xAxis.data[i] = res.result.ratePeakList[i].time
                this.option.series[0].data[i] = this.toFixed3(res.result.ratePeakList[i].value)
              }
              this.setEcharts(true,'lineEcharts2',2)
            }else{
              this.lineEcharts2Show = false
            }
            // 更多参数
            if(this.queryParam.more != 0){
              if(res.result.moreA && res.result.moreA.length>0){
                for (let i = 0; i < res.result.moreA.length; i++) {
                  this.option1.xAxis.data[i] = res.result.moreA[i].time
                  this.option1.series[0].data[i] = this.toFixed3(res.result.moreA[i].value)
                }
              }else{
                this.option1.xAxis.data = []
                this.option1.series[0].data = []
              }
              if(res.result.moreB && res.result.moreB.length>0){
                for (let i = 0; i < res.result.moreB.length; i++) {
                  this.option1.xAxis.data[i] = res.result.moreB[i].time
                  this.option1.series[1].data[i] = this.toFixed3(res.result.moreB[i].value)
                }
              }else{
                this.option1.xAxis.data = []
                this.option1.series[0].data = []
              }
              if(res.result.moreC && res.result.moreC.length>0){
                for (let i = 0; i < res.result.moreC.length; i++) {
                  this.option1.xAxis.data[i] = res.result.moreC[i].time
                  this.option1.series[2].data[i] = this.toFixed3(res.result.moreC[i].value)
                }
              }else{
                this.option1.xAxis.data = []
                this.option1.series[0].data = []
              }
              this.setEcharts(true,'moreEcharts',3)
            }
            
          }
        })
      },
      // 渲染折线图
      setEcharts(type,id,status){
        this.$nextTick(function(){
          if(status == 1){
            this.option.series[0].type = 'line'
            this.option.yAxis.name = '单位:(kw)'
            this.option.title.text = '功率曲线'
          }else if(status == 2){
            this.option.series[0].type = 'bar'
            this.option.yAxis.name = '单位:(kw·h)'
            this.option.title.text = '周期电量详情'
          }else{
            if(this.queryParam.more == 1){
              this.option1.yAxis.name = '电流:(A)'
              this.option1.title.text = '电流曲线'
              this.option1.series[0].name = '电流A'
              this.option1.series[1].name = '电流B'
              this.option1.series[2].name = '电流C'
            }else{
              this.option1.yAxis.name = '电压:(V)'
              this.option1.title.text = '电压曲线'
              this.option1.series[0].name = '电压A'
              this.option1.series[1].name = '电压B'
              this.option1.series[2].name = '电压C'
            }
          }
          let echartsLine = echarts.init(document.getElementById(id))
          echartsLine.clear()
          if(type){
            if(status == 3){
              echartsLine.setOption(this.option1,true);
            }else{
              echartsLine.setOption(this.option,true);
            }
            echartsLine.hideLoading()
          }else{
            echartsLine.showLoading({
                text: '暂无数据',
                color: '#ffffff',
                textColor: '#8a8e91',
                maskColor: 'rgba(255, 255, 255, 0.8)',
            });
          }
        })
      },
      timeChange(val1, val2){
        if (this.jcdId){
          let url = "/vEntDevice/getDetailDeviceById?id=" + this.jcdId + '&queryTime=' + val2
          httpAction(url,{},"get").then((res)=>{
            if(res.success){
              this.dataSource = res.result
            }})
        }
      },
      changeField(vals){
        let res = []
        vals.forEach(val =>{
          this.allKeys.push(val.key)
          if(val.children && val.children.length > 0){
            val.isLeaf=false
            val.children = this.changeField(val.children)
          }else {
            val.isLeaf=true
          }
          res.push(val)
        })
        return res
      },
      // 树形控件相关方法
      onExpand (expandedKeys) {
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      },
      // 选择树节点
      onSelect (checkedKeys, e) {
        if(e.node.isLeaf){
          this.tabsShow = false
        }else{
          this.tabsShow = true
        }
        this.queryParam.equipmentId = checkedKeys[0]
        this.getEchartsData()
      },
      // mqtt
      mqtt(){
        client  = mqtt.connect('ws://172.16.6.201:9002/mqtt')
          client.on('connect', function () {
            for (let i = 0; i < self.snList.length; i++) {
              client.subscribe(`/data/${record.mnNo}-${record.monitorNo}-${self.snList[i].sn}`, function (err) {
                if (!err) {
                  client.publish('presence', 'Hello mqtt')
                }
              })
            }
            
          })
          client.on('message', function (topic, message) {
          self.time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            let sn = topic.split('-')
            for (let i = 0; i < self.snList.length; i++) {
              if(sn[2] == self.snList[i].sn){
                self.snList[i].value = message.toString()
              }
            }
          })
      },
      closeMap(){
        if(!this.close){
          this.close = !this.close
          let t = setInterval(() =>{
            this.span--
            if(this.span === 1){
              clearInterval(t)
            }
          },20)
        }else {
          this.close = !this.close
          let t = setInterval(() =>{
            this.span++
            if(this.span === 4){
              clearInterval(t)
            }
          },20)
        }
      },
      changeInterval(){
        this.getEchartsData()
      },
      // 选择时间
      onChange(value){
        this.queryParam.date = moment(value).format(this.format)
        this.getEchartsData()
      },
      // 更多参数
      changeMore(){
        if(this.queryParam.more == 0){
          this.isMoreShow = false
        }else{
          this.isMoreShow = true
        }
        this.getEchartsData()
      },
      toFixed3(value){
        return Number(value).toFixed(3)
      }
    }
  }
</script>

<style lang="scss">
  .info{
    margin-top: 5px;
    span{
      display: inline-block;
      padding: 6px 10px;
    }
    .label{
      width: 20%;
      background: #d0d9e5;
    }
    .value{
      width: 30%;
      background: #e0e5ec;
    }
  }
  .map-card{
    height: calc(100vh - 150px);
    // min-height: calc(100vh - 84px);
    position: relative;
    .treeData{
      height: 100%;
    }
    .mapMb{
      position: absolute;
      right: 5px;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.6);
    }
    .map-btn{
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
      width: 25px;
      padding: 10px 0;
      background: #c5d0da;
      text-align: center;
      cursor: pointer;
      z-index: 9;
    }
  }
  .title{
    text-align: right;
    .jcd{
      width: calc(100% - 180px);
      display: inline-block;
      text-align: left;
      >span{
        display: inline-block;
      }
    }
  }
  .entMonior .card-container {
    overflow: hidden;
    margin-top: 20px;
  }
  .entMonior .card-container > .ant-tabs-card > .ant-tabs-content {
    margin-top: -16px;
  }
  .entMonior .card-container > .ant-tabs-card > .ant-tabs-bar {
    border-color: #fff;
  }
  .entMonior .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
    border-color: transparent;
    background: transparent;
  }
  .entMonior .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
    border-color: #fff;
    background: #fff;
  }
  .entMonior {
    .mqtt{
      padding: 20px 0;
      .title{
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .items{
        display: flex;
        justify-content: flex-start;
        .item{
          width: 260px;
          min-width: 200px;
          margin-right: 30px;
          display: flex;
          justify-content: space-between;
          .left{
            width: 30%;
            padding: 5px;
            color: #fff;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            &.loadPic{
              background: #57BD33;
            }
            &.powerPic{
              background: #DBB428;
            }
            &.amperePic{
              background: #AA65D2;
            }
          }
          .right{
            width: 70%;
            padding-left: 12px;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            &.loadPic{
              background: #E4EDE8;
            }
            &.powerPic{
              background: #EEEDE9;
            }
            &.amperePic{
              background: #EBE7F5;
            }
          }
        }
      }
    }
    .more{
      background: #fff;
      .title{
        padding: 10px 20px;
        margin-bottom: 20px;
        background: #d0d9e5;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      #moreEcharts{
        height:300px ;
      }
    }
  }
</style>