import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { RouterLink, RouterView } from 'vue-router';
import router from './router.ts';

class MyTaglist extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = document.querySelector(`div[data-taglist][data-taglist-key='${this.getAttribute('metakey')}']`)?.innerHTML || '';
  }
}

window.customElements.define('my-taglist', MyTaglist);

const app = createApp(App);

app
  .component('portfolio-agent', {
    RouterLink: RouterLink,
    RouterView: RouterView,
  })
  .use(router)
  .mount('#app');