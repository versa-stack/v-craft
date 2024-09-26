<template>
  <!-- <CraftErrorBoundary> -->
    <component
      ref="nodeRef"
      v-if="resolvedNode"
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
      <CraftNodeEditor
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

      <div class="fvc-drop-text" v-if="craftNodeIsCanvas(craftNode) && !craftNode.children?.length">
        Drop a component here.
      </div>
    </component>
  <!-- </CraftErrorBoundary> -->
</template>
<script setup lang="ts">
import {
  computed,
  ComputedRef,
  inject,
  onMounted,
  provide,
  ref,
  toRef,
} from "vue";
import useConnectCraftNodeToStore from "../hooks/useConnectCraftNodeToStore";
import useDragCraftNode from "../hooks/useDragCraftNode";
import {
  CraftNode,
  craftNodeIsAncestorOf,
  craftNodeIsCanvas,
} from "../lib/craftNode";
import CraftNodeResolver from "../lib/CraftNodeResolver";
import { useEditor } from "../store/editor";
import CraftNodeViewer from "./CraftNodeViewer.vue";
import { CombinationWithKeys } from ".";

defineOptions({
  name: "CraftNodeEditor",
});

const props = defineProps<{
  craftNode: CraftNode;
}>();

const resolver = inject<ComputedRef<CraftNodeResolver>>("resolver");
const editor = useEditor();
const nodeRef = ref<any>(null);

onMounted(() => {
  if (!resolver) {
    throw new Error("CraftNodeResolver was not provided in the component tree");
  }
});

const { isSelected, isDraggable, selectNode } = useConnectCraftNodeToStore(
  props.craftNode,
  nodeRef
);

const craftNodeRef = toRef(props, "craftNode");

const resolvedNode = computed(() => {
  if (!resolver) return null;
  return resolver.value.resolveNode(craftNodeRef.value);
})

const { handleDragStart, handleDragOver, handleDrop, handleDragEnd } =
  useDragCraftNode(
    craftNodeRef.value,
    nodeRef,
    (resolver as ComputedRef<CraftNodeResolver>).value
  );

const defaultProps = computed(() => {
  if (!resolver) return {};
  return resolver.value.resolve(craftNodeRef.value.componentName).defaultProps;
});

const nodeName = computed(
  () =>
    `"${
      resolver?.value?.resolveNode(craftNodeRef.value)?.componentName || "Unknown"
    }"`
);

const craftNodeClick = () => {
  selectNode();
};

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

<style lang="scss" scoped>
@import "../assets/craftNodeEditor";

.fvc-node::before {
  content: v-bind(nodeName);
}
</style>
