<template>
  <CraftNodeWrapper
    v-for="craftNode in nodes"
    :key="craftNode.uuid"
    :craftNode="craftNode"
    :viewOnly="viewOnly"
  />
  <Indicator v-if="!viewOnly && editor.enabled" />
</template>

<script lang="ts" setup generic="T extends object">
import { computed, ComputedRef, inject, onMounted, provide, ref } from "vue";
import { CraftNode } from "../lib/craftNode";
import CraftNodeResolver, {
  CraftNodeResolverMap,
} from "../lib/CraftNodeResolver";
import { useEditor } from "../store/editor";
import Indicator from "./CraftDropIndicator.vue";
import { useSlots } from "vue";
import vNodeToCraftNode from "../lib/vNodeToCraftNode";

defineOptions({
  name: "CraftFrame",
});

const props = withDefaults(
  defineProps<{
    resolverMap?: CraftNodeResolverMap<T>;
    viewOnly?: boolean;
  }>(),
  {
    viewOnly: false,
  }
);

const editor = useEditor<T>()();
const resolver = props.resolverMap
  ? ref(new CraftNodeResolver(props.resolverMap))
  : inject<ComputedRef<CraftNodeResolver<T>>>("resolver");

const nodes = computed(() => editor.nodeTree);

if (props.resolverMap) {
  provide("resolver", resolver);
}

onMounted(() => {
  if (resolver?.value) {
    editor.setResolver(resolver.value);
  }

  if (!editor.hasNodes && resolver?.value) {
    const slots = useSlots();
    const defaultSlots = slots.default ? slots.default() : [];

    const createdNodes = defaultSlots
      .flatMap((slot) => {
        if (
          slot.key === "_default" &&
          slot.children &&
          Array.isArray(slot.children)
        ) {
          return slot.children
            .map((child) => {
              const node = vNodeToCraftNode(resolver.value, child);
              if (!node) {
                console.error("Invalid node created from child:", child);
              }
              return node;
            })
            .filter(Boolean);
        } else {
          const node = vNodeToCraftNode(resolver.value, slot);
          if (!node) {
            console.error("Invalid node created from slot:", slot);
          }
          return [node];
        }
      })
      .filter(Boolean); // Filter out invalid nodes

    if (createdNodes.length) {
      editor.setNodes(createdNodes);
    }
  }
});
</script>
