<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8" style="min-width: 450px">
            <a-form-item label="创建时间">
              <a-range-picker showTime format="YYYY-MM-DD HH:mm:ss" @change="changDate" allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8" style="min-width: 400px">
            <a-form-item label="行政区域">
              <a-tree-select
                style="width: 300px"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="treeData"
                placeholder='Please select'
                treeDefaultExpandAll
                v-model="queryParam.affiliate"
              >
              </a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="所属行业">
              <a-cascader v-model="queryParam.industry" :options="industrys" @change="industryChange"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="企业名称">
              <a-input placeholder="请输入企业名称查询" v-model="queryParam.enterpriseName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="企业社会信用代码">
              <a-input placeholder="请输入企业名称查询" v-model="queryParam.cscc"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="地址">
              <a-input placeholder="请输入企业名称查询" v-model="queryParam.address"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
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

        <template slot="type" slot-scope="text, record">
            <template v-if="record.type != 1">
                <a-tag color="red">停产</a-tag>
            </template>
            <template v-else>
                <a-tag color="orange">限产</a-tag>
            </template>
        </template>
        <template slot="level" slot-scope="text, record">
          <template v-if="record.level === 1">
            <a-tag color="yellow">黄色预警</a-tag>
          </template>
          <template v-else-if="record.level === 2">
            <a-tag color="orange">橙色预警</a-tag>
          </template>
          <template v-else>
            <a-tag color="red">红色预警</a-tag>
          </template>
        </template>
        <template slot="state" slot-scope="text, record">
          <template v-if="record.state != 1">
            <a-tag color="green">启用</a-tag>
          </template>
          <template v-else>
            <a-tag color="orange">禁用</a-tag>
          </template>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
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
    <index-modal :treeData="treeData" ref="modalForm" @ok="modalFormOk"></index-modal>
  </a-card>
</template>

<script>
  import indexModal from './modules/indexModal'
  import { ListMixin } from '@/mixins/ListMixin'
  import industrys from '@/assets/js/json-data2'
  import {queryOrgTreeList} from '@/api/api'
  export default {
    name: "ArticleList",
    mixins:[ListMixin],
    components: {
      indexModal
    },
    data () {
      return {
        treeData: [],
        industrys,
        description: '文章管理页面',
        // 表头
        columns: [
          {
            title: '企业名称',
            dataIndex: 'enterpriseName',
          }, {
            title: '企业社会信用代码',
            dataIndex: 'cscc',
          }, {
            title: '行政区域名称',
            dataIndex: 'administrativeRegion',
          }, {
            title: '地址',
            dataIndex: 'address',
          }, {
            title: '所属行业',
            dataIndex: 'industry',
          }, {
            title: '创建时间',
            dataIndex: 'createTime',
          }
        ],
		url: {
          list: "/baseEnterprise/list",
          delete: "/baseEnterprise/delete",
          deleteBatch: "/baseEnterprise/deleteBatch",
        
       },
    }
  },
    created() {
      queryOrgTreeList().then(res => {
        this.treeData = res.result
      })
    },
    computed: {
    industryChange() {
      // if (this.queryParam.industry) {
      //   this.queryParam.industry = this.queryParam.industry.toString()
      //   console.log(this.queryParam.industry, 9999999)
      // }
    },
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
      changDate(val1, val2){
        this.queryParam.createTime_begin = val2[0]
        this.queryParam.createTime_end = val2[1]
        console.log(this.queryParam)
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
