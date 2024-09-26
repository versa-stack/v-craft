import { CraftNode, craftNodeIsCanvas, CraftNodeRules } from "./craftNode";

export type CraftNodeComponentMap = {
  componentName: string;
  propsSchema?: Record<string, any>;
  defaultProps?: Record<string, any>;
  rules?: CraftNodeRules;
};

export type CraftNodeResolverMap = Record<string, CraftNodeComponentMap>;

export class CraftNodeResolver {
  resolverMap: CraftNodeResolverMap = {};

  constructor(resolverMap: Record<string, CraftNodeComponentMap> = {}) {
    this.setResolverMap(resolverMap);
  }

  setResolverMap(resolverMap: Record<string, CraftNodeComponentMap>) {
    this.resolverMap = {};
    Object.entries(resolverMap).forEach(([key, value]) => {
      this.resolverMap[value.componentName] = value;
    });
  }

  resolve(name: string): CraftNodeComponentMap {
    return this.resolverMap[name];
  }

  getDefaultProps(craftNode: CraftNode): Record<string, any> {
    return this.resolveNode(craftNode)?.defaultProps || {};
  }

  resolveNode(craftNode: CraftNode): CraftNodeComponentMap {
    if (craftNodeIsCanvas(craftNode)) {
      return this.resolve(craftNode.props.component);
    }

    return this.resolve(craftNode.componentName);
  }

  getSchema(craftNode: CraftNode): Record<string, any> {
    return this.resolveNode(craftNode)?.propsSchema || {};
  }

  getRules(craftNode: CraftNode): CraftNodeRules {
    return this.resolveNode(craftNode)?.rules || {};
  }
}

export default CraftNodeResolver;
