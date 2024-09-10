<template>
  <CraftNodeEditor v-if="editor.enabled" :craftNode="craftNode" />
  <CraftNodeViewer v-if="!editor.enabled" :craftNode="craftNode" />
</template>
<script lang="ts">
export default {
  name: "CraftNodeWrapper",
};
</script>
<script setup lang="ts">
import { CraftNode } from "../lib/craftNode";
import { useEditor } from "../store/editor";
import CraftNodeEditor from "./CraftNodeEditor.vue";
import CraftNodeViewer from "./CraftNodeViewer.vue";

const props = defineProps<{
  craftNode: CraftNode;
}>();

const editor = useEditor();
</script>
