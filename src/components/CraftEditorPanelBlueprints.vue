<template>
  <div class="v-craft-panel v-craft-blueprints-panel">
    <h3 class="v-craft-title">blueprints</h3>
    <div class="v-craft-panel-content">
      <CraftEditorBlueprintsList :blueprints="blueprints" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { BlueprintsLibrary } from "../lib/model";

defineProps<{
  blueprints: BlueprintsLibrary;
}>();

defineEmits<{
  (event: "close", ...args: any[]): void;
}>();
</script>
<style lang="scss" scoped>
.v-craft-blueprints-panel {
  min-width: 15em;
  max-width: 15em;
  width: 15em;

  :deep(.v-craft-blueprint) {
    text-align: center;
    padding: 0.25em;
    position: relative;
    border: 1px solid var(--v-craft-gray-medium);
    border-radius: 3px;
    display: flex;
    align-items: center;
    cursor: pointer;
    background-color: var(--v-craft-background-color-lighter-10);
  }

  :deep(.v-craft-blueprint-label) {
    font-size: 0.8em;
    text-transform: uppercase;
    font-weight: bold;
    color: var(--v-craft-gray-darker);
  }

  h4 {
    font-size: 0.8em;
    text-transform: uppercase;
    font-weight: bold;
    color: var(--v-craft-gray-medium);
    margin-bottom: 0.75em;
    margin-top: 2em;
  }
}
</style>
