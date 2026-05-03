<template>
  <div
    :draggable="true"
    @dragstart.stop="handleDragStart"
    @dragend="handleDragEnd"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts" setup generic="T extends object">
import { CraftNode } from "../lib/craftNode";
import { useEditor } from "../store/editor";
import { useIndicator } from "../store/indicator";

const editor = useEditor();
const indicator = useIndicator();

defineOptions({
  name: "CraftEditorBlueprint",
});

const props = defineProps<{
  craftNode: CraftNode;
}>();

const handleDragStart = (e: MouseEvent) => {
  console.log('CraftEditorBlueprint - dragging node:', props.craftNode);
  console.log('CraftEditorBlueprint - node.componentName:', props.craftNode.componentName);
  console.log('CraftEditorBlueprint - node.props:', props.craftNode.props);
  editor.dragNode(props.craftNode);
};

const handleDragEnd = (e: MouseEvent) => {
  e.stopPropagation();

  editor.dragNode(null);
  indicator.hide();
};
</script>
