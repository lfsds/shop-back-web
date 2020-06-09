<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="时间"><a-range-picker @change="onChange" style="width: 100%" :format="format" :value="value" :mode="mode" /></a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="行政区域">
              <a-tree-select
                allowClear
                v-model="queryParam.orgCode" 
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" 
                :treeData="treeData" 
                treeDefaultExpandAll
                placeholder="请选择行政区域名称" 
                @change="changeTree">
              </a-tree-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="企业名称"><a-input placeholder="请输入企业名称" v-model="queryParam.entName" allowClear></a-input></a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="设备名称"><a-input placeholder="请输入设备名称" v-model="queryParam.facilityName" allowClear></a-input></a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="监测点名称"><a-input placeholder="请输入监测点名称" v-model="queryParam.monitorName" allowClear></a-input></a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="事件类型">
                <a-select
                  showSearch
                  placeholder="请选择事件类型"
                  optionFilterProp="children"
                  v-model="queryParam.exceptType"
                  allowClear
                >
                  <a-select-option value="3">功率越限</a-select-option>
                  <a-select-option value="4">电流越限</a-select-option>
                  <a-select-option value="5">电压越限</a-select-option>
                  <a-select-option value="6">用电量报警</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="网关编号"><a-input placeholder="请输入网关编号" v-model="queryParam.mnCode" allowClear></a-input></a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="search" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="examine">
        <div class="examineCheck">
          <a-checkbox-group @change="onChangeCheck" v-model="check">
            <a-checkbox v-for="( item,index ) in checkList" :key="index" :class="'abnormal'+index" :value="index+1">{{ item }}</a-checkbox>
          </a-checkbox-group>
        </div>
        <div class="img">
          <img src="../../../public/static/img/liucheng.png" alt="">
        </div>
      </div>
      <div class="examineList">
        <div class="title">异常查询列表</div>
        <a-spin :spinning="loading">
          <div class="list">
            <div class="item" v-for="(item,index) in examineList" :key="index">
              <div class="left">
                <div class="name">
                  <span class="company">{{ item.monitorName }}</span>
                  <span class="address">{{ item.entName }}</span>
                  <span class="event">{{ item.exceptType }}</span>
                </div>
                <div class="type">
                  <span>{{ item.exceptReason }}</span>
                </div>
                <div class="time">
                  <span>{{ item.inspectTime }}</span>
                </div>
              </div>
              <div class="right">
                <div class="type" :class="'abnormal'+item.exceptStatus">
                  {{ item.exceptStatus | isStatus }}
                </div>
                <div class="handle">
                  <span class="data" @click="handleData(item.id)">
                    <a-icon type="file-done" />
                    运行数据
                  </span>
                  <span class="detail" @click="goDetail(item.id)">
                    <a-icon type="file-exclamation" />
                    查看详情
                  </span>
                </div>
              </div>
            </div>
          </div>
        </a-spin>
      </div>
      <div class="pagination">
        <a-pagination 
          showSizeChanger
          v-model="page"
          :showTotal="total => `共 ${total} 条数据`"
          :pageSize.sync="pageSize"
          :total="total"
          @change="changeTableData"
          @showSizeChange="showSizeChange"/>
      </div>
    </div>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <query-modal v-if="modalShow" ref="modalForm" @ok="modalFormOk"></query-modal>
  </a-card>
</template>

