<template>
  <component
    ref="nodeRef"
    v-if="
      (craftNode.visible || craftNode.visible === undefined) &&
      resolver &&
      resolvedNode
    "
    :is="componentToRender"
    v-bind="finalProps"
    v-on="finalEventHandlers"
  >
    <template
      v-for="slotName in availableSlots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <template v-if="!data?.type">
        <CraftNodeStatic
          v-for="childNode in slotNodes[slotName]"
          :key="childNode.uuid"
          :craftNode="childNode"
          :nodeMap="nodeMap"
          :nodeDataMap="nodeDataMap"
          :eventsContext="eventsContext"
          :nodeRuntimeProps="nodeRuntimeProps"
          :pageState="pageState"
          :context="buildChildContext(slotName, slotProps)"
        />
      </template>
      <template v-else>
        <CraftNodeStatic
          v-for="item in computedChildren(slotNodes[slotName], slotName)"
          :key="item.key"
          :craftNode="item.craftNode"
          :nodeMap="nodeMap"
          :nodeDataMap="nodeDataMap"
          :eventsContext="eventsContext"
          :nodeRuntimeProps="nodeRuntimeProps"
          :pageState="pageState"
          :context="buildChildContext(slotName, slotProps, item.dataItem)"
        />
      </template>
    </template>
  </component>
</template>

<script lang="ts" setup>
import { computed, provide, readonly, ref, toRefs } from "vue";
import {
  CraftNode,
  CraftNodeDatasource,
  craftNodeIsCanvas,
} from "../lib/craftNode";
import { useCraftNodeEvents } from "./composable/useCraftNodeEvents";
import { useResolveCraftNode } from "./composable/useResolveCraftNode";
import { CraftNodePropsContext } from "./composable/useResolveCraftNodeProps";
import CraftNodeStatic from "./CraftNodeStatic.vue";

defineOptions({
  name: "CraftNodeStatic",
});

const props = defineProps<{
  craftNode: CraftNode;
  nodeMap: Map<string, CraftNode>;
  nodeDataMap?: Record<string, CraftNodeDatasource>;
  eventsContext?: Record<string, any>;
  nodeRuntimeProps?: Record<string, Record<string, any>>;
  pageState?: Record<string, any>;
  context?: CraftNodePropsContext;
}>();

const { craftNode, nodeMap } = toRefs(props);
const { resolvedNode, resolver, componentToRender, props: nodeProps } =
  useResolveCraftNode(craftNode, () => props.context || {});

provide("resolver", resolver);
provide("craftNode", readonly(craftNode.value));

const buildChildContext = (
  slotName: string,
  slotProps: Record<string, any> = {},
  dataItem?: Record<string, any>,
): CraftNodePropsContext => {
  const allowedKeys = resolver?.value?.getSlotsProps?.(craftNode.value)?.[slotName];
  const bucket = allowedKeys
    ? Object.fromEntries(
        allowedKeys
          .filter((key) => key in slotProps)
          .map((key) => [key, slotProps[key]]),
      )
    : slotProps;

  const context: CraftNodePropsContext = {
    ...(props.context || {}),
    [slotName]: bucket,
  };

  if (dataItem !== undefined) {
    context.data = dataItem;
  }

  return context;
};

const data = computed(() => {
  return props.nodeDataMap?.[craftNode.value.uuid] || null;
});

const slotNodes = computed(() => {
  return craftNode.value.slots || {};
});

const isCanvas = computed(() => craftNodeIsCanvas(craftNode.value));

const availableSlots = computed(() => {
  if (!shouldRenderSlots.value) {
    return [];
  }
  const slots: string[] = [];
  const resolved = resolver?.value?.resolveNode?.(craftNode.value);
  const resolverSlots = resolved?.slots;
  if (resolverSlots && resolverSlots.length > 0) {
    slots.push(...resolverSlots);
  } else {
    slots.push("default");
  }
  return slots;
});

const shouldRenderSlots = computed(() => {
  if (isCanvas.value) return true;
  return Object.values(slotNodes.value).some((children) => children.length > 0);
});

const computedChildren = (children: CraftNode[], slotName: string) => {
  if (!data.value) return [];
  if (data.value.slotName && data.value.slotName !== slotName) return [];
  return computeDataNodes(data.value, children);
};

const setNodeRuntimeProps = (uuid: string, patch: Record<string, any>) => {
  if (!props.nodeRuntimeProps) return;
  props.nodeRuntimeProps[uuid] = { ...(props.nodeRuntimeProps[uuid] || {}), ...patch };
};

const { eventHandlers } = useCraftNodeEvents(
  craftNode,
  props.eventsContext || {},
  {
    getNodes: () => Object.fromEntries(nodeMap.value.entries()),
    getNode: (uuid) => nodeMap.value.get(uuid) ?? null,
    nodeValues: props.nodeRuntimeProps,
    setNodeProps: setNodeRuntimeProps,
    state: props.pageState,
  },
);

const finalProps = computed(() => ({
  ...nodeProps.value,
  ...(props.nodeRuntimeProps?.[craftNode.value.uuid] || {}),
}));

const finalEventHandlers = computed(() => {
  const compose = (name: string, capture: (...args: any[]) => void) => (...args: any[]) => {
    capture(...args);
    (eventHandlers.value[name] as ((...a: any[]) => void) | undefined)?.(...args);
  };

  return {
    ...eventHandlers.value,
    input: compose("input", (e: Event) => setNodeRuntimeProps(craftNode.value.uuid, { value: (e?.target as HTMLInputElement)?.value })),
    change: compose("change", (e: Event) => setNodeRuntimeProps(craftNode.value.uuid, { value: (e?.target as HTMLInputElement)?.value })),
    "update:modelValue": compose("update:modelValue", (value: any) => setNodeRuntimeProps(craftNode.value.uuid, { value })),
  };
});

type ComputedDataNode = {
  key: string;
  craftNode: CraftNode;
  dataItem: Record<string, any>;
};

const computeDataNodes = (
  data: CraftNodeDatasource,
  children: CraftNode[],
): ComputedDataNode[] => {
  if (data.type === "single") {
    return children.map((childNode) => ({
      key: `${childNode.uuid}-single`,
      craftNode: {
        ...childNode,
        props: {
          ...childNode.props,
          ...(data.item || {}),
        },
      },
      dataItem: data.item || {},
    }));
  }

  if (data.type === "list") {
    if (!data.list) return [];

    return children.reduce((acc, childNode) => {
      return acc.concat(
        //@ts-ignore
        data.list.map((item, index) => ({
          key: `${childNode.uuid}-data-${index}`,
          craftNode: {
            ...childNode,
            props: {
              ...childNode.props,
              ...(item || {}),
            },
          },
          dataItem: item || {},
        })),
      );
    }, [] as ComputedDataNode[]);
  }

  return [];
};
</script>
