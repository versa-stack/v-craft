import { type FormKitSchemaDefinition } from "@formkit/core";
import { JSONPath } from "jsonpath-plus";
import { markRaw, type Component } from "vue";
import { CraftNode, craftNodeIsCanvas, CraftNodeRules } from "./craftNode";

export type CraftNodeComponentMap<
  T extends FormKitSchemaDefinition = FormKitSchemaDefinition,
> = {
  componentName: string;
  label?: string;
  component?: Component | (() => Promise<Component>);
  propsSchema?: T;
  eventsSchema?: T;
  defaultProps?: Record<string, any>;
  rules?: CraftNodeRules;
  slots?: string[];
  slotsProps?: Record<string, string[]>;
};

export type CraftNodeResolverMap<
  T extends FormKitSchemaDefinition = FormKitSchemaDefinition,
> = Record<string, CraftNodeComponentMap<T>>;

export type ResolveComponentHook = (
  craftNode: CraftNode,
  defaultResolver: (name: string) => Component | undefined,
) => Component | undefined;

/**
 * Lets a consuming app interpret a `slotsPropsPropsMap` mapping value however
 * it likes (e.g. a formatter/transform pipeline) instead of the plain
 * JSONPath default. `defaultResolve` runs a JSONPath against `contextData` —
 * call it directly for the bare-string case, or as a source-value primitive
 * within a richer mapping shape.
 */
export type ResolvePropertyValueHook = (
  mapping: unknown,
  contextData: any,
  defaultResolve: (path: string) => unknown,
) => unknown;

export class CraftNodeResolver<
  T extends FormKitSchemaDefinition = FormKitSchemaDefinition,
> {
  resolverMap: CraftNodeResolverMap<T> = {};
  private resolveComponentHook?: ResolveComponentHook;
  private resolvePropertyValueHook?: ResolvePropertyValueHook;

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

  onResolveComponent(hook: ResolveComponentHook): void {
    this.resolveComponentHook = hook;
  }

  onResolvePropertyValue(hook: ResolvePropertyValueHook): void {
    this.resolvePropertyValueHook = hook;
  }

  resolvePropertyValue(mapping: unknown, contextData: any): unknown {
    const defaultResolve = (path: string): unknown => {
      const matches = JSONPath({ path, json: contextData, resultType: "value" });
      return matches.length ? matches[0] : undefined;
    };

    if (this.resolvePropertyValueHook) {
      return this.resolvePropertyValueHook(mapping, contextData, defaultResolve);
    }

    return typeof mapping === "string" ? defaultResolve(mapping) : undefined;
  }

  resolve(name: string): CraftNodeComponentMap<T> {
    return this.resolverMap[name];
  }

  resolveComponent(craftNode: CraftNode): Component | undefined {
    const componentName = craftNodeIsCanvas(craftNode)
      ? craftNode.props.componentName
      : craftNode.componentName;

    const defaultResolver = (name: string): Component | undefined => {
      const resolved = this.resolve(name);
      if (!resolved?.component) {
        return undefined;
      }
      if (
        typeof resolved.component === "function" &&
        !("setup" in resolved.component) &&
        !("render" in resolved.component)
      ) {
        return resolved.component as () => Promise<Component>;
      }
      return resolved.component;
    };

    if (this.resolveComponentHook) {
      const result = this.resolveComponentHook(craftNode, defaultResolver);
      if (result) {
        return result;
      }
    }

    return defaultResolver(componentName);
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

  getSchema(craftNode: CraftNode): T {
    return this.resolveNode(craftNode)?.propsSchema || {} as T;
  }

  getEventsSchema(craftNode: CraftNode): T {
    return this.resolveNode(craftNode)?.eventsSchema || {} as T;
  }

  getRules(craftNode: CraftNode): CraftNodeRules {
    return this.resolveNode(craftNode)?.rules || {};
  }

  getSlotsProps(craftNode: CraftNode): Record<string, string[]> {
    return this.resolveNode(craftNode)?.slotsProps || {};
  }
}

export default CraftNodeResolver;
