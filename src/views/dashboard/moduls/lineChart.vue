<template>
    <div>
      <div id="linechart"></div>
    </div>
</template>

<script>
  import echarts from 'echarts';
  import resize from '../mixins/resize'
  require('echarts/theme/macarons')
  export default {
    mixins: [resize],
    props: {
      chartData: {
        type: Array,
        default: () => {
          return []
        }
      },
    },
    data() {
      return {
        chart: null,
        radio: '',
        yName: '',
        chartName: '',
        legendData: []
      }
    },
    watch: {
      chartData(val) {
        this.setOptions(val)
        console.log(this.chartData, '***********')
      }
    },
    created() {
      this.$nextTick(() =>{
        this.initChart()
      })
    },
    mounted() {
    },
    methods: {
      initChart() {
        this.echart = echarts.init(document.getElementById('linechart'), 'macarons');
        this.setOptions(this.chartData)
      },
      setOptions(val){
        this.chart.setOption({
          backgroundColor: 'white',
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'cross',
              textStyle: {
                color: '#fff'
              }
            }
          },
          xAxis: [
            {
              type : 'category',
              boundaryGap : false,
              data : ['周一','周二','周三','周四','周五','周六','周日']
            }
          ],
          yAxis : [
            {
              type : 'value',
              axisLabel : {
                formatter: '{value} °C'
              }
            }
          ],
          series: [
            {
              // name: this.yName,
              type: 'line',
              color: ['rgb(0,171,216)'],
              data: [1,2,3,4,5,6,7]
            }
          ]
        })
      },
    }
  };
</script>

<style scoped>

</style>