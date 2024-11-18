import { CraftNodeResolverMap } from "./CraftNodeResolver";
import { CraftNode, CraftNodeDatasource } from "./craftNode";

export type CraftBlueprintData = {
  label: string;
  component: string;
  props: Record<string, any>;
};

export type BlueprintsLibrary<T extends object> = {
  metadata?: BlueprintsMetadata;
  groups: BlueprintGroup<T>[];
};

export type BlueprintGroup<T extends object> = {
  label: string;
  metadata: BlueprintsMetadata;
  blueprints: Blueprints<T>;
};

export type BlueprintsMetadata = {
  name: string;
  description?: string;
  help?: string;
};

export type Blueprints<T extends object> = Record<string, Blueprint<T>>;

export type Blueprint<T extends object> = Omit<
  CraftNode<T>,
  "parent" | "uuid" | "children"
> & {
  label?: string;
  children: Blueprint<T>[];
};

export type CraftEditorConfig<T extends object> = {
  blueprintsLibrary: BlueprintsLibrary<T>;
  resolverMap: CraftNodeResolverMap<T>;
};

export type CraftGraphqlQueryWrapperPropMap = CraftDataWrapperPropMap;

export type CraftGraphqlQueryWrapperPatch = CraftDataPatch;

export type CraftGraphqlQueryWrapperData = CraftNodeDatasource;

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
