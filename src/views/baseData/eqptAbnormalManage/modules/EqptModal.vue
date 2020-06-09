<template>
  <a-drawer
    :title="title"
    :width="800"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible"
  >

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="事件类型">
          <a-select v-if="!isEdit" v-decorator="['exceptType', { rules: [{ required: true, message: '事件类型不能为空' }] }]" @change="changeExceptType" >
            <a-select-option value="3">功率越限</a-select-option>
            <a-select-option value="4">电流越限</a-select-option>
            <a-select-option value="5">电压越限</a-select-option>
            <a-select-option value="6">用电量报警</a-select-option>
          </a-select>
          <a-select v-else :disabled="isEdit" v-decorator="['exceptType', {}]" >
            <a-select-option value="3">功率越限</a-select-option>
            <a-select-option value="4">电流越限</a-select-option>
            <a-select-option value="5">电压越限</a-select-option>
            <a-select-option value="6">用电量报警</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="参数">
          <a-select v-if="!isEdit" v-decorator="['unit', { rules: [{ required: true, message: '参数不能为空' }] }]" @change="changeUnit" >
            <a-select-option value="3">P(功率KW)</a-select-option>
            <a-select-option value="4">I(功率A)</a-select-option>
            <a-select-option value="5">U(功率V)</a-select-option>
            <a-select-option value="6">Pv(功率KW·h)</a-select-option>
          </a-select>
          <a-select v-else :disabled="isEdit" v-decorator="['unit', {}]" >
            <a-select-option value="3">P(功率KW)</a-select-option>
            <a-select-option value="4">I(功率A)</a-select-option>
            <a-select-option value="5">U(功率V)</a-select-option>
            <a-select-option value="6">Pv(功率KW·h)</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="监测点">
          <div style="height: 300px;overflow: auto;">
            <a-tree
              v-if="treeData"
              checkable
              :expandedKeys="expandedKeys"
              :autoExpandParent="autoExpandParent"
              v-model="checkedKeys"
              @check="onCheck"
              :disabled="isEdit"
              :treeData="treeData"
            />
          </div>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="条件">
          <a-select v-if="!isEdit" v-decorator="['triggerCondition', { rules: [{ required: true, message: '条件不能为空' }] }]" >
            <a-select-option value="0">>=</a-select-option>
            <a-select-option value="1"><=</a-select-option>
          </a-select>
          <a-select v-else v-decorator="['triggerCondition', {}]" >
            <a-select-option value="0">>=</a-select-option>
            <a-select-option value="1"><=</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="阈值">
          <a-input v-decorator="['threshold', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注">
          <a-input v-decorator="['remark', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否启用">
          <a-radio-group name="isUse" v-model="queryParam.isUse">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">未启用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
    <a-button type="primary" @click="handleOk">确定</a-button>
    <a-button type="primary" @click="handleCancel">取消</a-button>
  </a-drawer>
</template>

<script>
  import { httpAction } from '@/api/manage'
  // import pick from 'lodash.pick'
  // import moment from "moment"
  export default {
    data () {
      return {
        isEdit:true,
        title:"操作",
        visible: false,
        // 树节点
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        treeData: [],
        allKeys:[],
        
        queryParam: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        myConfig: {
          // 如果需要上传功能,找后端小伙伴要服务器接口地址
          serverUrl: '/api/sys/common/upload',
          // 你的UEditor资源存放的路径,相对于打包后的index.html
          UEDITOR_HOME_URL: '/UEditor/',
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 240,
          // 初始容器宽度
          initialFrameWidth: '100%',
          // 关闭自动保存
          enableAutoSave: false,
          toolbars: [
            ['undo', 'redo', '|', 'fontsize','bold','italic','underline','forecolor','backcolor','justifyleft','justifycenter','justifyright','justifyjustify', 'lineheight'],
            ['insertimage','insertvideo','music','link']
          ]
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          add: "/serEntExceptionSet/add",
          edit: "/serEntExceptionSet/edit",
        },
        content: ""
      }
    },
    created(){
      let url = "/baseInstitution/queryAllTree"
      httpAction(url,{},"get").then((res)=>{
        if(res.success){
          this.treeData = this.changeField(res.result)
          this.expandedKeys = this.allKeys
          this.checkedKeys = []
        }
      })
    },
    mounted() {
      
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.content = record.content;
        this.queryParam = Object.assign({}, record);
        this.visible = true;
        if(JSON.stringify(this.queryParam) == "{}"){
          this.isEdit = false
          this.queryParam.isUse = 0
          this.$nextTick(() => {
            this.form.setFieldsValue(this.queryParam)
          });
          return
        }else{
          this.isEdit = true
          this.$nextTick(() => {
            this.form.setFieldsValue(this.queryParam)
            this.checkedKeys = []
            this.checkedKeys[0] = this.queryParam.monitorId
          });
        }
        
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.checkedKeys = []
        this.queryParam = {}
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.queryParam.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            this.queryParam.content = this.content;
            let formData = Object.assign(this.queryParam, values);
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
        })
      },
      handleCancel () {
        this.close()
      },
      // 事件类型单位同步切换
      changeExceptType(value){
        this.queryParam.exceptType = value
        this.queryParam.unit = value
        this.$nextTick(function(){
          this.form.setFieldsValue(this.queryParam)
        })
      },
      changeUnit(value){
        this.queryParam.exceptType = value
        this.queryParam.unit = value
        this.$nextTick(function(){
          this.form.setFieldsValue(this.queryParam)
        })        
      },
      // 树节点选中
      onCheck (checkedKeys) {
        this.checkedKeys = checkedKeys
        this.queryParam.monitorId = this.checkedKeys.join()
      },
      changeField(vals){
        let res = []
        vals.forEach(val =>{
          this.allKeys.push(val.key)
          if(val.children && val.children.length > 0){
            val.isLeaf=false
            val.children = this.changeField(val.children)
          }else {
            val.isLeaf=true
          }
          res.push(val)
        })
        return res
      }
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
  .ant-btn {
    margin-left: 30px;
    margin-bottom: 30px;
    float: right;
  }
</style>
