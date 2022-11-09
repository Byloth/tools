import { createApp } from "vue";

import * as Plugins from "./plugins";
import App from "./App.vue";

const app = createApp(App);

app.use(Plugins.Router);
app.use(Plugins.Store);

export default app.mount("#app");
