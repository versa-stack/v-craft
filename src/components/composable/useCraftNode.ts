import { computed, ComputedRef, inject, Ref } from "vue";
import { CraftNode } from "../../lib/craftNode";
import CraftNodeResolver, {
  CraftNodeComponentMap,
} from "../../lib/CraftNodeResolver";
import { CraftDataListItem } from "..";

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

  const dataListGenerator = function* (): Generator<
    CraftDataListItem,
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
    [Symbol.iterator]: dataListGenerator,
  }));

  return {
    craftNode,
    resolver,
    resolvedNode,
    defaultProps,
    dataList,
  };
};
