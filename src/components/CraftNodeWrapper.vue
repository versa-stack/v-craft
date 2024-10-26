<template>
  <CraftNodeEditor v-if="!viewOnly && visible && editorEnabled" />
  <CraftNodeViewer
    v-if="(viewOnly && visible) || (visible && !editorEnabled)"
  />
</template>
<script lang="ts"></script>
<script setup lang="ts" generic="T extends object">
import { computed, provide, readonly, toRef } from "vue";
import { CraftNode } from "../lib/craftNode";
import { useEditor } from "../store/editor";
import CraftNodeEditor from "./CraftNodeEditor.vue";
import CraftNodeViewer from "./CraftNodeViewer.vue";
import { storeToRefs } from "pinia";

defineOptions({
  name: "CraftNodeWrapper",
});

const props = withDefaults(
  defineProps<{
    craftNode: CraftNode<T>;
    viewOnly?: boolean;
  }>(),
  { viewOnly: false }
);

const editor = useEditor<T>()();
const { enabled: editorEnabled } = storeToRefs(editor);

const craftNodeRef = toRef(props, "craftNode");
const visible = computed(() => craftNodeRef.value.visible !== false);

provide("craftNode", readonly(craftNodeRef));
</script>
