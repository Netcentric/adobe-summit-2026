import { createRouter, createWebHashHistory } from 'vue-router';
import Start from './views/Start.vue';
import Detail from './views/Detail.vue';
import Overview from './views/Overview.vue';

const routes = [
  {
    path: '/',
    name: 'start',
    component: Start,
  },
  {
    path: '/overview/:filter?',
    name: 'overview',
    component: Overview,
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: Detail,
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
