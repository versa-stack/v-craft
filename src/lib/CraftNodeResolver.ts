import type { FormKitSchemaFormKit } from "@formkit/core";
import { CraftNode, craftNodeIsCanvas, CraftNodeRules } from "./craftNode";

export type CraftNodeComponentMap<T extends object> = {
  componentName: string;
  propsSchema?: T;
  eventsSchema?: T;
  defaultProps?: Record<string, any>;
  rules?: CraftNodeRules;
};

export type CraftNodeResolverMap<T extends object> = Record<
  string,
  CraftNodeComponentMap<T>
>;

export class CraftNodeResolver<T extends object = FormKitSchemaFormKit> {
  resolverMap: CraftNodeResolverMap<T> = {};

  constructor(resolverMap: Record<string, CraftNodeComponentMap<T>> = {}) {
    this.setResolverMap(resolverMap);
  }

  setResolverMap(resolverMap: Record<string, CraftNodeComponentMap<T>>) {
    this.resolverMap = {};
    Object.entries(resolverMap).forEach(([key, value]) => {
      this.resolverMap[value.componentName] = value;
    });
  }

  resolve(name: string): CraftNodeComponentMap<T> {
    return this.resolverMap[name];
  }

  getDefaultProps(craftNode: CraftNode<T>): Record<string, any> {
    return this.resolveNode(craftNode)?.defaultProps || {};
  }

  resolveNode(craftNode: CraftNode<T>): CraftNodeComponentMap<T> {
    if (craftNodeIsCanvas(craftNode)) {
      return this.resolve(craftNode.props.component);
    }

    return this.resolve(craftNode.componentName);
  }

  getSchema(craftNode: CraftNode<T>): Record<string, any> {
    return this.resolveNode(craftNode)?.propsSchema || {};
  }

  getEventsSchema(craftNode: CraftNode<T>): Record<string, any> {
    return this.resolveNode(craftNode)?.eventsSchema || {};
  }

  getRules(craftNode: CraftNode<T>): CraftNodeRules {
    return this.resolveNode(craftNode)?.rules || {};
  }
}

export default CraftNodeResolver;
