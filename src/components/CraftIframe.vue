<template>
  <div v-show="$slots.default">
    <iframe
      id="v-craft-iframe"
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
import {
  ref,
  nextTick,
  StyleValue,
  onUnmounted,
  toRef,
  toRefs,
  watch,
} from "vue";

const props = withDefaults(
  defineProps<{
    iframeClass?: string | Record<string, boolean>;
    iframeStyle?: StyleValue;
    inheritStyles?: boolean;
    styleSheets?: string[];
    styles?: string[];
    iframeId?: string;
    width?: "auto" | number;
    height?: "auto" | number;
  }>(),
  {
    iframeId: "v-craft-iframe",
    iframeClass: "",
    iframeStyle: () => ({}),
    inheritStyles: false,
    styleSheets: () => [],
    styles: () => [],
    width: "auto",
    height: "auto",
  }
);

const iframeRef = ref<HTMLIFrameElement>();
const hasLoad = ref(false);
const iframeBody = ref();
const observer = ref<MutationObserver>();
const resizeObserver = ref<ResizeObserver>();
const { width, height } = toRefs(props);

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
      setupAutoResize();
    });
  });
};

watch([width, height], ([w, h]) => {
  setupAutoResize();
});

const setupAutoResize = () => {
  if (!iframeRef.value) {
    return;
  }
  const iframeWindow = iframeRef.value.contentWindow;
  if (!iframeWindow) return;

  observer.value?.disconnect();
  resizeObserver.value?.disconnect();

  if (height.value !== "auto" || width.value !== "auto") {
    iframeRef.value.style.height = `${height.value}px`;
    iframeRef.value.style.width = `${width.value}px`;
    return;
  }

  iframeRef.value.style.width = "100%";

  observer.value = new MutationObserver(updateIframeHeight);
  observer.value.observe(iframeWindow.document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });

  resizeObserver.value = new ResizeObserver(updateIframeHeight);
  resizeObserver.value.observe(iframeWindow.document.body);

  updateIframeHeight();
};

const updateIframeHeight = () => {
  nextTick(() => {
    const iframeDocument = iframeRef.value?.contentWindow?.document;
    if (!iframeDocument) return;

    const body = iframeDocument.body;
    const html = iframeDocument.documentElement;

    const _height = Math.min(
      body.scrollHeight,
      body.offsetHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    if (iframeRef.value) {
      iframeRef.value.style.height = `calc(${_height}px + 1.75rem)`;
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

onUnmounted(() => {
  observer.value?.disconnect();
  resizeObserver.value?.disconnect();
});
</script>
