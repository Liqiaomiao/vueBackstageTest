<template>
  <div>
    <div class="button_container">
      <el-button size="small" type="primary" class="mb15" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>
    <zk-table
      ref="table"
      sum-text="sum"
      index-text="#"
      :data="data"
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
      :selection-type="props.selectionType"
      @tree-icon-click="handleExpand"
      v-loading.fullscreen.lock="loading2"
    >
      <template slot="resourceUrl" slot-scope="scope">
        {{urlreset(scope)}}
      </template>
      <template slot="resourcePid" slot-scope="scope">
        {{getPname(scope)}}
      </template>
      <template slot="myac" slot-scope="scope">
        <el-button plain size="small" @click="handleEditor(scope)" >编辑</el-button>
      </template>
    </zk-table>

    <!--添加-->
    <el-dialog
      title="菜单管理添加"
      :visible.sync="dialogVisible"
      width="580px"
      :append-to-body="true"
      top="25vh"
      :before-close="handleBeforeClose"
      @close="handleClose"
    >
      <div style="width:65%;margin: 0 auto; ">
        <el-form  ref="form" size="small" label-width="80px" :rules="rules" :model="form" >
          <el-form-item label="菜单名称" prop="label">
            <el-input v-model="form.label" clearable></el-input>
          </el-form-item>
          <el-form-item label="菜单路径" prop="resourceUrl">
            <el-input v-model="form.resourceUrl" clearable></el-input>
          </el-form-item>
          <el-form-item label="父级节点" prop="resourcePid">
            <el-cascader
              filterable
              change-on-select
              :options="data"
              v-model="form.resourcePid"
              clearable
              >
            </el-cascader>
          </el-form-item>
          <el-form-item label="激活状态" prop="state">
            <el-select v-model="form.state" placeholder="请选择激活状态" clearable>
              <el-option label="有效" value="1"></el-option>
              <el-option label="无效" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="同级顺序" prop="resourceOrderNum">
            <el-input v-model.number="form.resourceOrderNum" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogCancel">取 消</el-button>
    <el-button :class="dialogType" type="primary" @click="dialogComfirm(dialogType)">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<script>
  import axios from 'axios'
  import {urls} from '../../apiConfig.js'
  let vm={};
  export default {
    name: "s-menu2",
    data() {
      return {
        loading2: true,
        dialogVisible: false,
        dialogType:'',
        props: {
          stripe: true,
          border: true,
          showHeader: true,
          showSummary: false,
          showRowHover: true,
          showIndex: false,
          treeType: true,
          isFold: true,
          expandType: false,
          selectionType: false,
          'max-height': '500px',
          emptyText:'1256'
        },
        data: [],
        parents: [],
        columns: [
          {
            label: '菜单管理',
            prop: 'label',
            width: '500px',
          },
          {
            label: '菜单路径',
            prop: 'resourceUrl',
            minWidth: '100px',
            type: 'template',
            template: 'resourceUrl',
          },
          {
            label: '父级菜单',
            prop: 'resourcePid',
            type: 'template',
            minWidth: '100px',
            template: 'resourcePid',
          },
          {
            label: '同级顺序',
            prop: 'resourceOrderNum',
            minWidth: '100px',
          },
          {
            label: '操作',
            prop: 'myac',
            minWidth: '20px',
            type: 'template',
            template: 'myac',
            align:'center',
            headerAlign:'center'
          },
        ],
        tableheader: '',
        tablebody: '',
        form:{
          label:'',
          resourceUrl:'',
          resourcePid:[],
          state:'',
          resourceOrderNum:"",
        },
        rules:{
          label:[
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
            ],

          state:[
            { required: true, message: '请选择激活状态 ', trigger: 'change' },
          ],
          resourceOrderNum:[
            { required: true, message: '请输入同级顺序', trigger: 'blur' },
            { type:'number',  message:'请输入数字',trigger:'blur' }
          ],


        }
      }
    },
    computed: {
      propList() {
        return Object.keys(this.props).map(item => ({
          name: item,
        }));
      },
    },
    methods: {
      handleClose(){
        this.form={
          label:'',
          resourceUrl:'',
          resourcePid:[],
          state:'',
          resourceOrderNum:"",
        }
      },
      dialogCancel(){
        this.dialogVisible=false;
        this.resetForm();
      },
      dialogComfirm(a){
        this.$refs.form.validate((valid) => {
          if (valid) {
            if(a=='Add'){
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration:900
              });
            }
            if(a=='Editor'){
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration:900
              });;
            }
            this.dialogVisible=false;
            this.resetForm();
          } else {
            console.log('error submit!!');
            return false;
          }
        });


      },
      urlreset(scope) {
        let result = scope.row.resourceUrl;
        if (result == '[Null]' || result == '-') {
          result = '';
        }
        return result
      },
      getPname(scope) {
        var index = this.parents.indexOf(scope.row.resourcePid);
        if (scope.row.resourcePid) {
          return this.parents[index - 1]
        }
      },
      resetWitdth() {//重置表格宽度
        let $tablebody = this.tablebody;
        let $tableheader = this.tableheader;
        if ($tablebody.clientWidth != $tableheader.clientWidth) {
          $tableheader.style.width = $tablebody.clientWidth + 'px'
        }
      },
      resetHeight() {//设置表格高度
        let windowH = document.body.clientHeight || document.documentElement.clientHeight;
        let headerh = parseInt(document.querySelector('.el-header').clientHeight);
        let btnH =  document.querySelector('.button_container').offsetHeight;
        let $tableheader = this.tableheader;
        let padH =  40;
        this.tablebody.style.height = windowH - headerh - $tableheader.clientHeight - btnH-padH + 'px';
      },
      handleExpand() { //鼠标单击树形icon
        setTimeout(() => {
          this.resetWitdth()
        }, 50)

      },
      handleAdd(){
        this.dialogType='Add'
        this.form={
          label:'',
          resourceUrl:'',
          resourcePid:[],
          state:'',
          resourceOrderNum:"",
        }
         this.dialogVisible=true;
      },
      handleBeforeClose(done) {
         this.resetForm();
         done();
      },
      resetForm(formName) {
        this.$refs.form.resetFields();
      },
      handleEditor(rowInfo){
        let rowValue =rowInfo.row;
        console.log(rowValue);
        this.dialogType='Editor';
        this.form={
          label:rowValue.label,
          resourceUrl:rowValue.resourceUrl,
          resourcePid:rowValue.parentval,
          state:rowValue.state,
          resourceOrderNum:Number(rowValue.resourceOrderNum),
        };
        this.dialogVisible=true;
      }
    },
    mounted() {
      let menudata2 = this.$store.state.menu.menudata;//使用store中的数据；没有的话请求
      if(menudata2.length ==0){
        axios({
          url: urls.getmenu
        }).then(async (res) => {
          this.loading2=false ;
          if(res.data.status){
            let menudata = res.data.obj;
            this.$store.commit('handlemenu',menudata)
            this.data = menudata;
            function flat(arr) {
              let result = [];
              arr.forEach((item) => {
                if(item.children){
                  result=result.concat(flat(item.children))
                }
                result.push(item.label, item.value)
              });
              return result
            }
            //last中存储菜单的名称和id,方便表格中根据pid找到父节点
            let last = flat(menudata);
            this.parents = last;
            await  setTimeout(() => { //表头宽度调整
              this.resetHeight()
              this.resetWitdth()
            }, 10)
          }

        });
      }else{
        (async()=> {
          this.loading2=false ;
          this.data=menudata2 ;
          await setTimeout(() => { //表头宽度调整
            this.resetWitdth()
            this.resetHeight()
          }, 10)
        })()

      }

      let $table = this.$refs.table.$el;
      let tableheader = $table.querySelector('.zk-table__header-wrapper');//获取表头div
      let tablebox = $table.querySelector('.zk-table__body-wrapper'); //获取表格主体div
      this.tableheader = tableheader;
      this.tablebody = tablebox;
      vm =this;
      window.addEventListener('resize',handleresize,false)
    },
    destroyed(){
      window.removeEventListener('resize',handleresize,false)
    }

  }
  function  handleresize() {
    vm.resetHeight()
    vm.resetWitdth()
  }

</script>

<style scoped>
  .zk-table{font-size: 14px;color:#606266}


</style>
<style>
  .zk-table__body{border-bottom:1px solid #e9eaec}
</style>
