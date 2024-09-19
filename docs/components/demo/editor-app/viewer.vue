<template>
  <div class="content">
    <CraftFrame :resolverMap="resolverMap" />
  </div>
</template>
<script lang="ts" setup>
import { useEditor, EditorStoreType } from "@versa-stack/v-craft";
import { resolverMap } from "./resolvermap";
const editor: EditorStoreType = useEditor();
editor.disable();
</script>
