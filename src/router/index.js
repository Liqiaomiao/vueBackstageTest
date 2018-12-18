import Vue from 'vue'
import Router from 'vue-router'
import {routers,appRouter} from './router'
import store from '../store';
Vue.use(Router);
const RouterConfig={
  routes:routers
}

export  const router=new Router(RouterConfig);
router.beforeEach((to,from,next)=>{
  next();
})
router.afterEach((to,form)=>{

})
