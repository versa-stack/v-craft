<template>
  <!-- <CraftErrorBoundary> -->
  <component
    ref="nodeRef"
    v-if="resolver && resolvedNode"
    :is="resolvedNode.componentName"
    v-bind="{ ...defaultProps, ...craftNode.props }"
  >
    <CraftNodeWrapper
      :viewer="true"
      v-if="!craftNode.data"
      v-for="childNode in craftNode.children"
      :key="childNode.uuid"
      :craftNode="childNode"
    />

    <CraftNodeWrapper
      :viewer="true"
      v-if="craftNode.data?.type === 'single'"
      v-for="childNode in craftNode.children"
      :key="childNode.uuid + '-single'"
      :craftNode="{
        ...childNode,
        props: { ...childNode.props, ...(craftNode.data.item || {}) },
      }"
    />

    <CraftNodeWrapper
      :viewer="true"
      v-if="craftNode.data?.type === 'list'"
      v-for="comb in dataList"
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
import { useCraftNode } from "./composable/useCraftNode";
import CraftNodeWrapper from "./CraftNodeWrapper.vue";

defineOptions({
  name: "CraftNodeViewer",
});

const { craftNode, resolvedNode, defaultProps, resolver, dataList } =
  useCraftNode();
</script>
