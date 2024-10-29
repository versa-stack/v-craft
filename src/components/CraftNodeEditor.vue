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
    :draggable="editor.enabled && isDraggable"
    @dragstart.stop="handleDragStart"
    @dragover.prevent.stop="handleDragOver"
    @drop.prevent.stop="handleDrop"
    @dragend.prevent.stop="handleDragEnd"
    @click.stop="craftNodeClick"
    v-on="eventHandlers"
  >
    <template v-if="craftNode.children?.length">
      <CraftNodeWrapper
        v-for="childNode in craftNode.children"
        :key="childNode.uuid"
        :craftNode="childNode"
      />
    </template>

    <template v-if="craftNodeData?.type">
      <CraftNodeWrapper
        :viewOnly="true"
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

<script setup lang="ts" generic="T extends object">
import { ComponentPublicInstance, computed, ref, watch } from "vue";
import { craftNodeIsAncestorOf, craftNodeIsCanvas } from "../lib/craftNode";
import { useEditor } from "../store/editor";
import useConnectCraftNodeToStore from "./composable/useConnectCraftNodeToStore";
import { useCraftNode } from "./composable/useCraftNode";
import useDragCraftNode from "./composable/useDragCraftNode";
import { useCraftNodeEvents } from "./composable/useCraftNodeEvents";

defineOptions({
  name: "CraftNodeEditor",
});

const editor = useEditor<T>()();
const nodeRef = ref<ComponentPublicInstance<HTMLElement> | null>(null);
const { craftNode, resolvedNode, defaultProps, resolver } = useCraftNode<T>();

const craftNodeData = computed(() => editor.nodeDataMap[craftNode.value.uuid]);

const { isSelected, isDraggable, selectNode } = useConnectCraftNodeToStore<T>(
  craftNode.value,
  nodeRef
);

const { handleDragStart, handleDragOver, handleDrop, handleDragEnd } =
  useDragCraftNode<T>(craftNode, nodeRef, resolver.value);

const { eventHandlers } = useCraftNodeEvents<T>(
  craftNode,
  editor,
  editor.eventsContext
);

const nodeName = computed(
  () => resolver?.value?.resolveNode(craftNode.value)?.componentName
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
