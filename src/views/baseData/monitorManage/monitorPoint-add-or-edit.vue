<template>
</template>

<script>
</script>

<style>
</style>
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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设备类型">
          <a-radio-group :defaultValue="0" v-decorator="['deviceType', {}]">
            <a-radio :value="0">治污设备</a-radio>
            <a-radio :value="1">生产设备</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="车间选择">
          <a-tree-select
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="treeData"
            placeholder="请选择车间"
            treeDefaultExpandAll
            v-decorator="['owerWorkshop', {}]"
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="监测点名称">
          <a-input placeholder="请输入监测点名称" v-decorator="['monitoryPoint',{ rules: [{ required: true, message: '监测点名称不能为空' }] }]"  />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="网关编号">
          <a-input placeholder="请输入网关编号" v-decorator="['gatewayCode',{ rules: [{ required: true, message: '网关编号不能为空' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="仪表型号">
          <a-select mode="default" placeholder="请输入仪表型号" v-decorator="['instrumentType',{ rules: [{ required: true, message: '仪表型号不能为空' }] }]" >
            <a-select-option v-for="(itemYbxh,indexYbxh) in instrumentType" :key="indexYbxh" >{{ itemYbxh.text }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="仪表类别">
          <a-select mode="default" placeholder="请输入仪表类别" v-decorator="['instrumentCategory',{ rules: [{ required: true, message: '仪表类别不能为空' }] }]">
            <a-select-option v-for="(itemYblb,indexYblb) in instrumentCategory" :key="indexYblb" >{{ itemYblb.text }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否是演示箱">
          <a-radio-group name="isDemo" :defaultValue="1" v-decorator="['isDemo', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="电压变比">
          <a-input placeholder="请输入电压变比" v-decorator="['voltageRatio',{ rules: [{ required: true, message: '电压变比不能为空' }] }]"  />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="电流变比">
          <a-input placeholder="请输入电流变比" v-decorator="['currentRatio',{ rules: [{ required: true, message: '电流变比不能为空' }] }]"  />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="额定电压(V)">
          <a-input placeholder="请输入额定电压(V)" v-decorator="['rateVoltage',{}]"  />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="额定功率(kW)">
          <a-input placeholder="请输入额定功率(kW)" v-decorator="['ratePower',{}]"  />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="信息分类">
          <a-select mode="default" placeholder="请输入信息分类" v-decorator="['informationClassification',{ rules: [{ required: true, message: '信息分类不能为空' }] }]">
            <a-select-option v-for="(itemXxfl,indexXxfl) in informationClassification" :key="indexXxfl" >{{ itemXxfl.text }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="类别">
          <a-select mode="default" placeholder="请输入类别" v-decorator="['category',{ rules: [{ required: true, message: '类别不能为空' }] }]">
            <a-select-option v-for="(itemLb,indexLb) in category" :key="indexLb" >{{ itemLb.text }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工艺">
          <a-select mode="default" placeholder="请输入工艺" v-decorator="['technology',{ rules: [{ required: true, message: '工艺不能为空' }] }]">
            <a-select-option v-for="(itemGy,indexGy) in technology" :key="indexGy" >{{ itemGy.text }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设备用途">
          <a-input placeholder="请输入设备用途" v-decorator="['equipmentUseful',{ rules: [{ required: true, message: '设备用途不能为空' }] }]"  />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="功率启停阈值(kW)">
          <a-input placeholder="请输入功率启停阈值(kW)" v-decorator="['powerThreshold',{ rules: [{ required: true, message: '功率启停阈值(kW)不能为空' }] }]"  />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="功率门限时间(分钟)">
          <a-input placeholder="请输入功率门限时间(分钟)" v-decorator="['powerThresholdTime',{ rules: [{ required: true, message: '功率门限时间(分钟)不能为空' }] }]"  />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="电量阈值(kW·h)">
          <a-input placeholder="请输入电量阈值(kW·h)" v-decorator="['electricityThreshold',{}]"  />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="电量门限时间(分钟)">
          <a-input placeholder="请输入电量门限时间(分钟)" v-decorator="['electricityThresholdTime',{}]"  />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="摄像头编号">
          <a-input placeholder="请输入摄像头编号" v-decorator="['cameraNo',{}]"  />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
          <a-textarea placeholder="请输入备注" :rows="4" v-decorator="['remark',{}]"/>
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
  // import moment from "moment"
  import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module
  const treeData = [
      {
        title: 'Node1',
        value: '0-0',
        key: '0-0',
        children: [
          {
            title: 'Child Node1',
            value: '0-0-1',
            key: '0-0-1',
          },
          {
            title: 'Child Node2',
            value: '0-0-2',
            key: '0-0-2',
          },
        ],
      },
      {
        title: 'Node2',
        value: '0-1',
        key: '0-1',
      },
    ];
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
        treeData,
        time:'30',
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
          add: "/baseMonitoryPoint/add",
          edit: "/baseMonitoryPoint/edit",
        },
        technology	: [],//工艺
        category: [],//类别
        informationClassification: [],//信息分类	
        instrumentCategory: [],//仪表类别	
        instrumentType: [],//仪表型号	
      }
    },
    created () {
      
    },
    mounted() {
      this.getSelectList('technology')
      this.getSelectList('category')
      this.getSelectList('informationClassification')
      this.getSelectList('instrumentCategory')
      this.getSelectList('instrumentType')
    },
    methods: {
      getSelectList(type){
        httpAction(`/sys/dict/getDictItems/${type}`,{},'get').then((res)=>{
          if(res.success){
            if(type == 'technology'){
              this.technology = res.result
            }else if(type == 'category'){
              this.category = res.result
            }else if(type == 'informationClassification'){
              this.informationClassification = res.result
            }else if(type == 'instrumentCategory'){
              this.instrumentCategory = res.result
            }else{
              this.instrumentType = res.result
            }
          }else{
            this.$message.warning(res.message);
          }
        })
      },
      add () {
        this.edit({});
      },
      edit (record) {
        console.log(record)
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'deviceType','owerWorkshop','monitoryPoint','gatewayCode','instrumentType','instrumentCategory','isDemo','voltageRatio','currentRatio','rateVoltage','ratePower','informationClassification','category','technology','equipmentUseful','powerThreshold','powerThresholdTime','electricityThreshold','electricityThresholdTime','cameraNo','remark'))
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
          console.log(values)
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
            let formData = Object.assign(this.model, values);

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
      handleChange(){
        
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
