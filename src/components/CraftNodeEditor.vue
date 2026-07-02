<template>
  <component
    ref="nodeRef"
    v-if="visible && craftNode && resolvedNode"
    v-bind="{
      ...nodeProps,
      [`data-craft-uuid`]: craftNode.uuid,
    }"
    v-on="eventHandlers"
    :is="componentToRender"
    :class="{
      'v-craft-node-selected': isSelected,
      'v-craft-node': editor?.enabled,
      'v-craft-canvas': craftNodeIsCanvas(craftNode),
      'v-craft-empty':
        !craftNode.slots ||
        Object.keys(craftNode.slots).length === 0 ||
        Object.values(craftNode.slots).every((slot) => slot.length === 0),
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
    <template
      v-for="slotName in availableSlots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <div
        v-if="
          craftNodeIsCanvas(craftNode) &&
          (!craftNode.slots || craftNode.slots[slotName]?.length == 0)
        "
        class="v-craft-drop-text"
        :data-slot-name="slotName"
        @dragover.prevent.stop="handleDragOver"
        @drop.prevent.stop="handleDrop"
      >
        <span class="v-craft-drop-text-label">Drop a component here</span>
        <span class="v-craft-slot-name">{{ slotName }}</span>
      </div>
      <template v-if="shouldRenderSlots">
        <template
          v-if="craftNodeData?.type && craftNodeData.slotName === slotName"
        >
          <CraftNodeViewer
            v-for="item in computeDataChildren(
              craftNode.slots?.[slotName] || [],
              slotName,
            )"
            :key="item.key"
            :craftNode="item.craftNode"
          />
        </template>
        <CraftNodeEditor
          v-for="childNode in craftNode.slots?.[slotName] || []"
          :key="childNode.uuid"
          :craftNode="childNode"
          :context="buildChildContext(slotName, slotProps)"
        />
      </template>
    </template>
  </component>
</template>

<script setup lang="ts">
import {
  ComponentPublicInstance,
  computed,
  nextTick,
  onMounted,
  onUpdated,
  provide,
  ref,
  toRefs,
  watch,
} from "vue";
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
import { CraftNodePropsContext } from "./composable/useResolveCraftNodeProps";
import { generateColorFromUUID } from "./utils";

defineOptions({
  name: "CraftNodeEditor",
});

const props = defineProps<{
  craftNode: CraftNode;
  context?: CraftNodePropsContext;
}>();

const { craftNode } = toRefs(props);
const { editor, visible } = useCraftNodeWrapper(craftNode);
const { resolvedNode, resolver, componentToRender, props: nodeProps } =
  useResolveCraftNode(craftNode, () => props.context || {});

const buildChildContext = (
  slotName: string,
  slotProps: Record<string, any> = {},
): CraftNodePropsContext => {
  const allowedKeys = craftNode.value.slotsProps?.[slotName];
  const bucket = allowedKeys
    ? Object.fromEntries(
        allowedKeys
          .filter((key) => key in slotProps)
          .map((key) => [key, slotProps[key]]),
      )
    : slotProps;

  return {
    ...(props.context || {}),
    [slotName]: bucket,
  };
};

watch(
  resolver,
  (v) => {
    if (!v) return;
    provide("resolver", resolver);
  },
  { immediate: true },
);

const nodeRef = ref<ComponentPublicInstance<HTMLElement> | null>(null);
const nodeEl = ref<HTMLElement | null>(null);
const craftNodeData = computed(() => editor?.nodeDataMap[craftNode.value.uuid]);

const { isSelected, isDraggable, selectNode } = useConnectCraftNodeToStore(
  craftNode.value,
  nodeRef,
);

const { handleDragStart, handleDragOver, handleDrop, handleDragEnd } =
  useDragCraftNode(craftNode, nodeRef, resolver.value);

const { eventHandlers } = useCraftNodeEvents(
  craftNode,
  editor?.eventsContext || {},
  () =>
    editor?.nodeMap
      ? (Object.fromEntries(editor.nodeMap.entries()) as Record<
          string,
          CraftNode
        >)
      : null,
  (uuid) => editor?.nodeMap[uuid] ?? null,
);

const nodeName = computed(() => {
  const resolved = resolver?.value?.resolve(craftNode.value.componentName);
  if (resolved?.label) return resolved.label;

  return craftNodeIsCanvas(craftNode.value)
    ? craftNode.value.props.componentName
    : resolved?.componentName || craftNode.value.componentName;
});

const nodeColor = computed(() => generateColorFromUUID(craftNode.value.uuid));

const resolveNodeEl = (): HTMLElement | null => {
  const doc =
    nodeEl.value?.ownerDocument ??
    (nodeRef.value as ComponentPublicInstance | null)?.$el?.ownerDocument ??
    document;

  const stamped = doc.querySelector(
    `[data-craft-uuid="${craftNode.value.uuid}"]`
  ) as HTMLElement | null;
  if (stamped) return stamped;

  let el: any = (nodeRef.value as ComponentPublicInstance | null)?.$el;
  while (el && !(el instanceof HTMLElement)) {
    el = el.nextElementSibling ?? null;
  }
  return el ?? null;
};

const applyNodeAttributes = (el: HTMLElement, name: string, color: string) => {
  if (!(el instanceof Element)) {
    console.error("resolveNodeEl returned a non-Element:", el);
    return;
  }
  el.style.setProperty("--node-name", name);
  el.style.setProperty("--node-color", color);
  el.setAttribute("data-node-name", name);
};

const syncNodeEl = () => {
  const el = resolveNodeEl();
  if (!el) return;
  nodeEl.value = el;
  applyNodeAttributes(el, nodeName.value ?? "(n/a)", nodeColor.value);
};

onMounted(() => nextTick(syncNodeEl));
onUpdated(() => nextTick(syncNodeEl));

watch([nodeName, nodeColor], () => {
  if (!nodeEl.value) return;
  applyNodeAttributes(nodeEl.value, nodeName.value ?? "", nodeColor.value);
});

const availableSlots = computed(() => {
  const resolved = resolver?.value?.resolveNode?.(craftNode.value);
  const resolverSlots = resolved?.slots;
  if (resolverSlots && resolverSlots.length > 0) return resolverSlots;
  return ["default"];
});

const shouldRenderSlots = computed(() => {
  if (craftNodeIsCanvas(craftNode.value)) return true;
  return Object.values(craftNode.value.slots || {}).some(
    (children) => children.length > 0,
  );
});

const craftNodeClick = () => selectNode();

const computeDataChildren = (children: CraftNode[], slotName: string) => {
  if (!craftNodeData.value) return [];
  if (craftNodeData.value.slotName && craftNodeData.value.slotName !== slotName)
    return [];
  return computeDataNodes(craftNodeData.value, children);
};

type ComputedDataNode = { key: string; craftNode: CraftNode };

const computeDataNodes = (
  data: CraftNodeDatasource,
  children: CraftNode[],
): ComputedDataNode[] => {
  if (data.type === "single") {
    return children.map((childNode) => ({
      key: `${childNode.uuid}-single`,
      craftNode: {
        ...childNode,
        props: { ...childNode.props, ...(data.item || {}) },
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
            props: { ...childNode.props, ...(item || {}) },
          },
        })),
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
