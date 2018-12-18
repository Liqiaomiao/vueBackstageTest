<style>

</style>
<template>
  <el-container>
    <el-aside width="220px" :style="this.isCollapse?this.collapse:this.unCollapse">
      <img src="../assets/images/logo.png" alt="" class="logo" v-show="!this.isCollapse">
      <img src="../assets/images/logo2.jpg" alt="" class="logo2" v-show="this.isCollapse">
      <el-menu
               class="el-menu-vertical-demo"
               :collapse="isCollapse"
               :default-active="menuActive"
               background-color="rgb(73, 80, 96)"
               text-color="rgba(255,255,255,0.7)"
               unique-opened
               @select="handleMenuSelect"
      >
        <Menu :menuList="this.menuList"></Menu>
      </el-menu>

    </el-aside>
    <el-container :style="this.isCollapse?this.collapseMain:this.unCollapseMain">
      <el-header>
        <Button :style="{transform: 'rotateZ(' + (this.isCollapse ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
          <Icon type="navicon" size="32"></Icon>
        </Button>
        <breadcrumbNav :currentPath="breads"></breadcrumbNav>
        <div class="tags-con" >
          <Tabs :tabActive="tabActive" :tabs="tabs" v-on:active="acivechange" v-on:tabchange="tabchange"></Tabs>
        </div>

      </el-header>

      <el-main>

        <router-view/>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
    import Menu from './main-components/menu.vue';//侧导航
    import breadcrumbNav from './main-components/breadcrumb.vue';//面包屑
    import Tabs from './main-components/tabs.vue';//切签
    import axios from 'axios'
    import {urls} from '../apiConfig.js'
    import  {menudata} from "../data/menu";

    export default{
        name:"Main",
        data(){
            return {
              isCollapse:false,
              unCollapse:{
                width:'220px'
              },
              collapse:{
                width:'50px'
              },
              unCollapseMain:{
                paddingLeft:'220px'
              },
              collapseMain:{
                paddingLeft:'50px'
              },
              menuList:menudata.obj,//侧导航
              breads:[],//面包屑
              tabActive:'',
              menuActive:'首页',
              get tabs(){
                let  tablist = sessionStorage.getItem('tablist');
                if(tablist){
                  return  tablist.split(',')
                }else{
                  retrun ['首页']
                }
              },
              set tabs(value){
                sessionStorage.setItem('tablist',value)
              }
            }
        },
        methods:{
          tabchange(value){
            this.tabs=value;
          },
          acivechange(value){
            this.tabActive=value
          },
          toggleClick(){//菜单开关
            this.isCollapse=!this.isCollapse;
          },
          handleMenuSelect(index,indexPath){//选中菜单
              let tablist=this.tabs; //app.js    tabs:["首页", __ob__: Observer]
              let currentIndex=tablist.indexOf(index);//'首页'...
              if(currentIndex==-1){  //切签选项中不存在，增加
                tablist.push(index);
                this.$store.state.app.breadsList.set(index,indexPath) //设置每页对应的面包屑 Map {{"菜单管理" => Array(2)}}
                this.tabActive = (Number(this.tabActive)+1).toString();
              }//路由内容更改，会触发update,所以切签如果存在，会触发usdate，即调用里面的方法（切签高亮；面包屑更改）
            //切换路由
                else{
                this.tabActive=(currentIndex+1).toString();
              }
            this.$router.push({
                name: index
              });


               //404
              if(this.$route.matched.length==0){
                this.$router.push({
                  name: 'error-404'
                });
                //如果为404，将新增的没有路由的切签项去除；
                this.$store.state.app.tabs.pop();
              }
            var curbread=this.$store.state.app.breadsList
            curbread=Array.from(curbread);
            curbread=JSON.stringify(curbread);
            sessionStorage.setItem('tablist',tablist)//储存切签
            localStorage.setItem('currentBread',curbread)//储存面包屑

          },
          duplicatMethods(){//高亮导航；高亮切签；更改面包屑；
            let currentRouteName=this.$route.name;                //当前路径的name:'首页'...
            var arr=Array.from(this.$store.state.app.tabs);       //切签项所有项['首页'...]
            if(arr.indexOf(currentRouteName)!=-1){                //获取当前切签
              this.tabActive= this.$store.state.app.tabActive=arr.indexOf(currentRouteName).toString();//当前切签高亮；'1'...√

            }
            this.menuActive=currentRouteName;//菜单高亮导航 √

            this.breads = this.$store.state.app.breadsList.get(currentRouteName);  //面包屑根据菜单路径更改；√





          },
        },
        computed:{
        },

        created(){

        },
        mounted(){
          this.duplicatMethods();
          let currenturl=this.$route.name;
          if(currenturl=='index'||currenturl=='首页'){
            sessionStorage.setItem('tablist',['首页'])
          }


          //this.duplicatMethods();//从404返回后能正常显示。
        },
        updated(){//当1.数据发生更改 或者2.<router-view>内容给改时触发
          this.duplicatMethods();
        },
        components:{
          Menu,
          breadcrumbNav,
          Tabs
        }
    }
</script>
