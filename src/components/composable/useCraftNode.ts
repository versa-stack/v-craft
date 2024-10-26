import { computed, ComputedRef, inject, Ref } from "vue";
import { CraftNode } from "../../lib/craftNode";
import CraftNodeResolver, {
  CraftNodeComponentMap,
} from "../../lib/CraftNodeResolver";

export const useCraftNode = <T extends object>() => {
  const craftNode = inject<Ref<CraftNode<T>, CraftNode<T>>>("craftNode")!;
  const resolver = inject<ComputedRef<CraftNodeResolver<T>>>("resolver")!;

  if (!craftNode || !resolver) {
    throw new Error("craftNode or resolver not provided");
  }

  const resolvedNode = computed(() => {
    if (!resolver || !craftNode?.value) return {} as CraftNodeComponentMap<T>;
    return resolver.value.resolve(
      craftNode.value.componentName
    ) as CraftNodeComponentMap<T>;
  });

  const defaultProps = computed(() => resolvedNode.value?.defaultProps || {});

  return {
    craftNode,
    resolver,
    resolvedNode,
    defaultProps,
  };
};
