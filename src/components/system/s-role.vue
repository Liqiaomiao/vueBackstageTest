<template>
  <div>
    <el-switch
      v-model="switchFlag"
      active-text="搜索开启"
      inactive-text="搜索关闭">
    </el-switch>
    <div v-show="switchFlag">
      <Form class="fl" :refname="'searchform'" :formdata="searchform" :rules="searchrules" :formfmt="searcgfmt" :cname="''" :inline="true" ></Form>
      <div class="search_btns">
        <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
        <el-button size="mini">重置</el-button>
      </div>
    </div>
    <div class="table_box">
      <el-button size="mini" type="primary" class="mb15" icon="el-icon-plus" @click="handleAdd">新增角色</el-button>
      <Table :colConfigs="colConfigs"  :data='roleList'>
        <template slot="slot">
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            >
            <template slot-scope="scope">
              <el-button @click="handleSwitch(scope.row)" type="text" size="small">{{scope.row.valid==1?'停用':'启用'}}</el-button>
              <el-button @click="handleDetail(scope.row)" type="text" size="small">详情</el-button>
              <el-button @click="handleModify(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="handleBind(scope.row)"   type="text" size="small">绑定菜单</el-button>
            </template>
          </el-table-column>

        </template>
        <template slot="valid">
          <el-table-column
            label="状态"
            align="center"
          >
            <template slot-scope="scope">
              <Tag type="dot"  :color="scope.row.valid==2?'red':'blue'">{{scope.row.valid==2?'停用':'启用'}}</Tag>
            </template>

          </el-table-column>

        </template>
      </Table>
    </div>

    <!--详情-->
    <el-dialog
      title="角色管理详情"
      :visible.sync="detailVisible"
      width="500px"
      append-to-body
    >
      <Detail :colConfigs="colConfigs" :row="row">
      </Detail>
    </el-dialog>
    <!--修改-->
    <!--['visible','title','rules','form','formfmt','inline','cname']-->
    <Pop
      :visible="modifyVisible"
      :title="'角色管理修改'"
      :formdata='senval'
      :rules="popRules"
      :formfmt="colConfigs"
      :submitCallback="submitCallback"
      v-on:visibleChange="visibleChange"
    ></Pop>
    <!--添加-->
    <Pop
      :visible="addVisible"
      :title="'角色管理添加'"
      :formdata='addsenval'
      :rules="popRules"
      :formfmt="colConfigs"
      :submitCallback="submitCallback"
      v-on:visibleChange="visibleChange2"
    ></Pop>
    <!--绑定菜单-->
    <el-dialog
      :title="'绑定菜单'"
      :visible.sync="bindVisible"
      append-to-body
      width="800px"

    >
      <div  class="bindmenu">
        <h5 class="bindtitle"><el-checkbox v-model="checked">可选菜单</el-checkbox></h5>
        <div class="tree_box">
          <el-tree
            :data="menudata"
            show-checkbox
            node-key="key"
          >
          </el-tree>
        </div>

      </div>

    </el-dialog>
  </div>
</template>
<style>


