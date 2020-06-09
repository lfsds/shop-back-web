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
          label="图片">
            <a-upload
                    :headers="{ 'X-Access-Token': token }"
                    name="file"
                    listType="picture-card"
                    class="avatar-uploader"
                    :showUploadList="false"
                    :action="url.uploadImageAction"
                    :beforeUpload="beforeUpload"
                    @change="handleChangeShareImg"
            >
                <img v-if="image" :src="image" alt="avatar" class="ant-upload-img-show" />
                <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">上传</div>
                </div>
            </a-upload>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="跳转地址">
          <a-input placeholder="请输入跳转地址" v-decorator="['toUrl', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序">
          <a-input-number :min="0" v-decorator="[ 'imgSort', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否显示">
            <a-radio-group :defaultValue="1" v-decorator="['isShow', {}]">
                <a-radio :value="1">启用</a-radio>
                <a-radio :value="2">停用</a-radio>
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
  import pick from 'lodash.pick'
  import moment from "moment"
  import { mapGetters } from 'vuex'

  export default {
    name: "ImageConfigModal",
    computed: {
      ...mapGetters(['token'])
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

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          add: "/imageConfig/add",
          edit: "/imageConfig/edit",
          uploadImageAction: '/api/sys/common/upload'
        },
        image: '',
        imageUrl: '',
        loading: false
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
        if (record.id) {
          this.image = `${window._CONFIG['domianURL']}/` + record.url;
          this.imageUrl = record.url;
        }
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'title','url','toUrl','imgSort','isShow','creatBy','deleteBy'))
		  //时间格式化
          this.form.setFieldsValue({deleteTime:this.model.deleteTime?moment(this.model.deleteTime):null})
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
            this.model.url = this.imageUrl;
            let formData = Object.assign(this.model, values);
            //时间格式化
            formData.deleteTime = formData.deleteTime?formData.deleteTime.format('YYYY-MM-DD HH:mm:ss'):null;

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
      handleChangeShareImg (info) {
        if (info.file.status === 'uploading') {
          this.loading = true
          return
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          this.imageUrl = info.file.response.message
          getBase64(info.file.originFileObj, (shareImage) => {
            this.image = shareImage
            this.loading = false
          })
        }
      },
      beforeUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG && !isPNG) {
          this.$message.error('上传图片只能是 JPG/PNG 格式!')
          this.loading = false
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
          this.loading = false
          return false
        }
        return isJPG || isPNG && isLt2M
      },

    }
  }
  function getBase64 (img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
  .ant-btn {
    margin-left: 30px;
    margin-bottom: 30px;
    float: right;
  }

.avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
}
.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}
</style>
