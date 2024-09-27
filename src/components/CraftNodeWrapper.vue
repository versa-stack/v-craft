<template>
  <CraftNodeEditor v-if="viewer === false || editor.enabled" />
  <CraftNodeViewer v-if="viewer === true || !editor.enabled" />
</template>
<script lang="ts"></script>
<script setup lang="ts">
import { provide, readonly, toRef } from "vue";
import { CraftNode } from "../lib/craftNode";
import { useEditor } from "../store/editor";
import CraftNodeEditor from "./CraftNodeEditor.vue";
import CraftNodeViewer from "./CraftNodeViewer.vue";

defineOptions({
  name: "CraftNodeWrapper",
});

const props = withDefaults(
  defineProps<{
    craftNode: CraftNode;
    viewer?: boolean;
  }>(),
  { viewer: undefined }
);

const editor = useEditor();
const craftNodeRef = toRef(props, "craftNode");

provide("craftNode", readonly(craftNodeRef));
</script>
