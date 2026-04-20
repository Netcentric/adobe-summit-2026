import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { Temporal } from '@js-temporal/polyfill';

// This makes it available globally if your code expects 'Temporal' to exist
if (!globalThis.Temporal) {
  globalThis.Temporal = Temporal;
}

// handle token parameter
const searchParams = new URLSearchParams(location.search);

if (searchParams.get('t')) {
  localStorage.setItem('token', `token ${searchParams.get('t')}`);
  location.replace(location.href.split('?')[0] || '');
}

// mount app
createApp(App).mount('#app');
