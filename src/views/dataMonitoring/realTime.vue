<template>
    <div>
      <a-row :gutter="10">
          <a-col :span="span">
          <a-card size="small" bordered :title="false" class="map-card" >
            <div style="height: 80vh;width: 100%;" @mousewheel.prevent>
              <baidu-map class="map" :center="center" @ready="handler">
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
                <bm-scale anchor="BMAP_ANCHOR_BOTTOM_LEFT" />
                <bm-marker v-for="item in points" :key="item.id" :position="{lat: item.lat, lng: item.lng}" />
              </baidu-map>
            </div>
            <div class="map-btn" @click="closeMap"><a-icon v-if="!close" type="left" /><a-icon v-else type="right" /></div>
            <div v-if="close" class="mapMb"></div>
          </a-card>
        </a-col>
        <a-col :span="close?23:12">
          <a-card size="small" bordered :title="false">
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="10">
                  <a-col :md="6" :sm="8">
                    <a-form-item label="企业名称">
                      <a-input v-model="name" @change="nameChange" placeholder='企业名称'></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :md="10" :sm="8">
                    <a-form-item label="所属机构">
                      <a-tree-select
                        placeholder="所属机构"
                        :treeData="treeData"
                        allowClear
                        treeDefaultExpandAll
                        @change="jgChange"
                        v-model="organization"
                      >
                      </a-tree-select>
                    </a-form-item>
                  </a-col>
                  <a-col :md="6" :sm="8">
                    <a-form-item label="行业">
                      <a-cascader v-model="industry" :options="industrys" @change="hyChange" placeholder='行业' />
                    </a-form-item>
                  </a-col>
<!--                  <a-col :md="6" :sm="8">-->
<!--                    <a-form-item label="">-->
<!--                      <a-select defaultValue="lucy" v-model="queryParam.level">-->
<!--                        <a-select-option value="生产">生产</a-select-option>-->
<!--                        <a-select-option value="限产">限产</a-select-option>-->
<!--                        <a-select-option value="停产">停产</a-select-option>-->
<!--                      </a-select>-->
<!--                    </a-form-item>-->
<!--                  </a-col>-->
                </a-row>
              </a-form>
            </div>
            <a-table
              ref="table"
              size="middle"
              bordered
              rowKey="id"
              :columns="columns"
              :dataSource="dataSource"
              :scroll="{ x: 900}"
            >
              <template slot="entName" slot-scope="text, record">
                <template>
                  <span class="ent" @click="entDetails(record.entId)">{{ record.entName }}</span>
                </template>
              </template>
              <template slot="sczt" slot-scope="text, record">
                <template>
                  <a-tag color="green">生产</a-tag>
                </template>
              </template>
              <template slot="yczt" slot-scope="text, record">
                <template>
                  <a-tag color="green">正常</a-tag>
                </template>
              </template>
            </a-table>
          </a-card>
        </a-col>
      </a-row>
    </div>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import industrys from '@/assets/js/json-data2'
  import {queryOrgTreeList} from '@/api/api'

  export default {
    name: 'realTime',
    data(){
      return{
        span: 12,
        industry: [],
        organization: '',
        name: '',
        close: false,
        treeData: [],
        queryParam: {},
        industrys,
        center: '北京',
        BMap: null,
        baiduMap: null,
        points: [],
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
            title: '行政区域',
            dataIndex: 'organizationName',
          },
          {
            title: '企业',
            dataIndex: 'entName',
            scopedSlots: { customRender: 'entName' }
          },
          {
            title: '行业',
            dataIndex: 'industryName',
          }, {
            title: '生产状态',
            dataIndex: 'sczt',
            scopedSlots: { customRender: 'sczt' }
          },
          {
            title: '异常状态',
            dataIndex: 'yczt',
            scopedSlots: { customRender: 'yczt' }
          },
          {
            title: '产污监测点数量',
            dataIndex: 'productMonitorCount',
          }, {
            title: '治污监测点数量',
            dataIndex: 'grovernMonitorCount',
          },
          {
            title: '监测点数量（个）',
            children: [
              {
                title: '运行',
                dataIndex: 'normalMonitorCount',
                key: 'normalMonitorCount',
              },
              {
                title: '停机',
                dataIndex: 'haltMonitorCount',
                key: 'haltMonitorCount',
              },
              {
                title: '失联',
                dataIndex: 'offlineMonitorCount',
                key: 'offlineMonitorCount',
              },
            ],
          },
        ],
        dataSource: [],
      }
    },
    created() {
      this.getEntDataList()
      this.getList()
    },
    methods:{
      getList() {
        httpAction('/vEntMonitor/listEntInfo',{},'get').then(res => {
          const datas = res.result
          this.dataSource = datas
          datas.forEach(item =>{
            this.points.push({
              lat: item.latitude,
              lng: item.longitude
            })
          })
        })
      },
      jgChange(){
        const params = this.organization?this.organization:''
        const url = '/vEntMonitor/listEntInfo?orgCode='+params
        httpAction(url,{},'get').then(res => {
          const datas = res.result
          this.dataSource = datas
          this.points = []
          datas.forEach(item =>{
            this.points.push({
              lat: item.latitude,
              lng: item.longitude
            })
          })
        })
      },
      hyChange(){
        let url = '/vEntMonitor/listEntInfo?industry='+this.industry
        httpAction(url,{},'get').then(res => {
          const datas = res.result
          this.dataSource = datas
          this.points = []
          datas.forEach(item =>{
            this.points.push({
              lat: item.latitude,
              lng: item.longitude
            })
          })
        })
      },
      nameChange(){
        let url = '/vEntMonitor/listEntInfo?search='+this.name
        httpAction(url,{},'get').then(res => {
          const datas = res.result
          this.dataSource = datas
          this.points = []
          datas.forEach(item =>{
            this.points.push({
              lat: item.latitude,
              lng: item.longitude
            })
          })
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
          },2)
        }else {
          this.close = !this.close
          let t = setInterval(() =>{
            this.span++
            if(this.span === 12){
              clearInterval(t)
            }
          },2)
        }
      },
      entDetails(val){
        this.$router.push({path: '/dataMonitoring/entMonitor',query: {id: val}})
      },
      getEntDataList(){
        queryOrgTreeList().then(res => {
          this.treeData = res.result
        })
      },
      handler({ BMap, map }) {
        this.BMap = BMap
        this.baiduMap = map
        map.enableScrollWheelZoom(true)
        map.centerAndZoom(this.center, 6)
      },
    }
  }
</script>

<style lang="scss" scoped>
  .map-card{
    position: relative;
    .mapMb{
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.6);
    }
    .map-btn{
      position: absolute;
      right: 0;
      top: 49%;
      width: 25px;
      padding: 10px 0;
      background: #c5d0da;
      text-align: center;
      cursor: pointer;
      z-index: 9;
    }
  }

  .ent{
    color: #1890ff;
    background-color: transparent;
    outline: none;
    cursor: pointer;
  }
.map{
  width: 100%;
  height: 100%;
}
</style>