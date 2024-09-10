<template>
  <div
    :draggable="true"
    @dragstart.stop="handleDragStart"
    @dragend="handleDragEnd"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
export default {
  name: "CraftEditorBlueprint",
};
</script>
<script lang="ts" setup>
import { CraftNode } from "../lib/craftNode";
import { useEditor } from "../store/editor";
import { useIndicator } from "../store/indicator";

const editor = useEditor();
const indicator = useIndicator();

const props = defineProps<{
  craftNode: CraftNode;
}>();

const handleDragStart = (e: MouseEvent) => {
  editor.dragNode(props.craftNode);
};

const handleDragEnd = (e: MouseEvent) => {
  e.stopPropagation();

  editor.dragNode(null);
  indicator.hide();
};
</script>
