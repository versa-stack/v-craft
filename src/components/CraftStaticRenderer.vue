<template>
  <CraftNodeViewer
    v-for="craftNode in nodes"
    :key="craftNode.uuid"
    :craftNode="craftNode"
  />
</template>

<script lang="ts" setup generic="T extends object">
import { computed, provide } from "vue";
import { CraftNode } from "../lib/craftNode";
import CraftNodeResolver, { CraftNodeResolverMap } from "../lib/CraftNodeResolver";
import CraftNodeViewer from "./CraftNodeViewer.vue";

defineOptions({
  name: "CraftStaticRenderer",
});

const props = defineProps<{
  nodes: CraftNode[];
  resolverMap: CraftNodeResolverMap<T>;
}>();

const resolver = computed(() => new CraftNodeResolver(props.resolverMap));
provide("resolver", resolver);
</script>
