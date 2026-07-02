import { computed, Ref } from "vue";
import { CraftNode } from "../../lib/craftNode";
import { useEditor } from "../../store/editor";

export type ContextBucketInfo = {
  slotName: string;
  ancestorUuid: string;
  ancestorComponentName: string;
  keys: string[];
};

/**
 * Walks up from a node to the root, collecting the slot-context bucket each
 * ancestor exposes to the slot the node (or its intermediate ancestor) sits
 * in. Mirrors the accumulation CraftNodeStatic performs at runtime, so the
 * editor can offer the same bucket names available to useResolveCraftNodeProps.
 */
export const useAncestorContextBuckets = (
  craftNode: Ref<CraftNode | null | undefined>,
) => {
  const editor = useEditor();

  const buckets = computed<ContextBucketInfo[]>(() => {
    const result: ContextBucketInfo[] = [];
    let current = craftNode.value;

    while (current?.parentUuid) {
      const parent = editor.nodeMap.get(current.parentUuid);
      if (!parent) break;

      const slotEntry = Object.entries(parent.slots || {}).find(
        ([, children]) => children.some((child) => child.uuid === current!.uuid),
      );

      if (slotEntry) {
        const [slotName] = slotEntry;
        result.push({
          slotName,
          ancestorUuid: parent.uuid,
          ancestorComponentName: parent.componentName,
          keys: parent.slotsProps?.[slotName] || [],
        });
      }

      current = parent;
    }

    return result;
  });

  return { buckets };
};
