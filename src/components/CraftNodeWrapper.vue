<template>
  <CraftNodeEditor v-if="editor.enabled" :craftNode="craftNode" />
  <CraftNodeViewer v-if="!editor.enabled" :craftNode="craftNode" />
</template>
<script lang="ts"></script>
<script setup lang="ts">
import { CraftNode } from "../lib/craftNode";
import { useEditor } from "../store/editor";
import CraftNodeEditor from "./CraftNodeEditor.vue";
import CraftNodeViewer from "./CraftNodeViewer.vue";

defineOptions({
  name: "CraftNodeWrapper",
});

defineProps<{
  craftNode: CraftNode;
}>();

const editor = useEditor();
</script>
