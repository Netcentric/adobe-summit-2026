import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

// handle token parameter
const searchParams = new URLSearchParams(location.search);

if (searchParams.get('t')) {
  localStorage.setItem('token', `token ${searchParams.get('t')}`);
  location.replace(location.origin);
}

// mount app
createApp(App).mount('#app');
