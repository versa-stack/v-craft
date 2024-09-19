<template>
  <div
    ref="panel"
    class="fvc-panel fvc-settings-panel"
    @click.prevent.stop="() => false"
  >
    <h3 class="fvc-title">component inspector</h3>
    <div v-if="!editor.selectedNode">
      <p>select a component to inspect</p>
    </div>
    <div class="fvc-properties" :class="{ 'fvc-visible': editor.selectedNode }">
      <h4>{{ nodeName }}</h4>
      <div v-if="schema?.length" class="fvc-settings">
        <CraftEditorPanelNodeSettings
          :craftNode="editor.selectedNode"
          :schema="schema"
          @update:props="handlePropsUpdate"
        />
      </div>
      <div class="fvc-actions" data-type="button">
        <button
          class="formkit-input fvc-delete"
          v-if="deleteable"
          @click.prevent="removeNode"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, inject, type ComputedRef } from "vue";
import CoreResolver from "../lib/CraftNodeResolver";
import { useEditor } from "../store/editor";

const editor = useEditor();
const resolver = inject<ComputedRef<CoreResolver>>("resolver");

const schema = computed(() => {
  if (!editor.selectedNode || !resolver?.value) {
    return [];
  }
  return resolver.value.getSchema(editor.selectedNode);
});

const deleteable = computed(
  () => editor.selectedNode && editor.selectedNode.parent
);
const removeNode = computed(() => () => {
  if (!editor.selectedNode) {
    return;
  }
  editor.removeNode(editor.selectedNode);
});

const nodeName = computed(() =>
  editor.selectedNode
    ? `${
        resolver?.value?.resolveNode(editor.selectedNode)?.component ||
        "Unknown"
      }`
    : ""
);

const handlePropsUpdate = (newProps: Record<string, any>) => {
  if (editor.selectedNode && newProps) {
    editor.updateNodeProps(editor.selectedNode.uuid, newProps);
  }
};
</script>
<style lang="scss">
@import "../assets/panel";
</style>
