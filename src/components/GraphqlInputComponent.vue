<template>
  <ClientOnly>
    <div class="graphql-editor">
      <div class="editor-header">
        <button @click="openModal" class="pop-out-button">
          <i class="fas fa-expand"></i> Expand Editor
        </button>
      </div>
      <FormKit
        type="textarea"
        v-if="editorValue"
        v-model="editorValue"
        :style="{ width: '100%', height: '300px', resize: 'none' }"
        @input="debouncedUpdateValue"
      ></FormKit>
    </div>
    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <button @click="closeModal" class="close-button">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <FormKit
          type="textarea"
          v-if="editorValue"
          v-model="editorValue"
          :style="{ width: '100%', height: '300px', resize: 'none' }"
          @input="debouncedUpdateValue"
        ></FormKit>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, shallowRef } from 'vue'
import { useModal } from './composable/useModal'
import { FormKit } from '@formkit/vue';

const props = defineProps({
  context: {
    type: Object as () => any,
    required: true,
  },
})

const editorValue = ref(props.context?.node?.value ?? "# Enter your GraphQL query here\n")

const debounce = (fn: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

const updateValue = (value: string) => {
  editorValue.value = value
  props.context?.node?.input(value)
}

const debouncedUpdateValue = debounce(updateValue, 300)

const { closeModal, isModalOpen, openModal } = useModal()

watch(
  () => props.context?.node?.value,
  (newValue) => {
    if (newValue !== editorValue.value) {
      editorValue.value = newValue
    }
  }
)

onMounted(() => {
  if (!props.context?.node?.value) {
    props.context?.node?.input(editorValue.value)
  }
})
</script>

<style lang="scss" scoped>
@import "../assets/graphqlInput";
</style>
