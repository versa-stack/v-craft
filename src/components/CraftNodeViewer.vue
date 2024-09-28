<template>
  <component
    ref="nodeRef"
    v-if="resolver && resolvedNode"
    :is="resolvedNode.componentName"
    v-bind="{ ...defaultProps, ...currentCraftNode.props }"
  >
    <template v-if="!currentCraftNode.data">
      <CraftNodeWrapper
        v-for="childNode in currentCraftNode.children"
        :viewer="true"
        :key="childNode.uuid"
        :craftNode="childNode"
      />
    </template>

    <template v-else-if="currentCraftNode.data.type === 'single'">
      <CraftNodeWrapper
        v-for="childNode in currentCraftNode.children"
        :viewer="true"
        :key="`${childNode.uuid}-single-${JSON.stringify(
          currentCraftNode.data.item
        )}`"
        :craftNode="{
          ...childNode,
          props: { ...childNode.props, ...(currentCraftNode.data.item || {}) },
        }"
      />
    </template>

    <template v-else-if="currentCraftNode.data.type === 'list'">
      <CraftNodeWrapper
        v-for="item in computedDataList"
        :viewer="true"
        :key="item.key"
        :craftNode="{
          ...item.childNode,
          props: { ...item.childNode.props, ...(item.dataItem || {}) },
        }"
      />
    </template>
  </component>
</template>

<script lang="ts" setup>
import { computed, watch, ref } from "vue";
import { useCraftNode } from "./composable/useCraftNode";
import CraftNodeWrapper from "./CraftNodeWrapper.vue";
import { useEditor } from "../store/editor";
import { CraftDataListItem } from ".";

defineOptions({
  name: "CraftNodeViewer",
});

const editor = useEditor();
const {
  craftNode: currentCraftNode,
  resolvedNode,
  defaultProps,
  resolver,
  dataList,
} = useCraftNode();

const forceUpdate = ref(0);

watch(
  () => editor.pendingUpdates.size,
  () => {
    forceUpdate.value++;
  }
);

const computedDataList = computed<CraftDataListItem[]>(() => {
  forceUpdate.value;

  if (
    currentCraftNode.value?.children.length &&
    currentCraftNode.value?.data?.type === "list" &&
    Array.isArray(currentCraftNode.value.data.list)
  ) {
    return Array.from(dataList.value).map((item) => ({
      ...item,
      craftNode: {
        ...item.childNode,
        props: { ...item.childNode.props, ...item.dataItem },
      },
      key: `${item.childNode.uuid}-${item.dataIndex}-${JSON.stringify(
        item.dataItem
      )}-${forceUpdate.value}`,
    }));
  }
  return [];
});

const nodeRef = ref<HTMLElement | null>(null);
watch(
  () => nodeRef.value,
  (newRef) => {
    if (newRef && currentCraftNode.value) {
      editor.setNodeRef(currentCraftNode.value, newRef);
    }
  },
  { immediate: true }
);
</script>
