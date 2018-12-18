// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'es6-promise/auto'
import Vue from 'vue'
import App from './App'
import {router} from './router/index'
import iView from 'iview'
import ElementUI from 'element-ui';
import ZkTable from 'vue-table-with-tree-grid'
import 'iview/dist/styles/iview.css'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/index.css';
import $ from 'jquery';
import store from './store';
import Pop from './components/common-components/pop-common.vue'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'videojs-contrib-hls'

import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
Vue.use(ElementUI);
Vue.use(ZkTable);
Vue.use(iView)
  .use(VueVideoPlayer);


Vue.config.productionTip = false;
Vue.component('Pop',Pop);

const requireComponent = require.context(
  // 其组件目录的相对路径
  './components/baseComponent',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    camelCase(
      // 剥去文件名开头的 `./` 和结尾的扩展名
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
    )
  )
  console.log(componentName);

  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
