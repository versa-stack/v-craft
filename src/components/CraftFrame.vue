<template>
  <div class="v-craft-frame">
    <CraftIframe
      v-if="useIframe"
      @iframe-load="onIframeLoad"
      :inheritStyles="inheritStyles"
      :styles="[
        'body{margin:0;padding: 3px; width: calc(100% - 2px);}',
        ...iFrameStyles,
      ]"
      :iframe-style="iFrameStyle"
      :style-sheets="iFrameStyleSheets"
      :width="iFrameWidth"
      :height="iFrameHeight"
    >
      <CraftNodeViewer
        v-if="(viewOnly || !enabled) && hasNodes"
        v-for="craftNode in nodeTree"
        :key="`${craftNode.uuid}-view`"
        :craftNode="craftNode"
      />
      <CraftNodeEditor
        v-if="!viewOnly && enabled && hasNodes"
        v-for="craftNode in nodeTree"
        :key="`${craftNode.uuid}-edit`"
        :craftNode="craftNode"
      />
      <Indicator v-if="!viewOnly && enabled" />
    </CraftIframe>
    <CraftNodeViewer
      v-if="!useIframe && (viewOnly || !enabled) && hasNodes"
      v-for="craftNode in nodeTree"
      :key="`${craftNode.uuid}-view`"
      :craftNode="craftNode"
    />
    <CraftNodeEditor
      v-if="!useIframe && !viewOnly && enabled && hasNodes"
      v-for="craftNode in nodeTree"
      :key="`${craftNode.uuid}-edit`"
      :craftNode="craftNode"
    />
    <Indicator v-if="!useIframe && !viewOnly && enabled" />
  </div>
</template>

<script lang="ts" setup generic="T extends object">
import { storeToRefs } from "pinia";
import { StyleValue, toRefs } from "vue";
import { CraftNodeResolverMap } from "../lib/CraftNodeResolver";
import Indicator from "./CraftDropIndicator.vue";
import CraftIframe from "./CraftIframe.vue";
import { useCraftFrame } from "./composable/useCraftFrame";

defineOptions({
  name: "CraftFrame",
});

const props = withDefaults(
  defineProps<{
    iFrameHeight?: "auto" | number;
    iFrameStyle?: StyleValue;
    iFrameStyleSheets?: string[];
    iFrameStyles?: string[];
    iFrameWidth?: "auto" | number;
    inheritStyles?: boolean;
    resolverMap?: CraftNodeResolverMap<T>;
    useIframe?: boolean;
    viewOnly?: boolean;
  }>(),
  {
    iFrameHeight: "auto",
    iFrameStyle: () => ({}),
    iFrameStyleSheets: () => [],
    iFrameStyles: () => [],
    iFrameWidth: "auto",
    inheritStyles: false,
    useIframe: false,
    viewOnly: false,
  }
);

const { iFrameWidth, iFrameHeight } = toRefs(props);

const onIframeLoad = (iframe: HTMLIFrameElement) => {
  emit("iframeLoad", iframe);
};

const emit = defineEmits<{
  (e: "iframeLoad", iframe: HTMLIFrameElement): void;
}>();

const { editor } = useCraftFrame<T>(props.resolverMap);
const { nodeTree, hasNodes, enabled } = storeToRefs(editor);
</script>
