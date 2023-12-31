import "./public-path";
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import { routes } from "./router";
import store from "./store";

Vue.config.productionTip = false;

let router = null;
let instance = null;
let state = null;

function render(props = {}) {
  const { container } = props;
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? "/vue" : "/",
    mode: "history",
    routes,
  });

  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector("#app") : "#app");
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// 全局共享状态
function storeTest(props) {
  // 监听
  if (props.onGlobalStateChange) {
    props.onGlobalStateChange((value, prev) => {
      if (!state) state = value;
      console.log(props.name, "监听全局状态", value, prev);
    }, true);
  }
  // 设置
  if (props.setGlobalState) {
    // props.setGlobalState({ count: 2 });
  }
}

export async function bootstrap(props) {
  console.log("子应用(vue) 初始化(bootstrap)");
}

export async function mount(props) {
  console.log("子应用(vue) 挂载(mount) props=>", props);
  storeTest(props);
  render(props);
}

export async function unmount() {
  console.log("这是vue1 执行了 unmount");
  instance.$destroy();
  instance.$el.innerHTML = "";
  instance = null;
  router = null;
}
