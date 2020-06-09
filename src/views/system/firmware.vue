<template>
  <!-- 用电量汇总 -->
  <div>
    <a-row :gutter="10">
      <a-col :span="span">
        <a-card :bordered="false" class="map-card" style="overflow:auto;" >
          <a-tree
            v-if="treeData.length&&!close"
            defaultExpandAll
            checkable
            :defaultSelectedKeys="defaultSelectedKeys"
            @check="onSelect" 
            :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }" 
            :treeData="treeData" />
          <div class="map-btn" @click="closeMap"><a-icon v-if="!close" type="left" /><a-icon v-else type="right" /></div>
          <div v-if="close" class="mapMb"></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getAction } from '@/api/manage';
import moment from 'moment';
export default {
  data() {
    return {
      span: 12,
      close: false,
      loading:false,
      defaultSelectedKeys:[],
      treeData: [],
      url: {
        list: '/vEntTotal/list',
      }
    };
  },
  mounted() {
    this.getTreeData();
  },
  methods: {
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
    moment,
    getTreeData() {
      getAction('/baseInstitution/queryAllTree', {}).then(res => {
        if (res.success) {
          this.treeData = res.result;
          this.initIsLeaf(this.treeData);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    //默认选中第一个企业
    selectFirst(list){
      if(list[0].children && list[0].children.length > 0){
        this.selectFirst(list[0].children)
      }else{
        this.queryParam.entId = list[0].value
      }
    },
    initIsLeaf(list) {
      for (let i = 0; i < list.length; i++) {
        list[i].isLeaf = list[i].isLeaf == 0 ? false : true;
        if (list[i].children && list[i].children.length > 0) {
          this.initIsLeaf(list[i].children);
        }
      }
    },
    // 左侧查询树形数据
    // onSearch(value) {},
    // 左侧选择树节点
    onSelect(value, e) {
      console.log(value)
      
      // if (e.node.eventKey == e.node.value) {
      //   this.queryParam.entId = e.node.value
      //   this.queryParam.orgCode = ''
      // } else {
      //   this.queryParam.entId = ''
      //   this.queryParam.orgCode = e.node.value
      // }
    },
  }
};
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
</style>
