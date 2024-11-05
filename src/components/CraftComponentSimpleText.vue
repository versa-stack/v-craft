<template>
  <component
    :is="componentName"
    :class="{ 'editable-text': enabled, 'is-editable': enabled, 'is-editing': isEditing }"
    @dblclick="handleDoubleClick"
  >
    {{ isEditing ? "" : content }}
    <textarea
      v-if="isEditing"
      ref="textareaRef"
      class="editable-text__textarea"
      :value="content"
      @input="adjustTextareaHeight"
      @blur="finishEditing"
      @keyup.enter.exact="finishEditing"
      @keyup.esc="cancelEditing"
    ></textarea>
  </component>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick } from "vue";
import { useCraftNode } from "./composable/useCraftNode";
import { useEditor } from "../store/editor";
import { storeToRefs } from "pinia";

interface Props {
  content?: string;
  placeholder?: string;
  componentName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  content: "Lorem ipsum dolor sit amet...",
  isEditable: true,
  placeholder: "",
  componentName: "div",
});

const emit = defineEmits<{
  (e: "update:content", value: string): void;
}>();

const isEditing = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const originalValue = ref("");
const editor = useEditor()();
const { enabled } = storeToRefs(editor);
const { craftNode } = useCraftNode();

const canEdit = computed(() => enabled.value && !isEditing.value);

const handleDoubleClick = () => {
  if (canEdit.value) {
    startEditing();
  }
};

const startEditing = () => {
  originalValue.value = props.content;
  isEditing.value = true;
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.focus();
      adjustTextareaHeight();
    }
  });
};

const adjustTextareaHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
  }
};

const finishEditing = async () => {
  if (isEditing.value) {
    isEditing.value = false;
    const newValue = textareaRef.value?.value.trim() || "";
    if (newValue !== props.content) {
      if (!craftNode.value?.uuid) {
        return;
      }

      editor.nodeMap.set(craftNode.value.uuid, {
        ...craftNode.value,
        props: {
          ...craftNode.value.props,
          content: newValue,
        },
      });

      await nextTick();

      console.log(craftNode.value.props.content);
      emit("update:content", newValue);
    }
  }
};

const cancelEditing = () => {
  isEditing.value = false;
  emit("update:content", originalValue.value);
};

watch(enabled, (newValue) => {
  if (!newValue && isEditing.value) {
    cancelEditing();
  }
});
</script>

<style lang="scss" scoped>
.editable-text {
}

.editable-text.is-editable:hover {
  background-color: rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.editable-text.is-editing {
  display: inline-block;
  width: 100%;
}

.editable-text__textarea {
  font: inherit;
  border: none;
  background: none;
  outline: none;
  width: 100%;
  resize: none;
  overflow: hidden;
  min-height: 1em;
  line-height: inherit;
  padding: 0.12em;
  margin: 0;
}

.editable-text__textarea:focus {
  border: none;
}
</style>
