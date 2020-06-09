<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="企业名称"><a-input placeholder="请输入企业名称" v-model="queryParam.entName" allowClear></a-input></a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="行业">
              <a-select showSearch optionFilterProp="children" v-model="queryParam.industryId" allowClear>
                <a-select-option v-for="item in industryList" :key="item.value" :value="item.value">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="行政区域">
                <a-tree-select
                  allowClear
                  treeDefaultExpandAll
                  v-model="queryParam.deptId" 
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" 
                  :treeData="treeData" 
                  placeholder="请选择行政区域名称" 
                  @change="changeTree"
                  >
                </a-tree-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="事件类型">
                <a-select v-model="queryParam.eventType" style="width: 100%" placeholder="请选择事件类型" allowClear >
                  <a-select-option :value="1">设备停电</a-select-option>
                  <a-select-option :value="2">设备上电</a-select-option>
                  <a-select-option :value="3">设备异常</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="5">
              <a-form-item label="类别">
                <a-select v-model="queryParam.dateType" style="width: 100%" placeholder="请选择类别" @change="changeDateType">
                  <a-select-option value="1">日</a-select-option>
                  <a-select-option value="2">月</a-select-option>
                  <a-select-option value="3">年</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="时间">
                <a-date-picker 
                  v-model="date"
                  :mode="mode"
                  :format="format"
                  :open="isopen"
                  @openChange="openChange" 
                  @panelChange="panelChange"
                  @change="changeDate"
                  :allowClear="false"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
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
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="type" slot-scope="text, record">
          <template v-if="record.type == 1">
            <a-tag color="red">政策法规</a-tag>
          </template>
          <template v-else>
            <a-tag color="orange">新闻</a-tag>
          </template>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)"><a>删除</a></a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
import { getAction } from '@/api/manage';
import moment from 'moment';
import { ListMixin } from '@/mixins/ListMixin';

export default {
  mixins: [ListMixin],
  data() {
    return {
      industryList:[],
      treeData:[],
      isopen: false,
      queryParam:{
        dateType:"1",
        date:'',
      },
      date:moment(new Date()),
      mode:'date',
      format:'YYYY-MM-DD',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1;
          }
        },
        {
          title: '标题',
          align: 'center',
          dataIndex: 'title'
        },
        {
          title: '类型',
          align: 'center',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '发布时间',
          align: 'center',
          dataIndex: 'publishTime'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '删除时间',
          align: 'center',
          dataIndex: 'deleteTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/article/list',
        delete: '/article/delete',
        deleteBatch: '/article/deleteBatch',
        exportXlsUrl: 'article/exportXls',
        importExcelUrl: 'article/importExcel'
      }
    };
  },
  created(){
    this.getIndustryList()
    this.getTreeData()
    this.queryParam.date = moment(this.date).format(this.format)
  },
  mounted(){
    
  },
  methods: {
    moment,
    getIndustryList(){
      getAction('/baseInstitution/getIndustryList',{}).then((res) =>{
        if(res.success){
          
          if(res.result.length>0){
            for (let i = 0; i < res.result.length; i++) {
              this.industryList.push({
                value:`${res.result[i].item_key}`,
                name:`${res.result[i].item_value}`
              })
            }
          }
        }else{
          this.$message.warning(res.message);
        }
      })
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
    // 选择时间类别
    changeDateType(value){
      this.queryParam.dateType = value
      if(value == 1){
        this.mode = 'date'
        this.format = 'YYYY-MM-DD'
      }else if(value == 2){
        this.mode = 'month'
        this.format = 'YYYY-MM'
      }else{
        this.mode = 'year'
        this.format = 'YYYY'
      }
    },
    // 选择时间
    openChange(status){
      if(status){
        this.isopen = true
      } else {
        this.isopen = false
      }
    },
    panelChange(value){
      this.date = moment(value)
      this.isopen = false
      this.queryParam.date = moment(value).format(this.format)
    },
    changeDate(value){
      this.date = moment(value)
      this.queryParam.date = moment(value).format(this.format)
    },
  }
};
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
