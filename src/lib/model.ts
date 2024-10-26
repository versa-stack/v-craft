import { CraftNodeResolverMap } from "./CraftNodeResolver";
import { EditorStoreType } from "../store/editor";
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

export type CraftGraphqlQueryWrapperPropMap = {
  type: "single" | "list";
  fromPath: string;
  patches: CraftGraphqlQueryWrapperPatch[];
};

export type CraftGraphqlQueryWrapperPatch = {
  toPath: string;
  fromPath: string;
  type: "single" | "list";
  patchSource: "mapPathResult" | "value" | "child";
  value: any;
  default?: any;
};

export type CraftGraphqlQueryWrapperData = CraftNodeDatasource;
