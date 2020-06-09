<template>
  <queryList :modelName="modelName" :exceptStatus="exceptStatus"></queryList>
</template>

<script>
  import queryList from './components/queryList'

  export default {
    name: 'anoExamine',
    title:'异常审核',
    components:{
      queryList
    },
    data(){
      return{
        modelName: 'anoExamine',
        exceptStatus:3
      }
    }
  }
</script>

<style scoped>

</style>