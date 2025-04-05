<template>
  <slot
    name="panel-content"
    :craft-node="craftNode"
    :model="computedModel"
    :handle-form-input="handleFormInput"
    :schema="schema"
  />
</template>

<script lang="ts" setup generic="T extends object, V, N">
import { computed, watch, toRef, onUnmounted } from "vue";
import { debounce } from "lodash-es";
import type { CraftNode } from "../lib/craftNode";

export interface Props<T extends object, V, N> {
  craftNode?: CraftNode<T>;
  model?: V;
  schema?: T;
}

const props = withDefaults(defineProps<Props<T, V, N>>(), {
  schema: () => ({} as T),
});

const emit = defineEmits<{
  (e: "update", value: V): void;
}>();

const modelRef = toRef(props, "model");
const schema = toRef(props, "schema");
const craftNode = toRef(props, "craftNode");

const computedModel = computed(() =>
  modelRef.value ? { ...modelRef.value } : ({} as V)
);

const debouncedEmit = debounce((value: V) => {
  emit("update", value);
}, 50);

const handleFormInput = (value: V) => {
  if (value !== undefined && value !== null) {
    debouncedEmit(value);
  }
};

onUnmounted(() => debouncedEmit.cancel());
</script>
