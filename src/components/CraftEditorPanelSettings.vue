<template>
  <slot
    name="panel-content"
    :selectedNode="selectedNode"
    :nodeName="nodeName"
    :handlePropsUpdate="handlePropsUpdate"
    :schema="schema"
    :eventsSchema="eventsSchema"
    :handleEventsUpdate="handleEventsUpdate"
    :deleteable="deleteable"
    :removeNode="removeNode"
  >
    <div
      ref="panel"
      class="v-craft-panel v-craft-settings-panel"
      @click.prevent.stop="() => false"
    >
      <h3 class="v-craft-title">component inspector</h3>
      <span class="text-sm">{{ selectedNode?.uuid }}</span>
      <div v-if="!selectedNode">
        <p>select a component to inspect</p>
      </div>
      <div
        class="v-craft-properties"
        :class="{ 'v-craft-visible': selectedNode }"
      >
        <h4>{{ nodeName }}</h4>
        <div v-if="schema" class="v-craft-settings">
          <CraftEditorPanelNodeSettings
            :craftNode="selectedNode"
            :schema="schema"
            @update:props="handlePropsUpdate"
          />
        </div>
        <div v-if="eventsSchema" class="v-craft-settings">
          <CraftEditorPanelNodeEventsSettings
            :craftNode="selectedNode"
            :schema="eventsSchema"
            @update:events="handleEventsUpdate"
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
  </slot>
</template>

<script lang="ts" setup generic="T extends object">
import { storeToRefs } from "pinia";
import { computed, inject, type ComputedRef } from "vue";
import CoreResolver from "../lib/CraftNodeResolver";
import { useEditor } from "../store/editor";

const editor = useEditor();
const { selectedNode } = storeToRefs(editor);
const resolver = inject<ComputedRef<CoreResolver<T>>>("resolver");

const schema = computed(() => {
  if (!selectedNode.value || !resolver?.value) {
    return [];
  }
  return resolver.value.getSchema(selectedNode.value);
});
const eventsSchema = computed(() => {
  if (!selectedNode.value || !resolver?.value) {
    return [];
  }
  return resolver.value.getEventsSchema(selectedNode.value);
});

const deleteable = computed(
  () => selectedNode.value && selectedNode.value.parentUuid
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

const handleEventsUpdate = (newEvents: Record<string, any>) => {
  if (selectedNode.value && newEvents) {
    editor.updateNodeEvents(selectedNode.value.uuid, newEvents);
  }
};
</script>

<style lang="scss" scoped>
.v-craft-settings-panel {
  padding: 1rem;

  h4 {
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 600;
    color: rgb(var(--ui-text-muted));
    margin-bottom: 0.75rem;
    letter-spacing: 0.05em;
  }

  .v-craft-delete {
    background: rgb(var(--ui-error) / 0.1);
    color: rgb(var(--ui-error));
    border: 1px solid rgb(var(--ui-error) / 0.3);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background: rgb(var(--ui-error) / 0.2);
    }
  }
}
</style>
