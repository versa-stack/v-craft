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
      'v-craft-node': editor?.enabled,
      'v-craft-canvas': craftNodeIsCanvas(craftNode),
      'v-craft-empty': !craftNode.slots || Object.keys(craftNode.slots).length === 0 || Object.values(craftNode.slots).every(slot => slot.length === 0),
      'v-craft-other-node-dragged':
        editor?.draggedNode &&
        !craftNodeIsAncestorOf(editor.draggedNode, craftNode),
    }"
    :draggable="editor?.enabled && isDraggable"
    @click.prevent.stop="craftNodeClick"
    @dragend.prevent.stop="handleDragEnd"
    @dragover.prevent.stop="handleDragOver"
    @dragstart.stop="handleDragStart"
    @drop.prevent.stop="handleDrop"
  >
    <template v-for="slotName in availableSlots" :key="slotName" #[slotName]>
      <div
        v-if="craftNodeIsCanvas(craftNode) && (craftNode.slots[slotName]?.length == 0)"
        class="v-craft-drop-text"
        :data-slot-name="slotName"
        @dragover.prevent.stop="handleDragOver"
        @drop.prevent.stop="handleDrop"
      >
        <span class="v-craft-drop-text-label">Drop a component here</span>
        <span class="v-craft-slot-name">{{ slotName }}</span>
      </div>
      <template v-if="shouldRenderSlots">
        <template v-if="craftNodeData?.type && craftNodeData.slotName === slotName">
          <CraftNodeViewer
            v-for="item in computedDataChildren(craftNode.slots?.[slotName] || [], slotName)"
            :key="item.key"
            :craftNode="item.craftNode"
          />
        </template>
        <CraftNodeEditor
          v-for="childNode in (craftNode.slots?.[slotName] || [])"
          :key="childNode.uuid"
          :craftNode="childNode"
        />
      </template>
    </template>
  </component>
</template>

<script setup lang="ts">
import { ComponentPublicInstance, computed, provide, ref, toRef } from "vue";
import {
  CraftNode,
  craftNodeIsAncestorOf,
  craftNodeIsCanvas,
  CraftNodeDatasource,
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
  craftNode: CraftNode;
}>();

const craftNode = toRef(props, "craftNode");
const { editor, visible } = useCraftNodeWrapper(craftNode);
const { resolvedNode, defaultProps, resolver } = useResolveCraftNode(craftNode);


if (resolver.value) provide("resolver", resolver);

const nodeRef = ref<ComponentPublicInstance<HTMLElement> | null>(null);

const craftNodeData = computed(() => editor?.nodeDataMap[craftNode.value.uuid]);

const { isSelected, isDraggable, selectNode } = useConnectCraftNodeToStore(
  craftNode.value,
  nodeRef
);

const { handleDragStart, handleDragOver, handleDrop, handleDragEnd } =
  useDragCraftNode(craftNode, nodeRef, resolver.value);

const { eventHandlers } = useCraftNodeEvents(
  craftNode,
  editor as any,
  editor?.eventsContext || {}
);

const nodeName = computed(() => {
  const resolved = resolver?.value?.resolve(craftNode.value.componentName);
  return resolved?.componentName || craftNode.value.componentName;
});

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

const availableSlots = computed(() => {
  const slots: string[] = [];
  const resolved = resolver?.value?.resolveNode?.(craftNode.value);
  const resolverSlots = resolved?.slots;
  if (resolverSlots && resolverSlots.length > 0) {
    slots.push(...resolverSlots);
  } else {
    slots.push('default');
  }
  return slots;
});

const shouldRenderSlots = computed(() => {
  if (craftNodeIsCanvas(craftNode.value)) return true;
  return Object.values(craftNode.value.slots || {}).some(children => children.length > 0);
});

const computedDataChildren = (children: CraftNode[], slotName: string) => {
  if (!craftNodeData.value) return [];
  if (craftNodeData.value.slotName && craftNodeData.value.slotName !== slotName) return [];
  return computeDataNodes(craftNodeData.value, children);
};

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
        data.list!.map((item, index) => ({
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

<style lang="scss">
@use "../assets/craftNodeEditor";

.v-craft-node::before {
  content: attr(data-node-name);
}
</style>
