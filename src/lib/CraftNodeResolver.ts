import type { FormKitSchemaFormKit } from "@formkit/core";
import { markRaw } from "vue";
import { CraftNode, craftNodeIsCanvas, CraftNodeRules } from "./craftNode";

export type CraftNodeComponentMap<T extends object> = {
  componentName: string;
  propsSchema?: T;
  eventsSchema?: T;
  defaultProps?: Record<string, any>;
  rules?: CraftNodeRules;
  slots?: string[];
};

export type CraftNodeResolverMap<T extends object> = Record<
  string,
  CraftNodeComponentMap<T>
>;

export class CraftNodeResolver<T extends object = FormKitSchemaFormKit[]> {
  resolverMap: CraftNodeResolverMap<T> = {};

  constructor(resolverMap: Record<string, CraftNodeComponentMap<T>> = {}) {
    this.setResolverMap(resolverMap);
    return markRaw(this) as this;
  }

  setResolverMap(resolverMap: Record<string, CraftNodeComponentMap<T>>) {
    this.resolverMap = {};
    Object.entries(resolverMap).forEach(([_, value]) => {
      this.resolverMap[value.componentName] = value;
    });
  }

  resolve(name: string): CraftNodeComponentMap<T> {
    return this.resolverMap[name];
  }

  getDefaultProps(craftNode: CraftNode): Record<string, any> {
    return this.resolveNode(craftNode)?.defaultProps || {};
  }

  resolveNode(craftNode: CraftNode): CraftNodeComponentMap<T> {
    const result = craftNodeIsCanvas(craftNode)
      ? this.resolve(craftNode.props.componentName)
      : this.resolve(craftNode.componentName);
    return result;
  }

  getSchema(craftNode: CraftNode): Record<string, any> {
    return this.resolveNode(craftNode)?.propsSchema || {};
  }

  getEventsSchema(craftNode: CraftNode): Record<string, any> {
    return this.resolveNode(craftNode)?.eventsSchema || {};
  }

  getRules(craftNode: CraftNode): CraftNodeRules {
    return this.resolveNode(craftNode)?.rules || {};
  }
}

export default CraftNodeResolver;
