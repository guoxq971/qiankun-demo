<template>
  <header>
    <div class="chunk-wrap">
      <a-button @click="onMenu('close')">收起菜单</a-button>
      <a-button @click="onMenu('open')">展开菜单</a-button>
    </div>
    <div class="chunk-wrap">测试2</div>
    <div class="chunk-wrap">测试3</div>
  </header>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/stores/modules/menu.ts';

const { onMenu } = useMenuStore();
</script>

<style scoped lang="scss">
@import '../index.scss';
</style>
