<template>
  <div id="app">
    <div class="mainapp">
      <!-- 标题栏 -->
      <header class="mainapp-header">
        <h1>QianKun</h1>
      </header>
      <div class="mainapp-main">
        <!-- 侧边栏 -->
        <ul class="mainapp-sidemenu">
          <li :class="{ active: activeRule === '/react16' }" @click="onClick('/react16')">React16</li>
          <li :class="{ active: activeRule === '/react15' }" @click="onClick('/react15')">React15</li>
          <li :class="{ active: activeRule === '/vue' }" @click="onClick('/vue')">Vue</li>
          <li :class="{ active: activeRule === '/vue2' }" @click="onClick('/vue2')">Vue2</li>
          <li :class="{ active: activeRule === '/vue3' }" @click="onClick('/vue3')">Vue3</li>
          <li :class="{ active: activeRule === '/angular9' }" @click="onClick('/angular9')">Angular9</li>
          <li :class="{ active: activeRule === '/purehtml' }" @click="onClick('/purehtml')">Purehtml</li>
        </ul>
        <!-- 子应用  -->
        <main id="subapp-container"></main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

let activeRule = ref('/vue');

// 重写函数
const _wr = function(type) {
  const orig = window.history[type];
  return function() {
    const rv = orig.apply(this, arguments);
    const e = new Event(type);
    e.arguments = arguments;
    window.dispatchEvent(e); // 派发自定义事件
    return rv;
  };
};
// 重写函数
window.history.pushState = _wr('pushState');
// 在这个函数中做跳转后的逻辑
const bindHistory = () => {
  const currentPath = '/' + window.location.pathname.split('/')[1];
  activeRule.value = currentPath;
};
window.addEventListener('pushState', bindHistory);
bindHistory();

function onClick(url) {
  const baseUrl = window.location.origin;
  const subAppUrl = `${baseUrl}/${url}`;
  history.pushState(null, url, url);
}
</script>

<style lang="scss">
@import './assets/index.scss';
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.active {
  color: red !important;
}
</style>
