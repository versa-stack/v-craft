<template>
  <component
    v-if="resolved && resolved.componentName"
    :is="resolved.componentName"
    v-bind="filteredAttrs"
  >
    <template v-for="(_, name) in slots" :key="name" #[name]="slotData">
      <slot :name="name" />
    </template>
    <template v-if="$attrs.children">
      <slot v-for="(child, index) in $attrs.children" :key="index">
        {{ child }}
      </slot>
    </template>
  </component>
</template>

<script setup lang="ts" generic="T extends object">
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

const resolver = inject<ComputedRef<CraftNodeResolver<T>>>("resolver");
const resolved = computed(() => resolver?.value.resolve(props.componentName));

const filteredAttrs = computed(() => {
  const { children, ...rest } = attrs;
  return rest;
});
</script>
