import { onBeforeMount, onBeforeUnmount, Ref, watch } from "vue";
import { CraftNode } from "../../lib/craftNode";
import { computed } from "vue";
import { EditorStoreInstanceType } from "../../store/editor";

export const useCraftNodeEvents = <T extends object>(
  craftNode: Ref<CraftNode<T>>,
  ctx: Record<string, any> & { editor: EditorStoreInstanceType<T> }
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
      const handler = (...args: any[]) => {
        const eventHandler = new Function(
          "ctx",
          "craftNode",
          "args",
          eventCode
        );
        eventHandler(
          ctx,
          ctx.editor.nodeMap.get(craftNode.value.uuid),
          ...args
        );
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
