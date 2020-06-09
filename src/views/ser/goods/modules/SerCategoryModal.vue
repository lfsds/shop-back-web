<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :destroyOnClose="true"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="父分类ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-tree-select
            ref="treeSelect"
            placeholder="请选择父分类ID"
            v-decorator="['pid', validatorRules.pid]"
            dict="ser_category,category_name,id"
            pidField="parent_id"
            pidValue="0"
            hasChildField="has_child">
          </j-tree-select>
        </a-form-item>
        <a-form-item label="分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'categoryName', validatorRules.categoryName]" placeholder="请输入分类名称"></a-input>
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'categoryOrder', validatorRules.categoryOrder]" placeholder="请输入排序"></a-input>
        </a-form-item>
        <a-form-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'description', validatorRules.description]" placeholder="请输入描述"></a-input>
        </a-form-item>
        <!-- <a-form-item label="分类编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'categoryCode', validatorRules.categoryCode]" placeholder="请输入分类编码"></a-input>
        </a-form-item> -->
        <!-- <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'memo', validatorRules.memo]" placeholder="请输入备注"></a-input>
        </a-form-item> -->
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['status', validatorRules.status]" :trigger-change="true" dictCode="status" placeholder="请选择状态（1启用，0不启用）"/>
        </a-form-item>
        
        <!-- <a-form-item label="图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'carouselUrl', validatorRules.carouselUrl]" placeholder="图片"></a-input>
        </a-form-item> -->

        <!-- <a-form-item label="是否展示轮播图（0，不展示，1展示）" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['showCarouselFlag', validatorRules.showCarouselFlag]" :trigger-change="true" dictCode="whether" placeholder="请选择是否展示轮播图（0，不展示，1展示）"/>
        </a-form-item> -->
        <!-- <a-form-item label="是否展示（0，不展示，1展示）" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['showFlag', validatorRules.showFlag]" :trigger-change="true" dictCode="whether" placeholder="请选择是否展示（0，不展示，1展示）"/>
        </a-form-item> -->
        
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import JTreeSelect from '@/components/jeecg/JTreeSelect'
  
  export default {
    name: "SerCategoryModal",
    components: { 
      JDictSelectTag,
      JTreeSelect
    },
    data () {
      return {
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
          pid: {rules: [
          ]},
          pid: {rules: [
          ]},
          categoryName: {rules: [
          ]},
          categoryOrder: {rules: [
          ]},
          description: {rules: [
          ]},
          categoryType: {rules: [
          ]},
          categoryCode: {rules: [
          ]},
          memo: {rules: [
          ]},
          status: {rules: [
          ]},
          delFlag: {rules: [
          ]},
          carouselUrl: {rules: [
          ]},
          showCarouselFlag: {rules: [
          ]},
          showFlag: {rules: [
          ]},
        },
        url: {
          add: "/category/serCategory/add",
          edit: "/category/serCategory/edit",
        },
        expandedRowKeys:[],
        pidField:"pid"
     
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
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'pid','categoryName','categoryOrder','description','categoryType','categoryCode','memo','status','delFlag','carouselUrl','showCarouselFlag','showFlag'))
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
            let old_pid = this.model[this.pidField]
            let formData = Object.assign(this.model, values);
            let new_pid = this.model[this.pidField]
            console.log("表单提交数据",formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.submitSuccess(formData,old_pid==new_pid)
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
        this.form.setFieldsValue(pick(row,'pid','categoryName','categoryOrder','description','categoryType','categoryCode','memo','status','delFlag','carouselUrl','showCarouselFlag','showFlag'))
      },
      submitSuccess(formData,flag){
        if(!formData.id){
          let treeData = this.$refs.treeSelect.getCurrTreeData()
          this.expandedRowKeys=[]
          this.getExpandKeysByPid(formData[this.pidField],treeData,treeData)
          this.$emit('ok',formData,this.expandedRowKeys.reverse());
        }else{
          this.$emit('ok',formData,flag);
        }
      },
      getExpandKeysByPid(pid,arr,all){
        if(pid && arr && arr.length>0){
          for(let i=0;i<arr.length;i++){
            if(arr[i].key==pid){
              this.expandedRowKeys.push(arr[i].key)
              this.getExpandKeysByPid(arr[i]['parentId'],all,all)
            }else{
              this.getExpandKeysByPid(pid,arr[i].children,all)
            }
          }
        }
      }
      
      
    }
  }
</script>