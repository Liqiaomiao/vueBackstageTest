<template>
  <el-table  :data="data" border class="wi100">
    <template v-for="colConfig in colConfigs" >
      <slot :name="colConfig.slot" v-if="colConfig.slot" ></slot>
      <el-table-column v-else
                       :align="colConfig.align"
                       :prop="colConfig.prop"
                       :label="colConfig.label"
                       :key="colConfig.prop"
                       :formatter="colConfig.fmt">
      </el-table-column>
    </template>
  </el-table>
</template>
<script>
  let vm;
    export default{
      name:'myTable',
      props: ['colConfigs', 'data'],
      data(){
          return{
              tableH:"250px"
          }
      },
      methods:{
        resetHeight() {//设置表格高度
          let windowH = document.body.clientHeight || document.documentElement.clientHeight;
          let headerh = parseInt(document.querySelector('.el-header').clientHeight);
          let $btn = document.querySelector('.button_container');
          let btnH=0;
          if($btn){
               btnH = $btn.offsetHeight;
          }
          let padH =  40;
          this.$el.style.height=windowH - headerh - btnH-padH + 'px';
        }
      },
      created(){

      },
      mounted(){
        vm=this;
        this.resetHeight();
        window.addEventListener('resize',handleresize,false)
      },
      destory (){
        vm=this;
        window.removeEventListener('resize',handleresize,false)
      }
    }
    function handleresize() {
       vm.resetHeight()
    }
</script>
<style lang="less">
  .wi100{
    width: 100%;
    .el-table__header,
    .el-table__body{
        width: 100%!important;
     }
  }

</style>
