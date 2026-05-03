<template>
  <component
    v-if="componentToRender"
    :is="componentToRender"
    v-bind="attrs"
  >
    <template v-for="(_, name) in slots" :key="name" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed, inject, useAttrs, useSlots } from "vue";
import type { ComputedRef } from "vue";
import CraftNodeResolver from "../lib/CraftNodeResolver";

defineOptions({
  name: "CraftCanvas",
});

const slots = useSlots();
const attrs = useAttrs();

const props = defineProps<{
  componentName: string;
}>();

const resolver = inject<ComputedRef<CraftNodeResolver>>("resolver");
const resolved = computed(() => resolver?.value.resolve(props.componentName));
const componentToRender = computed(() => resolved.value?.componentName || props.componentName);
</script>
