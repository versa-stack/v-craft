<template>
  <CraftEditorPanelForm
    :craftNode="craftNode"
    :schema="schema"
    :model="craftNode?.events"
    @update="(v) => emit('update:events', v)"
  >
    <template #panel-content="{ craftNode, model, handleFormInput, schema }">
      <fieldset
        class="v-craft-panel-settings formkit-fieldset v-craft-scrollable-content"
        v-if="schema"
      >
        <legend class="formkit-legend">Events</legend>
        <FormKit
          :key="craftNode?.uuid"
          type="form"
          :value="model"
          @input="handleFormInput"
          :actions="false"
        >
          <FormKitSchema :schema="(schema as FormKitSchemaFormKit)" />
        </FormKit>
      </fieldset>
    </template>
  </CraftEditorPanelForm>
</template>

<script lang="ts" setup generic="T extends object = FormKitSchemaFormKit">
import { FormKitSchemaFormKit } from "@formkit/core";
import { FormKit, FormKitSchema } from "@formkit/vue";
import { toRefs } from "vue";
import { CraftNode } from "../lib/craftNode";

export interface Props<T extends object> {
  craftNode: CraftNode;
  schema?: T;
}

const props = withDefaults(defineProps<Props<T>>(), {
  schema: () => ({} as T),
});

const { craftNode, schema } = toRefs(props);

const emit = defineEmits<{
  (e: "update:events", value: Record<string, any>): void;
}>();
</script>