<script>
import { ListMixin } from '@/mixins/ListMixin';
import { getAction} from '@/api/manage'
import moment from 'moment';
import QueryModal from './components/entQueryList';
export default {
  mixins: [ListMixin],
  components: {
    QueryModal
  },
  data() {
    return {
      modalShow:false,
      loading:false,
      form: this.$form.createForm(this, { name: 'query' }),
      queryParam:{
        deptId:'',
        startDate:'',
        endDate:'',
        entName:'',
        shopName:'',
        deviceName:'',
        pointName:'',
        eventType:'',
        gateway:'',
      },
      check:[1,2,3,4,5,6],
      // 时间
      mode: ['date', 'date'],
      format: 'YYYY-MM-DD',
      value: [],
      // 行政区域
      treeData:[],
      checkList:['未处理','已处理未申报','已申报未审核','审核通过','审核未通过','已处理(不需要申报)'],
      // 分页
      page:1,
      pageSize:10,
      total: 10,
      examineList:[]
    };
  },
  created() {
    this.getTreeData()
  },
  mounted() {
    this.loadData()
  },
  methods: {
    moment,
    // 获取数据
    loadData(){
      this.loading = true
      this.queryParam = Object.assign(this.queryParam, {
        pageNo:this.page,
        pageSize:this.pageSize,
        status:this.check.join()
      });
      getAction('/serEntException/list',this.queryParam).then((res) =>{
        this.loading = false
        if(res.success){
          this.examineList = res.result.records
          this.total = res.result.total
        }else{
          this.$message.warning(res.message);
        }
      })
    },
    search(){
      this.loadData();
    },
    searchReset(){
     this.queryParam = {}
     // this.loadData(1);
    },
    // 选择时间
    onChange(value) {
      this.value = value;
      if (value.length > 0) {
        this.queryParam.startDay = moment(value[0]).format(this.format);
        this.queryParam.endDay = moment(value[1]).format(this.format);
      } else {
        this.queryParam.startDay = '';
        this.queryParam.endDay = '';
      }
    },
    // 获取行政区域树形下拉结构
    getTreeData(){
      getAction('/baseInstitution/queryTreeList',{}).then((res) =>{
        if(res.success){
          this.treeData = res.result
          this.initIsLeaf(this.treeData)
        }else{
          this.$message.warning(res.message);
        }
      })
    },
    initIsLeaf(list){
      for (let i = 0; i < list.length; i++) {
        list[i].isLeaf = list[i].isLeaf == 0 ? false : true
        if (list[i].children && list[i].children.length > 0) {
          this.initIsLeaf(list[i].children)
        }
      }
    },
    changeTree(value, label, extra){
      console.log(value)
      console.log(label)
      console.log(extra)
    },
    // 审核多选
    onChangeCheck(checkedValue){
      this.check = checkedValue
      this.loadData()
    },
    // 分页
    changeTableData(page,pageSize){
      this.loadData()
    },
    showSizeChange(current,size){
      this.loadData()
    },
    //运行数据
    handleData(id){
      // 进入企业监控页面
      console.log(id)
    },
    goDetail(id){
      this.modalShow = true
      this.$nextTick(function(){
        this.$refs.modalForm.init(id)
      })
    }
  },
  filters: {
    isStatus: function(value) {
      if(value == 1){
        return '未处理';
      }else if(value == 2){
        return '已处理未申报';
      }else if(value == 3){
        return '已申报未审核';
      }else if(value == 4){
        return '审核通过';
      }else if(value == 5){
        return '审核未通过';
      }else if(value == 6){
        return '已处理(不需要申报)';
      }
    }
  }
};
</script>
<style lang="scss">
@import '~@assets/less/common.less';
.examine{
  margin-bottom: 20px;
  display:flex ;
  justify-content: space-between;
  align-items: center;
  .examineCheck{
    min-width: 630px;
    .ant-checkbox-wrapper{
      font-size: 12px;
    }
  }
  .img{
    width: 40%;
    img{
      width: 100%;
    }
  }
}
.examineList{
  border-left: 1px solid #d9dfe2;
  border-right: 1px solid #d9dfe2;
  border-bottom: 1px solid #d9dfe2;
  margin-bottom: 20px;
  .spin-content{
    background-color: #e6f7ff;
  }
  .title{
    color: white;
    background: #73aee6;
    padding: 9px 20px;
  }
  .list{
    padding: 20px;
    background: #fff;
    .item{
      height: 120px;
      padding: 16px 20px;
      border: 1px solid #d9dfe2;
      margin-bottom: 3px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left{
        width: 70%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .name{
          font-size: 15px;
          display: flex;
          align-items: center;
          .company{
            color: #0091ea;
            font-weight: 600;
            margin-right: 20px;
          }
          .address{
            color: #778fa0;
            padding: 3px 5px;
            background: #d6eaff;
            font-weight: 600;
            margin-right: 40px;
          }
          .event{
            color: #747474;
          }
        }
        .type{
          font-size: 14px;
          color: #919ba2;
        }
        .time{
          font-size: 12px;
          color: #c3c3c3;
        }
      }
      .right{
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;
        .type{
          color: #fff;
          padding: 3px 5px;
          font-weight: 600;
          &.abnormal1{//未处理
            background: #f36161;
          }
          &.abnormal2{//已处理未申报
            background: #ecc94e;
          }
          &.abnormal3{//已申报未审核
            background: #698953;
          }
          &.abnormal4{//审核通过
            background: #5ecf58;
          }
          &.abnormal5{//审核未通过
            background: #ac66d4;
          }
          &.abnormal6{//已处理(不需要申报)
            background: #aaa;
          }
        }
        .handle{
          .data{
            cursor: pointer;
            margin-right: 20px;
          }
          .detail{
            cursor: pointer;
          }
        }
      }
    }
  }
}
.abnormal0{
  .ant-checkbox-checked .ant-checkbox-inner {
      background-color: #f36161;
      border-color: #f36161;
  }
}
.abnormal1{
  .ant-checkbox-checked .ant-checkbox-inner {
      background-color: #ecc94e;
      border-color: #ecc94e;
  }
}
.abnormal2{
  .ant-checkbox-checked .ant-checkbox-inner {
      background-color: #698953;
      border-color: #698953;
  }
}
.abnormal3{
  .ant-checkbox-checked .ant-checkbox-inner {
      background-color: #5ecf58;
      border-color: #5ecf58;
  }
}
.abnormal4{
  .ant-checkbox-checked .ant-checkbox-inner {
      background-color: #ac66d4;
      border-color: #ac66d4;
  }
}
.abnormal5{
  .ant-checkbox-checked .ant-checkbox-inner {
      background-color: #aaa;
      border-color: #aaa;
  }
}
.pagination{
  display: flex;
  justify-content: flex-end;
}
</style>
