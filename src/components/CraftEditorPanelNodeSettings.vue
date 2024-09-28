<template>
  <fieldset
    class="fvc-panel-settings formkit-fieldset fvc-scrollable-content"
    v-if="formSchema"
  >
    <legend class="formkit-legend">Properties</legend>
      <FormKit
        :key="craftNode?.uuid"
        type="form"
        :value="computedProps"
        @input="handleFormInput"
        :actions="false"
      >
        <FormKitSchema :schema="formSchema" />
      </FormKit>
  </fieldset>
</template>

<script lang="ts" setup>
import { toRefs, computed, watch } from "vue";
import { FormKit, FormKitSchema } from "@formkit/vue";
import {
  FormKitSchemaNode,
  FormKitGroupValue,
  FormKitNode,
} from "@formkit/core";
import cloneDeep from "lodash-es/cloneDeep";
import debounce from "lodash-es/debounce";
import { CraftNode } from "../lib/craftNode";

interface Props {
  craftNode?: CraftNode;
  schema?: FormKitSchemaNode[];
}

const debounceTime = 32;
const props = withDefaults(defineProps<Props>(), {
  schema: () => [],
});

const { craftNode, schema } = toRefs(props);

const emit = defineEmits<{
  (e: "update:props", value: Record<string, any>): void;
}>();

const computedProps = computed(() => cloneDeep(craftNode.value?.props || {}));

const formSchema = computed(() => {
  const staticSchema = {
    $el: "div",
    attrs: {
      class: "form-wrapper",
    },
    children: [],
  };

  if (schema.value && schema.value.length > 0) {
    staticSchema.children = [...staticSchema.children, ...schema.value] as any;
  }

  return staticSchema;
});


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
