<template>
  <div class="v-craft-frame">
    <CraftIframe
      v-if="iframe"
      @iframeLoad="onIframeLoad"
      :inheritStyles="iframe?.inheritStyles"
      :iframeStyle="iframe?.iframeStyle"
      :iframeClass="iframe?.iframeClass"
      :class="iframe?.wrapperClass"
      :style="iframe?.wrapperStyle"
      :styles="iframe?.styles"
      :styleSheets="iframe?.styleSheets"
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
      v-if="!iframe && (viewOnly || !enabled) && hasNodes"
      v-for="craftNode in nodeTree"
      :key="`${craftNode.uuid}-view`"
      :craftNode="craftNode"
    />
    <CraftNodeEditor
      v-if="!iframe && !viewOnly && enabled && hasNodes"
      v-for="craftNode in nodeTree"
      :key="`${craftNode.uuid}-edit`"
      :craftNode="craftNode"
    />
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
