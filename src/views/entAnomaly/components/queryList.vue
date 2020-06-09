<template>
  <a-card size="small">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="创建时间"><a-range-picker
              @change="onChange"
              style="width: 100%"
              :format="format"
              :value="value"
              :mode="mode"
              allowClear/></a-form-item>
          </a-col>
          <a-col :md="6" :sm="8" style="min-width: 400px">
            <a-form-item label="行政区域">
              <a-tree-select
                style="width: 300px"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="treeData"
                placeholder="请选择"
                treeDefaultExpandAll
                v-model="queryParam.orgCode"
                allowClear
              >
              </a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="企业名称"><a-input placeholder="请输入内容" v-model="queryParam.entName" allowClear></a-input></a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="设备名称"><a-input placeholder="请输入内容" v-model="queryParam.facilityName" allowClear></a-input></a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="检测点名称"><a-input placeholder="请输入内容" v-model="queryParam.monitorName" allowClear></a-input></a-form-item>
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
              <a-form-item label="网关编号"><a-input placeholder="请输入内容" v-model="queryParam.mnCode" allowClear></a-input></a-form-item>
            </a-col>
          </template>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="toggleSearchStatus = !toggleSearchStatus" style="margin-left: 8px">
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
      <a-button class="btn1" @click="manage" type="primary" icon="edit">批量处理</a-button>
      <!-- <a-button v-if="modelName==='anoExamine'" class="btn1" @click="manage1" type="primary" icon="edit">批量处理</a-button> -->
      <!-- <a-button v-if="modelName==='anoExamine'" class="btn2" @click="manage2" type="primary" icon="edit">批量处理(不通过)</a-button> -->
      <a-alert message="发现异常" type="error" showIcon />
      <a-alert message="异常处理" type="warning" showIcon />
      <a-alert message="异常申报" type="info" showIcon />
      <a-alert message="审核" type="success" showIcon />
    </div>
    <!-- table区域-begin -->
    <div class="table-content">
      <div class="ant-alert ant-alert-info" style="margin-top: 16px;">
        <a-checkbox :indeterminate="indeterminate" @change="allSelect" :checked="checkAll">全选</a-checkbox>
        <i class="anticon anticon-info-circle ant-alert-icon"></i>
        已选择
        <a style="font-weight: 600">{{ selectList.length }}</a>
        项
      </div>
      <a-spin :spinning="loading">
        <a-card size="small">
          <a-checkbox-group @change="onSelect" v-model="selectList">
            <div class="cell" v-for="(item, index) in tableData" :key="index">
              <div class="select">
                <a-checkbox :value="item.id"></a-checkbox>
              </div>
              <div>
                <span class="ent">{{ item.facilityName }}</span>
                <span class="area">{{ item.entName }}</span>
                <span class="type">{{ item.exceptType }}</span>
              </div>
              <div class="desc">{{ item.exceptReason }}</div>
              <div style="overflow: hidden;">
                <span class="time">{{ item.inspectTime }}</span>
                <span class="btn" @click="details(item.id)"><a-icon type="align-left" /> 查看详情</span>
              </div>
            </div>
          </a-checkbox-group>
          <div style="text-align: right">
            <a-pagination
              showSizeChanger
              :showTotal="total => `共 ${total} 条数据`"
              :pageSize.sync="pageSize"
              v-model="current"
              :total="total"
              @change="changeTableData"
              @showSizeChange="showSizeChange"/>
          </div>
        </a-card>
      </a-spin>
    </div>
    <!-- table区域-end -->
    <!--      提示信息     -->
    <a-modal
      title="信息"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="visible=false"
    >
      <p>确认要处理这<a style="font-weight: 600">{{ selectList.length }}</a>个异常？</p>
    </a-modal>
    <a-drawer
      :title="modelName==='anoManage'?'异常处理':modelName==='anoDeclare'?'异常申报':'申报审核'"
      :width="800"
      :maskClosable="true"
      placement="right"
      :closable="false"
      @close="close"
      :visible="visible2"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form" @submit="handleOk2">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="事件类型：">
            <span>{{ detailList.exceptType }}</span>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="企业名称：">
            <span>{{ detailList.entName }}</span>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="设施名称：">
            <span>{{ detailList.facilityName }}</span>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="监测点名称：">
            <span>{{ detailList.monitorName }}</span>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="网关编号：">
            <span>{{ detailList.mnCode }}</span>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="异常发生时间：">
            <span>{{ detailList.createTime }}</span>
          </a-form-item><a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="异常原因：">
            <span>{{ detailList.exceptReason }}</span>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="核查人：">
            <a-input v-if="modelName!=='anoManage'" :disabled="modelName!=='anoManage'" placeholder="请输入" v-decorator="['inspectName', {}]" />
            <a-input v-else :disabled="modelName!=='anoManage'" placeholder="请输入" v-decorator="['inspectName', { rules: [{ required: true, message: '检查人不能为空' }] }]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="核查时间：">
            <a-date-picker v-if="modelName!=='anoManage'" showTime :disabled="modelName!=='anoManage'" format="YYYY-MM-DD HH:mm:ss" v-decorator="['inspectTime', {}]" />
            <a-date-picker v-else showTime :disabled="modelName!=='anoManage'" format="YYYY-MM-DD HH:mm:ss" v-decorator="['inspectTime', { rules: [{ required: true, message: '核查时间不能为空' }] }]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="核查结果：">
            <a-radio-group v-if="modelName!=='anoManage'" name="radioGroup" :disabled="modelName!=='anoManage'" v-decorator="['inspectResult', {}]" >
              <a-radio :value="1">企业异常</a-radio>
              <a-radio :value="0">用电监管设备异常</a-radio>
            </a-radio-group>
            <a-radio-group v-else name="radioGroup" :disabled="modelName!=='anoManage'" v-decorator="['inspectResult', { rules: [{ required: true, message: '核查结果不能为空' }] }]" >
              <a-radio :value="1">企业异常</a-radio>
              <a-radio :value="0">用电监管设备异常</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="详细描述：">
            <a-input :disabled="modelName!=='anoManage'" placeholder="请输入详细描述" v-decorator="['detail', {}]" />
          </a-form-item>
          <!-- <a-form-item
            v-if="modelName!=='anoManage'"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="备注：">
            <a-input :disabled="modelName!=='anoManage'" placeholder="请输入备注" v-decorator="['remark', {}]" />
          </a-form-item> -->
          <a-form-item
            v-if="modelName!=='anoManage'"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="事件处理说明：">
            <a-input placeholder="请输入内容" :disabled="modelName==='anoExamine'" v-model="detailList.instructions" />
          </a-form-item>
          <!-- <a-form-item
            v-if="modelName==='anoManage'"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="附件：">
            <a-upload-dragger
              name="file"
              :multiple="true"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              @change="handleChange"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
              </p>
              <p class="ant-upload-text">点击或者拖拽文件到此区域进行上传</p>
            </a-upload-dragger>
          </a-form-item> -->
          <a-form-item
            v-if="modelName==='anoExamine'"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="审核人：">
            <a-input :disabled="modelName==='anoDeclare'" placeholder="请输入" v-decorator="['checkName', {}]" />
          </a-form-item>
          <a-form-item
            v-if="modelName==='anoExamine'"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="审核时间：">
            <a-date-picker showTime :disabled="modelName==='anoDeclare'" format="YYYY-MM-DD HH:mm:ss" v-decorator="[ 'checkTime', {}]" />
          </a-form-item>
          <a-form-item
            v-if="modelName==='anoExamine'"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="审核意见：">
            <a-input :disabled="modelName==='anoDeclare'" placeholder="请输入" v-decorator="['checkIdea', {}]" />
          </a-form-item>
          <a-form-item
            v-if="modelName==='anoExamine'"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="审核结果：">
            <a-radio-group name="radioGroup" :disabled="modelName==='anoDeclare'" :defaultValue="1" v-decorator="['checkResult', {}]">
              <a-radio :value="0">未通过</a-radio>
              <a-radio :value="1">通过</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-button class="de-btn" type="primary" html-type="submit" >确定</a-button>
          <a-button class="de-btn" type="primary" @click="cancle">取消</a-button>
        </a-form>
      </a-spin>
    </a-drawer>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import {queryOrgTreeList} from '@/api/api'
  import { getAction ,postAction,putAction} from '@/api/manage'
  export default {
    props: {
      modelName: {
        type: String,
        default: ''
      },
      exceptStatus:{
        type: Number
      }
    },
    data() {
      return{
        indeterminate: false,
        checkAll: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        loading:false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        visible2: false,
        visible: false,
        // 分页
        pageSize: 10,
        current: 1,
        total: 10,
        
        selectList: [],
        toggleSearchStatus: false,
        treeData: [],
        mode: ['date', 'date'],
        format: 'YYYY-MM-DD',
        value: [],
        queryParam: {},
        tableData: [],
        detailList:{},
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
    created() {
      queryOrgTreeList().then(res => {
        this.treeData = res.result
      })
    },
    mounted() {
      this.init()
    },
    methods: {
      init(){
        this.loading = true
        this.queryParam = Object.assign(this.queryParam, {
          pageNo:this.current,
          pageSize:this.pageSize,
          exceptStatus:this.exceptStatus
        });
        getAction('/serEntException/list',this.queryParam).then((res) =>{
          this.loading = false
          if(res.success){
            this.tableData = res.result.records
            this.total = res.result.total
          }else{
            this.$message.warning(res.message);
          }
        })
      },
      changeTableData(page,pageSize){
        this.init()
      },
      showSizeChange(current,size){
        this.init()
      },
      handleChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
        }
        if (status === 'done') {
          this.$message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`);
        }
      },
      close () {
        // this.$emit('close');
        this.visible = false;
      },
      onSelect() {
        if(this.tableData.length > this.selectList.length){
          this.indeterminate = true
          if( this.selectList.length===0){
            this.indeterminate = false
            this.checkAll = false
          }
        }else if(this.tableData.length === this.selectList.length){
          this.indeterminate = false
          this.checkAll = true
        }
      },
      allSelect(e){
        if(e.target.checked){
          this.checkAll = true
          this.indeterminate = false
          let list = []
          this.tableData.forEach(item =>{
            list.push(item.id)
          })
          this.selectList = list
        }else {
          this.checkAll = false
          this.indeterminate = false
          this.selectList=[]
        }
      },
      details(val){
        this.visible2 = true
        this.$nextTick(function(){
          getAction('/serEntException/queryById',{
            id:val
          }).then((res) =>{
            if(res.success){
              this.detailList = res.result
              if(res.result.inspectTime){
                this.detailList.inspectTime = moment(res.result.inspectTime)
              }
              if(res.result.checkTime){
                this.detailList.checkTime = moment(res.result.checkTime)
              }
              this.$nextTick(function(){
                this.form.setFieldsValue(this.detailList)
              })
            }else{
              this.$message.warning(res.message);
            }
          })
        })
      },
      handleOk2(e){
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            this.detailList.inspectTime = moment(values.inspectTime).format('YYYY-MM-DD HH:mm:ss')
            this.detailList.inspectName = values.inspectName
            this.detailList.inspectResult = values.inspectResult
            
            this.detailList.checkName = values.checkName
            this.detailList.checkTime = moment(values.checkTime).format('YYYY-MM-DD HH:mm:ss')
            this.detailList.checkIdea = values.checkIdea
            this.detailList.checkResult = values.checkResult
            
            putAction('/serEntException/edit',this.detailList).then((res) =>{
              if(res.success){
                this.form.resetFields();
                this.detailList = {}
                this.visible2 = false
                this.init()
              }else{
                this.$message.warning(res.message);
              }
            })
          }
        });
      },
      cancle(){
        this.visible2 = false
        this.form.resetFields();
      },
      // 确认处理异常
      manage() {
        if(this.selectList.length !== 0){
          this.visible = true
        }else {
          this.$message.error("请勾选需要处理项！")
        }
      },
      handleOk(){
        let formData = new FormData(); 
        let ids = this.selectList.join(',')
        formData.append("ids",ids);
        postAction('/serEntException/editBatch',formData).then((res) =>{
          if(res.success){
            this.visible = false
            this.$message.success(res.message);
            this.init()
          }else{
            this.$message.warning(res.message);
          }
        })
      },
      manage1(){},
      manage2(){},
      searchQuery() {
        this.init()
      },
      searchReset() {},
      moment,
      // 选择时间。
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
    }
  }
</script>

<style lang="scss" scoped>
  .de-btn{
    margin: 30px 15px 0 ;
    float: right;
  }
  .table-operator{
    text-align: right;
    .btn1{
      float: left;
      background: #23c6c8;
      border-color: #23c6c8;
    }
    .btn2{
      float: left;
      background: #f8ac59;
      border-color: #f8ac59;
      margin-left: 10px;
    }
    .ant-btn, div{
      display: inline-block;
    }
    .ant-alert{
      font-size: 12px;
      border-radius: 10px;
      margin-left: 10px;
      text-align: left;
      width: 200px;
    }
  }
  .table-content{
    .ant-alert{
      padding: 8px 15px 8px 15px;
    }
  }
  .cell{
    width: 100%;
    padding: 16px 20px;
    border: 1px solid #d9dfe2;
    margin-bottom: 5px;
    position: relative;
    .select{
      position: absolute;
      top: -1px;
      left: -1px;
    }
    .ent{
      color: #0091ea;
      font-weight: 600;
      margin-right: 30px;
      font-size: 15px;
    }
    .area{
      color: #778fa0;
      padding: 3px 5px;
      background: #d6eaff;
      margin-right: 40px;
      font-weight: 600;
    }
    .type{
      color: #747474;
      font-size: 15px;
    }
    .desc{
      color: #919ba2;
      margin: 5px 0;
    }
    .btn{
      float: right;
      cursor: pointer;
      &:hover{
        color: #0091ea;
      }
    }
    .time{
      color: #c3c3c3;
    }
  }
  .ant-checkbox-group{
    width: 100%;
  }
  .ant-drawer{
    .ant-form-item{
      margin-bottom: 2px;
    }
  }
</style>
<style lang="scss">
  .cell{
    .ant-checkbox{
      height: 16px;
      vertical-align: top;
    }
  }
</style>