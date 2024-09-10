<template>
    <CraftNodeWrapper
      v-if="resolver"
      v-for="craftNode in editor.nodes"
      :key="(craftNode as any).uuid"
      :craftNode="craftNode"
    />
    <Indicator v-if="editor.enabled" />
</template>

<script lang="ts">
export default {
  name: "CraftFrame",
};
</script>

<script lang="ts" setup>
import {
  ComputedRef,
  inject,
  onBeforeMount,
  ref,
  useSlots,
  provide,
} from "vue";
import { CraftNode } from "../lib/craftNode";
import CraftNodeResolver, {
  CraftNodeResolverMap,
} from "../lib/CraftNodeResolver";
import vNodeToCraftNode from "../lib/vNodeToCraftNode";
import { useEditor } from "../store/editor";
import Indicator from "./CraftDropIndicator.vue";

const props = defineProps<{
  resolverMap?: CraftNodeResolverMap;
}>();

const editor = useEditor();
const resolver = props.resolverMap
  ? ref(new CraftNodeResolver(props.resolverMap))
  : inject<ComputedRef<CraftNodeResolver>>("resolver");

if (props.resolverMap) {
  provide("resolver", resolver);
}

const createNodesFromSlots = () => {
  if (!resolver?.value) {
    return [];
  }

  const slots = useSlots();
  const defaultSlots = slots.default ? slots.default() : [];

  let createdNodes: CraftNode[] = [];

  const childrenToNodes = (children) =>
    children.map((n) => vNodeToCraftNode(resolver.value, n)).filter((n) => !!n);

  defaultSlots.forEach((slot) => {
    if (slot.key === "_default") {
      createdNodes = createdNodes.concat(childrenToNodes(slot.children));
      return;
    }
    createdNodes.push(vNodeToCraftNode(resolver.value, slot));
  });

  return createdNodes;
};

onBeforeMount(() => {
  if (!editor.hasNodes) {
    editor.setNodes(createNodesFromSlots());
  }
});
</script>
