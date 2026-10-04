import { computed, Ref, ref } from "vue";
import { CraftNode } from "../../lib/craftNode";

/** Helpers v-craft hands the host's dispatch so it can act on the rendered page. */
export interface CraftNodeEventsRuntime {
  getNodes?: () => Record<string, CraftNode> | null;
  getNode?: (uuid: string) => CraftNode | null;
  /** Live runtime values captured from value-bearing nodes (e.g. what a user typed), keyed by uuid. */
  nodeValues?: Record<string, Record<string, any>>;
  /** Patch another node's rendered props at runtime, by uuid. */
  setNodeProps?: (uuid: string, patch: Record<string, any>) => void;
  /** Patch this rendered instance's own props, e.g. on one of many list items. */
  setSelfProps?: (patch: Record<string, unknown>) => void;
  /** Page-scoped bag shared across dispatches. */
  state?: Record<string, any>;
  /** The data item this node was rendered with by a bound ancestor. */
  getData?: () => unknown;
}

/**
 * Host handler for a node event, provided as `eventsContext.dispatch`.
 * Return a Promise to mark the node busy: while pending the node carries
 * `aria-busy="true"` and repeat fires of any of its events are ignored.
 */
export type CraftNodeEventsDispatch = (
  node: CraftNode,
  eventName: string,
  args: unknown[],
  data: unknown,
  runtime: CraftNodeEventsRuntime,
) => unknown;

export const useCraftNodeEvents = (
  craftNode: Ref<CraftNode>,
  ctx: Record<string, any>,
  runtime: CraftNodeEventsRuntime = {},
) => {
  const busy = ref(false);

  const eventHandlers = computed(() => {
    const dispatch = ctx.dispatch as CraftNodeEventsDispatch | undefined;
    const names = new Set(
      (craftNode.value?.interactions || [])
        .map((i) => i?.on)
        .filter((on): on is string => typeof on === "string" && !!on),
    );
    if (!dispatch || !names.size) return {};

    const fire = (eventName: string) => (...args: unknown[]) => {
      if (busy.value) return;
      let result: unknown;
      try {
        result = dispatch(craftNode.value, eventName, args, runtime.getData?.(), runtime);
      } catch (e) {
        console.error(`Event dispatch failed for "${eventName}":`, e);
        return;
      }
      if (result instanceof Promise) {
        busy.value = true;
        result
          .catch((e) => console.error(`Event dispatch failed for "${eventName}":`, e))
          .finally(() => (busy.value = false));
      }
    };

    return Object.fromEntries([...names].map((n) => [n, fire(n)]));
  });

  const busyAttrs = computed(() => (busy.value ? { "aria-busy": "true" } : {}));

  return { eventHandlers, busy, busyAttrs };
};
