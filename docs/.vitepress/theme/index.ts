import type { Theme } from "vitepress";
import { defaultConfig, plugin } from "@formkit/vue";
import { VCraft } from "@versa-stack/v-craft";
import { createPinia } from "pinia";
import DefaultTheme from "vitepress/theme";
import DemoContainer from "../components/DemoContainer.vue";
import { rootClasses } from "../../formkit.theme";
import "./style.css";
import "./custom.css";
import "./frame.css";

const pinia = createPinia();

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
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

export default theme;
