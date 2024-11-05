import { onBeforeMount, onBeforeUnmount, Ref, watch } from "vue";
import { CraftNode } from "../../lib/craftNode";
import { computed } from "vue";
import { EditorStoreInstanceType } from "../../store/editor";

export const useCraftNodeEvents = <T extends object>(
  craftNode: Ref<CraftNode<T>>,
  editor: EditorStoreInstanceType<T>,
  ctx: Record<string, any>
) => {
  const eventHandlersMap = new Map();

  const buildEvents = () => {
    if (
      !craftNode.value?.events ||
      !Object.values(craftNode.value.events).length
    ) {
      return;
    }

    Object.entries(craftNode.value.events).forEach(([eventName, eventCode]) => {
      if (!eventCode.trim()) {
        return;
      }

      const handler = (...args: any[]) => {
        try {
          const eventHandler = new Function(
            "ctx",
            "craftNode",
            "args",
            eventCode
          );
          eventHandler(
            { ...ctx, editor },
            editor.nodeMap.get(craftNode.value.uuid),
            ...args
          );
        } catch (e) {
          console.error(
            `Event code execution failed with code: 
${eventCode}

Error:`,
            e
          );
        }
      };

      eventHandlersMap.set(eventName, handler);
    });
  };

  watch(
    () => craftNode,
    () => {
      buildEvents();
    }
  );

  onBeforeMount(() => {
    buildEvents();
  });

  onBeforeUnmount(() => {
    eventHandlersMap.clear();
  });

  return {
    eventHandlers: computed(() => Object.fromEntries(eventHandlersMap)),
  };
};
