<template>
  <fieldset
    class="fvc-panel-settings formkit-fieldset fvc-scrollable-content"
    v-if="localProps && schema"
  >
    <legend class="formkit-legend">Properties</legend>
    <ClientOnly>
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
    </ClientOnly>
  </fieldset>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { FormKit } from "@formkit/vue";
import cloneDeep from "lodash-es/cloneDeep";
import isEqual from "lodash-es/isEqual";
import get from "lodash-es/get";
import set from "lodash-es/set";
import kebabCase from "lodash-es/kebabCase";
import { CraftNode } from "../lib/craftNode";
import { FormKitSchemaNode } from "@formkit/core";

interface Props {
  craftNode?: CraftNode;
  schema?: FormKitSchemaNode[] | any[];
}

const props = withDefaults(defineProps<Props>(), {
  schema: () => [],
});

const emit = defineEmits<{
  (e: "update:props", value: Record<string, any>): void;
}>();

const localProps = ref(cloneDeep(props.craftNode?.props || {}));

watch(
  () => props.craftNode?.props,
  (newValue) => {
    if (newValue && !isEqual(newValue, localProps.value)) {
      localProps.value = cloneDeep(newValue);
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
  return get(localProps.value, fieldName);
};

const parseValue = (value: any) => {
  if (typeof value === "string") {
    return value.trim();
  }
  return value;
};

const updateField = (fieldName: string, value: any) => {
  localProps.value = set({ ...localProps.value }, fieldName, value);
};
</script>

<style lang="scss" scoped></style>
