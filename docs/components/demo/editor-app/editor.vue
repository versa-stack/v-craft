<template>
  <CraftEditor :config="config" @action-click="onAction">
    <CraftCanvas component="CraftComponentSimpleContainer" />
  </CraftEditor>
</template>
<script lang="ts" setup>
import { fas } from "@fortawesome/free-solid-svg-icons";
import {
  CraftEditorActionPayload,
  CraftEditorConfig,
  setupMonaco,
  useEditor,
} from "@versa-stack/v-craft";
import blueprintsLibrary from "./blueprints";
import { resolverMap } from "./resolvermap";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

const editor = useEditor();
editor.enable();

setupMonaco(new editorWorker());

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
  if (payload.action.key === "save") {
    const cleanedNodes = removeParentField(payload.editor.nodes);
    alert(JSON.stringify(cleanedNodes));
  }
};

const config: CraftEditorConfig = {
  blueprintsLibrary,
  resolverMap,
  actions: [
    {
      label: "Save",
      icon: fas.faDownload,
      key: "save",
    },
  ],
};
</script>
