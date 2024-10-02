import "./index.css"
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEye,
  faEyeSlash,
  faGripVertical,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { App } from "vue";
import formkitConfig from "../formkit.config";
import * as components from "./components";
export { rootClasses } from "../formkit.theme";
export * from "./blueprints/default";
export * from "./components";
export * from "./lib/craftNode";
export * from "./lib/CraftNodeResolver";
export * from "./lib/model";
export * from "./resolvers/default";
export { useEditor } from "./store/editor";
export type { EditorState, EditorStoreType } from "./store/editor";
export { useIndicator } from "./store/indicator";
export type { IndicatorState, IndicatorStoreType } from "./store/indicator";
export { formkitConfig };

import './index.css';

const install = (app: App) => {
  library.add(faEye, faEyeSlash, faXmarkCircle, faGripVertical);

  for (const key in components) {
    app.component(key, components[key]);
  }
};

export default { install };
