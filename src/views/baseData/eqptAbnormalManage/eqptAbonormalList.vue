<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="创建时间">
              <a-date-picker 
                format="YYYY-MM-DD" 
                @change="changDate" 
                allowClear 
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="监测点名称">
              <a-input placeholder="请输入监测点名称" v-model="queryParam.monitorName" allowClear></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="事件类型">
                <a-select
                  showSearch
                  placeholder="请选择事件类型"
                  optionFilterProp="children"
                  @change="handleChange"
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

    <!-- 操作按钮区域 -->
    <div class="table-operator">
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
        <template slot="exceptType" slot-scope="text, record">
          <template v-if="record.exceptType == 3">
            <a-tag>功率越限</a-tag>
          </template>
          <template v-else-if="record.exceptType == 4">
            <a-tag>电流越限</a-tag>
          </template>
          <template v-else-if="record.exceptType == 5">
            <a-tag>电压越限</a-tag>
          </template>
          <template v-else-if="record.exceptType == 6">
            <a-tag>用电量报警</a-tag>
          </template>
        </template>
        <template slot="isUse" slot-scope="text, record">
          <template v-if="record.isUse == 1">
            <a-tag color="green">启用</a-tag>
          </template>
          <template v-else>
            <a-tag color="red">未启用</a-tag>
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

    <!-- 表单区域 -->
    <eqpt-modal ref="modalForm" @ok="modalFormOk"></eqpt-modal>
  </a-card>
</template>

<script>
import EqptModal from './modules/EqptModal';
import { ListMixin } from '@/mixins/ListMixin';
import moment from "moment"
export default {
  mixins: [ListMixin],
  components: {
    EqptModal
  },
  data() {
    return {
      date:'',
      // 表头
      columns: [{
        title: '监测点/企业',
        align: 'center',
        dataIndex: 'monitorName',
      }, {
        title: '事件类型',
        align: 'center',
        dataIndex: 'exceptType',
        scopedSlots: { customRender: 'exceptType' }
      }, {
        title: '条件',
        align: 'center',
        dataIndex: 'triggerCondition',
      }, {
        title: '阈值',
        align: 'center',
        dataIndex: 'threshold',
      }, {
        title: '备注',
        align: 'center',
        dataIndex: 'remark',
      }, {
        title: '是否启用',
        align: 'center',
        dataIndex: 'isUse',
        scopedSlots: { customRender: 'isUse' }
      }, {
        title: '创建时间',
        align: 'center',
        dataIndex: 'createTime',
      },{
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' }
      }],
      url: {
        list: '/serEntExceptionSet/list',
        delete:'/serEntExceptionSet/delete',
        deleteBatch: '/serEntExceptionSet/deleteBatch',
      }
    };
  },
  mounted() {
    this.date = moment(this.queryParam.createTime)
  },
  methods: {
    handleChange(){
      console.log(this.queryParam.dj)
    },
    changDate(val1, val2){
      if(val2){
        this.queryParam.createTime = val2+" 00:00:00"
      }else{
        this.queryParam.createTime = val2
      }
      
    },
  }
};
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
