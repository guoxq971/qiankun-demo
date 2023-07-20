import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

import { registerMicroApps, start, initGlobalState } from 'qiankun';
import render from './render/vueRender';

/**
 * 初始化全局 state
 * */
const state = { count: 1, fn: () => console.log(1) };
const actions = initGlobalState(state);
actions.onGlobalStateChange((state, prev) => {
  console.log('基座 监听全局状态', state, prev);
});
actions.setGlobalState(state);

/**
 * Step1 初始化应用（可选）
 */
render({ loading: true });
const loader = (loading) => render({ loading });

/**
 * Step2 注册子应用
 */
export const apps = [
  {
    name: '/vue', // 中文描述
    entry: '//localhost:7101', // 默认会加载这个html 解析里面的js 动态执行（子应用必须支持跨域）
    container: '#subapp-viewport', // 容器名
    activeRule: '/vue', // 激活的路径
    loader, // 加载器
  },
  {
    name: '/vue2',
    entry: '//localhost:7102',
    container: '#subapp-viewport',
    activeRule: '/vue2',
    loader,
  },
];
registerMicroApps(apps, {
  beforeLoad: [async (app) => console.log('基座打印: 加载前(before load)', app.name)],
  beforeMount: [async (app) => console.log('基座打印: 挂载前(before mount)', app.name)],
  afterUnmount: [async (app) => console.log('基座打印: 卸载后(after unload)', app.name)],
});

start();
