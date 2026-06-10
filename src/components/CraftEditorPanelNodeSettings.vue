<template>
  <CraftEditorPanelForm
    :craftNode="craftNode"
    :schema="schema"
    :model="craftNode?.props"
    @update="(v) => emit('update:props', v)"
  >
    <template #panel-content="{ craftNode, model, handleFormInput, schema }">
      <fieldset
        class="v-craft-panel-settings formkit-fieldset v-craft-scrollable-content"
        v-if="schema"
      >
        <legend class="formkit-legend">Properties</legend>
        <FormKit
          :key="craftNode?.uuid"
          type="form"
          :value="model"
          @input="handleFormInput"
          :actions="false"
        >
          <FormKitSchema :schema="schema" />
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
    schema: () => ({}) as any,
  },
);

const { craftNode, schema } = toRefs(props);

const emit = defineEmits<{
  (e: "update:props", value: Record<string, any>): void;
}>();
</script>
