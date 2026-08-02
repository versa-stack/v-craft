<template>
  <div
    :draggable="true"
    @dragstart.stop="handleDragStart"
    @dragend="handleDragEnd"
  >
    <slot />
  </div>
</template>
<script lang="ts" setup generic="T extends FormKitSchemaDefinition">
import type { FormKitSchemaDefinition } from '@formkit/core';
import { CraftNode } from "../lib/craftNode";
import { useEditor } from "../store/editor";

const editor = useEditor();

defineOptions({
  name: "CraftEditorBlueprint",
});

const props = defineProps<{
  craftNode: CraftNode;
}>();

const handleDragStart = (_e: MouseEvent) => {
  console.log('CraftEditorBlueprint - dragging node:', props.craftNode);
  console.log('CraftEditorBlueprint - node.componentName:', props.craftNode.componentName);
  console.log('CraftEditorBlueprint - node.props:', props.craftNode.props);
  editor.dragNode(props.craftNode);
};

const handleDragEnd = (e: MouseEvent) => {
  e.stopPropagation();

  editor.dragNode(null);
};
</script>
