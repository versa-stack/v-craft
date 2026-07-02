<template>
  <component v-if="componentToRender" :is="componentToRender" v-bind="attrs">
    <template v-for="(_, name) in slots" :key="name" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs, useSlots, watch } from "vue";
import { useResolveCraftNode } from "./composable/useResolveCraftNode";
import { CraftNode } from "../lib/craftNode";

defineOptions({
  name: "CraftCanvas",
});

const slots = useSlots();
const attrs = useAttrs();

const props = defineProps<{
  componentName: string;
}>();

const craftNode = computed<CraftNode>(() => ({
  componentName: props.componentName,
  props: {},
  slots: {},
  uuid: "",
}));

const { componentToRender } = useResolveCraftNode(craftNode);
</script>
