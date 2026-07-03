import { inject, Ref } from "vue";
import type { CraftNode } from "../../lib/craftNode";
import { useResolveCraftNode } from "./useResolveCraftNode";

export const useCraftNode = () => {
  const craftNode = inject<Ref<CraftNode, CraftNode>>("craftNode")!;
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
