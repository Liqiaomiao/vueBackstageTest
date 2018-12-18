/**
 * Created by Liqiaomiao on 2018/4/12.
 */
import Main from '../components/Main.vue';//Main框架；
import Home from '../components/home/home.vue';//home；
import Page404 from '../components/error-page/404.vue'//404
import Smenu from '../components/system/s-menu2.vue';//菜单管理
import Suser from '../components/system/s-user.vue';//用户管理
import Srole from '../components/system/s-role.vue';//角色管理
import Dholiday from '../components/dispatch/holiday.vue';//调度
import Video from '../components/system/s-video'//视频
import tableTree from '../components/common-components/tableTree'// 树表格
import treeTransfer from '../components/system/treeTransfer' //树形穿梭框
import echartDemo from '../components/system/echartDemo' //树形穿梭框
import tabsDemo from '../components/system/tabsDemo.vue' //切签
export const page404={
  path: '/error',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component:Page404
}
export const otherRouter=  {
  path: '/',
  name: 'index',
  component: Main,
  children:[
    {path:'home',name:'首页',component:Home}
  ]
}
export const appRouter=[
  {
    path: '/system',
    name: '系统管理',
    component: Main,
    children:[
      {path:'menu',title:'树形表格',name:'树形表格',component:Smenu},
      {path:'user',title:'普通表格',name:'普通表格',component:Suser},
      {path:'role',title:'角色管理',name:'角色管理',component:Srole},
      {path:'video',title:'视频播放',name:'视频播放',component:Video},
      {path:'tableTree',title:'树表格',name:'树表格',component:tableTree},
      {path:'treeTransfer',title:'权限分配',name:'权限分配',component:treeTransfer},
      {path:'echartDemo',title:'图形界面',name:'图形界面',component:echartDemo},
      {path:'tabsDemo',title:'动态切签',name:'动态切签',component:tabsDemo},
    ]
  },{
    path: '/dispatch',
    name: '调度管理',
    component: Main,
    children:[
      {path:'driver/holiday',title:'节假日管理',name:'节假日管理',component:Dholiday},

    ]

  }
]
export const routers = [
  otherRouter,
  ...appRouter,
  page404

];
