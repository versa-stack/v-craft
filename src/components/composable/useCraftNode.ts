import { inject, Ref } from "vue";
import { CraftNode } from "../../lib/craftNode";
import { useResolveCraftNode } from "./useResolveCraftNode";

export const useCraftNode = <T extends object>() => {
  const craftNode = inject<Ref<CraftNode<T>, CraftNode<T>>>("craftNode")!;
  if (!craftNode) {
    throw new Error("craftNode or resolver not provided");
  }

  const { resolver, resolvedNode, defaultProps } =
    useResolveCraftNode(craftNode);

  return {
    craftNode,
    resolver,
    resolvedNode,
    defaultProps,
  };
};
