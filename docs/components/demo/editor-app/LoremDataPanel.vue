<template>
  <fieldset
    v-if="craftNode"
    class="v-craft-panel-settings formkit-fieldset v-craft-scrollable-content"
  >
    <legend class="formkit-legend">Lorem API</legend>
    <p class="formkit-help">
      Fetch placeholder paragraphs from
      <a href="https://lorem-api.com/" target="_blank" rel="noopener">lorem-api.com</a>
      and feed them into this node as a list datasource. Children read fields
      out of it via <code>slotsPropsPropsMap</code>'s reserved
      <code>data</code> bucket, exactly like any other node datasource.
    </p>

    <FormKit
      type="number"
      label="Paragraphs"
      min="1"
      max="10"
      :value="paragraphCount"
      @input="(value) => (paragraphCount = Math.min(10, Math.max(1, Number(value) || 1)))"
    />

    <button
      type="button"
      class="formkit-input"
      :disabled="loading"
      @click.prevent="fetchLorem"
    >
      {{ loading ? "Fetching…" : "Fetch from Lorem API" }}
    </button>

    <p v-if="error" class="formkit-help v-craft-lorem-error">{{ error }}</p>
  </fieldset>
</template>

<script lang="ts" setup>
import { FormKit } from "@formkit/vue";
import { ref, watch } from "vue";
import type { CraftNode, CraftNodeDatasource } from "@versa-stack/v-craft";

const props = defineProps<{
  craftNode?: CraftNode;
  handleNodeDataUpdate: (data: CraftNodeDatasource | null) => void;
}>();

const paragraphCount = ref(3);
const loading = ref(false);
const error = ref("");

// Selecting a different node shouldn't keep showing a stale error from the
// previous one.
watch(
  () => props.craftNode?.uuid,
  () => {
    error.value = "";
  },
);

const fetchLorem = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await fetch(
      `https://lorem-api.com/api/lorem?paragraphs=${paragraphCount.value}`,
    );
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    // lorem-api.com's /lorem endpoint returns plain text, one paragraph
    // per line - no JSON parsing needed, just split and wrap each line so
    // it has a field ("text") for slotsPropsPropsMap to target.
    const raw = await response.text();
    const paragraphs = raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    props.handleNodeDataUpdate({
      type: "list",
      list: paragraphs.map((text) => ({ text })),
    });
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to fetch";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.v-craft-lorem-error {
  color: var(--v-craft-red, #e5484d);
}
</style>
