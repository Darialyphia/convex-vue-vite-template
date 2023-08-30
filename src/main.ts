import '@/styles/global.css';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router/auto';
import App from './App.vue';

declare module 'vue-router/auto' {
  interface RouteMeta {
    needsAuth?: boolean;
    publicOnly?: boolean;
  }
}

const app = createApp(App);

app.use(
  createRouter({
    history: createWebHistory()
  })
);

app.mount('#app');
