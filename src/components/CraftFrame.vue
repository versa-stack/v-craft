<template>
  <CraftNodeWrapper
    v-if="editor.hasNodes"
    v-for="craftNode in editor.nodeTree"
    :key="craftNode.uuid"
    :craftNode="craftNode"
    :viewOnly="viewOnly"
  />
  <Indicator v-if="!viewOnly && editor.enabled" />
</template>

<script lang="ts" setup generic="T extends object">
import { storeToRefs } from "pinia";
import {
  ComputedRef,
  inject,
  onMounted,
  provide,
  ref,
  useSlots,
  watch,
} from "vue";
import CraftNodeResolver, {
  CraftNodeResolverMap,
} from "../lib/CraftNodeResolver";
import vNodeToCraftNode from "../lib/vNodeToCraftNode";
import { useEditor } from "../store/editor";
import Indicator from "./CraftDropIndicator.vue";

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
const { hasNodes } = storeToRefs(editor);
const resolver = props.resolverMap
  ? ref(new CraftNodeResolver(props.resolverMap))
  : inject<ComputedRef<CraftNodeResolver<T>>>("resolver");

if (resolver?.value) {
  editor.setResolver(resolver.value);
}

if (props.resolverMap) {
  provide("resolver", resolver);
}

const mountNodes = () => {
  if (!resolver?.value) {
    return;
  }

  if (!hasNodes.value) {
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
      .filter(Boolean);

    if (createdNodes.length) {
      editor.setNodes(createdNodes);
    }
  }
};

onMounted(mountNodes);

watch(
  () => hasNodes.value,
  () => {
    mountNodes();
  }
);

watch(
  () => resolver?.value,
  (res) => {
    if (!res) {
      return;
    }

    editor.setResolver(res);
  }
);
</script>
