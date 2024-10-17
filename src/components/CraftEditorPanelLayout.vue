<template>
  <div class="v-craft-panel-manager">
    <div class="flex w-full justify-between gap-10">
      <div class="v-craft-grid-panel v-craft-panel-left flex-shrink">
        <CraftEditorPanelBlueprints :blueprints="blueprints" />
      </div>
      <div class="v-craft-panel-center flex-grow" @click.stop="deselectNodes">
        <slot></slot>
      </div>
      <div class="v-craft-grid-panel v-craft-panel-right flex-shrink">
        <CraftEditorPanelLayers />
        <CraftEditorPanelSettings />
      </div>
    </div>
    <div class="v-craft-grid-panel v-craft-panel-bottom"></div>
  </div>
</template>
<script lang="ts" setup>
import { BlueprintsLibrary } from "../lib/model";
import { useEditor } from "../store/editor";

defineProps<{
  blueprints: BlueprintsLibrary;
}>();

const editor = useEditor();
const deselectNodes = () => {
  editor.selectNode(null);
};
</script>
<style lang="scss" scoped>
.v-craft-panel-manager {
  .v-craft-panel {
    padding: 0.75em;
    margin-bottom: 1.25em;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.034), 0 4px 4px rgba(0, 0, 0, 0.048),
      0 6px 6px rgba(0, 0, 0, 0.06), 0 8px 8px rgba(0, 0, 0, 0.072),
      0 10px 10px rgba(0, 0, 0, 0.086), 0 15px 15px rgba(0, 0, 0, 0.12);
    border-radius: 3px;
  }

  :deep(.v-craft-panel .v-craft-title) {
    margin: 0px;
    padding: 0.125em;
    border-bottom: 1px solid var(--v-craft-gray-medium);
  }
}
</style>
