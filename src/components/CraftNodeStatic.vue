<template>
  <component
    :is="componentToRender"
    v-if="
      (craftNode.visible || craftNode.visible === undefined) &&
        resolver &&
        resolvedNode
    "
    ref="nodeRef"
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
          :craft-node="childNode"
          :node-map="nodeMap"
          :node-data-map="nodeDataMap"
          :events-context="eventsContext"
          :node-runtime-props="nodeRuntimeProps"
          :page-state="pageState"
          :context="buildChildContext(slotName, slotProps)"
        />
      </template>
      <template v-else>
        <CraftNodeStatic
          v-for="item in computedChildren(slotNodes[slotName], slotName)"
          :key="item.key"
          :craft-node="item.craftNode"
          :node-map="nodeMap"
          :node-data-map="nodeDataMap"
          :events-context="eventsContext"
          :node-runtime-props="nodeRuntimeProps"
          :page-state="pageState"
          :context="buildChildContext(slotName, slotProps, item.dataItem)"
        />
      </template>
    </template>
  </component>
</template>

<script lang="ts" setup>
import { computed, provide, readonly, ref, toRaw, toRefs, watchEffect } from "vue";
import {
  CraftNode,
  CraftNodeDatasource,
  craftNodeIsCanvas,
  itemsDatasource,
} from "../lib/craftNode";
import { useCraftNodeEvents } from "./composable/useCraftNodeEvents";
import { useResolveCraftNode } from "./composable/useResolveCraftNode";
import { CraftNodePropsContext } from "./composable/useResolveCraftNodeProps";
import CraftNodeStatic from "./CraftNodeStatic.vue";
import { capturedFor } from "../lib/capturedValues";

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
  return (
    props.nodeDataMap?.[craftNode.value.uuid] ||
    itemsDatasource(craftNode.value, props.context?.data) ||
    null
  );
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
  if ("value" in patch) capturedFor(props.nodeRuntimeProps).delete(uuid);
  props.nodeRuntimeProps[uuid] = { ...(props.nodeRuntimeProps[uuid] || {}), ...patch };
};

// A value captured from what a user typed is readable as ctx.nodeValues but
// never bound back as a prop: list siblings share the uuid, and a component
// whose value prop is modelValue (an input number) renders a stray `value` blank.
// A field whose value the host set keeps it bound and follows the typing, or
// dropping the bound value would blank the field.
const captureValue = (value: unknown) => {
  if (!props.nodeRuntimeProps) return;
  const uuid = craftNode.value.uuid;
  const captured = capturedFor(props.nodeRuntimeProps);
  const hostSet = "value" in (props.nodeRuntimeProps[uuid] || {}) && !captured.has(uuid);
  // Only a host-set value re-renders: a re-render resets a v-model field
  // (UInput) to its defaultValue, dropping the keystroke.
  // ponytail: captured values are not reactive; make them so if a page ever displays one live.
  const target = hostSet ? props.nodeRuntimeProps : toRaw(props.nodeRuntimeProps);
  target[uuid] = { ...(target[uuid] || {}), value };
  if (!hostSet) captured.add(uuid);
};

// A field the content or its data prefilled holds that value until someone
// types, so an interaction reading ctx.nodeValues sees it too.
watchEffect(() => {
  if (!props.nodeRuntimeProps) return;
  const { modelValue, defaultValue, value } = nodeProps.value as Record<string, unknown>;
  const seed = modelValue ?? defaultValue ?? value;
  const uuid = craftNode.value.uuid;
  const raw = toRaw(props.nodeRuntimeProps);
  if (seed === undefined || "value" in (raw[uuid] || {})) return;
  raw[uuid] = { ...(raw[uuid] || {}), value: seed };
  capturedFor(props.nodeRuntimeProps).add(uuid);
});

const selfProps = ref<Record<string, unknown>>({});

const { eventHandlers, busyAttrs } = useCraftNodeEvents(
  craftNode,
  props.eventsContext || {},
  {
    getNodes: () => Object.fromEntries(nodeMap.value.entries()),
    getNode: (uuid) => nodeMap.value.get(uuid) ?? null,
    nodeValues: props.nodeRuntimeProps,
    setNodeProps: setNodeRuntimeProps,
    setSelfProps: (patch) => {
      selfProps.value = { ...selfProps.value, ...patch };
    },
    state: props.pageState,
    getData: () => props.context?.data,
  },
);

const finalProps = computed(() => {
  const uuid = craftNode.value.uuid;
  const runtime = { ...(props.nodeRuntimeProps?.[uuid] || {}) };
  if (props.nodeRuntimeProps && capturedFor(props.nodeRuntimeProps).has(uuid)) delete runtime.value;
  return { ...nodeProps.value, ...runtime, ...selfProps.value, ...busyAttrs.value };
});

const finalEventHandlers = computed(() => {
  const compose = (name: string, capture: (...args: any[]) => void) => (...args: any[]) => {
    capture(...args);
    (eventHandlers.value[name] as ((...a: any[]) => void) | undefined)?.(...args);
  };

  return {
    ...eventHandlers.value,
    input: compose("input", (e: Event) => captureValue((e?.target as HTMLInputElement)?.value)),
    change: compose("change", (e: Event) => captureValue((e?.target as HTMLInputElement)?.value)),
    "update:modelValue": compose("update:modelValue", (value: unknown) => captureValue(value)),
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
        },
      },
      dataItem: data.item || {},
    }));
  }

  if (data.type === "list") {
    if (!data.list) return [];

    return children.reduce((acc, childNode) => {
      return acc.concat(
        //@ts-expect-error - data.list is only present on the list-typed union member
        data.list.map((item, index) => ({
          key: `${childNode.uuid}-data-${index}`,
          craftNode: {
            ...childNode,
            props: {
              ...childNode.props,
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
