<template>
  <div class="fvc-editor-panel">
    <CraftEditorPanelLayout
      :blueprints="config.blueprints"
      :actions="config.actions"
      @action-click="(e) => emit('action-click', e)"
    >
      <div class="fvc-content-panel">
        <CraftFrame><slot></slot></CraftFrame>
      </div>
    </CraftEditorPanelLayout>
  </div>
</template>
<script lang="ts" setup>
import { provide, ref, toRef } from "vue";
import CraftNodeResolver from "../lib/CraftNodeResolver";
import { CraftEditorActionPayload, CraftEditorConfig } from "../lib/model";

const props = defineProps<{
  config: CraftEditorConfig;
}>();

const resolver = ref(new CraftNodeResolver(props.config.resolverMap));

provide("resolver", resolver);

const emit = defineEmits<{
  (e: 'action-click', payload: CraftEditorActionPayload): void
}>();

</script>
