<template>
  <CraftNodeViewer
    v-if="(viewOnly || !editor.enabled) && editor.hasNodes"
    v-for="craftNode in editor.nodeTree"
    :key="`${craftNode.uuid}-view`"
    :craftNode="craftNode"
  />
  <CraftNodeEditor
    v-if="!viewOnly && editor.enabled && editor.hasNodes"
    v-for="craftNode in editor.nodeTree"
    :key="`${craftNode.uuid}-edit`"
    :craftNode="craftNode"
  />
  <Indicator v-if="!viewOnly && editor.enabled" />
</template>

<script lang="ts" setup generic="T extends object">
import { CraftNodeResolverMap } from "../lib/CraftNodeResolver";
import Indicator from "./CraftDropIndicator.vue";
import { useCraftFrame } from "./composable/useCraftFrame";

defineOptions({
  name: "CraftFrame",
});

const props = withDefaults(
  defineProps<{
    resolverMap?: CraftNodeResolverMap<T>;
    viewOnly?: boolean;
  }>(),
  {
    viewOnly: false,
  }
);

const { editor } = useCraftFrame<T>(props.resolverMap);
</script>
