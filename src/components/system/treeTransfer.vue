<template>
  <div>
    <div class="treeTransfer">
      <div class="left">
        <div class="fixedtop">
          <h5> <el-checkbox v-model="checked">{{valueable}}</el-checkbox></h5>
          <div class="filerContainer">
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText"
              size="small"
              class="filterContainer"
            >
            </el-input>
          </div>

        </div>


        <div class="treeContainer">
          <el-tree
            :data="data2"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
            @check-change="handleChecked1"
            :filter-node-method="filterNode"
          >
          </el-tree>
        </div>

      </div>
      <div class="right">
        <div class="fixedtop">
          <h5>{{ownpower}}</h5>
        </div>

        <div class="treeContainer">
          <el-tree
            ref="righttree"
            :data="dataright"
            default-expand-all
            node-key="id"
            :props="defaultProps"
          >
         <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            Delete
          </el-button>
        </span>
      </span>
          </el-tree>
        </div>

      </div>
    </div>
    <el-button type="primary" size="small" @click="getCheckedNodes">确定</el-button>
    <span v-if="rightResult.length>0">
      您选择了 {{rightResult}}
    </span>
  </div>


</template>

<script>
  import {transfer} from "../../data/transfer";

  function resettree(arr) {
    let result = [];
    arr.forEach((item) => {
      if (item.children) {
        result.push({
          id: item.id,
          label: item.label,
          children: resettree(item.children)
        })
      } else {
        result.push({
          id: item.id,
          label: item.label,
          ifChildern: true
        })
      }
    })
    return result
  }

  let treedata = resettree(transfer.data2)
  export default {
    name: "treeTransfer",
    props: {
      valueable: {
        type: String,
        default: ' 可分配'
      },
      ownpower: {
        type: String,
        default: '已分配'
      }
    },
    data() {

      return {
        checked:false,
        data2: treedata,
        dataright: [],   //已分配的数据
        datachecked: [], //选中的值，用于移除权限后可分配权限的勾选状态更改
        rightResult: [],//最终值
        filterText:'',
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      checked(val){
        if(val){
           let arr = treedata.filter( (item)=>{
            return item
          });

          this.$refs.tree.setCheckedNodes(arr)
        }else{
          this.$refs.tree.setCheckedKeys([])
        }
      }
    },
    methods: {
      getCheckedNodes() {
        this.rightResult = flatten(this.dataright);
        function flatten(arr) {
          let result = [];
          arr.forEach((item) => {
            result.push(item.label);
            if (item.children) {//子集
              result=result.concat(flatten(item.children))
            }
          });
          return result
        }
      },
      handleChecked1() {
        let checkedNodes = this.$refs.tree.getCheckedNodes();
        if (checkedNodes.length > 0) {
          //递归数据，找到匹配节点，并生成包含选中节点的树；
          function matchtree(arr) {
            var result = [];
            arr.forEach((item, index) => {
              if (!item.children) {
                if (checkedNodes.includes(item)) {//找到匹配节点
                  result.push({
                    id: item.id,
                    label: item.label
                  });
                }
              }
              else {
                let obj = {
                  id: item.id,
                  label: item.label,
                  children: matchtree(item.children)
                }
                if (obj.children.length > 0) {//如果没有子节点就不生成
                  result.push(obj);
                }
              }
            });
            return result
          }

          let result = matchtree(treedata)

          this.dataright = result
        } else {
          this.dataright = [];
          /*this.$message({
            showClose: true,
            message: '请先选择需要分配的项',
            type: 'warning'
          });*/
        }
        this.datachecked = checkedNodes.filter((item) => {
          return item.ifChildern
        })

      },
      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
        const index2 = this.datachecked.findIndex(d => d.id === data.id);
        this.datachecked.splice(index2, 1)
        this.$refs.tree.setCheckedNodes(this.datachecked);

      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }
    },
    updated() {

    }
  }
</script>

<style scoped lang="less">
  @titleH:40px;
  .treeTransfer {
    margin-bottom: 15px;
    display: flex;
    & > .left,
    & > .right {
      width: 300px;
      border: 1px solid #eee;
      position: relative;
    }
    & > .left {
      border-right: none;
    }
    & > .btns_container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 0 10px;
      & > .el-button {
        width: 46px;
        height: 46px;
        margin-bottom: 20px;
        margin-left: 0;
      }
    }
    .fixedtop{
      position: absolute;
      z-index: 2;
      width: 100%;
    }
    h5 {
      background: #f5f7fa;
      height: @titleH;
      font-size: 14px;
      padding-left: 20px;
      line-height: @titleH;
      border-bottom: 1px solid #eee;

    }
    .treeContainer,.treeContainer2 {
      height: 100%;
      z-index: 0;
      margin-top:@titleH*2.2;
      height: 300px;
      overflow-y: auto;
    }
    .treeContainer2{
      margin-top:@titleH;
    }
    .filerContainer{
      padding: 10px 20px;
      background: #fff;
    }
  }
</style>
