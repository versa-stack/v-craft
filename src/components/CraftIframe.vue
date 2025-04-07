<template>
  <div v-show="$slots.default">
    <iframe
      ref="iframeRef"
      :class="iframeClass"
      :style="iframeStyle"
      :onload="onLoad"
    />
    <Teleport v-if="hasLoad" :to="iframeRef?.contentWindow?.document.body">
      <slot />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, StyleValue, onUnmounted } from "vue";

const props = withDefaults(
  defineProps<{
    iframeClass?: string | Record<string, boolean>;
    iframeStyle?: StyleValue;
    inheritStyles?: boolean;
    styleSheets?: string[];
    styles?: string[];
  }>(),
  {
    iframeClass: "",
    iframeStyle: () => ({}),
    inheritStyles: true,
    styleSheets: () => [],
    styles: () => [],
  }
);

const iframeRef = ref<HTMLIFrameElement>();
const hasLoad = ref(false);
const iframeBody = ref();
const observer = ref<MutationObserver>();
const resizeObserver = ref<ResizeObserver>();

const onLoad = () => {
  nextTick(() => {
    setupBody();
    inheritAttributes();
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
      iframeBody.value = iframeRef.value?.contentWindow?.document.body;
      setupAutoResize();
    });
  });
};

const setupAutoResize = () => {
  const iframeWindow = iframeRef.value?.contentWindow;
  if (!iframeWindow) return;

  // Cleanup previous observers
  observer.value?.disconnect();
  resizeObserver.value?.disconnect();

  // MutationObserver for content changes
  observer.value = new MutationObserver(updateIframeHeight);
  observer.value.observe(iframeWindow.document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });

  // ResizeObserver for intrinsic sizing elements
  resizeObserver.value = new ResizeObserver(updateIframeHeight);
  resizeObserver.value.observe(iframeWindow.document.body);

  // Initial height set
  updateIframeHeight();
};

const updateIframeHeight = () => {
  nextTick(() => {
    const iframeDocument = iframeRef.value?.contentWindow?.document;
    if (!iframeDocument) return;

    const body = iframeDocument.body;
    const html = iframeDocument.documentElement;

    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    if (iframeRef.value) {
      iframeRef.value.style.height = `${height}px`;
    }
  });
};

const inheritStyles = () => {
  const styles = Array.from(
    iframeRef.value?.contentWindow?.parent.document.querySelectorAll("style") ??
      []
  );
  styles.forEach((el: any) => {
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

const inheritAttributes = () => {
  copyAttributes("html");
  copyAttributes("body");
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

const copyAttributes = (tagName: string) => {
  const htmlTag =
    iframeRef.value?.contentWindow?.parent.document.querySelector(tagName);
  const targetTag =
    iframeRef.value?.contentWindow?.document.querySelector(tagName);
  if (!htmlTag || !targetTag) return;

  Array.from(htmlTag.attributes as NamedNodeMap).forEach((attribute: Attr) => {
    if (attribute.name === "id") return;
    const clonedAttr = attribute.cloneNode(true) as Attr;
    targetTag.attributes.setNamedItem(clonedAttr);
  });
};

onUnmounted(() => {
  observer.value?.disconnect();
  resizeObserver.value?.disconnect();
});
</script>
