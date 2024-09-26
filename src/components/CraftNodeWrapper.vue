<template>
  <CraftNodeEditor v-if="editor.enabled" :craftNode="craftNode" />
  <CraftNodeViewer v-if="!editor.enabled" :craftNode="craftNode" />
</template>
<script lang="ts"></script>
<script setup lang="ts">
import { provide, toRef } from "vue";
import { CraftNode } from "../lib/craftNode";
import { useEditor } from "../store/editor";
import CraftNodeEditor from "./CraftNodeEditor.vue";
import CraftNodeViewer from "./CraftNodeViewer.vue";

defineOptions({
  name: "CraftNodeWrapper",
});

const props = defineProps<{
  craftNode: CraftNode;
}>();

const editor = useEditor();
const craftNodeRef = toRef(props, "craftNode");

provide("craftNode", craftNodeRef);

</script>
