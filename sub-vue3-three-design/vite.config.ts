import { fileURLToPath, URL } from 'node:url';
import qiankun from 'vite-plugin-qiankun';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vue3',
  server: {
    port: 5173,
    cors: true,
    origin: '*',
  },
  plugins: [
    vue(),
    qiankun('vue3', {
      useDevMode: true, // 开发环境下使用主应用的html entry
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
