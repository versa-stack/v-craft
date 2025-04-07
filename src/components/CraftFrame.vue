<template>
  <CraftIframe
    v-if="useIframe"
    :inheritStyles="inheritStyles"
    :styles="[
      'body{margin:0;padding: 3px; width: calc(100% - 2px);}',
      ...iFrameStyles,
    ]"
    :iframe-style="iFrameStyle"
    :style-sheets="iFrameStyleSheets"
    iframeClass="w-full h-full"
  >
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
  </CraftIframe>
  <CraftNodeViewer
    v-if="!useIframe && (viewOnly || !editor.enabled) && editor.hasNodes"
    v-for="craftNode in editor.nodeTree"
    :key="`${craftNode.uuid}-view`"
    :craftNode="craftNode"
  />
  <CraftNodeEditor
    v-if="!useIframe && !viewOnly && editor.enabled && editor.hasNodes"
    v-for="craftNode in editor.nodeTree"
    :key="`${craftNode.uuid}-edit`"
    :craftNode="craftNode"
  />
  <Indicator v-if="!useIframe && !viewOnly && editor.enabled" />
</template>

<script lang="ts" setup generic="T extends object">
import { StyleValue } from "vue";
import { CraftNodeResolverMap } from "../lib/CraftNodeResolver";
import Indicator from "./CraftDropIndicator.vue";
import CraftIframe from "./CraftIframe.vue";
import { useCraftFrame } from "./composable/useCraftFrame";
import { type CraftNode } from "../lib/craftNode";

defineOptions({
  name: "CraftFrame",
});

const props = withDefaults(
  defineProps<{
    resolverMap?: CraftNodeResolverMap<T>;
    viewOnly?: boolean;
    useIframe?: boolean;
    iFrameStyleSheets?: string[];
    iFrameStyles?: string[];
    inheritStyles?: boolean;
    iFrameStyle?: StyleValue;
  }>(),
  {
    viewOnly: false,
    useIframe: false,
    inheritStyles: false,
    iFrameStyleSheets: () => [],
    iFrameStyles: () => [],
    iFrameStyle: () => ({}),
  }
);

const { editor } = useCraftFrame<T>(props.resolverMap);
</script>
<style>
.vue3-iframe iframe body {
  padding: 10px;
}
</style>
