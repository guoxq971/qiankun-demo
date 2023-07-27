<template>
  <div class="home-wrap">
    <!--头部导航栏-->
    <MyHeader />

    <div class="body-wrap">
      <!--左侧仪表盘-->
      <MyPanel />

      <!--画布-->
      <div class="right-canvas">
        <div class="canvas-wrap" id="canvas-container">
          <div id="canvas-three" v-show="!isShow" />
          <img draggable="false" id="canvas-img" :src="tempUrl" v-show="isShow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MyHeader from './header/index.vue';
import MyPanel from './panel/index.vue';
// import { useThree } from '@/useHook/three';
import { onMounted, ref } from 'vue';
import { useThree } from '@/useHook/three/index.ts';

let tempUrl = ref(''); // 临时url
let isShow = ref(false); // 是否显示临时图片

onMounted(() => {
  useThree();
});

// useThree({
//   in(three) {
//     isShow.value = false;
//   },
//   out(three) {
//     if (!isShow.value) {
//       tempUrl.value = three.value.screenShot();
//       isShow.value = true;
//     }
//   },
// });
</script>

<style scoped lang="scss">
@import './index.scss';
.body-wrap {
  display: flex;
  .right-canvas {
    user-select: none;
    flex: 1;
    background-image: linear-gradient(#18181c 14px, transparent 0), linear-gradient(90deg, transparent 14px, #86909c 0);
    background-size:
      15px 15px,
      15px 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    .canvas-wrap {
      width: 800px;
      height: 800px;
      background-color: #232324;
      border-color: #373739;
      border-radius: 10px;
      overflow: hidden;
      transition: all 0.4s;
      box-shadow: 0 8px 10px #1e1e1e1f;
      list-style: none;
    }
  }
}
</style>
