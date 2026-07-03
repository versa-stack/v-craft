import { HTMLAttributes, StyleValue } from "vue";
import { CraftNodeResolver, CraftNodeResolverMap } from "./CraftNodeResolver";
import { CraftNode } from "./craftNode";
import { FormKitSchemaDefinition } from '@formkit/core';

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

export type Blueprint = Omit<CraftNode, "parentUuid" | "uuid"> & {
  label?: string;
  slots: Record<string, Blueprint[]>;
};

export type CraftEditorConfig<T extends FormKitSchemaDefinition = FormKitSchemaDefinition> = {
  blueprintsLibrary: BlueprintsLibrary;
  resolverMap?: CraftNodeResolverMap<T>;
  resolver?: CraftNodeResolver<T>;
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

export type CraftNodeIFrameProps = {
  iframeClass?: HTMLAttributes["class"];
  iframeStyle?: StyleValue;
  inheritStyles?: boolean;
  styleSheets?: string[];
  styles?: string[];
  iframeId?: string;
};


export type CraftFrameIFrameProps = CraftNodeIFrameProps & {
  wrapperClass?: HTMLAttributes["class"];
  wrapperStyle?: StyleValue;
}
