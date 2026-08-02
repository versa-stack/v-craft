import { ref } from 'vue'

export function useNodeElement() {
  const nodeEl = ref<HTMLElement | null>(null)

  const vNodeEl = {
    mounted(el: HTMLElement) {
      nodeEl.value = el
    },
    updated(el: HTMLElement) {
      nodeEl.value = el
    },
    unmounted() {
      nodeEl.value = null
    },
  }

  return { nodeEl, vNodeEl }
}