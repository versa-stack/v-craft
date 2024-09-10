<template>
  <div class="fvc-panel fvc-actions-panel">
    <div class="fvc-action" v-for="(action, index) in actions" :key="index">
      <button @click="emit('action-click', { action, editor })" :title="action.label">
        <FontAwesomeIcon :icon="action.icon" />
        <span class="action-label">{{ action.label }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { CraftEditorAction, CraftEditorActionPayload } from "../lib/model";
import { useEditor } from "../store/editor";

const props = defineProps<{
  actions: CraftEditorAction[];
}>();

const editor = useEditor();

const emit = defineEmits<{
  (e: "action-click", payload: CraftEditorActionPayload): void;
}>();
</script>

<style lang="scss" scoped>
@import "../assets/editorPanelActions";

</style>