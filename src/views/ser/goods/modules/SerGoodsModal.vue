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
            <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="[ 'name', validatorRules.name]" placeholder="请输入名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <!-- <a-input v-decorator="[ 'categoryId', validatorRules.categoryId]" placeholder="分类"></a-input> -->
              <j-tree-select
                ref="treeSelect"
                placeholder="请选择物料分类"
                v-decorator="['categoryId', validatorRules.categoryId]"
                dict="ser_category,category_name,id"
                pidField="pid"
                pidValue="0"
                hasChildField="has_child">
              </j-tree-select>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="小图" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-upload v-decorator="['pic', validatorRules.pic]" :trigger-change="true"></j-upload>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="大图相册" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-upload v-decorator="['gallery', validatorRules.gallery]" :trigger-change="true"></j-upload>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="价格" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="[ 'price', validatorRules.price]" placeholder="请输入价格" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="库存数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="[ 'stock', validatorRules.stock]" placeholder="请输入库存数量" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="12">
            <a-form-item label="是否删除" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['isDelete', validatorRules.isDelete]" :trigger-change="true" dictCode="whether" placeholder="请选择是否删除"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否人气商品" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['isHot', validatorRules.isHot]" :trigger-change="true" dictCode="whether" placeholder="请选择是否人气商品"/>
            </a-form-item>
          </a-col> -->
          <a-col :span="12">
            <a-form-item label="是否新品推荐" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['isNew', validatorRules.isNew]" :trigger-change="true" dictCode="whether" placeholder="请选择是否新品推荐"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否上架" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['isOnSale', validatorRules.isOnSale]" :trigger-change="true" dictCode="whether" placeholder="请选择是否上架"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="产品简介" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="[ 'descript', validatorRules.descript]" placeholder="请输入产品简介"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="产品详情" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-editor v-decorator="['detail',{trigger:'input'}]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <!-- 子表单区域 -->
      <a-tabs v-model="activeKey" @change="handleChangeTabs">
        <a-tab-pane tab="商品sku表" :key="refKeys[0]" :forceRender="true">
          <j-editable-table
            :ref="refKeys[0]"
            :loading="serGoodsSkuTable.loading"
            :columns="serGoodsSkuTable.columns"
            :dataSource="serGoodsSkuTable.dataSource"
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
  import JUpload from '@/components/jeecg/JUpload'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import JEditor from '@/components/jeecg/JEditor'
  import JTreeSelect from '@/components/jeecg/JTreeSelect'

  export default {
    name: 'SerGoodsModal',
    mixins: [JEditableTableMixin],
    components: {
      JUpload,
      JDictSelectTag,
      JEditor,
      JTreeSelect,
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
          name: {rules: [
          ]},
          price: {rules: [
          ]},
          pic: {rules: [
          ]},
          descript: {rules: [
          ]},
          detail: {rules: [
          ]},
          gallery: {rules: [
          ]},
          categoryId: {rules: [
          ]},
          isDelete: {rules: [
          ]},
          isHot: {rules: [
          ]},
          isNew: {rules: [
          ]},
          isOnSale: {rules: [
          ]},
          stock: {rules: [
          ]},
        },
        refKeys: ['serGoodsSku', ],
        tableKeys:['serGoodsSku', ],
        activeKey: 'serGoodsSku',
        // 商品sku表
        serGoodsSkuTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '商品id',
              key: 'goodsId',
              type: FormTypes.hidden,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '颜色选项',
              key: 'colorSelect',
              type: FormTypes.select,
              dictCode:"color_select",
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '尺寸选项',
              key: 'sizeSelect',
              type: FormTypes.select,
              dictCode:"size_select",
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '价格',
              key: 'price',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '库存',
              key: 'stock',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
          ]
        },
        url: {
          add: "/category/serGoods/add",
          edit: "/category/serGoods/edit",
          serGoodsSku: {
            list: '/category/serGoods/querySerGoodsSkuByMainId'
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
        let fieldval = pick(this.model,'name','price','pic','descript','detail','gallery','categoryId','isDelete','isHot','isNew','isOnSale','stock')
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldval)
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.serGoodsSku.list, params, this.serGoodsSkuTable)
        }
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)

        return {
          ...main, // 展开
          serGoodsSkuList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },
     popupCallback(row){
       this.form.setFieldsValue(pick(row,'name','price','pic','descript','detail','gallery','categoryId','isDelete','isHot','isNew','isOnSale','stock'))
     },

    }
  }
</script>

<style scoped>
</style>