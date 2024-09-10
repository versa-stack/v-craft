<template>
  <CraftEditor :config="config" @action-click="onAction">
    <CraftCanvas component="CraftComponentSimpleContainer"> </CraftCanvas>
  </CraftEditor>
</template>
<script lang="ts" setup>
import {
  CraftEditorActionPayload,
  CraftEditorConfig,
  useEditor,
} from "@faasaf/v-craft";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { resolverMap } from "./resolvermap";
import { blueprints } from "./blueprints";

const editor = useEditor();
editor.enable();

const removeParentField = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(removeParentField);
  } else if (typeof obj === "object" && obj !== null) {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key !== "parent") {
        newObj[key] = removeParentField(value);
      }
    }
    return newObj;
  }
  return obj;
};

const onAction = (payload: CraftEditorActionPayload) => {
  if (payload.action.key === "export") {
    const cleanedNodes = removeParentField(payload.editor.nodes);
    alert(JSON.stringify(cleanedNodes));
  }
};

const config: CraftEditorConfig = {
  blueprints,
  resolverMap,
  actions: [
    {
      label: "Export",
      icon: fas.faDownload,
      key: "export",
    },
  ],
};
</script>
