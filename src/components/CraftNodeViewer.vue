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
  dataList,
} = useCraftNode<T>();

const nodeProps = computed(() => ({
  ...defaultProps,
  ...currentCraftNode.value?.props,
}));

const data = computed(() => {
  return editor.nodeDataMap[currentCraftNode.value.uuid];
});

const computedChildren = computed(() => {
  if (!data.value) return [];

  if (data.value.type === "single") {
    return currentCraftNode.value.children.map((childNode) => ({
      key: `${childNode.uuid}-single`,
      craftNode: {
        ...childNode,
        props: {
          ...childNode.props,
          ...(data.value?.item || {}),
        },
      },
    }));
  }

  if (
    data.value.type === "list" &&
    data.value.list &&
    (Array.isArray(data.value.list) ||
      typeof data.value.list[Symbol.iterator] === "function")
  ) {
    const dataArray = Array.isArray(dataList.value)
      ? dataList.value
      : Array.from(dataList.value);

    return dataArray.map((item, index) => ({
      key: `${item.childNode.uuid}-${index}`,
      craftNode: {
        ...item.childNode,
        props: { ...item.childNode.props, ...item.dataItem },
      },
    }));
  }
  return [];
});

const nodeRef = ref<HTMLElement | null>(null);

const { eventHandlers } = useCraftNodeEvents<T>(
  currentCraftNode,
  editor.eventsContext as any
);

onMounted(() => {
  if (nodeRef.value && currentCraftNode.value) {
    editor.setNodeRef(currentCraftNode.value, nodeRef.value);
  }
});
</script>
