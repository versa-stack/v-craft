<template>
  <CraftEditor
    :config="config"
    :inheritStyles="true"
    :useIframe="true"
    @iframe-load="onIframeLoad"
  >
    <CraftCanvas componentName="div" />
  </CraftEditor>
  <div class="editor-switch">
    <label for="editorEnabled">Preview Content: </label>
    <input
      id="editorEnabled"
      type="checkbox"
      name="editorEnabled"
      v-model="previewContent"
    />
    <div class="text-sm">(disables editor drag and drop)</div>
  </div>
</template>
<script lang="ts" setup>
import { CraftEditorConfig, useEditor } from "@versa-stack/v-craft";
import blueprintsLibrary from "./blueprints";
import { resolverMap } from "./resolvermap";
import { demoContent } from "./demo-content";
import { onBeforeMount, ref, watch } from "vue";

const editor = useEditor();

onBeforeMount(() => {
  if (!editor.hasNodes) {
    editor.setNodes(demoContent);
  }
});

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

const onIframeLoad = (iframe: HTMLIFrameElement) => {
  const syncDarkMode = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const iframeHtml = iframe.contentDocument?.documentElement;
    if (iframeHtml) {
      if (isDark) {
        iframeHtml.classList.add('dark');
      } else {
        iframeHtml.classList.remove('dark');
      }
      iframeHtml.style.colorScheme = isDark ? 'dark' : 'light';
    }
  };

  // Wait for iframe content to be fully loaded
  const checkAndSync = () => {
    if (iframe.contentDocument?.documentElement) {
      syncDarkMode();
    } else {
      setTimeout(checkAndSync, 10);
    }
  };
  checkAndSync();

  const observer = new MutationObserver(syncDarkMode);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
};
</script>
<style lang="scss" scoped>
.editor-switch {
  display: inline-block;
}
</style>
