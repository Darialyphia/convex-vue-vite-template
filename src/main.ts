import '@/styles/global.css';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router/auto';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';

import App from './App.vue';
const app = createApp(App);

app.use(
  createRouter({
    history: createWebHistory()
  })
);
app.use(createConvex(import.meta.env.VITE_CONVEX_URL));
app.use(autoAnimatePlugin);
app.mount('#app');
