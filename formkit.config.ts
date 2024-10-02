import { defaultConfig, DefaultConfigOptions } from "@formkit/vue";
import { rootClasses } from "./formkit.theme";
import { inputs } from "./src/formkit/inputs";

const config: DefaultConfigOptions = {
  config: {
    rootClasses,
  },
  inputs,
};

export default defaultConfig(config);
