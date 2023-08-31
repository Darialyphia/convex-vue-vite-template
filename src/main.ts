import '@/styles/global.css';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router/auto';
import { createAuth0 } from '@auth0/auth0-vue';
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
app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENTID,
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  })
);
app.mount('#app');
