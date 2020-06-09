<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="7" :sm="9">
            <a-form-item label="时间"><a-range-picker @change="onChange" style="width: 100%" :format="format" :value="value" :mode="mode" :allowClear="false"/></a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="企业">
              <!-- <a-select
                  showSearch
                  v-model="queryParam.enterpriseId"
                  placeholder="Select a person"
                  optionFilterProp="children"
                  style="width: 200px"
                  @change="changeEntId"
                >
                  <a-select-option value="1">Jack</a-select-option>
                  <a-select-option value="2">Lucy</a-select-option>
                  <a-select-option value="3">Tom</a-select-option>
                </a-select> -->
              <a-select showSearch v-model="queryParam.enterpriseId" optionFilterProp="children" @change="changeEntId">
                <a-select-option v-for="item in entList" :key="item.value" :value="item.value">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="车间名称"><a-input placeholder="车间名称" v-model="queryParam.shopName"></a-input></a-form-item>
            </a-col>
            <a-col :md="5" :sm="8">
              <a-form-item label="监测点名称"><a-input placeholder="监测点名称" v-model="queryParam.monitoring"></a-input></a-form-item>
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
      </a-table>
    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
import { ListMixin } from '@/mixins/ListMixin';
import { getAction } from '@/api/manage';
import moment from 'moment';
export default {
  mixins: [ListMixin],
  data() {
    return {
      mode: ['date', 'date'],
      format: 'YYYY-MM-DD',
      value: [moment(new Date()),moment(new Date())],
      //企业列表
      entList:[],
      // 表头
      columns: [
        {
          title: '标题',
          align: 'center',
          dataIndex: 'title'
        },
        {
          title: '类型',
          align: 'center',
          width:80,
          dataIndex: 'type',
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
  created() {
    this.queryParam.startDate = moment(new Date()).format('YYYY-MM-DD')
    this.queryParam.endDate = moment(new Date()).format('YYYY-MM-DD')
  },
  mounted() {
    this.getEntList()
  },
  methods: {
    moment,
    // 企业下拉列表
    getEntList(){
      getAction('/serEntInfo/queryEntInfoList',{}).then((res)=>{
        if(res.success){
          this.entList = []
          for (let i = 0; i < res.result.length; i++) {
            this.entList.push({
              value:`${res.result[i].key}`,
              name:`${res.result[i].value}`
            })
          }
        }else{
          this.$message.warning(res.message);
        }
      })
    },
    // 选择时间
    onChange(value) {
      this.value = value;
      if (value.length > 0) {
        this.queryParam.startDate = moment(value[0]).format(this.format);
        this.queryParam.endDate = moment(value[1]).format(this.format);
      } else {
        this.queryParam.startDate = '';
        this.queryParam.endDate = '';
      }
    },
    changeEntId(value){
      console.log(value)
      console.log(this.queryParam)
    }
  }
};
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
