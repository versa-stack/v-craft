import VCraft, { formkit as vcFormkit } from "@versa-stack/v-craft";
import { defaultConfig, plugin } from "@formkit/vue";
import { createPinia } from "pinia";
import DefaultTheme from "vitepress/theme";
import DemoContainer from "../components/DemoContainer.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import "./custom.css";

const pinia = createPinia();

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.config.debug = true;
    app.config.devtools = true;
    app.component("FontAwesomeIcon", FontAwesomeIcon);
    app.use(pinia);
    app.use(VCraft);
    app.use(
      plugin,
      defaultConfig({
        inputs: {
          ...vcFormkit.inputs,
        },
      })
    );
    app.component("DemoContainer", DemoContainer);
  },
};
