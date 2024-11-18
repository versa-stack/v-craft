import { App } from "vue";
import * as components from "./components";
export * from "./blueprints/default";
export * from "./components";
export * from "./components/composable";
export * from "./lib/craftNode";
export * from "./lib/CraftNodeResolver";
export * from "./lib/mapData";
export * from "./lib/model";
export * from "./resolvers/default";
export { useEditor } from "./store/editor";
export type { EditorState, EditorStoreInstanceType } from "./store/editor";
export { useIndicator } from "./store/indicator";
export type { IndicatorState, IndicatorStoreType } from "./store/indicator";

import "./assets/styles.scss";

const install = (app: App) => {
  for (const key in components) {
    app.component(key, components[key]);
  }
};

export const VCraft = { install };
