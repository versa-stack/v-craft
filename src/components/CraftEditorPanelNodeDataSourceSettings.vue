<template>
  <fieldset
    v-if="craftNode"
    class="v-craft-panel-settings formkit-fieldset v-craft-scrollable-content"
  >
    <legend class="formkit-legend">Data Source</legend>
    <p class="formkit-help">
      Paste JSON here to experiment with mapping data fields into this
      subtree's props. Descendants read it via <code>slotsPropsPropsMap</code>
      using the reserved <code>data</code> context bucket (e.g.
      <code>{ data: { title: "$.name" } }</code>). This panel is a
      convenience for experimentation - production apps normally feed real
      data in via <code>editor.setNodeData()</code> directly.
    </p>

    <FormKit
      type="select"
      label="Type"
      :options="[
        { value: 'single', label: 'Single item' },
        { value: 'list', label: 'List' },
      ]"
      :value="draftType"
      @input="(value) => updateType(String(value ?? 'single'))"
    />

    <FormKit
      type="textarea"
      label="JSON"
      :placeholder="
        draftType === 'list'
          ? '[{ &quot;title&quot;: &quot;Alice&quot; }, { &quot;title&quot;: &quot;Bob&quot; }]'
          : '{ &quot;title&quot;: &quot;Alice&quot; }'
      "
      :value="draftJson"
      @input="(value) => updateJson(String(value ?? ''))"
    />

    <p v-if="jsonError" class="formkit-help v-craft-data-source-error">
      {{ jsonError }}
    </p>
  </fieldset>
</template>

<script lang="ts" setup>
import { FormKit } from "@formkit/vue";
import { ref, toRef, watch } from "vue";
import { CraftNode, CraftNodeDatasource } from "../lib/craftNode";

const props = defineProps<{
  craftNode?: CraftNode;
  nodeData?: CraftNodeDatasource | null;
}>();

const emit = defineEmits<{
  (e: "update:nodeData", value: CraftNodeDatasource | null): void;
}>();

const craftNode = toRef(props, "craftNode");
const draftType = ref<"single" | "list">("single");
const draftJson = ref("");
const jsonError = ref("");

const syncFromNode = () => {
  const data = props.nodeData;
  draftType.value = data?.type === "list" ? "list" : "single";
  draftJson.value = data
    ? JSON.stringify(
        data.type === "list" ? data.list || [] : data.item || {},
        null,
        2,
      )
    : "";
  jsonError.value = "";
};

watch(() => craftNode.value?.uuid, syncFromNode, { immediate: true });

const emitFromDraft = () => {
  if (!draftJson.value.trim()) {
    jsonError.value = "";
    emit("update:nodeData", null);
    return;
  }

  try {
    const parsed = JSON.parse(draftJson.value);
    jsonError.value = "";
    if (draftType.value === "list") {
      emit("update:nodeData", {
        type: "list",
        list: Array.isArray(parsed) ? parsed : [parsed],
      });
    } else {
      emit("update:nodeData", { type: "single", item: parsed });
    }
  } catch (e) {
    jsonError.value = "Invalid JSON - not applied until fixed.";
  }
};

const updateType = (value: string) => {
  draftType.value = value === "list" ? "list" : "single";
  emitFromDraft();
};

const updateJson = (value: string) => {
  draftJson.value = value;
  emitFromDraft();
};
</script>

<style lang="scss" scoped>
.v-craft-data-source-error {
  color: var(--v-craft-red, #e5484d);
}
</style>
