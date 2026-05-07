<template>
  <CraftNodeViewer
    v-for="craftNode in nodes"
    :key="craftNode.uuid"
    :craftNode="craftNode"
    :nodeDataMap="nodeDataMap"
    :eventsContext="eventsContext"
  />
</template>

<script lang="ts" setup generic="T extends object">
import { computed, provide } from "vue";
import { CraftNode, CraftNodeDatasource } from "../lib/craftNode";
import CraftNodeResolver, { CraftNodeResolverMap } from "../lib/CraftNodeResolver";
import CraftNodeViewer from "./CraftNodeViewer.vue";

defineOptions({
  name: "CraftStaticRenderer",
});

const props = defineProps<{
  nodes: CraftNode[];
  resolverMap: CraftNodeResolverMap<T>;
  nodeDataMap?: Record<string, CraftNodeDatasource>;
  eventsContext?: Record<string, any>;
}>();

const resolver = computed(() => new CraftNodeResolver(props.resolverMap));
provide("resolver", resolver);
provide("nodeDataMap", props.nodeDataMap || {});
provide("eventsContext", props.eventsContext || {});
</script>
