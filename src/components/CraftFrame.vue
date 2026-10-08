<template>
  <div class="v-craft-frame">
    <CraftIframe
      v-if="iframe"
      :inherit-styles="iframe?.inheritStyles"
      :iframe-style="iframe?.iframeStyle"
      :iframe-class="iframe?.iframeClass"
      :class="iframe?.wrapperClass"
      :style="iframe?.wrapperStyle"
      :styles="iframe?.styles"
      :style-sheets="iframe?.styleSheets"
      @iframe-load="onIframeLoad"
    >
      <template v-if="(viewOnly || !enabled) && hasNodes">
        <CraftNodeViewer
          v-for="craftNode in nodeTree"
          :key="`${craftNode.uuid}-view`"
          :craft-node="craftNode"
        />
      </template>
      <template v-if="!viewOnly && enabled && hasNodes">
        <CraftNodeEditor
          v-for="craftNode in nodeTree"
          :key="`${craftNode.uuid}-edit`"
          :craft-node="craftNode"
        />
      </template>
      <Indicator v-if="!viewOnly && enabled" />
    </CraftIframe>
    <template v-if="!iframe && (viewOnly || !enabled) && hasNodes">
      <CraftNodeViewer
        v-for="craftNode in nodeTree"
        :key="`${craftNode.uuid}-view`"
        :craft-node="craftNode"
      />
    </template>
    <template v-if="!iframe && !viewOnly && enabled && hasNodes">
      <CraftNodeEditor
        v-for="craftNode in nodeTree"
        :key="`${craftNode.uuid}-edit`"
        :craft-node="craftNode"
      />
    </template>
    <Indicator v-if="!iframe && !viewOnly && enabled" />
  </div>
</template>

<script
  lang="ts"
  setup
  generic="T extends FormKitSchemaDefinition = FormKitSchemaDefinition"
>
import { FormKitSchemaDefinition } from "@formkit/core";
import { storeToRefs } from "pinia";
import { toRefs } from "vue";
import { CraftNodeResolverMap } from "../lib/CraftNodeResolver";
import { type CraftFrameIFrameProps } from "../lib/model";
import Indicator from "./CraftDropIndicator.vue";
import CraftIframe from "./CraftIframe.vue";
import { useCraftFrame } from "./composable/useCraftFrame";

defineOptions({
  name: "CraftFrame",
});

const props = withDefaults(
  defineProps<{
    iframe?: CraftFrameIFrameProps;
    resolverMap?: CraftNodeResolverMap<T>;
    viewOnly?: boolean;
  }>(),
  {
    iframe: undefined,
    resolverMap: undefined,
    viewOnly: false,
  },
);

const { iframe } = toRefs(props);

const onIframeLoad = (iframe: HTMLIFrameElement) => {
  emit("iframeLoad", iframe);
};

const emit = defineEmits<{
  (e: "iframeLoad", iframe: HTMLIFrameElement): void;
}>();

const { editor } = useCraftFrame<T>(props.resolverMap);
const { nodeTree, hasNodes, enabled } = storeToRefs(editor);
</script>
