<template>
  <slot :data="{ schema, computedProps, craftNode }">
    <fieldset
      class="v-craft-panel-settings formkit-fieldset v-craft-scrollable-content"
      v-if="schema"
    >
      <legend class="formkit-legend">Properties</legend>
      <FormKit
        :key="craftNode?.uuid"
        type="form"
        :value="computedProps"
        @input="handleFormInput"
        :actions="false"
      >
        <FormKitSchema :schema="(schema as FormKitSchemaFormKit)" />
      </FormKit>
    </fieldset>
  </slot>
</template>

<script lang="ts" setup generic="T extends object = FormKitSchemaFormKit">
import { toRefs, computed, watch } from "vue";
import { FormKit, FormKitSchema } from "@formkit/vue";
import {
  FormKitGroupValue,
  FormKitNode,
  FormKitSchemaFormKit,
} from "@formkit/core";
import cloneDeep from "lodash-es/cloneDeep";
import debounce from "lodash-es/debounce";
import { CraftNode } from "../lib/craftNode";

export interface Props<T extends object> {
  craftNode?: CraftNode<T>;
  schema?: T;
}

const debounceTime = 50;
const props = withDefaults(defineProps<Props<T>>(), {
  schema: () => ({} as T),
});

const { craftNode, schema } = toRefs(props);

const emit = defineEmits<{
  (e: "update:props", value: Record<string, any>): void;
}>();

const computedProps = computed(() => cloneDeep(craftNode.value?.props || {}));
const debouncedEmit = debounce((newValue: FormKitGroupValue) => {
  emit("update:props", newValue as Record<string, any>);
}, debounceTime);

const handleFormInput = (
  value: FormKitGroupValue | undefined,
  node: FormKitNode
) => {
  if (value !== undefined) {
    debouncedEmit(value);
  }
};
</script>

<style lang="scss" scoped></style>
