<template>
  <div class="fvc-panel-manager">
    <div class="fvc-grid-panel fvc-panel-left">
      <CraftErrorBoundary>
        <CraftEditorPanelBlueprints :blueprints="blueprints" @closeClick="" />
      </CraftErrorBoundary>
    </div>
    <div class="fvc-grid-panel fvc-panel-top">
      <CraftErrorBoundary>
        <CraftEditorPanelActions
          :actions="actions"
          @action-click="(e) => emit('action-click', e)"
        />
      </CraftErrorBoundary>
    </div>
    <div class="fvc-panel-center">
      <CraftErrorBoundary>
        <slot></slot>
      </CraftErrorBoundary>
    </div>
    <div class="fvc-grid-panel fvc-panel-right">
      <CraftErrorBoundary>
        <CraftEditorPanelSettings />
      </CraftErrorBoundary>
      <CraftErrorBoundary>
        <CraftEditorPanelLayers />
      </CraftErrorBoundary>
    </div>
    <div class="fvc-grid-panel fvc-panel-bottom"></div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import {
  Blueprints,
  CraftEditorAction,
  CraftEditorActionPayload,
} from "../lib/model";

const props = defineProps<{
  blueprints: Blueprints;
  actions: CraftEditorAction[];
}>();

const topRowHeight = computed(() => 0.3);
const topRowTranslate = computed(() => 90);

const emit = defineEmits<{
  (e: "action-click", payload: CraftEditorActionPayload): void;
}>();
</script>
<style lang="scss" scoped>
@import "../assets/editorPanelLayout";
</style>
