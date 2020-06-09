<template>
  <div class="page-header-index-wide">

  </div>
</template>

<script>
  import {httpAction} from '@/api/manage'
  import lineChart from './moduls/lineChart'
  import txcTable from './moduls/txcTable'
  import ChartCard from '@/components/ChartCard'
  import ACol from "ant-design-vue/es/grid/Col"
  import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  import MiniArea from '@/components/chart/MiniArea'
  import MiniBar from '@/components/chart/MiniBar'
  import MiniProgress from '@/components/chart/MiniProgress'
  import RankList from '@/components/chart/RankList'
  import Bar from '@/components/chart/Bar'
  import BarMultid from '@/components/chart/BarMultid'
  import LineChartMultid from '@/components/chart/LineChartMultid'
  import HeadInfo from '@/components/tools/HeadInfo.vue'

  import Trend from '@/components/Trend'
  import { getLoginfo,getVisitInfo } from '@/api/api'
  export default {
    name: "Analysis",
    components: {
      lineChart,
      BarMultid,
      txcTable,
      ATooltip,
      ACol,
      ChartCard,
      MiniArea,
      MiniBar,
      MiniProgress,
      RankList,
      Bar,
      Trend,
      LineChartMultid,
      HeadInfo
    },
    data() {
      return {
        entCount: null,
        productMonitorCount: null,
        grovernMonitorCount: null,
        totalMonitorCount: null,
        today: null,
        yesterday: null,
        xAxis: ['生产用电'],
        dataList: [
        ],
        datas: [
          { type: '今日',},
          { type: '昨日',}
        ],
        xAxis2: [],
        loading: true,
        center: null,
        lineList: [],
        barDatas:[],
        // barDatas:[
        //   {
        //     x:'z',
        //     y:1
        //   },
        //   {
        //     x:'q',
        //     y:2
        //   },
        //   {
        //     x:'w',
        //     y:3
        //   },
        //   {
        //     x:'e',
        //     y:4
        //   },{
        //     x:'r',
        //     y:5
        //   },
        //   {
        //     x:'t',
        //     y:6
        //   },{
        //     x:'y',
        //     y:7
        //   },
        //   {
        //     x:'u',
        //     y:8
        //   },{
        //     x:'i',
        //     y:8
        //   },{
        //     x:'o',
        //     y:9
        //   },
        //
        //
        //
        //
        // ],
        loginfo:{},
        visitFields:['ip','visit'],
        visitInfo:[],
        // indicator: <a-icon type="loading" style="font-size: 24px" spin />
      }
    },
    created() {
      // 首页数据
      this.initLogInfo();
    },
    methods: {
      jcDetails(){
        this.$router.push('/dataMonitoring/realTime')
      },
      initLogInfo () {
        getLoginfo(null).then((res)=>{
          if(res.success){
            Object.keys(res.result).forEach(key=>{
              res.result[key] =res.result[key]+""
            })
            this.loginfo = res.result;
          }
        })
        getVisitInfo().then(res=>{
          if(res.success){
             console.log("aaaaaa",res.result)
             this.visitInfo = res.result;
           }
         })
      },
    }
  }
</script>
<style>
  .ant-card-head-title{
    font-size: 16px;
  }
</style>
<style lang="scss" scoped>
  .ant-col-6{
    cursor: pointer;
  }
  .cell-title{
    padding-left: 20px;
    font-size: 15px;
  }
  .cell{
    background-image: linear-gradient(-45deg, #50c2fa, #1384f3);
    color: white;
    width: 100%;
    height: 130px;
    border-radius: 20px;
    /*margin-bottom: 20px;*/
    .cell-content{
      margin-top: 30px;
    }
    .ant-row{
      background: url(../../assets/img/1.png) no-repeat;
      background-size: 120px 100%;
      height: 100%;
      text-align: center;
      font-size: 15px;
    }
    .cell-text{
      font-size: 24px;
    }
  }
  .cell2{
    background: linear-gradient(-45deg, #b789e9, #753bcb);
    .ant-row{
      background: url(../../assets/img/2.png) no-repeat;
    }
  }
  .cell3{
    background: linear-gradient(-45deg, #6ed97f, #38bb46);
    .ant-row{
      background: url(../../assets/img/2.png) no-repeat;
    }
  }
  .circle-cust{
    position: relative;
    top: 28px;
    left: -100%;
  }
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  /* 首页访问量统计 */
  .head-info {
    position: relative;
    text-align: left;
    padding: 0 32px 0 0;
    min-width: 125px;

    &.center {
      text-align: center;
      padding: 0 32px;
    }

    span {
      color: rgba(0, 0, 0, .45);
      display: inline-block;
      font-size: .95rem;
      line-height: 42px;
      margin-bottom: 4px;
    }
    p {
      line-height: 42px;
      margin: 0;
      a {
        font-weight: 600;
        font-size: 1rem;
      }
    }
  }
</style>
