import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

import "./assets/main.css";

import { test } from "@function-ui/packages/utils";
import { Button } from "@function-ui/packages/components";
const app = createApp(App);
test();
console.log("Button", Button);

app.use(createPinia());
app.use(Button);
app.use(Antd);
app.use(router);

app.mount("#app");
