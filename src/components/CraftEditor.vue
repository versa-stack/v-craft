<template>
  <CraftEditorPanelLayout :blueprints="config.blueprintsLibrary">
    <CraftFrame><slot></slot></CraftFrame>
  </CraftEditorPanelLayout>
</template>

<script lang="ts" setup generic="T extends object">
import { provide, ref } from "vue";
import CraftNodeResolver from "../lib/CraftNodeResolver";
import { CraftEditorConfig } from "../lib/model";
import CraftFrame from "./CraftFrame.vue";

const props = defineProps<{
  config: CraftEditorConfig<T>;
}>();

const resolver = ref(new CraftNodeResolver(props.config.resolverMap));
provide("resolver", resolver);
</script>
