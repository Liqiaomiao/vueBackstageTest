/**
 * Created by Liqiaomiao on 2018/4/12.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import menu from './modules/menu'
Vue.use(Vuex);
const store=new Vuex.Store({
  state:{},
  mutations:{},
  actions:{},
  modules:{
    app,
    menu
  }
})
export default store;
