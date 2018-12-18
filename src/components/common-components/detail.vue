<template>
    <div class="popDetail">
        <el-row v-for="(colConfig,index) in colConfigs" v-if="colConfig.label" :key="`detail_${index}`" :id="`detail_${index}`">
          <el-col :span="8" class="tar pr20">{{colConfig.label}}：</el-col>
          <el-col :span="16">{{row[colConfig.prop]}}</el-col>
        </el-row>
    </div>
</template>
<style>


</style>
<script>
    export default{
        data(){
            return {}
        },
        props:['colConfigs','row']
    }
</script>
