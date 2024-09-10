<template>
  <div class="patches-input">
    <FormKit type="list" v-model="patches" @input="emitUpdate">
      <FormKit
        v-for="(patch, index) in patches"
        :key="index"
        type="group"
        :name="`patch-${index}`"
        class="patch-item"
      >
        <FormKit
          type="text"
          name="fromPath"
          label="From Path"
          v-model="patch.fromPath"
        />
        <FormKit
          type="text"
          name="toPath"
          label="To Path"
          v-model="patch.toPath"
        />
        <FormKit
          type="select"
          name="type"
          label="Type"
          :options="typeOptions"
          v-model="patch.type"
        />
        <FormKit
          type="select"
          name="patchSource"
          label="Patch Source"
          :options="patchSourceOptions"
          v-model="patch.patchSource"
        />
        <FormKit
          type="text"
          name="value"
          label="Value"
          v-model="patch.value"
          v-if="patch.patchSource === 'value'"
        />
        <FormKit
          type="text"
          name="default"
          label="Default"
          v-model="patch.default"
        />
        <FormKit
          type="button"
          label="Remove Patch"
          @click="removePatch(index)"
        />
      </FormKit>
    </FormKit>
    <FormKit
      type="button"
      name="add-patch"
      label="Add Patch"
      @click="addPatch"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { CraftGraphqlQueryWrapperPatch } from "../lib/model"; // Adjust the import path as needed

const props = defineProps<{
  context: any;
}>();

const modelValue = computed(() => props.context?.node?.value);

const emit = defineEmits<{
  (e: "update:modelValue", value: CraftGraphqlQueryWrapperPatch[]): void;
}>();

const patches = ref<CraftGraphqlQueryWrapperPatch[]>(modelValue.value || []);

const typeOptions = [
  { label: "Single", value: "single" },
  { label: "List", value: "list" },
];

const patchSourceOptions = [
  { label: "Map Path Result", value: "mapPathResult" },
  { label: "Value", value: "value" },
  { label: "Child", value: "child" },
];

watch(
  () => modelValue.value,
  (newValue) => {
    patches.value = newValue || [];
  }
);

const emitUpdate = () => {
  emit("update:modelValue", patches.value);
  if (
    props.context &&
    props.context.node &&
    typeof props.context.node.input === "function"
  ) {
    props.context.node.input(patches.value);
  }
};

const addPatch = () => {
  patches.value.push({
    toPath: "",
    fromPath: "",
    type: "single",
    patchSource: "mapPathResult",
    value: null,
    default: undefined,
  });
  emitUpdate();
};

const removePatch = (index: number) => {
  patches.value.splice(index, 1);
  emitUpdate();
};
</script>

<style scoped lang="scss">
@import '../assets/base';
@import '../assets/panel';

.patches-input {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.patch-item {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid $border-color;
  border-radius: 4px;
}
</style>
