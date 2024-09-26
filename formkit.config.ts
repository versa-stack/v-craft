import { defaultConfig } from "@formkit/vue";
import { rootClasses } from "./formkit.theme";
import { inputs } from "./src/formkit";

export default defaultConfig({
  config: {
    rootClasses,
  },
  inputs,
});
