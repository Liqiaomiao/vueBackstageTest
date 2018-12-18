<template>
      <el-dialog
        :title="title"
        :visible.sync="popVisible"
        width="500px"
        append-to-body
        :before-close="beforeClose"
      >
        <Form   ref="form"
                :refname="'form'"
                :rules="rules"
                :formdata="formdata"
                :formfmt="formfmt"
                :cname="cname||'verticalForm'"
        >
        </Form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="popCancel">取 消</el-button>
        <el-button type="primary" @click="popSubmit">确 定</el-button>
      </span>
      </el-dialog>
</template>
<style>
</style>
<script>
  /*
  * 组件必传项：  visible    =》 是否可见
  *             'title'     =》 标题
  *             'rules'     =》 验证规则     {}
  *             'formdata', =》 提交数据     {}
  *             'formfmt'   =》 弹窗展示内容 {label:'标题',prop:'属性',type:'input'},type:input||select||textarea。。
  * */
  import Form from '../common-components/common-form.vue'
    export default{
        data(){
            return {
              popVisible:false,
            }
        },
      methods:{
        popSubmit(){
          let that=this;
          this.$refs['form'].$refs['form'].validate((valid)=>{
              if(valid){
                that.submitCallback();
              } else {
                return false;
              }
            }
          )
        },
        resetForm() {
          this.$refs['form'].$refs['form'].resetFields();
        },
        popCancel(){
            this.popVisible=false;
            this.resetForm();
        },
        beforeClose(done){
          this.resetForm();
          done();
        }
      },
      components:{
        Form
      },
      watch:{
        visible(value){
            this.popVisible=value;
        },
        popVisible(value){
          this.$emit('visibleChange',value)
        },
        cname(value){
          console.log(value)
        }

      },
      props:['visible','title','rules','formdata','formfmt','submitCallback','cname']
    }
</script>
