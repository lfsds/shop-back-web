<template>
  <a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <!-- 主表单区域 -->
      <a-form :form="form">
        <a-row>

          <a-col :span="12">
            <a-form-item label="用户id" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="[ 'userId', validatorRules.userId]" placeholder="请输入用户id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="收货信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="[ 'addressId', validatorRules.addressId]" placeholder="请输入收货信息"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="订单备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="[ 'message', validatorRules.message]" placeholder="请输入订单备注"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="订单号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="[ 'orderSn', validatorRules.orderSn]" placeholder="请输入订单号"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="实付金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="[ 'realPrice', validatorRules.realPrice]" placeholder="请输入实付金额" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['status', validatorRules.order_status]" :trigger-change="true" dictCode="order_status" placeholder="请选择状态"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="总金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="[ 'totalPrice', validatorRules.totalPrice]" placeholder="请输入总金额" style="width: 100%"/>
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>

      <!-- 子表单区域 -->
      <a-tabs v-model="activeKey" @change="handleChangeTabs">
        <a-tab-pane tab="订单子表" :key="refKeys[0]" :forceRender="true">
          <j-editable-table
            :ref="refKeys[0]"
            :loading="serOrderItemTable.loading"
            :columns="serOrderItemTable.columns"
            :dataSource="serOrderItemTable.dataSource"
            :maxHeight="300"
            :rowNumber="true"
            :rowSelection="true"
            :actionButton="true"/>
        </a-tab-pane>
        
      </a-tabs>

    </a-spin>
  </a-modal>
</template>

<script>

  import pick from 'lodash.pick'
  import { FormTypes,getRefPromise } from '@/utils/JEditableTableUtil'
  import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
  import { validateDuplicateValue } from '@/utils/util'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"

  export default {
    name: 'SerOrderModal',
    mixins: [JEditableTableMixin],
    components: {
      JDictSelectTag,
    },
    data() {
      return {
        labelCol: {
          span: 6
        },
        wrapperCol: {
          span: 16
        },
        labelCol2: {
          span: 3
        },
        wrapperCol2: {
          span: 20
        },
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 1,
        validatorRules: {
          userId: {rules: [
          ]},
          addressId: {rules: [
          ]},
          message: {rules: [
          ]},
          orderSn: {rules: [
          ]},
          realPrice: {rules: [
          ]},
          status: {rules: [
          ]},
          totalPrice: {rules: [
          ]},
        },
        refKeys: ['serOrderItem', ],
        tableKeys:['serOrderItem', ],
        activeKey: 'serOrderItem',
        // 订单子表
        serOrderItemTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '数量',
              key: 'count',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '商品id',
              key: 'goodsId',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '所属订单id',
              key: 'orderId',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: 'skuId',
              key: 'skuId',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '单价',
              key: 'price',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '合计',
              key: 'totalPrice',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
          ]
        },
        url: {
          add: "/order/serOrder/add",
          edit: "/order/serOrder/edit",
          serOrderItem: {
            list: '/order/serOrder/querySerOrderItemByMainId'
          },
        }
      }
    },
    methods: {
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        let fieldval = pick(this.model,'userId','addressId','message','orderSn','realPrice','status','totalPrice')
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldval)
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.serOrderItem.list, params, this.serOrderItemTable)
        }
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)

        return {
          ...main, // 展开
          serOrderItemList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },
     popupCallback(row){
       this.form.setFieldsValue(pick(row,'userId','addressId','message','orderSn','realPrice','status','totalPrice'))
     },

    }
  }
</script>

<style scoped>
</style>