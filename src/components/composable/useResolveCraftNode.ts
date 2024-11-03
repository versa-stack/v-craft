import { computed, ComputedRef, inject, Ref } from "vue";
import { CraftNode } from "../../lib/craftNode";
import CraftNodeResolver, {
  CraftNodeComponentMap,
} from "../../lib/CraftNodeResolver";

export const useResolveCraftNode = <T extends object>(
  craftNode: Ref<CraftNode<T>>
) => {
  const resolver = inject<ComputedRef<CraftNodeResolver<T>>>("resolver")!;
  const resolvedNode = computed(() => {
    if (!resolver || !craftNode?.value) return {} as CraftNodeComponentMap<T>;
    return resolver.value.resolve(
      craftNode.value.componentName
    ) as CraftNodeComponentMap<T>;
  });

  const defaultProps = computed(() => resolvedNode.value?.defaultProps || {});

  return {
    resolvedNode,
    resolver,
    defaultProps,
  };
};
