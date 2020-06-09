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
          label="企业名称"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-decorator="[
          'enterpriseName',
          {rules: [{ required: true, message: '请输入企业名称!' }]}
        ]"
          >
          </a-input>
        </a-form-item>
        <a-form-item
          label="电压变比"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-decorator="[
          'voltageRatio'
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
          'cscc',
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
          'currentRatio'
        ]"
          />
        </a-form-item>
        <a-form-item
          label="所属省市区"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-cascader :options="options" v-decorator="[
          'administrativeRegion',
          {rules: [{ required: true, message: '请选择所属省市区！' }]}
        ]" />
        </a-form-item>
        <a-form-item
          label="企业详细地址"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-decorator="[
          'address',
          {rules: [{ required: true, message: '请输入企业详细地址!' }]}
        ]"
          />
        </a-form-item>
        <a-form-item
          label="企业负责人"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-decorator="[
          'principal'
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
          'principalPhone'
        ]"
          />
        </a-form-item>
        <a-form-item
          label="所属行业"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-cascader v-decorator="[
          'industry'
        ]" :options="industrys"/>
        </a-form-item>
<!--        <a-form-item-->
<!--          label="归属用户"-->
<!--          :label-col="labelCol"-->
<!--          :wrapper-col="wrapperCol"-->
<!--        >-->
<!--          <a-select-->
<!--            v-decorator="[-->
<!--          'gsyh'-->
<!--        ]"-->
<!--          >-->
<!--            <a-select-option value="male">-->
<!--              用户1-->
<!--            </a-select-option>-->
<!--            <a-select-option value="female">-->
<!--              用户2-->
<!--            </a-select-option>-->
<!--          </a-select>-->
<!--        </a-form-item>-->
        <a-form-item
          label="行政区域名称"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-tree-select
            style="width: 300px"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="treeData"
            placeholder='Please select'
            treeDefaultExpandAll
            v-decorator="[
          'administrativeRegionCode',
          {rules: [{ required: true, message: '请选择行政区域名称！' }]}
        ]"
          >
          </a-tree-select>
<!--          <a-input-->
<!--            v-decorator="[-->
<!--          'xzqymc',-->
<!--          {rules: [{ required: true, message: '请选择行政区域名称！' }]}-->
<!--        ]"-->
<!--          />-->
        </a-form-item>
        <a-form-item
          label="网关编号"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-decorator="[
          'gatewayCode'
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
          'instrumentAddress'
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
          'instrumentType'
        ]"
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
          'remark'
        ]" :autosize="{ minRows: 2, maxRows: 6 }" />
        </a-form-item>
        <a-form-item
          label="用户名"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-decorator="[
          'userName',
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
    </a-spin>
    <a-button type="primary" @click="handleOk">确定</a-button>
    <a-button type="primary" @click="handleCancel">取消</a-button>
  </a-drawer>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import industrys from '@/assets/js/json-data2'
  import moment from "moment"
  import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module
  import areas from '@/assets/js/json-data'
  export default {
    name: "IndexModal",
    components: {
      VueUeditorWrap
    },
    data () {
      return {
        industrys,
        options: areas,
        disabled: false,
        title:"操作",
        visible: false,
        model: {},
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
          add: "/reduceEmissionScheme/add",
          edit: "/reduceEmissionScheme/edit",
        },
        content: ""
      }
    },
    props: {
      treeData: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.content = record.content;
        this.model = Object.assign({}, record);
        this.visible = true;
        if(this.model.startTime) {
          this.model.startTime = moment(this.model.startTime,'YYYY-MM-DD HH:mm:ss')
          this.model.endTime = moment(this.model.endTime,'YYYY-MM-DD HH:mm:ss')
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(this.model)
          // this.form.setFieldsValue(pick(this.model,'title','content'))
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            this.model.content = this.content;
            let formData = Object.assign(this.model, values);
            //时间格式化
            formData.endTime = formData.endTime?formData.endTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.startTime = formData.startTime?formData.startTime.format('YYYY-MM-DD HH:mm:ss'):null;
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


    }
  }
</script>

<style lang="less" scoped>
  .ant-form-item{
    margin-bottom: 0  ;
  }
/** Button按钮间距 */
  .ant-btn {
    margin-top: 20px;
    margin-left: 30px;
    margin-bottom: 30px;
    float: right;
  }
</style>
