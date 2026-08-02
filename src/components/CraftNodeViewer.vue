<template>
  <component
    :is="componentToRender"
    v-if="visible && resolver && resolvedNode"
    ref="nodeRef"
    v-bind="{ ...nodeProps, ...runtimeProps }"
    v-on="finalEventHandlers"
  >
    <template
      v-for="slotName in availableSlots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <template v-if="shouldRenderSlots">
        <template v-if="!data?.type">
          <CraftNodeViewer
            v-for="childNode in slotNodes[slotName]"
            :key="childNode.uuid"
            :craft-node="childNode"
            :context="buildChildContext(slotName, slotProps)"
          />
        </template>
        <template v-else>
          <CraftNodeViewer
            v-for="item in computedChildren(slotNodes[slotName], slotName)"
            :key="item.key"
            :craft-node="item.craftNode"
            :context="buildChildContext(slotName, slotProps, item.dataItem)"
          />
        </template>
      </template>
    </template>
  </component>
</template>

<script lang="ts" setup>
import { computed, onMounted, provide, ref, toRef } from "vue";
import {
  CraftNode,
  CraftNodeDatasource,
  craftNodeIsCanvas,
} from "../lib/craftNode";
import { useCraftNodeEvents } from "./composable/useCraftNodeEvents";
import { useResolveCraftNode } from "./composable/useResolveCraftNode";
import { CraftNodePropsContext } from "./composable/useResolveCraftNodeProps";
import { useCraftNodeWrapper } from "./composable/useCraftNodeWrapper";
import CraftNodeViewer from "./CraftNodeViewer.vue";

defineOptions({
  name: "CraftNodeViewer",
});

const props = defineProps<{
  craftNode: CraftNode;
  nodeDataMap?: Record<string, CraftNodeDatasource>;
  eventsContext?: Record<string, any>;
  context?: CraftNodePropsContext;
}>();

const craftNode = toRef(props, "craftNode");
const { editor, visible } = useCraftNodeWrapper(craftNode);
const { resolvedNode, resolver, componentToRender, props: nodeProps } =
  useResolveCraftNode(craftNode, () => props.context || {});

provide("resolver", resolver);

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
    editor?.nodeDataMap?.[craftNode.value.uuid]
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

const nodeRef = ref<HTMLElement | null>(null);

const { eventHandlers } = useCraftNodeEvents(
  craftNode,
  props.eventsContext || editor?.eventsContext || {},
  {
    getNodes: () =>
      editor?.nodeMap
        ? (Object.fromEntries(editor.nodeMap.entries()) as Record<
            string,
            CraftNode
          >)
        : null,
    getNode: (uuid) => editor?.nodeMap.get(uuid) ?? null,
    nodeValues: editor?.nodeRuntimeProps,
    setNodeProps: (uuid, patch) => editor?.setNodeRuntimeProps(uuid, patch),
    state: editor?.pageState,
  },
);

const runtimeProps = computed(() => editor?.nodeRuntimeProps[craftNode.value.uuid] || {});

const captureNodeValue = (value: any) => {
  editor?.setNodeRuntimeProps(craftNode.value.uuid, { value });
};

const finalEventHandlers = computed(() => {
  const compose = (name: string, capture: (...args: any[]) => void) => (...args: any[]) => {
    capture(...args);
    (eventHandlers.value[name] as ((...a: any[]) => void) | undefined)?.(...args);
  };

  return {
    ...eventHandlers.value,
    input: compose("input", (e: Event) => captureNodeValue((e?.target as HTMLInputElement)?.value)),
    change: compose("change", (e: Event) => captureNodeValue((e?.target as HTMLInputElement)?.value)),
    "update:modelValue": compose("update:modelValue", (value: any) => captureNodeValue(value)),
  };
});

onMounted(() => {
  if (nodeRef.value && craftNode.value && editor) {
    editor.setNodeRef(craftNode.value, nodeRef.value);
  }
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
        //@ts-expect-error - data.list is only present on the list-typed union member
        data.list.map((item, index) => ({
          key: `${childNode.uuid}-data-${index}`,
          craftNode: {
            ...childNode,
            props: {
              ...childNode.props,
              ...(item || {}),
            },
          },
        })),
      );
    }, [] as ComputedDataNode[]);
  }

  return [];
};
</script>
