<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="创建时间"><a-range-picker format="YYYY-MM-DD" v-model="queryParam.time" @change="changDate" allowClear /></a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="关键字"><a-input placeholder="监测点/企业名称" v-model="queryParam.keyword"></a-input></a-form-item>
          </a-col>
          <a-col :md="6" :sm="6">
            <a-form-item label="行政区域">
              <a-tree-select v-model="queryParam.division" :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="treeData" placeholder="请选择行政区域名称" treeDefaultExpandAll>
              </a-tree-select>
            </a-form-item>
          </a-col>
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="margin-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>
    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>
        已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>
        项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        <span style="float:right;">
          <a @click="loadData">
            <a-icon type="sync" />
            刷新
          </a>
        </span>
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
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
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
    <!-- 表单区域 -->
    <add-or-edit ref="modalForm" @ok="modalFormOk"></add-or-edit>
  </a-card>
</template>

<script>
  import AddOrEdit from './monitorPoint-add-or-edit';
  import { ListMixin } from '@/mixins/ListMixin';
const columns = [
  {
    title: '创建日期',
    align: 'center',
    dataIndex: 'createTime'
  },
  {
    title: '监测点名称',
    align: 'center',
    dataIndex: 'monitoryPoint'
  },
  {
    title: '所属企业',
    align: 'center',
    dataIndex: 'ssqy'
  },
  {
    title: '行政区域',
    align: 'center',
    dataIndex: 'xzqy'
  },
  {
    title: '所属车间',
    align: 'center',
    dataIndex: 'sscj'
  },
  {
    title: '所属设备',
    align: 'center',
    dataIndex: 'sssb'
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark'
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
];

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        value: '0-0-1',
        key: '0-0-1',
        scopedSlots: {
          // custom title
          title: 'title'
        }
      },
      {
        title: 'Child Node2',
        value: '0-0-2',
        key: '0-0-2'
      }
    ]
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1'
  }
];
export default {
  mixins: [ListMixin],
  components: {
    AddOrEdit
  },
  data() {
    return {
      queryParam: {
        date: ''
      },
      value: undefined,
      treeData,
      columns,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      url: {
        list: '/baseMonitoryPoint/list',
        delete: '/baseMonitoryPoint/delete',
        deleteBatch: '/baseMonitoryPoint/deleteBatch',
      }
    };
  },
  computed: {
    // hasSelected() {
    //   return this.selectedRowKeys.length > 0
    // }
  },
  mounted() {
    
  },
  methods: {
    changDate(val1, val2) {
      this.queryParam.start_time = val2[0]
      this.queryParam.end_time = val2[1]
    },
    onClearSelected() {
      this.start();
    },
    start() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.selectedRowKeys = [];
      }, 1000);
    },
  }
};
</script>
<style scoped>
.ant-card-body .table-operator {
  margin-bottom: 18px;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}

.anty-row-operator button {
  margin: 0 5px;
}

.ant-btn-danger {
  background-color: #ffffff;
}

.ant-modal-cust-warp {
  height: 100%;
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}
/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}
</style>
