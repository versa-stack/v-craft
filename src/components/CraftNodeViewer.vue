<template>
  <component
    ref="nodeRef"
    v-if="resolver && resolvedNode"
    :is="resolvedNode.componentName"
    v-bind="nodeProps"
    v-on="eventHandlers"
  >
    <template v-if="!data?.type">
      <CraftNodeWrapper
        v-for="childNode in currentCraftNode.children"
        :viewOnly="true"
        :key="childNode.uuid"
        :craftNode="childNode"
      />
    </template>

    <template v-else>
      <CraftNodeWrapper
        v-for="item in computedChildren"
        :viewOnly="true"
        :key="item.key"
        :craftNode="item.craftNode"
      />
    </template>
  </component>
</template>

<script lang="ts" setup generic="T extends object">
import { computed, onMounted, ref } from "vue";
import { CraftNode, CraftNodeDatasource } from "../lib/craftNode";
import { useEditor } from "../store/editor";
import { useCraftNode } from "./composable/useCraftNode";
import { useCraftNodeEvents } from "./composable/useCraftNodeEvents";
import CraftNodeWrapper from "./CraftNodeWrapper.vue";

defineOptions({
  name: "CraftNodeViewer",
});

const editor = useEditor<T>()();
const {
  craftNode: currentCraftNode,
  resolvedNode,
  defaultProps,
  resolver,
} = useCraftNode<T>();

const nodeProps = computed(() => ({
  ...defaultProps,
  ...currentCraftNode.value?.props,
}));

const data = computed(() => {
  return editor.nodeDataMap[currentCraftNode.value.uuid];
});

const computedChildren = computed(() =>
  data.value
    ? computeDataNodes(data.value, currentCraftNode.value.children)
    : []
);

const nodeRef = ref<HTMLElement | null>(null);

const { eventHandlers } = useCraftNodeEvents<T>(
  currentCraftNode,
  editor,
  editor.eventsContext
);

onMounted(() => {
  if (nodeRef.value && currentCraftNode.value) {
    editor.setNodeRef(currentCraftNode.value, nodeRef.value);
  }
});

type ComputedDataNode = { key: string; craftNode: CraftNode<T> };

const computeDataNodes = (
  data: CraftNodeDatasource,
  children: CraftNode<T>[]
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
