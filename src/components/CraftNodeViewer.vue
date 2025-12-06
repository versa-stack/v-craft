<template>
  <component
    ref="nodeRef"
    v-if="visible && resolver && resolvedNode"
    :is="resolvedNode.componentName"
    v-bind="nodeProps"
    v-on="eventHandlers"
  >
    <template v-if="!isVoidElement">
      <template v-if="!data?.type">
        <CraftNodeViewer
          v-for="childNode in craftNode.children"
          :key="childNode.uuid"
          :craftNode="childNode"
        />
      </template>

      <template v-else>
        <CraftNodeViewer
          v-for="item in computedChildren"
          :key="item.key"
          :craftNode="item.craftNode"
        />
      </template>
    </template>
  </component>
</template>

<script lang="ts" setup generic="T extends object">
import { computed, onMounted, provide, ref, toRef } from "vue";
import { CraftNode, CraftNodeDatasource } from "../lib/craftNode";
import { useCraftNodeEvents } from "./composable/useCraftNodeEvents";
import { useResolveCraftNode } from "./composable/useResolveCraftNode";
import { useCraftNodeWrapper } from "./composable/useCraftNodeWrapper";

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'source', 'track', 'wbr'
]);

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

const isVoidElement = computed(() => {
  const componentName = resolvedNode.value?.componentName?.toLowerCase();
  return componentName ? VOID_ELEMENTS.has(componentName) : false;
});

const nodeProps = computed(() => ({
  ...defaultProps.value,
  ...craftNode.value?.props,
}));

const data = computed(() => {
  return editor.nodeDataMap[craftNode.value.uuid];
});

const computedChildren = computed(() =>
  data.value ? computeDataNodes(data.value, craftNode.value.children) : []
);

const nodeRef = ref<HTMLElement | null>(null);

const { eventHandlers } = useCraftNodeEvents<T>(
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
