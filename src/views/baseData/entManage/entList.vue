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
            <a-form-item label="行政区域">
              <a-select defaultValue="lucy" v-model="queryParam.dj" @change="handleChange">
                <a-select-option value="0">黄色预警</a-select-option>
                <a-select-option value="1">红色预警</a-select-option>
                <a-select-option value="2">橙色预警</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="所属行业">
              <a-select defaultValue="lucy" v-model="queryParam.dj" @change="handleChange">
                <a-select-option value="0">黄色预警</a-select-option>
                <a-select-option value="1">红色预警</a-select-option>
                <a-select-option value="2">橙色预警</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="企业名称">
              <a-input placeholder="请输入企业名称查询" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="企业社会信用代码">
              <a-input placeholder="请输入企业社会信用代码查询" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="地址">
              <a-input placeholder="请输入地址查询" v-model="queryParam.name"></a-input>
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
      <a-button type="primary" icon="download">批量导入</a-button>
      <a-button type="primary" @click="addEnt" icon="plus">新增</a-button>
      <a-button type="success" icon="edit">编辑</a-button>
      <a-button type="success" icon="delete">删除</a-button>
      <a-button type="success" icon="upload">导出</a-button>
      <a-button type="success" icon="cluster">工艺流程图</a-button>
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
    <!--  弹出框  -->
    <a-modal
      v-model="visible"
      title="添加企业"
      width="60%"
      onOk="handleOk"
    >
      <template slot="footer">
        <a-button key="back" @click="visible=false">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          提交
        </a-button>
      </template>
      <a-form
        :form="form"
        layout="inline"
      >
        <a-form-item
          label="企业名称"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select
            v-decorator="[
          'ent',
          {rules: [{ required: true, message: '请选择企业名称!' }]}
        ]"
            @change="selectEnt"
          >
            <a-select-option value="male">
              企业1
            </a-select-option>
            <a-select-option value="female">
              企业2
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="电压变比"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-decorator="[
          'voltage'
        ]"
          />
        </a-form-item>
        <a-form-item
          label="企业社会信用代码"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-decorator="[
          'entCode',
          {rules: [{ required: true, message: '请输入企业社会信用代码!' }]}
        ]"
          />
        </a-form-item>
        <a-form-item
          label="电流变比"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-decorator="[
          'current'
        ]"
          />
        </a-form-item>
        <a-form-item
          label="所属省市区"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-cascader :options="options" @change="diquChange" v-decorator="[
          'area',
          {rules: [{ required: true, message: '请选择所属省市区！' }]}
        ]" />
        </a-form-item>
        <a-form-item
          label="企业负责人"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-decorator="[
          'qyfzr'
        ]"
          />
        </a-form-item>
        <a-form-item
          label="企业详细地址"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-decorator="[
          'xxdz',
          {rules: [{ required: true, message: '请输入企业详细地址!' }]}
        ]"
          />
        </a-form-item>
        <a-form-item
          label="企业负责人电话"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-decorator="[
          'qyfzrdh'
        ]"
          />
        </a-form-item>
        <a-form-item
          label="所属行业"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select
            v-decorator="[
          'sshy',
          {rules: [{ required: true, message: '请选择所属行业!' }]}
        ]"
            @change="selectEnt"
          >
            <a-select-option value="male">
              行业1
            </a-select-option>
            <a-select-option value="female">
              行业2
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="归属用户"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select
            v-decorator="[
          'gsyh'
        ]"
            @change="selectEnt"
          >
            <a-select-option value="male">
              用户1
            </a-select-option>
            <a-select-option value="female">
              用户2
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="行政区域名称"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-decorator="[
          'xzqymc',
          {rules: [{ required: true, message: '请选择行政区域名称！' }]}
        ]"
          />
        </a-form-item>
        <a-form-item
          label="网关编号"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-decorator="[
          'wgbh'
        ]"
          />
        </a-form-item>
        <a-form-item
          label="仪表地址"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-decorator="[
          'ybdz'
        ]"
          />
        </a-form-item>
        <a-form-item
          label="仪表型号"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select
            v-decorator="[
          'ybxh'
        ]"
            @change="selectEnt"
          >
            <a-select-option value="male">
              型号1
            </a-select-option>
            <a-select-option value="female">
              型号2
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="备注"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-textarea v-decorator="[
          'remake'
        ]" :autosize="{ minRows: 2, maxRows: 6 }" />
        </a-form-item>
        <a-form-item></a-form-item>
        <a-form-item
          label="用户名"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-decorator="[
          'username',
          {rules: [{ required: true, message: '请输入用户名!' }]}
        ]"
          />
        </a-form-item>
        <a-form-item
          label="用户密码"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            type="password"
            v-decorator="[
          'password',
          {rules: [{ required: true, message: '请输入密码!' }]}
        ]"
          />
        </a-form-item>
        <a-form-item>
        </a-form-item>
        <a-form-item
          label="密码确认"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            type="password"
            v-decorator="[
          'password2',
          {rules: [{ required: true, message: '请输入企业详细地址!' }]}
        ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
  import areas from '@/assets/js/json-data'
  import industry from '@/assets/js/json-data2'
  const columns = [
    {
    title: '企业名称',
    dataIndex: 'name',
  }, {
    title: '企业社会信用代码',
    dataIndex: 'age',
  }, {
    title: '行政区域名称',
    dataIndex: 'xzqy',
  }, {
    title: '地址',
    dataIndex: 'dz',
  }, {
    title: '所属行业',
    dataIndex: 'sshy',
  }, {
    title: '创建时间',
    dataIndex: 'cjsj',
  }
  ];
  export default {
    data() {
      return {
        industry,
        options: areas,
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
        form: this.$form.createForm(this),
        visible: false,
        queryParam: {
          date: '',
          name: ''
        },
        data: [],
        columns,
        selectedRowKeys: [],
        loading: false,
      }
    },
    computed: {
      // hasSelected() {
      //   return this.selectedRowKeys.length > 0
      // }
    },
    methods: {
      addEnt() {
        this.visible = true
        this.resetField()
      },
      diquChange(value, selectedOptions) {
        console.log(value, selectedOptions)
      },
      selectEnt() {},
      handleOk() {
        this.form.validateFields((err, values) => {
          console.log(err)
          if (!err) {
            console.log('Received values of form: ', values);
            this.visible = false
          }else {
          }
        });
      },
      resetField() {
        this.form.resetFields()
      },
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
<style lang="scss" scoped>
  .ant-modal-body{
    .ant-form-item{
      width: 45%;
      margin-bottom: 10px;
    }
    .ant-form-item-with-help{
      margin-bottom: 0;
    }
  }
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
