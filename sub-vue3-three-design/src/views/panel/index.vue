<template>
  <div class="panel-wrap" :class="{ 'panel-wrap2': isClose }">
    <div class="nav-wrap">
      <div class="menu-title">组件</div>

      <div v-show="isOpen">
        <!--单列 | 双列-->
        <a-tooltip placement="bottom" title="双列">
          <appstore-outlined @click="onPreview('small')" :style="{ color: isSmall ? 'var(--color-primary)' : '', fontSize: '22px', marginRight: '4px' }" />
        </a-tooltip>
        <a-tooltip placement="bottom" title="单列">
          <border-outlined @click="onPreview('big')" :style="{ color: isBig ? 'var(--color-primary)' : '', fontSize: '22px' }" />
        </a-tooltip>
      </div>
    </div>
    <div class="menu-wrap">
      <!--菜单1-->
      <div class="menu"></div>
      <!--菜单2-->
      <div class="menu2" v-show="isOpen"></div>
      <!--项-->
      <div class="design-group" v-show="isOpen">
        <div
          class="design-item"
          :class="{
            'design-item1': isSmall,
            'design-item2': isBig,
          }"
          v-for="item in 50"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppstoreOutlined, BorderOutlined } from '@ant-design/icons-vue';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMenuStore } from '@/stores/modules/menu.ts';

let { isOpen, isClose } = storeToRefs(useMenuStore());

type sizeType = 'small' | 'big';
const imgType = ref<sizeType>('big');
function onPreview(type: sizeType) {
  imgType.value = type;
}
const isSmall = computed(() => imgType.value === 'small');
const isBig = computed(() => imgType.value === 'big');
</script>

<style scoped lang="scss">
@import '../index.scss';
</style>
