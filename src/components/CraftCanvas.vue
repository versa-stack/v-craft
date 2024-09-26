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

<script setup lang="ts">
import { computed, ComputedRef, inject, useAttrs, useSlots } from "vue";
import CraftNodeResolver from "../lib/CraftNodeResolver";

defineOptions({
  name: "CraftCanvas",
});

const slots = useSlots();
const attrs = useAttrs();

const props = defineProps<{
  component: string;
}>();

const resolver = inject<ComputedRef<CraftNodeResolver>>("resolver");
const resolved = computed(() => resolver?.value.resolve(props.component));

const filteredAttrs = computed(() => {
  const { children, ...rest } = attrs;
  return rest;
});
</script>
