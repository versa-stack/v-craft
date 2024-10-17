<template>
  <CraftEditor :config="config">
    <CraftCanvas component="CraftComponentSimpleContainer" />
  </CraftEditor>
</template>
<script lang="ts" setup>
import { CraftEditorConfig, useEditor } from "@versa-stack/v-craft";
import blueprintsLibrary from "./blueprints";
import { resolverMap } from "./resolvermap";

const editor = useEditor();
editor.enable();

const config: CraftEditorConfig = {
  blueprintsLibrary,
  resolverMap,
};
</script>
