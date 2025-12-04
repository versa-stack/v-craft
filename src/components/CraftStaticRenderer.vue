<template>
  <template v-for="node in nodes" :key="node.uuid">
    <template v-if="isVisible(node)">
      <component
        :is="resolveComponent(node)"
        v-bind="getNodeProps(node)"
        v-on="getEventHandlers(node)"
      >
        <template v-if="!getNodeData(node)?.type">
          <CraftStaticRenderer
            v-if="node.children?.length"
            :nodes="node.children"
            :resolver-map="resolverMap"
            :node-data-map="nodeDataMap"
            :events-context="eventsContext"
          />
        </template>
        <template v-else>
          <CraftStaticRenderer
            v-if="computeDataChildren(node).length"
            :nodes="computeDataChildren(node)"
            :resolver-map="resolverMap"
            :node-data-map="nodeDataMap"
            :events-context="eventsContext"
          />
        </template>
      </component>
    </template>
  </template>
</template>

<script lang="ts" setup generic="T extends object">
import { computed, onBeforeMount, onBeforeUnmount, watch } from "vue";
import { CraftNode, CraftNodeDatasource, isVisible } from "../lib/craftNode";
import CraftNodeResolver, { CraftNodeResolverMap } from "../lib/CraftNodeResolver";

defineOptions({
  name: "CraftStaticRenderer",
});

const props = withDefaults(
  defineProps<{
    nodes: CraftNode[];
    resolverMap: CraftNodeResolverMap<T>;
    nodeDataMap?: Record<string, CraftNodeDatasource | null>;
    eventsContext?: Record<string, any>;
  }>(),
  {
    nodeDataMap: () => ({}),
    eventsContext: () => ({}),
  }
);

const resolver = computed(() => new CraftNodeResolver(props.resolverMap));

const resolveComponent = (node: CraftNode) => {
  const resolved = resolver.value.resolveNode(node);
  return resolved?.componentName || node.componentName;
};

const getNodeProps = (node: CraftNode) => {
  const resolved = resolver.value.resolveNode(node);
  return {
    ...(resolved?.defaultProps || {}),
    ...node.props,
  };
};

const getNodeData = (node: CraftNode): CraftNodeDatasource | null => {
  return props.nodeDataMap?.[node.uuid] || null;
};

const computeDataChildren = (node: CraftNode): CraftNode[] => {
  const data = getNodeData(node);
  if (!data || !node.children) return [];

  if (data.type === "single") {
    return node.children.map((child) => ({
      ...child,
      uuid: `${child.uuid}-single`,
      props: { ...child.props, ...(data.item || {}) },
    }));
  }

  if (data.type === "list" && data.list) {
    return node.children.flatMap((child) =>
      data.list!.map((item, index) => ({
        ...child,
        uuid: `${child.uuid}-data-${index}`,
        props: { ...child.props, ...(item || {}) },
      }))
    );
  }

  return [];
};

const eventHandlersCache = new Map<string, Record<string, (...args: any[]) => void>>();

const buildEventHandlers = (node: CraftNode): Record<string, (...args: any[]) => void> => {
  const handlers: Record<string, (...args: any[]) => void> = {};

  if (!node.events || !Object.keys(node.events).length) {
    return handlers;
  }

  Object.entries(node.events).forEach(([eventName, eventCode]) => {
    if (!eventCode?.trim()) return;

    handlers[eventName] = (...args: any[]) => {
      try {
        const eventHandler = new Function("ctx", "craftNode", "args", eventCode);
        eventHandler(props.eventsContext, node, ...args);
      } catch (e) {
        console.error(`Event code execution failed with code:\n${eventCode}\n\nError:`, e);
      }
    };
  });

  return handlers;
};

const getEventHandlers = (node: CraftNode): Record<string, (...args: any[]) => void> => {
  if (!eventHandlersCache.has(node.uuid)) {
    eventHandlersCache.set(node.uuid, buildEventHandlers(node));
  }
  return eventHandlersCache.get(node.uuid)!;
};

watch(
  () => props.nodes,
  () => eventHandlersCache.clear(),
  { deep: true }
);

onBeforeUnmount(() => {
  eventHandlersCache.clear();
});
</script>
