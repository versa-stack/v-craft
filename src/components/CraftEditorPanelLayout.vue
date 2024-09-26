<template>
  <div class="fvc-panel-manager">
    <div class="fvc-grid-panel fvc-panel-left">
      <!-- <CraftErrorBoundary> -->
        <CraftEditorPanelBlueprints :blueprints="blueprints" @closeClick="" />
      <!-- </CraftErrorBoundary> -->
    </div>
    <div class="fvc-grid-panel fvc-panel-top">
      <!-- <CraftErrorBoundary> -->
        <CraftEditorPanelActions
          :actions="actions"
          @action-click="(e) => emit('action-click', e)"
        />
      <!-- </CraftErrorBoundary> -->
    </div>
    <div class="fvc-panel-center">
      <!-- <CraftErrorBoundary> -->
        <slot></slot>
      <!-- </CraftErrorBoundary> -->
    </div>
    <div class="fvc-grid-panel fvc-panel-right">
      <!-- <CraftErrorBoundary> -->
        <CraftEditorPanelSettings />
      <!-- </CraftErrorBoundary> -->
      <!-- <CraftErrorBoundary> -->
        <CraftEditorPanelLayers />
      <!-- </CraftErrorBoundary> -->
    </div>
    <div class="fvc-grid-panel fvc-panel-bottom"></div>
  </div>
</template>
<script lang="ts" setup>
import {
  BlueprintsLibrary,
  CraftEditorAction,
  CraftEditorActionPayload
} from "../lib/model";

defineProps<{
  blueprints: BlueprintsLibrary;
  actions: CraftEditorAction[];
}>();

const emit = defineEmits<{
  (e: "action-click", payload: CraftEditorActionPayload): void;
}>();
</script>
<style lang="scss" scoped>
@use 'sass:color';
@import "../assets/editorPanelLayout";

.fvc-panel-manager {
  --shadow-alpha: 0.8;
  background-color: $panel-manager-background;
  display: grid;
  overflow: hidden;
  grid-template-columns: 9em 1fr 32em;
  grid-template-rows: auto 1fr auto;
  gap: 1px;
  grid-template-areas:
    "top top top"
    "left center right"
    "bottom bottom bottom";
  position: relative;
  width: 100%;
  color: $text-color;

  .fvc-grid-panel {
    padding: 10px;
  }

  .fvc-panel-left {
    grid-area: left;
  }

  .fvc-panel-top {
    grid-area: top;
    position: relative;
    width: 100%;
    border-bottom: 2px solid $border-color;
    z-index: 10;
    margin-bottom: 1.125em;
  }

  .fvc-panel-center {
    grid-area: center;
    margin: 1.75em;
    max-width: 60vw;
  }

  .fvc-panel-right {
    display: flex;
    flex-direction: column;
    grid-area: right;
    max-width: 20vw;

    > * {
      margin-bottom: 1.5em;
    }
  }

  .fvc-panel-bottom {
    grid-area: bottom;
    position: relative;
  }
}

.fvc-scrollable-content {
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: color.adjust($panel-background, $lightness: -5%);
  }

  &::-webkit-scrollbar-thumb {
    background: $gray-medium;
    border-radius: 4px;
    &:hover {
      background: color.adjust($gray-medium, $lightness: 10%);
    }
  }
}
</style>
