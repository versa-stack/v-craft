import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEye,
  faEyeSlash,
  faGripVertical,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { App } from "vue";
import * as components from "./components";

const install = (app: App) => {
  library.add(faEye, faEyeSlash, faXmarkCircle, faGripVertical);

  for (const key in components) {
    app.component(key, components[key]);
  }
};

export default { install };

export * from "./components";
export * as formkit from "./formkit";
export * from "./lib/model";

export { useEditor } from "./store/editor";
export type { EditorState, EditorStoreType } from "./store/editor";

export { useIndicator } from "./store/indicator";
export type { IndicatorState, IndicatorStoreType } from "./store/indicator";
export * from "./lib/craftNode"