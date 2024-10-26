<template>
  <fieldset
    class="v-craft-panel-settings formkit-fieldset v-craft-scrollable-content"
    v-if="schema"
  >
    <legend class="formkit-legend">Events</legend>
    <FormKit
      :key="craftNode?.uuid"
      type="form"
      :value="computedEvents"
      @input="handleFormInput"
      :actions="false"
    >
      <FormKitSchema :schema="(schema as FormKitSchemaFormKit)" />
    </FormKit>
  </fieldset>
</template>

<script lang="ts" setup generic="T extends object">
import {
  FormKitGroupValue,
  FormKitNode,
  FormKitSchemaFormKit,
} from "@formkit/core";
import { FormKit, FormKitSchema } from "@formkit/vue";
import cloneDeep from "lodash-es/cloneDeep";
import debounce from "lodash-es/debounce";
import { computed, toRefs } from "vue";
import { CraftNode } from "../lib/craftNode";

export interface Props<T extends object> {
  craftNode: CraftNode<T>;
  schema?: T;
}

const debounceTime = 32;
const props = withDefaults(defineProps<Props<T>>(), {
  schema: () => ({} as T),
});

const { craftNode, schema } = toRefs(props);

const emit = defineEmits<{
  (e: "update:events", value: Record<string, any>): void;
}>();

const computedEvents = computed(() => cloneDeep(craftNode.value?.events || {}));

const debouncedEmit = debounce((newValue: FormKitGroupValue) => {
  emit("update:events", newValue as Record<string, any>);
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
