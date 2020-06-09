<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="5" :sm="5">
            <a-form-item label="创建时间">
              <a-range-picker format="YYYY-MM-DD" @change="changDate" allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="企业名称">
              <a-input placeholder="请输入企业名称" v-model="queryParam.keyword"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="6">
            <a-form-item label="行政区域">
              <a-tree-select
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="treeData"
                placeholder='请选择行政区域名称'
                treeDefaultExpandAll
                v-model="value"
              >
              <span style="color: #08c" slot="title" slot-scope="{key, value}" v-if="key='0-0-1'">
                Child Node1 {{value}}
              </span>
              </a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="5">
            <a-form-item label="事件类型">
            <a-select
              showSearch
              placeholder="请选择事件类型"
              optionFilterProp="children"
              @focus="handleFocus"
              @blur="handleBlur"
              @change="handleChange"
              :filterOption="filterOption"
            >
              <a-select-option value="jack">限产异常</a-select-option>
              <a-select-option value="lucy">停产异常</a-select-option>
              <a-select-option value="tom">治污设施异常</a-select-option>
            </a-select>
            </a-form-item>
          </a-col>
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="4" :sm="24">
              <a-button type="primary" icon="search">查询</a-button>
              <a-button type="primary" icon="reload" style="margin-left: 8px">重置</a-button>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="margin-top: 5px">
      <a-button type="primary" icon="plus">新增</a-button>
      <a-button type="success" icon="plus">编辑</a-button>
      <a-button type="success" icon="plus">详情</a-button>
      <a-button type="danger" icon="plus">删除</a-button>
    </div>
    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        <span style="float:right;">
          <a @click="loadData"><a-icon type="sync" />刷新</a>
        </span>
      </div>
      <a-table :loading="loading" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :columns="columns" :dataSource="data" />
    </div>
    <!-- table区域-end -->
  </a-card>
</template>
<script>
  const columns = [{
    title: '企业名称',
    dataIndex: 'name',
  }, {
    title: '行政区域',
    dataIndex: 'age',
  }, {
    title: '事件类型',
    dataIndex: 'address',
  }, {
    title: '发送方式',
    dataIndex: 'address',
  }, {
    title: '发送对象',
    dataIndex: 'address',
  }, {
    title: '创建时间',
    dataIndex: 'address',
  }];

  const treeData = [{
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [{
      value: '0-0-1',
      key: '0-0-1',
      scopedSlots: { // custom title
        title: 'title',
      },
    }, {
      title: 'Child Node2',
      value: '0-0-2',
      key: '0-0-2',
    }],
  }, {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
  }]

  const data = [];
  for (let i = 0; i < 8; i++) {
    data.push({
      key: i,
      name: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
    });
  }

  export default {
    data() {
      return {
        queryParam: {
          date: ''
        },
        value: undefined,
        treeData,
        data,
        columns,
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
      }
    },
    computed: {
      // hasSelected() {
      //   return this.selectedRowKeys.length > 0
      // }
    },
    methods: {
      handleChange(){
        console.log(this.queryParam.dj)
      },
      handleBlur() {
        console.log('blur');
      },
      handleFocus() {
        console.log('focus');
      },
      changDate(val1, val2){
        console.log(val1, val2)
      },
      onClearSelected() {
        this.start()
      },
      loadData() {
      },
      start () {
        this.loading = true;
        // ajax request after empty completing
        setTimeout(() => {
          this.loading = false;
          this.selectedRowKeys = [];
        }, 1000);
      },
      onSelectChange (selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys
      }
    },
  }
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
    margin: 0 5px
  }

  .ant-btn-danger {
    background-color: #ffffff
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }
  /** Button按钮间距 */
  .ant-btn {
    margin-left: 3px
  }
</style>
