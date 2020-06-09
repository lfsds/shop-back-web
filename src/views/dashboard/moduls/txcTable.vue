<template>
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        >

        <template slot="type" slot-scope="text, record">
          <template v-if="record.type != 1">
            <a-tag color="red">停产</a-tag>
          </template>
          <template v-else>
            <a-tag color="orange">限产</a-tag>
          </template>
        </template>
        <template slot="level" slot-scope="text, record">
          <template v-if="record.level === 1">
            <a-tag color="yellow">黄色预警</a-tag>
          </template>
          <template v-else-if="record.level === 2">
            <a-tag color="orange">橙色预警</a-tag>
          </template>
          <template v-else>
            <a-tag color="red">红色预警</a-tag>
          </template>
        </template>
        <template slot="state" slot-scope="text, record">
          <template v-if="record.state != 1">
            <a-tag color="green">启用</a-tag>
          </template>
          <template v-else>
            <a-tag color="orange">禁用</a-tag>
          </template>
        </template>
      </a-table>
    </div>
</template>

<script>
  import { httpAction } from '@/api/manage'
  export default {
    name: 'txcTable',
    data() {
      return{
        // columns: [
        //   {
        //     title: '序号',
        //     dataIndex: '',
        //     key:'rowIndex',
        //     width:60,
        //     align:"center",
        //     customRender:function (t,r,index) {
        //       return parseInt(index)+1;
        //     }
        //   },
        //   {
        //     title: '设置类型',
        //     dataIndex: 'type',
        //     align:"center",
        //     scopedSlots: { customRender: 'type' }
        //   }, {
        //     title: '限产百分比（%）',
        //     dataIndex: 'percentage',
        //     align:"center",
        //   }, {
        //     title: '开始时间',
        //     dataIndex: 'startTime',
        //     align:"center",
        //   }, {
        //     title: '结束时间',
        //     dataIndex: 'endTime',
        //     align:"center",
        //   }, {
        //     title: '预警等级',
        //     dataIndex: 'level',
        //     align:"center",
        //     scopedSlots: { customRender: 'level' }
        //   }, {
        //     title: '是否启用',
        //     dataIndex: 'state',
        //     align:"center",
        //     scopedSlots: { customRender: 'state' }
        //   }, {
        //     title: '创建时间',
        //     dataIndex: 'createTime',
        //     align:"center",
        //   }
        // ],
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title: '企业',
            dataIndex: 'type',
            align:"center",
            scopedSlots: { customRender: 'type' }
          }, {
            title: '行政区域',
            dataIndex: 'percentage',
            align:"center",
          }, {
            title: '日期',
            dataIndex: 'startTime',
            align:"center",
          }, {
            title: '目标负荷（%）',
            dataIndex: 'endTime',
            align:"center",
          }, {
            title: '当天负荷（kWh）',
            dataIndex: 'level',
            align:"center",
            scopedSlots: { customRender: 'level' }
          }, {
            title: '是否违规',
            dataIndex: 'state',
            align:"center",
            scopedSlots: { customRender: 'state' }
          },
        ],
        dataSource: []

      }
    },
    created() {
      
      // httpAction('/reduceEmissionScheme/list',{},'get').then((res) => {
      //   if(res.success){
      //     this.dataSource = res.result.records
      //   }
      // })
    }
  }
</script>

<style scoped>

</style>