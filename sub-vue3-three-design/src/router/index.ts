import { createRouter, createWebHistory } from 'vue-router';

export const routes = [
  {
    path: '/',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;
