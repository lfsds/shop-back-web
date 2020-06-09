<template>
  <queryList :modelName="modelName" :exceptStatus="exceptStatus"></queryList>
</template>

<script>
  import queryList from './components/queryList'
  export default {
    name: 'anoDeclare',
    title:'异常申报',
    components:{
      queryList
    },
    data(){
      return{
        modelName: 'anoDeclare',
        exceptStatus:2
      }
    }
  }
</script>

<style scoped>

</style>