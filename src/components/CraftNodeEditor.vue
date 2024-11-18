<template>
  <component
    ref="nodeRef"
    v-if="visible && craftNode && resolvedNode"
    v-bind="{ ...defaultProps, ...craftNode.props }"
    v-on="eventHandlers"
    :data-node-name="nodeName"
    :is="resolvedNode.componentName"
    :style="{ '--node-color': nodeColor }"
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
    @click.prevent.stop="craftNodeClick"
    @dragend.prevent.stop="handleDragEnd"
    @dragover.prevent.stop="handleDragOver"
    @dragstart.stop="handleDragStart"
    @drop.prevent.stop="handleDrop"
  >
    <template v-if="craftNode.children?.length">
      <CraftNodeEditor
        v-for="childNode in craftNode.children"
        :key="childNode.uuid"
        :craftNode="childNode"
      />
    </template>

    <template v-if="craftNodeData?.type">
      <CraftNodeViewer :key="`${craftNode.uuid}-data`" :craftNode="craftNode" />
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
import { ComponentPublicInstance, computed, provide, ref, toRef } from "vue";
import {
  CraftNode,
  craftNodeIsAncestorOf,
  craftNodeIsCanvas,
} from "../lib/craftNode";
import useConnectCraftNodeToStore from "./composable/useConnectCraftNodeToStore";
import { useCraftNodeEvents } from "./composable/useCraftNodeEvents";
import { useCraftNodeWrapper } from "./composable/useCraftNodeWrapper";
import useDragCraftNode from "./composable/useDragCraftNode";
import { useResolveCraftNode } from "./composable/useResolveCraftNode";

defineOptions({
  name: "CraftNodeEditor",
});

const props = defineProps<{
  craftNode: CraftNode<T>;
}>();

const craftNode = toRef(props, "craftNode");
const { editor, visible } = useCraftNodeWrapper(craftNode);
const { resolvedNode, defaultProps, resolver } =
  useResolveCraftNode<T>(craftNode);

if (resolver.value) provide("resolver", resolver);

const nodeRef = ref<ComponentPublicInstance<HTMLElement> | null>(null);
const craftNodeData = computed(() => editor.nodeDataMap[craftNode.value.uuid]);

const { isSelected, isDraggable, selectNode } = useConnectCraftNodeToStore<T>(
  craftNode.value,
  nodeRef
);

const { handleDragStart, handleDragOver, handleDrop, handleDragEnd } =
  useDragCraftNode<T>(craftNode, nodeRef, resolver.value);

const { eventHandlers } = useCraftNodeEvents<T>(
  craftNode,
  editor as any,
  editor.eventsContext
);

const nodeName = computed(
  () => resolver?.value?.resolveNode(craftNode.value)?.componentName
);

const craftNodeClick = () => {
  selectNode();
};

const generateColorFromUUID = (uuid: string): string => {
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    hash = uuid.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  const s = 70 + (hash % 30);
  const l = 45 + (hash % 30);
  return `hsla(${h}, ${s}%, ${l}%, 0.9)`;
};

const nodeColor = computed(() => generateColorFromUUID(craftNode.value.uuid));
</script>

<style lang="scss" scoped>
@use "../assets/craftNodeEditor";

.v-craft-node::before {
  content: attr(data-node-name);
}
</style>
