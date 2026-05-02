<template>
  <div v-if="$slots['panel-layout']">
    <slot
      name="panel-layout"
      :blueprints="blueprints"
      :deselectNodes="deselectNodes"
    />
  </div>
  <div v-else class="v-craft-panel-manager">
    <div class="flex w-full justify-between gap-10">
      <div class="v-craft-grid-panel v-craft-panel-left shrink">
        <CraftEditorPanelBlueprints :blueprints="blueprints" />
      </div>
      <div class="v-craft-panel-center flex grow" @click.stop="deselectNodes">
        <slot></slot>
      </div>
      <div class="v-craft-grid-panel v-craft-panel-right shrink">
        <CraftEditorPanelLayers />
        <CraftEditorPanelSettings />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup generic="T extends object">
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
    padding: 1rem;
    margin-bottom: 1.25em;
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
    border-radius: 0.75rem;
    background: #f8fafc;
    border: 2px solid #e2e8f0;
  }

  .dark .v-craft-panel {
    background: #1e293b;
    border-color: #334155;
  }

  :deep(.v-craft-panel .v-craft-title) {
    margin: 0px;
    padding: 0.75rem 0;
    border-bottom: 2px solid #e2e8f0;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-size: 0.875rem;
    color: #1e293b;
  }

  .dark :deep(.v-craft-panel .v-craft-title) {
    border-color: #334155;
    color: #f1f5f9;
  }
}
</style>
