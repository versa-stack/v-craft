<template>
  <!-- <CraftErrorBoundary> -->
  <component
    ref="nodeRef"
    v-if="craftNode && resolvedNode"
    :data-node-name="nodeName"
    :is="resolvedNode.componentName"
    v-bind="{ ...defaultProps, ...craftNode.props }"
    :class="{
      'fvc-node-selected': isSelected,
      'fvc-node': editor.enabled,
      'fvc-canvas': craftNodeIsCanvas(craftNode),
      'fvc-empty': craftNode.children?.length == 0,
      'fvc-other-node-dragged':
        editor.draggedNode &&
        !craftNodeIsAncestorOf(editor.draggedNode, craftNode),
    }"
    :draggable="isDraggable"
    @dragstart.stop="handleDragStart"
    @dragover.prevent.stop="handleDragOver"
    @drop.prevent.stop="handleDrop"
    @dragend.prevent.stop="handleDragEnd"
    @click.stop="craftNodeClick"
  >
    <CraftNodeWrapper
      v-for="childNode in craftNode.children"
      :key="childNode.uuid"
      :craftNode="childNode"
    />

    <CraftNodeWrapper
      v-if="craftNode.data?.type === 'single'"
      v-for="child in craftNode.children"
      :viewer="true"
      :key="child.uuid + '-single'"
      :craftNode="{
        ...child,
        props: { ...(child.props || {}), ...(craftNode.data.item || {}) },
      }"
    />

    <CraftNodeWrapper
      v-if="craftNode.data?.type === 'list'"
      v-for="comb in dataList"
      :viewer="true"
      :key="comb.childNode.uuid + '-' + comb.dataIndex"
      :craftNode="{
        ...comb.childNode,
        props: { ...comb.childNode.props, ...comb.dataItem },
      }"
    />

    <div
      class="fvc-drop-text"
      v-if="craftNodeIsCanvas(craftNode) && !craftNode.children?.length"
    >
      Drop a component here.
    </div>
  </component>
  <!-- </CraftErrorBoundary> -->
</template>
<script setup lang="ts">
import { computed, ComputedRef, ref } from "vue";
import { craftNodeIsAncestorOf, craftNodeIsCanvas } from "../lib/craftNode";
import CraftNodeResolver from "../lib/CraftNodeResolver";
import { useEditor } from "../store/editor";
import useConnectCraftNodeToStore from "./composable/useConnectCraftNodeToStore";
import { useCraftNode } from "./composable/useCraftNode";
import useDragCraftNode from "./composable/useDragCraftNode";

defineOptions({
  name: "CraftNodeEditor",
});

const editor = useEditor();
const nodeRef = ref<any>(null);
const { craftNode, resolvedNode, defaultProps, resolver, dataList } =
  useCraftNode();

const { isSelected, isDraggable, selectNode } = useConnectCraftNodeToStore(
  craftNode.value,
  nodeRef
);
const { handleDragStart, handleDragOver, handleDrop, handleDragEnd } =
  useDragCraftNode(
    craftNode,
    nodeRef,
    (resolver as ComputedRef<CraftNodeResolver>).value
  );
const nodeName = computed(() =>
  craftNode.value
    ? `${
        resolver?.value?.resolveNode(craftNode.value)?.componentName ||
        "Unknown"
      }`
    : ""
);

const craftNodeClick = () => {
  selectNode();
};
</script>
<style lang="scss" scoped>
@import "../assets/craftNodeEditor";

.fvc-node::before {
  content: attr(data-node-name);
}
</style>
