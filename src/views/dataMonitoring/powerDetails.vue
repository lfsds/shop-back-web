<template>
  <div>
    <a-row :gutter="10">
      <a-col :span="span">
        <a-card size="small" bordered :title="false" style="overflow-x: hidden;
        overflow-y: scroll;" class="map-card" >
          <a-tree
            v-if="treeData&&!close"
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :defaultExpandedKeys="defaultExpandedKeys"
            v-model="checkedKeys"
            :selectedKeys="selectedKeys"
            @select="onSelect"
            :treeData="treeData"
          />
          <div class="map-btn" @click="closeMap"><a-icon v-if="!close" type="left" /><a-icon v-else type="right" /></div>
          <div v-if="close" class="mapMb"></div>
        </a-card>
      </a-col>
      <a-col :span="close?23:20">
        <a-card size="small" bordered :title="false">
          <div class="title">
            <div class="jcd">监测点名称：<a-tag v-if="jcdName" color="cyan">{{jcdName}}</a-tag></div>
            <a-date-picker style="margin-bottom: 10px" @change="timeChange" />
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
            dataIndex: 'name',
          },
          {
            title: '时间',
            dataIndex: 'time',
          },
          {
            title: 'Ua(V)',
            dataIndex: 'Ua',
          }, {
            title: 'Ub(V)',
            dataIndex: 'Ub',
          },
          {
            title: 'Uc(V)',
            dataIndex: 'Uc',
          },
          {
            title: 'Ia(A)',
            dataIndex: 'Ia',
          }, {
            title: 'Ib(A)',
            dataIndex: 'Ib',
          },
          {
            title: 'Ic(A)',
            dataIndex: 'Ic',
          },
          {
            title: 'Pt(kW)',
            dataIndex: 'Pt',
          }, {
            title: 'Ept(KWH)',
            dataIndex: 'Ept',
          },
        ],
        dataSource: [],
        treeData: [],
        expandedKeys: [],
        checkedKeys: [],
        autoExpandParent: true,
        allKeys:[],
        selectedKeys: [],
        defaultExpandedKeys: [],
        span: 4,
        close: false,
        jcdId:'',
      }
    },
    created() {
      let url = "/baseInstitution/queryAllTree"
      httpAction(url,{},"get").then((res)=>{
        if(res.success){
          this.treeData = this.changeField(res.result)
          this.expandedKeys = this.allKeys
        }})
    },
    methods:{
      timeChange(val1, val2){
        console.log(val2)
        if (this.jcdId){
          let url = "/vEntDevice/getDetailDeviceById?id=" + this.jcdId + '&queryTime=' + val2
          httpAction(url,{},"get").then((res)=>{
            if(res.success){
              console.log(res)
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
        console.log('onExpand', expandedKeys)
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      },

      onCheck (checkedKeys) {
        // console.log('onCheck', checkedKeys)
        this.checkedKeys = checkedKeys
      },
      onSelect (checkedKeys, e) {
        this.jcdName = e.selectedNodes[0].data.props.title
        this.jcdId = checkedKeys[0]
        let url = "/vEntDevice/getDetailDeviceById?id=" + checkedKeys[0]
        httpAction(url,{},"get").then((res)=>{
          if(res.success){
            this.dataSource = res.result
          }})
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
            if(this.span === 4){
              clearInterval(t)
            }
          },2)
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .map-card{
    height: calc(100vh - 150px);
    /*min-height: calc(100vh - 84px);*/
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


</style>