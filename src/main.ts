import '@/styles/global.css';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router/auto';
import { createAuth0 } from '@auth0/auth0-vue';
import { createConvex } from './plugins/convex';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';

declare module 'vue-router/auto' {
  interface RouteMeta {
    needsAuth?: boolean;
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    needsAuth?: boolean;
  }
}

import App from './App.vue';
const app = createApp(App);

app.use(
  createRouter({
    history: createWebHistory()
  })
);
app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENTID,
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  })
);
app.use(
  createConvex(import.meta.env.VITE_CONVEX_URL, {
    auth0: {
      installNavigationGuard: true,
      redirectTo: () => '/',
      needsAuth: to => !!to.meta.needsAuth
    }
  })
);
app.use(autoAnimatePlugin);
app.mount('#app');
