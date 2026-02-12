import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { syncDemoStoreWithRouter } from "./router/syncDemoStore";

import "./style.css";

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(router);

// sync AFTER both are installed
syncDemoStoreWithRouter(router, pinia);

app.mount("#app");