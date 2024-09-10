<template>
  <component
    v-if="resolved && resolved.component"
    :is="resolved.component"
    v-bind="$attrs"
  >
    <slot></slot>
  </component>
</template>
<script lang="ts">
export default {
  name: "CraftCanvas",
};
</script>

<script setup lang="ts">
import { ComputedRef, inject, computed } from "vue";
import CraftNodeResolver from "../lib/CraftNodeResolver";

const props = defineProps<{
  component: string;
}>();

const resolver = inject<ComputedRef<CraftNodeResolver>>("resolver");
const resolved = computed(() => resolver?.value.resolve(props.component));
</script>
