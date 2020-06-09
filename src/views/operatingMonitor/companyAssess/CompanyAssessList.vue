<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="企业名称">
              <a-input placeholder="请输入企业名称" v-model="queryParam.companyName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="评价年份">
              <a-input placeholder="请输入评价年份" v-model="queryParam.year"></a-input>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">

          </template>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <a-button type="primary" icon="download" @click="handleExportTemplateXls('企业评价表模板')">导出模板</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('企业评价表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
         <!-- <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />-->
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <companyAssess-modal ref="modalForm" @ok="modalFormOk"></companyAssess-modal>
  </a-card>
</template>

<script>
  import CompanyAssessModal from './modules/CompanyAssessModal'
  import { ListMixin } from '@/mixins/ListMixin'

  export default {
    name: "CompanyAssessList",
    mixins:[ListMixin],
    components: {
      CompanyAssessModal
    },
    data () {
      return {
        description: '企业评价表管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
           },
		   {
            title: '企业名称',
            align:"center",
            dataIndex: 'companyName'
           },
		   {
            title: '产业区星级',
            align:"center",
            dataIndex: 'star'
           },
		   {
            title: '行业分类',
            align:"center",
            dataIndex: 'category'
           },
		   {
            title: '用地面积(亩)',
            align:"center",
            dataIndex: 'useArea'
           },
		   {
            title: '实缴税收(万元)',
            align:"center",
            dataIndex: 'paidRevenue'
           },
		   {
            title: '亩均税收(万元/亩)',
            align:"center",
            dataIndex: 'averageRevenue'
           },
		   {
            title: '利润总额(万元)',
            align:"center",
            dataIndex: 'profitTotal'
           },
		   {
            title: '亩均利润(万元/亩)',
            align:"center",
            dataIndex: 'averageProfit'
           },
		   {
            title: '研发投入经费(万元)',
            align:"center",
            dataIndex: 'spendDevelopment'
           },
		   {
            title: '主营业务收入(万元)',
            align:"center",
            dataIndex: 'mainService'
           },
		   {
            title: '研发投入强度(%)',
            align:"center",
            dataIndex: 'strengthDevelopment'
           },
		   {
            title: '总产值(万元)',
            align:"center",
            dataIndex: 'totalValue'
           },
		   {
            title: '综合能耗(吨标准煤)',
            align:"center",
            dataIndex: 'energyUsageSynthetical'
           },
		   {
            title: '单位能耗总产值(万元/吨标准煤)',
            align:"center",
            dataIndex: 'unitEnergyTotal'
           },
		   {
            title: '主要污染物排放总当量',
            align:"center",
            dataIndex: 'pollutantTotalNum'
           },
		   {
            title: '单位污染物排放税收(万元)',
            align:"center",
            dataIndex: 'unitPollutantRevenue'
           },
		   {
            title: '得分(除去加分项)',
            align:"center",
            dataIndex: 'countScore'
           },
		   {
            title: '加分项得分',
            align:"center",
            dataIndex: 'addScore'
           },
		   {
            title: '加分情况',
            align:"center",
            dataIndex: 'addScoreInfo'
           },
		   {
            title: '总得分',
            align:"center",
            dataIndex: 'scoreTotal'
           },
		   {
            title: '调档情况',
            align:"center",
            dataIndex: 'remark'
           },
		   {
            title: '评价分类',
            align:"center",
            dataIndex: 'assessCategory'
           },
		   {
            title: '评价年份',
            align:"center",
            dataIndex: 'year'
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/companyAssess/list",
          delete: "/companyAssess/delete",
          deleteBatch: "/companyAssess/deleteBatch",
          exportTemplateXlsUrl: "companyAssess/exportTemplateXls",
          exportXlsUrl: "companyAssess/exportXls",
          importExcelUrl: "companyAssess/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
