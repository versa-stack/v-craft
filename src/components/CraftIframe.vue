<template>
  <div v-show="$slots.default">
    <iframe
      id="v-craft-iframe"
      ref="iframeRef"
      :class="iframeClass"
      :style="iframeStyle"
      :onload="onLoad"
    />
    <Teleport
      v-if="hasLoad"
      :to="iframeRef?.contentWindow?.document.body"
    >
      <slot />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  nextTick,
  StyleValue,
  HTMLAttributes,
} from "vue";

const props = withDefaults(
  defineProps<{
    iframeClass?: HTMLAttributes["class"];
    iframeStyle?: StyleValue;
    inheritStyles?: boolean;
    styleSheets?: string[];
    styles?: string[];
    iframeId?: string;
  }>(),
  {
    iframeId: "v-craft-iframe",
    iframeClass: "",
    iframeStyle: () => ({}),
    inheritStyles: false,
    styleSheets: () => [],
    styles: () => [],
  }
);

const iframeRef = ref<HTMLIFrameElement>();
const hasLoad = ref(false);
const iframeBody = ref();

const onLoad = () => {
  nextTick(() => {
    if (!iframeRef.value) {
      console.error("iframe could not be loaded.");
      return;
    }

    emit("iframeLoad", iframeRef.value);
    iframeRef.value?.setAttribute("data-iframe-ready", "true");
    setupBody();
    if (props.inheritStyles) inheritStyles();

    props.styles.forEach((el) => {
      if (!iframeRef.value) return;
      insertStyle(iframeRef.value, el);
    });

    props.styleSheets.forEach((sheet) => {
      if (!iframeRef.value) return;
      insertStyleSheet(iframeRef.value, sheet);
    });

    hasLoad.value = true;

    nextTick(() => {
      if (!iframeRef.value) {
        return;
      }

      iframeBody.value = iframeRef.value?.contentWindow?.document.body;
    });
  });
};

const inheritStyles = () => {
  const parentDoc = iframeRef.value?.contentWindow?.parent.document;
  if (!parentDoc) return;

  const styles = Array.from(parentDoc.querySelectorAll("style") ?? []);
  styles.forEach((el: any) => {
    iframeRef.value?.contentDocument?.head.appendChild(el.cloneNode(true));
  });

  const links = Array.from(parentDoc.querySelectorAll("link[rel='stylesheet']") ?? []);
  links.forEach((el: any) => {
    iframeRef.value?.contentDocument?.head.appendChild(el.cloneNode(true));
  });
};

const insertStyle = (target: HTMLIFrameElement, style: string) => {
  const styleEl = document.createElement("style");
  styleEl.innerHTML = style;
  target?.contentWindow?.document
    .getElementsByTagName("head")
    .item(0)
    ?.appendChild(styleEl);
};

const insertStyleSheet = (target: HTMLIFrameElement, sheet: string) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = sheet;
  target.contentWindow?.document.head.appendChild(link);
};

const setupBody = () => {
  const iframeDoc = iframeRef.value?.contentWindow?.document as Document;
  if (!iframeDoc) return;
  const body = iframeDoc.querySelector("body");
  if (!body) return;

  const id = iframeDoc.createAttribute("id");
  id.nodeValue = "v-craft-body";
  (body.attributes as NamedNodeMap).setNamedItem(id);
};

const emit = defineEmits<{
  (e: "iframeLoad", iframe: HTMLIFrameElement): void;
}>();
</script>
