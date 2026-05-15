import { computed, ComputedRef, defineAsyncComponent, inject, Ref } from "vue";
import type { Component } from "vue";
import { CraftNode } from "../../lib/craftNode";
import CraftNodeResolver, {
  CraftNodeComponentMap,
} from "../../lib/CraftNodeResolver";

const resolveComponent = (
  resolvedNode: CraftNodeComponentMap<any> | undefined,
  fallbackName: string
): string | Component => {
  const component = resolvedNode?.component;
  if (!component) {
    return resolvedNode?.componentName || fallbackName;
  }
  if (
    typeof component === "function" &&
    !("setup" in component) &&
    !("render" in component)
  ) {
    return defineAsyncComponent(component as () => Promise<Component>);
  }
  return component;
};

export const useResolveCraftNode = <T extends object>(
  craftNode: Ref<CraftNode>
) => {
  const resolver = inject<ComputedRef<CraftNodeResolver<T>>>("resolver")!;
  const resolvedNode = computed(() => {
    if (!resolver || !craftNode?.value) return {} as CraftNodeComponentMap<T>;
    return resolver.value.resolve(
      craftNode.value.componentName
    ) as CraftNodeComponentMap<T>;
  });

  const defaultProps = computed(() => resolvedNode.value?.defaultProps || {});

  const componentToRender = computed(() =>
    resolveComponent(resolvedNode.value, craftNode.value?.componentName || "")
  );

  return {
    resolvedNode,
    resolver,
    defaultProps,
    componentToRender,
  };
};
