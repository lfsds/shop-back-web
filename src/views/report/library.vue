<template>
  <!-- 报表库 -->
  <div class="reports">
    <!-- 查询区域 -->
    <a-form layout="inline">
      <a-form-item label="报表"><a-input placeholder="请输入报表名称" v-model="reportName"></a-input></a-form-item>
      </a-col>
      <a-button type="primary" @click="searchQuery" icon="search">搜索</a-button>
    </a-form>
    <!-- 报表列表 -->
    <div class="reportList">
      <div class="report" v-for="(item,index) in reportList" :key="index" >
        <img class="img" src="../../../public/static/img/reportImg.jpg" alt="">
        <span class="name">{{ item.name }}</span>
        <span class="time">{{ item.time }}</span>
        <a-button :type="item.type == '1'?'primary':''" @click="quote(item.id)">{{ item.type == '1'?'引用':'取消' }}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
  const reportList = [];
    for (let i = 1; i < 15; i++) {
      reportList.push({
        id: i.toString(),
        name: `设备本月预警统计报表 ${i}`,
        time: `2019-12-2 09:56:19`,
        type:Math.floor(Math.random()*10)
      });
    }
  export default {
    data() {
      return {
        reportList,
        reportName:'',
      }
    },
    mounted() {
      
    },
    activated() {
      this.getReportList()
    },
    methods: {
      // 获取我的报表数据
      getReportList(){
        
      },
      // 查询
      searchQuery() {
        
      },
      // 取消/引用
      quote(id){
        console.log(id)
      },
      // 跳转详情
      viewDetail(){
        
      },
      // 确定删除
      confirm(id){
        console.log(id)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .reports{
    min-height: 400px;
    background: #fff;
    padding: 10px;
    .reportList{
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      .report{
        width: 130px;
        color: #404040;
        margin: 0 50px;
        font-size: 12px;
        overflow: hidden;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        &:hover .mask{
          display: block;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .img{
          width: 130px;
        }
      }
    }
  }
</style>
