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
          label="事件类型：">
          <a-input v-model="detailList.exceptType" disabled/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="企业名称：">
          <a-input  v-model="detailList.entName" disabled/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="设备名称：">
          <a-input v-model="detailList.facilityName" disabled/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="监测点名称：">
          <a-input v-model="detailList.monitorName" disabled/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="网关编号：">
          <a-input v-model="detailList.mnCode" disabled/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="异常发生时间：">
          <a-input v-model="detailList.createTime" disabled/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="异常原因：">
          <a-textarea :rows="4" v-model="detailList.exceptReason" disabled/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="核查人：">
          <a-input v-model="detailList.inspectName" disabled/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="核查时间：">
          <a-input v-model="detailList.inspectTime" disabled/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="核查结果：">
          <a-radio-group name="inspectResult" v-model="detailList.inspectResult" disabled>
              <a-radio :value="1">企业异常</a-radio>
              <a-radio :value="0">用电监管设备异常</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="详情描述：">
          <a-textarea :rows="4" v-model="detailList.detail" disabled/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="审核人：">
          <a-input v-model="detailList.checkName" disabled/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="审核时间：">
          <a-input v-model="detailList.checkTime" disabled/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="审核结果：">
          <a-radio-group name="checkResult" v-model="detailList.checkResult" disabled>
              <a-radio :value="0">未通过</a-radio>
              <a-radio :value="1">通过</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="审核意见：">
          <a-textarea :rows="4" v-model="detailList.checkIdea" disabled/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注：">
          <a-textarea :rows="4" v-model="detailList.remark" disabled/>
        </a-form-item>
      </a-form>
    </a-spin>
    <a-button type="primary" @click="handleCancel">取消</a-button>
  </a-drawer>
</template>

<script>
  import { getAction ,postAction,putAction,deleteAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  
  export default {
    name: "ArticleModal",
    data () {
      return {
        title:"异常详情",
        visible: false,
        detailList: {
          id: "1",
          entId: "b112e74c409dfcb69f75814639cc652e",
          entName: "演示企业数据采集仪",
          exceptType: "设备上电",
          exceptStatus: 6,
          monitorName: "演示治污系统监测点3",
          monitorId: "a13a4104b21015426192e145e422a58f",
          monitorCode: "100000",
          mnId: "1802187107b5fd60392325f6a5b3bc3c",
          mnCode: "MNTTTTTTTTTTTTTTTT117828",
          createTime: null,
          exceptReason: "生产设施锅炉的实时功率为1333.74KW,启停阈值为7.5KW,属于正常生产状态,关联的治污设施1#光氧的实时功率为0KW,启停阈值为0.8KW,未正常运行,治污设施异常",
          facilityName: "演示设施",
          facilityId: "d1a65f50d27c2759426f6d1164e287d3",
          inspectName: null,
          inspectTime: null,
          inspectResult: 0,
          checkName: null,
          checkTime: null,
          checkResult: null,
          remark: null,
          checkIdea: null,
          detail: null,
          instructions: null
        },
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
      init(id,type){
        this.visible = true;
        getAction('/serEntException/queryById',{
          id:id
        }).then((res) =>{
          console.log(res)
          if(res.success){
            this.detailList = res.result
            this.form.setFieldsValue(this.detailList)
          }else{
            this.$message.warning(res.message);
          }
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
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
