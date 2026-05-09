<template>
  <div class="v-craft-frame">
    <CraftIframe
      v-if="useIframe"
      @iframe-load="onIframeLoad"
      :inheritStyles="inheritStyles"
      :styles="[
        ...iFrameStyles,
      ]"
      :iframe-style="iFrameStyle"
      :iframe-class="iFrameClass"
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
import { StyleValue, toRefs, type HTMLAttributes } from "vue";
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
    iFrameClass?: HTMLAttributes["class"];
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
