<template>
  <CraftEditorPanelForm
    :craft-node="craftNode"
    :schema="schema"
    :model="craftNode?.props"
    @update="(v) => emit('update:props', v)"
  >
    <template #panel-content="{ craftNode: slotNode, model, handleFormInput, schema: slotSchema }">
      <fieldset
        v-if="slotSchema"
        class="v-craft-panel-settings formkit-fieldset v-craft-scrollable-content"
      >
        <legend class="formkit-legend">
          Properties
        </legend>
        <FormKit
          :key="slotNode?.uuid"
          type="form"
          :value="model"
          :actions="false"
          @input="handleFormInput"
        >
          <FormKitSchema :schema="slotSchema" />
        </FormKit>
      </fieldset>
    </template>
  </CraftEditorPanelForm>
</template>

<script
  lang="ts"
  setup
  generic="T extends FormKitSchemaDefinition = FormKitSchemaDefinition"
>
import { type FormKitSchemaDefinition } from "@formkit/core";
import { FormKit, FormKitSchema } from "@formkit/vue";
import { toRefs } from "vue";
import { CraftNode } from "../lib/craftNode";

const props = withDefaults(
  defineProps<{
    craftNode?: CraftNode;
    schema?: T;
  }>(),
  {
    craftNode: undefined,
    schema: () => ({}) as T,
  },
);

const { craftNode, schema } = toRefs(props);

const emit = defineEmits<{
  (e: "update:props", value: Record<string, unknown>): void;
}>();
</script>
