<template>
  <div v-show="$slots.default" :class="{ 'h-full': isAutoHeight }">
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
  computed,
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
const { height, width } = toRefs(props);

const isAutoHeight = computed(() => height.value === 'auto');
let lastHeight = 0;
let updateScheduled = false;

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
  iframeRef.value.style.height = "100%";

  observer.value = new MutationObserver(() => {
    setTimeout(updateIframeHeight, 100);
  });
  observer.value.observe(iframeWindow.document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });

  const initialResizeObserver = new ResizeObserver(() => {
    updateIframeHeight();
    initialResizeObserver.disconnect();
  });
  initialResizeObserver.observe(iframeWindow.document.documentElement);

  updateIframeHeight();
};

const updateIframeHeight = () => {
  if (updateScheduled) return;
  
  updateScheduled = true;
  nextTick(() => {
    const iframeDocument = iframeRef.value?.contentWindow?.document;
    if (!iframeDocument) {
      updateScheduled = false;
      return;
    }

    const iframeParent = iframeRef.value?.parentElement;
    let availableHeight = 0;
    
    if (iframeParent) {
      const parentHeight = iframeParent.clientHeight;
      const iframeTop = iframeRef.value?.offsetTop || 0;
      availableHeight = parentHeight - iframeTop;
    }

    const body = iframeDocument.body;
    const html = iframeDocument.documentElement;

    const contentHeight = Math.max(
      150,
      body.scrollHeight,
      body.offsetHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    const finalHeight = Math.max(contentHeight, availableHeight);

    if (iframeRef.value && Math.abs(finalHeight - lastHeight) > 1) {
      lastHeight = finalHeight;
      iframeRef.value.style.height = `${finalHeight}px`;
    }
    
    updateScheduled = false;
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

<style>
.vue3-iframe iframe body {
  padding: 10px;
}
</style>