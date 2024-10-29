<template>
  <div class="w-full mb-10">
    <label for="editorEnabled">Preview Content: </label>
    <input id="editorEnabled" type="checkbox" name="editorEnabled" v-model="previewContent" />
  </div>
  <CraftEditor :config="config">
    <CraftCanvas component="CraftComponentSimpleContainer" />
  </CraftEditor>
</template>
<script lang="ts" setup>
import { CraftEditorConfig, useEditor } from "@versa-stack/v-craft";
import blueprintsLibrary from "./blueprints";
import { resolverMap } from "./resolvermap";
import { ref, watch } from "vue";

const editor = useEditor()();

const eventsContext = {
  editor,
};

editor.setEventsContext(eventsContext);

const previewContent = ref(false);

if (!previewContent.value) {
  editor.enable();
}

watch(
  () => previewContent.value,
  (disabled) => {
    if (!disabled) {
      editor.enable();
    }

    if (disabled) {
      editor.disable();
    }
  }
);

const config: CraftEditorConfig = {
  blueprintsLibrary,
  resolverMap,
};
</script>
