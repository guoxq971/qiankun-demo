import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

type MenuType = 'open' | 'close';
export const menuDefine = {
  open: 'open',
  close: 'close',
};
export const useMenuStore = defineStore('menu', () => {
  const menuType = ref<MenuType>('open');

  function onMenu(type: MenuType) {
    menuType.value = type;
  }

  const isOpen = computed(() => menuType.value === menuDefine.open);
  const isClose = computed(() => menuType.value === menuDefine.close);

  return {
    menuType,
    onMenu,
    isOpen,
    isClose,
  };
});
