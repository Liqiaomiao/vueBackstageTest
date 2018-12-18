<template>
  <div>
    <zk-table
      ref="table"
      sum-text="sum"
      index-text="#"
      :data="menudata"
      :columns="columns"
      :stripe="props.stripe"
      :border="props.border"
      :show-header="props.showHeader"
      :show-summary="props.showSummary"
      :show-row-hover="props.showRowHover"
      :show-index="props.showIndex"
      :tree-type="props.treeType"
      :is-fold="props.isFold"
      :expand-type="props.expandType"
      :selection-type="props.selectionType">
      <template slot="resourceUrl"  slot-scope="scope" >
        {{formatterurl(scope.row.resourceUrl)}}
      </template>

      <template slot="myac" slot-scope="scope">
        <el-button size="mini" @click="editor(scope)">编辑</el-button>
      </template>
    </zk-table>
    <el-dialog
      title="菜单管理修改"
      :visible.sync="dialogVisible"
      width="500px"
      :append-to-body=true
      :before-close="beforeClose"
    >
      <Form ref="formDialog" :refname="'formDialog'" :form="form" :rules="rules" :formfmt="formfmt" :cname="'verticalForm'" :inline="false"></Form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitForm" size="mini" >确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  import {menudata} from '../../data/menu.js';
  import Form from '../common-components/common-form.vue';
  import axios from 'axios'
  var obj=new Map();
  var parents=[];
  var test=new Map();
  function treedata(data) {
    var result=[];
    var p='';
    $.each(data,function (i, item) {
      obj.set(item.resourceId,[item.resourceName]);
      let parray=obj.get(item.resourcePid);
      if(parray){
        p=parray[0];
      }
      if(item.children.length>0){
        test.set(item.resourceId,[item.resourcePid,item.resourceId]);
        result.push({
          value:item.resourceId,
          label:item.resourceName,
          isParent:true,
          resourceName:item.resourceName,
          resourceUrl:item.resourceUrl,
          resourcePid:item.resourcePid,
          resourceState:item.resourceState,
          resourceOrderNum:item.resourceOrderNum,
          resourcePidP:p,
          resourceId:item.resourceId,
          children:treedata(item.children)
        })
      }
      else{
        result.push({
          value:item.resourceId,
          label:item.resourceName,
          resourceState:item.resourceState,
          resourceId:item.resourceId,
          resourceName:item.resourceName,
          resourceUrl:item.resourceUrl,
          resourcePid:item.resourcePid,
          resourcePidP:p,
          resourceOrderNum:item.resourceOrderNum
        })
      }
    });
    return result
  }

  var menuArray=treedata(menudata.obj);
  export default {
    name: 'smenu',
    components:{
      Form
    },
    data(){
        var states=[{value:'1',label:'有效'},{value:'0',label:'无效'}];
      return {
        menudata:menuArray,
        props: {
          stripe: false,
          border: true,
          showHeader: true,
          showSummary: false,
          showRowHover: true,
          showIndex: false,
          treeType: true,
          isFold: true,
          expandType: false,
          selectionType: false,
        },
        columns: [
          {
            label: '菜单名称',
            prop: 'resourceName',
            width: '400px',
          },
          {
            label: '菜单路径',
            prop: 'resourceUrl',
            minWidth: '50px',
            type: 'template',
            template:'resourceUrl'
          },
          {
            label: '父级菜单',
            prop: 'resourcePidP',

          },
          {
            label: '同级顺序',
            prop: 'resourceOrderNum',
            minWidth: '200px',
            align:'center',
            headerAlign:'center'

          },
          {
            label: '操作',
            prop: 'resourceOrderNum',
            minWidth: '200px',
            type: 'template',
            template: 'myac',
            align:'center',
            headerAlign:'center'
          },
        ],
        dialogVisible:false,
        formfmt:[
            {label:'菜单名称',type:'input',prop:'resourceName'},
            {label:'菜单路径',type:'input',prop:'resourceUrl'},
            {label:'父级节点',type:'cascader',prop:'resourcePid',options:menuArray},
            {label:'激活状态',type:'select',prop:'resourceState',options:states},
            {label:'同级顺序',type:'number',prop:'resourceOrderNum'},
            ],
        form:{
          resourceName:'',
          resourceId:'',
          resourceOrderNum:'',
          resourcePid:[],
          resourceState:'',
          resourceUrl:''
        },
        rules: {
          resourceName:[
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
          ],
          resourceState:[
            { required: true, message: '请选择激活状态', trigger: 'blur' },
          ],
          resourceOrderNum:[
            { required: true, message: '请输入同级顺序', trigger: 'blur' },
          ]

        }
      }
    },
    methods: {
      formatterurl(data){//表格地址格式化
         if(data=='[Null]'||data=='-'){
           return ''
         }else{
           return data
         }


      },
      editor(data){//编辑按钮

        var data=data.row;

        this.dialogVisible = true;
        for(let key in this.form){
          if(key in data){
            let val=data[key];
            if(key=='resourcePid'){
                val=[val];

                 for(let [key2,val2] of test.entries()){
                     //子pid==父id;test => [id,[pid,id]] ;组成爷=》 val=[父id，子id]
                     if(val==key2&&test.get(key2)[0]!=undefined){
                          val=test.get(key2)
                          //父.pid==爷.id;组成爷=》 val=[爷id，父id，子id]

                         if(test.get(val[0])[0]){
                           val.unshift(test.get(val[0])[0])
                           if(test.get(val[0])[0]){
                             val.unshift(test.get(val[0])[0])
                           }
                         }
                     }
                 }

            }
            this.form[key]=val
          }
        }


      },
      submitForm(){
        this.$refs['formDialog'].$refs['formDialog'].validate((valid) => {
          if (valid) {
            this.resetForm();
            this.dialogVisible = false;
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm() {
        this.$refs['formDialog'].$refs['formDialog'].resetFields();
      },
      beforeClose(done){
          this.resetForm();
          done();
      }
    },
    created (){
      axios({
        url:''
      })
     },
    mounted(){
      console.log('mounted',this.$el,this.form);
    }
  };
</script>
<style scoped>

</style>

