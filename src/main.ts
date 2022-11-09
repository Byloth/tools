import { createApp } from "vue";

import { pinia, router } from "./plugins";

import App from "./App.vue";

const app = createApp(App);

app.use(pinia);
app.use(router);

export default app.mount("#app");
