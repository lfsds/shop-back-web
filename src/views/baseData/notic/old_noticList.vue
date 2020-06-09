<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="创建时间">
              <a-range-picker format="YYYY-MM-DD" @change="changDate" allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="标题">
              <a-input placeholder="请输入标题查询" v-model="queryParam.title"></a-input>
            </a-form-item>
          </a-col>
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
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
      <a-table :loading="loading" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :columns="columns" :dataSource="data" :pagination="false" />
      <a-pagination showSizeChanger :pageSize.sync="pageSize" v-model="current" :total="total" />
    </div>
    <!-- table区域-end -->
  </a-card>
</template>
<script>
  const columns = [{
    title: 'Name',
    dataIndex: 'name',
  }, {
    title: 'Age',
    dataIndex: 'age',
  }, {
    title: 'Address',
    dataIndex: 'address',
  }];

  const data = [];
  for (let i = 0; i < 15; i++) {
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
        pageSize: 10,
        current: 1,
        total: data.length,
        queryParam: {
          date: ''
        },
        data,
        columns,
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
      }
    },
    watch:{
      pageSize(val) {
        console.log('pageSize',val);
      },
      current(val) {
        console.log('current',val);
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
  .ant-pagination{
    margin: 10px auto;
    text-align: right;
  }
</style>
