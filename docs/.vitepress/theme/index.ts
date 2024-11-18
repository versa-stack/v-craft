import { defaultConfig, plugin } from "@formkit/vue";
import { VCraft } from "@versa-stack/v-craft";
import { createPinia } from "pinia";
import DefaultTheme from "vitepress/theme";
import DemoContainer from "../components/DemoContainer.vue";
import { rootClasses } from "../../formkit.theme";

import "./custom.css";

const pinia = createPinia();

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.config.debug = true;
    app.config.devtools = true;
    app.use(pinia);
    app.use(VCraft);
    app.use(
      plugin,
      defaultConfig({
        config: {
          rootClasses,
        },
      })
    );
    app.component("DemoContainer", DemoContainer);
  },
};
