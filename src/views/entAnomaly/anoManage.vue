<template>
  <queryList :modelName="modelName" :exceptStatus="exceptStatus"></queryList>
</template>

<script>
  import queryList from './components/queryList'
  export default {
    name: 'anoManage',
    title:'异常处理',
    components:{
      queryList
    },
    data(){
      return{
        modelName: 'anoManage',
        exceptStatus:1
      }
    }
  }
</script>

<style scoped>

</style>