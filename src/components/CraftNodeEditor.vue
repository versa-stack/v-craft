<template>
  <component
    ref="nodeRef"
    v-if="craftNode && resolvedNode"
    :data-node-name="nodeName"
    :is="resolvedNode.componentName"
    v-bind="{ ...defaultProps, ...craftNode.props }"
    :class="{
      'v-craft-node-selected': isSelected,
      'v-craft-node': editor.enabled,
      'v-craft-canvas': craftNodeIsCanvas(craftNode),
      'v-craft-empty': craftNode.children?.length == 0,
      'v-craft-other-node-dragged':
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
    <template v-if="craftNode.children.length">
      <CraftNodeWrapper
        v-for="childNode in craftNode.children"
        :key="childNode.uuid"
        :craftNode="childNode"
      />
    </template>

    <template v-if="craftNode.data?.type">
      <CraftNodeWrapper
        :viewer="true"
        :key="`${craftNode.uuid}-data`"
        :craftNode="craftNode"
      />
    </template>

    <div
      class="v-craft-drop-text"
      v-if="craftNodeIsCanvas(craftNode) && !craftNode.children?.length"
    >
      Drop a component here.
    </div>
  </component>
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
const { craftNode, resolvedNode, defaultProps, resolver } = useCraftNode();

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
@use "../assets/craftNodeEditor";

.v-craft-node::before {
  content: attr(data-node-name);
}
</style>
