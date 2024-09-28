<template>
  <div class="graphql-editor">
    <div class="editor-header">
      <button @click="openModal" class="pop-out-button">
        <i class="fas fa-expand"></i> Expand Editor
      </button>
    </div>
    <MonacoEditor
      v-if="MonacoEditor"
      :value="editorValue"
      language="graphql"
      :options="editorOptions"
      @change="debouncedUpdateValue"
    />
  </div>
  <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <button @click="closeModal" class="close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <MonacoEditor
        v-if="MonacoEditor"
        :value="editorValue"
        language="graphql"
        :options="modalEditorOptions"
        @change="debouncedUpdateValue"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch, shallowRef, defineAsyncComponent } from "vue";
import { useModal } from "./composable/useModal";

const props = defineProps({
  context: {
    type: Object as () => any,
    required: true,
  },
});

const MonacoEditor = shallowRef();

onMounted(async () => {
  await import("../config/monaco-config");
  MonacoEditor.value = defineAsyncComponent(() => import("monaco-editor-vue3"));
});

const editorValue = ref(
  props.context?.node?.value ?? "# Enter your GraphQL query here\n"
);

const editorOptions = {
  minimap: { enabled: false },
  lineNumbers: "on",
  roundedSelection: false,
  scrollBeyondLastLine: false,
  readOnly: false,
  theme: "vs-dark",
  automaticLayout: true,
};

const modalEditorOptions = {
  ...editorOptions,
  automaticLayout: true,
};

const debounce = (fn: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const updateValue = (value: string) => {
  editorValue.value = value;
  props.context?.node?.input(value);
};

const debouncedUpdateValue = debounce(updateValue, 300);

const { closeModal, isModalOpen, openModal } = useModal();

watch(
  () => props.context?.node?.value,
  (newValue) => {
    if (newValue !== editorValue.value) {
      editorValue.value = newValue;
    }
  }
);

onMounted(() => {
  if (!props.context?.node?.value) {
    props.context?.node?.input(editorValue.value);
  }
});
</script>

<style lang="scss" scoped>
@import "../assets/graphqlInput";
</style>