</style>
<script>
  import Form from '../common-components/common-form.vue'
  import Table from '../common-components/my-table.vue'
  import Detail from '../common-components/detail.vue'
  import Pop from '../common-components/pop-common.vue'
  import roleList from '../../data/sysRole.js'
  import {menudata} from '../../data/menu.js';
  var obj=new Map();
  var parents=[];
  var test=new Map();
  function treedata(data) {
    var result=[];
    var p='';
    $.each(data,function (i, item) {
      obj.set(item.value,[item.label]);
      let parray=obj.get(item.value);
      if(parray){
        p=parray[0];
      }
      if(item.children){
        test.set(item.value,[item.resourcePid,item.value]);
        result.push({
          key:item.value,
          label:item.label,
          children:treedata(item.children)
        })
      }
      else{
        result.push({
          key:item.value,
          label:item.label
        })
      }
    });
    return result
  }
  var  menuArray=treedata(menudata.obj);
  let leveldata= [  //角色等级
    {value: 1, label: "管理员权限(最高权限 默认拥有所有菜单权限)"},
    {value: 2, label: "受保护角色"},
    {value: 3, label: "普通角色"}
  ];
  let rolevalid=[  //启用状态
    {value: 1, label: "启用"},
    {value: 2, label: "停用"}
  ]
  let senval={
      roleName:'',
      level:'',
      valid:'',
      remark:''
    }
  export default  {
    components:{
      Form,
      Table,
      Detail,
      Pop
    },
    data(){
      let store = this.$store.state.app.Role;

      return {
        switchFlag:store.switchFlag,
        searchform:store.searchForm,
        searchrules:{},
        searcgfmt:[
          {label:'角色名称',type:'input',prop:'roleName'},
          {label:'角色等级',type:'select',prop:'level',options:leveldata},
        ],
        roleList:roleList.obj,
        colConfigs:[
          {label:'角色名称',prop:'roleName',type:'input'},
          {label:'角色等级',prop:'level',type:'select',options:leveldata,fmt: (row) =>{
            return this.fmtlevel(row.level)
          }},
          {label:'状态',prop:'valid',type:'select',options:rolevalid,slot:'valid',align:'center'},
          {label:'备注',prop:'remark',type:'textarea'},
          {slot:'slot'}
        ],
        detailVisible:false,
        row:{},
        modifyVisible:false,
        popRules:{
          roleName:[ { required: true, message: '请输入角色名称', trigger: 'blur' }],
          level:[ { required: true, message: '请输入角色等级', trigger: 'blur' }],
          valid:[{ required: true, message: '请输入状态', trigger: 'blur' }]
        },
        senval:$.extend({},senval),
        addVisible:false,
        addsenval:$.extend({},senval),
        bindVisible:false,
        menudata:menuArray,
        checked:false
      }
    },
    methods:{
      handleSwitch(data){
        let text=data.valid==2?'启用':'停用';

        this.$confirm(`确认${text}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: `${text}成功!`
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: `已取消${text}`
          });
        });
      },
      handleDetail(data){
        this.detailVisible=true;
        let obj=$.extend({},data);
        for(let key in obj){
            if(key=='level'){
              obj[key]=this.fmtlevel(obj[key])
            }else if(key=='valid'){
              obj[key]=this.fmtvalid(obj[key])
            }
        }
        this.row=obj;

      },
      handleModify(data){
        this.modifyVisible=true;
        this.senval=$.extend({},data);
      },
      handleBind(data){
          this.bindVisible=true
      },
      submitCallback(){
          alert('submit from parent')
      },
      fmtlevel:function (data) {
        switch (data) {
          case 1:
            return '管理员';
            break;
          case 2:
            return '受保护角色';
            break;
          case 3:
            return '普通角色';
            break;
          default:
            return '司机';
            break;
        }
      },
      fmtvalid:function (data) {
        switch (data){
          case 2:
            return '停用';
            break;
          case 1:
            return '启用';
            break;
        }
      },
      handlePOPsubmit(formName){
          this.$refs[formName].$refs[formName].validate((valid)=>{
              if(valid){
                alert('submit!');
              } else {
                console.log('error submit!!');
                return false;
              }
              }
          )
      },
      handelPopCancel(formName){
        this.resetForm();
        this.addVisible=false;

      },
      visibleChange(value){
        this.modifyVisible=value;
      },
      visibleChange2(value){
        this.addVisible=value;
      },
      handleAdd(){
        this.addVisible=true;
        this.addsenval=$.extend({},senval)

      },
      resetForm() {
        this.$refs['addForm'].$refs['addForm'].resetFields();
//        this.$refs['modifyForm'].$refs['modifyForm'].resetFields();
      },
      beforeaddClose(done){
        this.resetForm();
        done();
      }
    },
    computed:{
      valid(data){
          console.log(data.$refs)
      }
    },
    watch:{
      switchFlag(value){
        this.$store.state.app.Role.switchFlag=value
      },
      searchform(value){
        this.$store.state.app.Role.searchForm=value
      }
    }

  }

</script>
