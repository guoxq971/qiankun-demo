<template>
  <a-config-provider :theme="theme" component-size="small">
    <RouterView />
  </a-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { theme } from '@/config/themeConfig';
// body中插入 --color-primary
document.body.style.setProperty('--color-primary', theme.token?.colorPrimary as string);
</script>

<style scoped lang="scss"></style>
