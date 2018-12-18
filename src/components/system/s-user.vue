<template>
   <div>
     <commonTable :colConfigs="colConfigs" :data="tableData">
       <el-table-column slot="opt" label="操作">
         <el-button size="mini" slot-scope="{ row }">查看</el-button>
       </el-table-column>
     </commonTable>
   </div>

</template>
<style>


</style>
<script>
  import commonTable from '../common-components/my-table.vue'
    export default{
      data () {
        this.colConfigs = [
          { prop: 'date', label: '日期' },
          { prop: 'name', label: '姓名' },
          { prop: 'address', label: '地址' },
          {  prop: 'myac', label: '操作' , slot: 'opt'}
        ]
        return {
          tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }]
        }
      },
      components:{
        commonTable
      }

    }
</script>
