<template>
  <CraftNodeWrapper
    v-if="resolver"
    v-for="craftNode in nodes"
    :key="craftNode.uuid"
    :craftNode="craftNode"
  />
  <Indicator v-if="editor.enabled" />
</template>

<script lang="ts" setup>
import {
  computed,
  ComputedRef,
  inject,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  useSlots,
  watch,
} from "vue";
import { buildCraftNodeTree, CraftNode } from "../lib/craftNode";
import CraftNodeResolver, {
  CraftNodeResolverMap,
} from "../lib/CraftNodeResolver";
import vNodeToCraftNode from "../lib/vNodeToCraftNode";
import { useEditor } from "../store/editor";
import Indicator from "./CraftDropIndicator.vue";

defineOptions({
  name: "CraftFrame",
});

const props = defineProps<{
  resolverMap?: CraftNodeResolverMap;
}>();

const editor = useEditor();
const resolver = props.resolverMap
  ? ref(new CraftNodeResolver(props.resolverMap))
  : inject<ComputedRef<CraftNodeResolver>>("resolver");

if (resolver?.value) {
  editor.setResolver(resolver?.value);
}

watch(
  () => resolver?.value,
  (r) => {
    if (r) {
      editor.setResolver(r);
    }
  }
);

if (props.resolverMap) {
  provide("resolver", resolver);
}

const nodes = computed(() => editor.nodes);

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

  return createdNodes.map(buildCraftNodeTree);
};

const slotNodes = ref([] as CraftNode[]);

onBeforeMount(() => {
  slotNodes.value = createNodesFromSlots();
  if (!editor.hasNodes && slotNodes.value) {
    editor.setNodes(slotNodes.value);
  }
});

watch(
  () => editor.hasNodes,
  () => {
    if (!editor.hasNodes && slotNodes.value) {
      editor.setNodes(slotNodes.value);
    }
  }
);

const applyUpdates = () => {
  editor.applyPendingUpdates();
};

let updateInterval: number;

onMounted(() => {
  updateInterval = setInterval(applyUpdates, 100) as unknown as number;
});

onBeforeUnmount(() => {
  clearInterval(updateInterval);
});
</script>
