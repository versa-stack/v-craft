<template>
  <CraftNodeViewer
    v-for="craftNode in nodes"
    :key="craftNode.uuid"
    :craftNode="craftNode"
    :nodeDataMap="nodeDataMap"
    :eventsContext="eventsContext"
  />
</template>

<script
  lang="ts"
  setup
  generic="T extends FormKitSchemaDefinition = FormKitSchemaDefinition"
>
import { computed, provide } from "vue";
import { CraftNode, CraftNodeDatasource } from "../lib/craftNode";
import CraftNodeResolver, {
  CraftNodeResolverMap,
} from "../lib/CraftNodeResolver";
import CraftNodeViewer from "./CraftNodeViewer.vue";
import { FormKitSchemaDefinition } from "@formkit/core";

defineOptions({
  name: "CraftStaticRenderer",
});

const props = defineProps<{
  nodes: CraftNode[];
  resolverMap?: CraftNodeResolverMap<T>;
  resolver?: CraftNodeResolver<T>;
  nodeDataMap?: Record<string, CraftNodeDatasource>;
  eventsContext?: Record<string, any>;
}>();

const resolver = computed(
  () => props.resolver || new CraftNodeResolver(props.resolverMap),
);
provide("resolver", resolver);
provide("nodeDataMap", props.nodeDataMap || {});
provide("eventsContext", props.eventsContext || {});
</script>
