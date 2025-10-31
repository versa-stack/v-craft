import { CraftNodeResolverMap } from "./CraftNodeResolver";
import { CraftNode } from "./craftNode";

export type CraftBlueprintData = {
  label: string;
  component: string;
  props: Record<string, any>;
};

export type BlueprintsLibrary = {
  metadata?: BlueprintsMetadata;
  groups: BlueprintGroup[];
};

export type BlueprintGroup = {
  label: string;
  metadata: BlueprintsMetadata;
  blueprints: Blueprints;
};

export type BlueprintsMetadata = {
  name: string;
  description?: string;
  help?: string;
};

export type Blueprints = Record<string, Blueprint>;

export type Blueprint = Omit<CraftNode, "parent" | "uuid" | "children"> & {
  label?: string;
  children: Blueprint[];
};

export type CraftEditorConfig<T extends object> = {
  blueprintsLibrary: BlueprintsLibrary;
  resolverMap: CraftNodeResolverMap<T>;
};

export type CraftDataPatch<V = any, D = any> = {
  defaultValue?: D;
  fromPath: string;
  patchSource: "mapPathResult" | "value" | "child";
  toPath: string;
  type: "single" | "list";
  value?: V;
};

export type CraftDataWrapperPropMap<V = any, D = any> = {
  fromPath: string;
  patches: CraftDataPatch<V, D>[];
  type: "single" | "list";
};
