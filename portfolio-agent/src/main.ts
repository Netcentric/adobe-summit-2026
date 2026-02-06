import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { RouterLink, RouterView } from 'vue-router';
import router from './router.ts';

const app = createApp(App);

app
  .component('portfolio-agent', {
    RouterLink: RouterLink,
    RouterView: RouterView,
  })
  .use(router)
  .mount('#app');
