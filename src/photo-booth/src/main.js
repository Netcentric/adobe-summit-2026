import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import "flag-icons/css/flag-icons.min.css";
import "./style.css";

const searchParams = new URLSearchParams(location.search);
if (searchParams.get("t")) {
    localStorage.setItem("token", `token ${searchParams.get("t")}`);
    location.replace(location.href.split("?")[0] || "");
}

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount("#app");
