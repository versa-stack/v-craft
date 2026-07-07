<template>
  <CraftNodeStatic
    v-for="craftNode in nodes"
    :key="craftNode.uuid"
    :craftNode="craftNode"
    :nodeMap="nodeMap"
    :nodeDataMap="nodeDataMap"
    :eventsContext="eventsContext"
    :nodeRuntimeProps="nodeRuntimeProps"
    :pageState="pageState"
  />
</template>

<script
  lang="ts"
  setup
  generic="T extends FormKitSchemaDefinition = FormKitSchemaDefinition"
>
import { computed, provide, reactive, readonly } from "vue";
import { CraftNode, CraftNodeDatasource } from "../lib/craftNode";
import CraftNodeResolver, {
  CraftNodeResolverMap,
} from "../lib/CraftNodeResolver";
import CraftNodeStatic from "./CraftNodeStatic.vue";
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

const recurseNodes = (node: CraftNode, nm: Map<string, CraftNode>) => {
  nm.set(node.uuid, node);
  Object.entries(node.slots).forEach(([slot, children]) => {
    if (!children?.forEach) {
      return;
    }

    children.forEach((c) => recurseNodes(c, nm));
  });
};

const nodeMap = computed(() => {
  const nm = new Map<string, CraftNode>();
  props.nodes.forEach((n) => recurseNodes(n, nm));
  return nm;
});

const resolver = computed(
  () => props.resolver || new CraftNodeResolver(props.resolverMap),
);
provide("resolver", resolver);
provide("nodeDataMap", props.nodeDataMap || {});
provide("eventsContext", props.eventsContext || {});

/** Live runtime props written by event handlers or captured from value-bearing nodes, by uuid. */
const nodeRuntimeProps = reactive<Record<string, Record<string, any>>>({});
/** Page-scoped bag shared across event handlers, e.g. a pending flag. */
const pageState = reactive<Record<string, any>>({});
</script>
