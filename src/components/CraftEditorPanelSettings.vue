<template>
  <div
    ref="panel"
    class="v-craft-panel v-craft-settings-panel"
    @click.prevent.stop="() => false"
  >
    <h3 class="v-craft-title">component inspector</h3>
    <div v-if="!selectedNode">
      <p>select a component to inspect</p>
    </div>
    <div class="v-craft-properties" :class="{ 'v-craft-visible': selectedNode }">
      <h4>{{ nodeName }}</h4>
      <div v-if="schema?.length" class="v-craft-settings">
        <CraftEditorPanelNodeSettings
          :craftNode="selectedNode"
          :schema="schema"
          @update:props="handlePropsUpdate"
        />
      </div>
      <div class="v-craft-actions" data-type="button">
        <button
          class="formkit-input v-craft-delete"
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
import { storeToRefs } from "pinia";
import { computed, inject, type ComputedRef } from "vue";
import CoreResolver from "../lib/CraftNodeResolver";
import { useEditor } from "../store/editor";

const editor = useEditor();
const { selectedNode } = storeToRefs(editor);
const resolver = inject<ComputedRef<CoreResolver>>("resolver");

const schema = computed(() => {
  if (!selectedNode.value || !resolver?.value) {
    return [];
  }
  return resolver.value.getSchema(selectedNode.value);
});

const deleteable = computed(
  () => selectedNode.value && selectedNode.value.parent
);

const removeNode = () => {
  if (selectedNode.value) {
    editor.removeNode(selectedNode.value);
  }
};

const nodeName = computed(() =>
  selectedNode.value
    ? `${
        resolver?.value?.resolveNode(selectedNode.value)?.componentName ||
        "Unknown"
      }`
    : ""
);

const handlePropsUpdate = (newProps: Record<string, any>) => {
  if (selectedNode.value && newProps) {
    editor.updateNodeProps(selectedNode.value.uuid, newProps);
  }
};
</script>

<style lang="scss" scoped>
</style>
