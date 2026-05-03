<template>
  <component
    ref="nodeRef"
    v-if="visible && resolver && resolvedNode"
    :is="resolvedNode.componentName"
    v-bind="nodeProps"
    v-on="eventHandlers"
  >
    <template v-for="slotName in availableSlots" :key="slotName" #[slotName]>
      <template v-if="shouldRenderSlots">
        <template v-if="!data?.type">
          <CraftNodeViewer
            v-for="childNode in slotNodes[slotName]"
            :key="childNode.uuid"
            :craftNode="childNode"
          />
        </template>
        <template v-else>
          <CraftNodeViewer
            v-for="item in computedChildren(slotNodes[slotName], slotName)"
            :key="item.key"
            :craftNode="item.craftNode"
          />
        </template>
      </template>
    </template>
  </component>
</template>

<script lang="ts" setup>
import { computed, onMounted, provide, ref, toRef } from "vue";
import { CraftNode, CraftNodeDatasource, craftNodeIsCanvas } from "../lib/craftNode";
import { useCraftNodeEvents } from "./composable/useCraftNodeEvents";
import { useResolveCraftNode } from "./composable/useResolveCraftNode";
import { useCraftNodeWrapper } from "./composable/useCraftNodeWrapper";
import CraftNodeViewer from "./CraftNodeViewer.vue";

defineOptions({
  name: "CraftNodeViewer",
});

const props = defineProps<{
  craftNode: CraftNode;
}>();

const craftNode = toRef(props, "craftNode");
const { editor, visible } = useCraftNodeWrapper(craftNode);
const { resolvedNode, defaultProps, resolver } = useResolveCraftNode(craftNode);

provide("resolver", resolver);

const nodeProps = computed(() => ({
  ...defaultProps.value,
  ...craftNode.value?.props,
}));

const data = computed(() => {
  return editor.nodeDataMap[craftNode.value.uuid];
});

const slotNodes = computed(() => {
  return craftNode.value.slots || {};
});

const isCanvas = computed(() => craftNodeIsCanvas(craftNode.value));

const availableSlots = computed(() => {
  const slots: string[] = [];
  const resolved = resolver?.value?.resolveNode?.(craftNode.value);
  const resolverSlots = resolved?.slots;
  if (resolverSlots && resolverSlots.length > 0) {
    slots.push(...resolverSlots);
  } else {
    slots.push('default');
  }
  return slots;
});

const shouldRenderSlots = computed(() => {
  if (isCanvas.value) return true;
  return Object.values(slotNodes.value).some(children => children.length > 0);
});

const computedChildren = (children: CraftNode[], slotName: string) => {
  if (!data.value) return [];
  if (data.value.slotName && data.value.slotName !== slotName) return [];
  return computeDataNodes(data.value, children);
};

const nodeRef = ref<HTMLElement | null>(null);

const { eventHandlers } = useCraftNodeEvents(
  craftNode,
  editor as any,
  editor.eventsContext
);

onMounted(() => {
  if (nodeRef.value && craftNode.value) {
    editor.setNodeRef(craftNode.value, nodeRef.value);
  }
});

type ComputedDataNode = { key: string; craftNode: CraftNode };

const computeDataNodes = (
  data: CraftNodeDatasource,
  children: CraftNode[]
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
        }))
      );
    }, [] as ComputedDataNode[]);
  }

  return [];
};
</script>
