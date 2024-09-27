import { computed, ComputedRef, inject, Ref } from "vue";
import { CraftNode } from "../../lib/craftNode";
import CraftNodeResolver, {
  CraftNodeComponentMap,
} from "../../lib/CraftNodeResolver";
import { CombinationWithKeys } from "..";

export const useCraftNode = () => {
  const craftNode = inject<Ref<CraftNode, CraftNode>>("craftNode")!;
  const resolver = inject<ComputedRef<CraftNodeResolver>>("resolver")!;

  if (!craftNode || !resolver) {
    throw new Error("craftNode or resolver not provided");
  }

  const resolvedNode = computed(() => {
    if (!resolver || !craftNode?.value) return {} as CraftNodeComponentMap;
    return resolver.value.resolve(
      craftNode.value.componentName
    ) as CraftNodeComponentMap;
  });

  const defaultProps = computed(() => resolvedNode.value?.defaultProps || {});

  const combinationGenerator = function* (): Generator<
    CombinationWithKeys,
    void,
    unknown
  > {
    const dataItems = craftNode?.value?.data?.list || [];
    const childNodes = craftNode?.value?.children || [];

    for (let dataIndex = 0; dataIndex < dataItems.length; dataIndex++) {
      for (let childIndex = 0; childIndex < childNodes.length; childIndex++) {
        yield {
          dataItem: dataItems[dataIndex],
          dataIndex,
          childNode: childNodes[childIndex],
          childIndex,
          key: `${dataIndex}-${childIndex}`,
        };
      }
    }
  };

  const dataList = computed(() => ({
    [Symbol.iterator]: combinationGenerator,
  }));

  return {
    craftNode,
    resolver,
    resolvedNode,
    defaultProps,
    dataList,
  };
};
