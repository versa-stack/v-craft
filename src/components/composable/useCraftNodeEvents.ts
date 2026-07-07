import { onBeforeMount, onBeforeUnmount, Ref, watch } from "vue";
import { CraftNode } from "../../lib/craftNode";
import { computed } from "vue";
import { EditorStoreInstanceType } from "../../store/editor";

/** Extra lookups/channels merged into `ctx` for compiled event code. */
export interface CraftNodeEventsRuntime {
  getNodes?: () => Record<string, CraftNode> | null;
  getNode?: (uuid: string) => CraftNode | null;
  /** Live runtime values captured from value-bearing nodes (e.g. what a user typed), keyed by uuid. */
  nodeValues?: Record<string, Record<string, any>>;
  /** Patch another node's rendered props at runtime, by uuid. */
  setNodeProps?: (uuid: string, patch: Record<string, any>) => void;
  /** Page-scoped bag shared across event handlers, e.g. a pending flag. */
  state?: Record<string, any>;
}

export const useCraftNodeEvents = (
  craftNode: Ref<CraftNode>,
  ctx: Record<string, any>,
  runtime: CraftNodeEventsRuntime = {},
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
            { ...ctx, ...runtime },
            craftNode.value.uuid,
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
