<template>
    <div>
      <el-form :ref="refname" :model="formdata" :rules="rules" label-width="80px" size="mini" :class="thiscname" :inline="inline||false">
        <el-form-item v-for="(formlist,index) in formfmt" :key="`formItem_${index}`" :label="formlist.label" :prop="formlist.prop" >
          <el-input  v-if="formlist.type=='input'" v-model="formdata[formlist.prop]"></el-input>
          <el-select v-else-if="formlist.type=='select'"   placeholder="请选择"  v-model="formdata[formlist.prop]" >
            <el-option
              v-for="item in formlist.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-cascader
            v-else-if="formlist.type=='cascader'"
            v-model="formdata[formlist.prop]"
            placeholder="试试搜索：指南"
            filterable
            :options="formlist.options"
            change-on-select
          ></el-cascader>
          <el-input-number  v-else-if="formlist.type=='number'"  v-model="formdata[formlist.prop]" controls-position="right"  :min="1"></el-input-number>
          <el-input v-else-if="formlist.type=='textarea'"  type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span ></span>
    </div>
</template>
<style>


</style>
<script>
    export default{
        data(){
            return {
              thiscname:'verticalForm'
            }
        },
      mounted(){
        if(this.cname==''){
          this.thiscname=''
        }
      },

      watch:{

      },
      props:['refname','formdata','rules','formfmt','cname','inline']
    }
</script>
