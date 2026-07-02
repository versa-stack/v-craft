<template>
  <slot
    name="panel-content"
    :selectedNode="selectedNode"
    :nodeName="nodeName"
    :handlePropsUpdate="handlePropsUpdate"
    :schema="schema"
    :eventsSchema="eventsSchema"
    :handleEventsUpdate="handleEventsUpdate"
    :ownSlots="ownSlots"
    :availableProps="availableProps"
    :handleSlotsPropsUpdate="handleSlotsPropsUpdate"
    :handleSlotsPropsPropsMapUpdate="handleSlotsPropsPropsMapUpdate"
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
        <div v-if="eventsSchema && selectedNode" class="v-craft-settings">
          <CraftEditorPanelNodeEventsSettings
            :craftNode="selectedNode"
            :schema="eventsSchema"
            @update:events="handleEventsUpdate"
          />
        </div>
        <div v-if="selectedNode" class="v-craft-settings">
          <CraftEditorPanelNodeSlotPropsSettings
            :craftNode="selectedNode"
            :availableSlots="ownSlots"
            :availableProps="availableProps"
            @update:slotsProps="handleSlotsPropsUpdate"
            @update:slotsPropsPropsMap="handleSlotsPropsPropsMapUpdate"
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

<script lang="ts" setup generic="T extends FormKitSchemaDefinition = FormKitSchemaDefinition">
import { storeToRefs } from "pinia";
import { computed, inject, type ComputedRef } from "vue";
import CoreResolver from "../lib/CraftNodeResolver";
import { extractSchemaFieldNames } from "../lib/extractSchemaFieldNames";
import { useEditor } from "../store/editor";
import type { FormKitSchemaDefinition } from '@formkit/core';

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

const availableProps = computed(() => extractSchemaFieldNames(schema.value));

// Only components that explicitly declare slots in their resolver entry
// can expose slot context, so no "default" fallback here (unlike the
// renderer's availableSlots, which assumes every component can accept
// a default slot for placing children).
const ownSlots = computed(() => {
  if (!selectedNode.value || !resolver?.value) {
    return [];
  }
  const resolved = resolver.value.resolveNode(selectedNode.value);
  return resolved?.slots || [];
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

const handleSlotsPropsUpdate = (slotsProps: Record<string, string[]>) => {
  if (selectedNode.value) {
    editor.updateNodeSlotsProps(selectedNode.value.uuid, slotsProps);
  }
};

const handleSlotsPropsPropsMapUpdate = (
  slotsPropsPropsMap: Record<string, Record<string, string>>,
) => {
  if (selectedNode.value) {
    editor.updateNodeSlotsPropsPropsMap(
      selectedNode.value.uuid,
      slotsPropsPropsMap,
    );
  }
};
</script>

<style lang="scss" scoped>
</style>
