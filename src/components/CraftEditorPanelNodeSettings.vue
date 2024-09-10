<template>
  <fieldset
    class="formkit-fieldset fvc-scrollable-content"
    v-if="localProps && schema && schema.filter"
  >
    <legend class="formkit-legend">Properties</legend>
      <FormKit
        v-for="field in schema"
        :key="field.name"
        :label="field.label"
        :name="field.name"
        :options="field.options"
        :type="field.$formkit"
        :value="getFieldValue(field.name)"
        @input="(value) => updateField(field.name, value)"
        :parse="parseValue"
      />
  </fieldset>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { FormKit } from "@formkit/vue";
import _ from "lodash";
import { CraftNode } from "../lib/craftNode";
import { FormKitSchemaNode } from "@formkit/core";

interface Props {
  craftNode?: CraftNode;
  schema?: FormKitSchemaNode[];
}

const props = withDefaults(defineProps<Props>(), {
  schema: () => [],
});

const emit = defineEmits<{
  (e: "update:props", value: Record<string, any>): void;
}>();

const localProps = ref(_.cloneDeep(props.craftNode?.props || {}));

watch(
  () => props.craftNode?.props,
  (newValue) => {
    if (newValue && !_.isEqual(newValue, localProps.value)) {
      localProps.value = _.cloneDeep(newValue);
    }
  },
  { deep: true }
);

watch(
  localProps,
  (newValue) => {
    emit("update:props", newValue);
  },
  { deep: true }
);

const getFieldValue = (fieldName: string) => {
  return _.get(localProps.value, fieldName);
};

const parseValue = (value: any) => {
  if (typeof value === "string") {
    return value.trim();
  }
  return value;
};

const updateField = (fieldName: string, value: any) => {
  localProps.value = _.set({ ...localProps.value }, fieldName, value);
};
</script>

<style lang="scss">
@import '../assets/editorPanelNodeSettings';

</style>
