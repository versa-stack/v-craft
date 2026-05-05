<template>
  <div class="content">
    <CraftFrame :viewOnly="true" :resolverMap="resolverMap" />
  </div>
</template>
<script lang="ts" setup>
import { useEditor } from "@versa-stack/v-craft";
import { resolverMap } from "./resolvermap";
import { demoContent } from "./demo-content";
import { onBeforeMount } from "vue";

const editor = useEditor();

onBeforeMount(() => {
  if (!editor.hasNodes) {
    editor.setNodes(demoContent);
  }
});

editor.disable();
</script>
