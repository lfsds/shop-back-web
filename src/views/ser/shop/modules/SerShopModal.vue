<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="详细地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'address', validatorRules.address]" placeholder="请输入详细地址"></a-input>
        </a-form-item>
        <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'name', validatorRules.name]" placeholder="请输入姓名"></a-input>
        </a-form-item>
        <a-form-item label="电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tel', validatorRules.tel]" placeholder="请输入电话"></a-input>
        </a-form-item>
        <a-form-item label="营业时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'open', validatorRules.open]" placeholder="请输入营业时间"></a-input>
        </a-form-item>
        <a-form-item label="图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <j-upload v-decorator="['image', validatorRules.image]" :trigger-change="true"></j-upload> -->
            <a-upload
              name="file"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              action="http://localhost:9001/api/sys/common/upload"
              :before-upload="beforeUpload"
              @change="handleChange"
            >
              <img width="420px;" v-if="imageUrl" :src="imageUrl" alt="avatar" />
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                  Upload
                </div>
              </div>
            </a-upload>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: "SerShopModal",
    components: { 
    },
    data () {
      return {
        loading: false,
        imageUrl: '',

        form: this.$form.createForm(this),
        title:"操作",
        width:800,
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
        confirmLoading: false,
        validatorRules: {
          address: {rules: [
          ]},
          name: {rules: [
          ]},
          tel: {rules: [
          ]},
          open: {rules: [
          ]},
        },
        url: {
          add: "/shop/serShop/add",
          edit: "/shop/serShop/edit",
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
        this.model = Object.assign({}, record);
        this.imageUrl = this.model.image
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'address','name','tel','open'))
        })
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
            this.model.image = this.imageUrl
            let formData = Object.assign(this.model, values);
            console.log("表单提交数据",formData)
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
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'address','name','tel','open'))
      },
      handleChange(info) {
        if (info.file.status === 'uploading') {
          this.loading = true;
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          // getBase64(info.file.originFileObj, imageUrl => {
            this.imageUrl = 'http://localhost:9001/api/sys/common/view/' + info.file.response.message;
            this.loading = false;
          // });
        }
      },
      beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          this.$message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
      }
      
    }
  }
</script>