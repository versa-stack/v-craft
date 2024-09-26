<template>
  <!-- <CraftErrorBoundary> -->
    <component
      ref="nodeRef"
      v-if="resolver"
      :is="resolver.resolve(craftNode.componentName).component"
      v-bind="{ ...defaultProps, ...craftNode.props }"
    >
      <CraftNodeViewer
        v-if="!craftNode.data"
        v-for="childNode in craftNode.children"
        :key="childNode.uuid"
        :craftNode="childNode"
      />

      <CraftNodeViewer
        v-if="craftNode.data?.type === 'single'"
        v-for="childNode in craftNode.children"
        :key="childNode.uuid + '-single'"
        :craftNode="{
          ...childNode,
          props: { ...childNode.props, ...(craftNode.data.item || {}) },
        }"
      />

      <CraftNodeViewer
        v-if="craftNode.data?.type === 'list'"
        v-for="comb in itemChildCombinations"
        :key="comb.childNode.uuid + '-' + comb.dataIndex"
        :craftNode="{
          ...comb.childNode,
          props: { ...comb.childNode.props, ...comb.dataItem },
        }"
      />
    </component>
  <!-- </CraftErrorBoundary> -->
</template>
<script lang="ts" setup>
import { computed, ComputedRef, inject, toRef } from "vue";
import { CraftNode } from "../lib/craftNode";
import CraftNodeResolver from "../lib/CraftNodeResolver";
import { CombinationWithKeys } from ".";

defineOptions({
  name: "CraftNodeViewer",
});

const props = defineProps<{
  craftNode: CraftNode;
}>();

const resolver = inject<ComputedRef<CraftNodeResolver>>("resolver");

const defaultProps = computed(() => {
  if (!resolver) return {};
  return resolver.value.resolve(props.craftNode.componentName).defaultProps;
});

const craftNodeRef = toRef(props, "craftNode");

function* combinationGenerator(): Generator<
  CombinationWithKeys,
  void,
  unknown
> {
  const dataItems = craftNodeRef.value.data?.list || [];
  const childNodes = craftNodeRef.value.children || [];

  for (let dataIndex = 0; dataIndex < dataItems.length; dataIndex++) {
    for (let childIndex = 0; childIndex < childNodes.length; childIndex++) {
      yield {
        dataItem: dataItems[dataIndex],
        dataIndex,
        childNode: childNodes[childIndex],
        childIndex,
        key: `${dataIndex}-${childIndex}`,
      };
    }
  }
}

const itemChildCombinations = computed(() => ({
  [Symbol.iterator]: combinationGenerator,
}));
</script>
