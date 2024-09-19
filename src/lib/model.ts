import { FontAwesomeIconProps } from "@fortawesome/vue-fontawesome";
import { CraftNodeResolverMap } from "./CraftNodeResolver";
import { EditorStoreType } from "../store/editor";
import { CraftNode, CraftNodeDatasource } from "./craftNode";

export type CraftBlueprintData = {
  label: string;
  icon: Pick<FontAwesomeIconProps, "icon">;
  component: string;
  props: Record<string, any>;
}

export type Blueprints = Record<
  string,
  Omit<CraftNode, "parent" | "uuid"> & { label?: string }
>;

export type CraftEditorConfig = {
  blueprints: Blueprints;
  resolverMap: CraftNodeResolverMap;
  actions: CraftEditorAction[];
}

export type CraftEditorAction = {
  label: string;
  key: string;
  icon: Pick<FontAwesomeIconProps, "icon">;
}

export type CraftEditorActionPayload = {
  action: CraftEditorAction;
  editor: EditorStoreType;
}

export type CraftGraphqlQueryWrapperPropMap = {
  type: "single" | "list";
  fromPath: string;
  patches: CraftGraphqlQueryWrapperPatch[];
}

export type CraftGraphqlQueryWrapperPatch = {
  toPath: string;
  fromPath: string;
  type: "single" | "list";
  patchSource: "mapPathResult"|"value"|"child";
  value: any;
  default?: any;
}

export type CraftGraphqlQueryWrapperData = CraftNodeDatasource;
