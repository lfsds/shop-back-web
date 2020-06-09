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
          label="标题">
          <a-input placeholder="请输入标题" v-decorator="['title', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="内容">
<!--          <a-input placeholder="请输入内容" v-decorator="['content', {}]" />-->
            <vue-ueditor-wrap v-model="content" :config="myConfig"></vue-ueditor-wrap>
        </a-form-item>
        <a-form-item
          v-if="0 === true"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="类型 1：政策法规 2：新闻">
          <a-input placeholder="请输入类型 1：政策法规 2：新闻" v-decorator="['type', {}]" />
        </a-form-item>
        <!--<a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="发布时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'publishTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'createTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="更新时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'updateTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="删除时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'deleteTime', {}]" />
        </a-form-item>-->

      </a-form>
    </a-spin>
    <a-button type="primary" @click="handleOk">确定</a-button>
    <a-button type="primary" @click="handleCancel">取消</a-button>
  </a-drawer>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module

  export default {
    name: "ArticleModal",
    components: {
      VueUeditorWrap
    },
    data () {
      return {
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
          add: "/article/add",
          edit: "/article/edit",
        },
        content: ""
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        console.log(record)
        this.form.resetFields();
        this.content = record.content;
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'title','content'))
		  //时间格式化
          /*this.form.setFieldsValue({publishTime:this.model.publishTime?moment(this.model.publishTime):null})
          this.form.setFieldsValue({createTime:this.model.createTime?moment(this.model.createTime):null})
          this.form.setFieldsValue({updateTime:this.model.updateTime?moment(this.model.updateTime):null})
          this.form.setFieldsValue({deleteTime:this.model.deleteTime?moment(this.model.deleteTime):null})*/
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
            /*formData.publishTime = formData.publishTime?formData.publishTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.createTime = formData.createTime?formData.createTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.updateTime = formData.updateTime?formData.updateTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.deleteTime = formData.deleteTime?formData.deleteTime.format('YYYY-MM-DD HH:mm:ss'):null;*/

            console.log(formData)
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
/** Button按钮间距 */
  .ant-btn {
    margin-left: 30px;
    margin-bottom: 30px;
    float: right;
  }
</style>
