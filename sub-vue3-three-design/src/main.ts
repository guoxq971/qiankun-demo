import './assets/main.css';

import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import { store } from '@/stores/index.ts';

// @ts-ignore
const app = createApp(App);

app.use(store);
app.use(Antd);
app.use(router);

app.mount('#app');
