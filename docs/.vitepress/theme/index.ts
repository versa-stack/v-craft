import { defaultConfig, plugin } from "@formkit/vue";
import { createPinia } from "pinia";
import DefaultTheme from "vitepress/theme";
import DemoContainer from "../components/DemoContainer.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VCraft, {
  formkitConfig,
  rootClasses
} from "@versa-stack/v-craft";

import "./custom.css";

const pinia = createPinia();


export default {
  ...DefaultTheme,
  enhanceApp({ app }) {

    console.log("formkitConfig", formkitConfig);
    app.config.debug = true;
    app.config.devtools = true;
    app.component("FontAwesomeIcon", FontAwesomeIcon);
    app.use(pinia);
    app.use(VCraft);
    app.use(
      plugin,
      defaultConfig(formkitConfig)
    );
    app.component("DemoContainer", DemoContainer);
  },
};
