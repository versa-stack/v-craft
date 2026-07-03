import { ComputedRef, computed, inject, Ref } from "vue";
import { CraftNode, CraftNodeDatasource } from "../../lib/craftNode";
import CraftNodeResolver from "../../lib/CraftNodeResolver";
import { useEditor } from "../../store/editor";

export type ContextBucketInfo = {
  slotName: string;
  ancestorUuid: string;
  ancestorComponentName: string;
  keys: string[];
};

const keysFromDatasource = (
  datasource: CraftNodeDatasource | null | undefined,
): string[] => {
  if (!datasource) return [];
  const sample =
    datasource.type === "single" ? datasource.item : datasource.list?.[0];
  return sample ? Object.keys(sample) : [];
};

/**
 * Walks up from a node to the root, collecting the context bucket each
 * ancestor exposes - either a named slot bucket (from the resolver's
 * slotsProps, mirroring the scoped-slot accumulation CraftNodeStatic
 * performs at runtime) or the reserved "data" bucket (from that ancestor's
 * own nodeDataMap entry). Both feed the same useResolveCraftNodeProps
 * mapping mechanism, so the editor can offer every bucket name actually
 * available at runtime.
 */
export const useAncestorContextBuckets = (
  craftNode: Ref<CraftNode | null | undefined>,
) => {
  const editor = useEditor();
  const resolver = inject<ComputedRef<CraftNodeResolver<any>>>("resolver");

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
          keys: resolver?.value?.getSlotsProps(parent)?.[slotName] || [],
        });
      }

      const datasource = editor.nodeDataMap[parent.uuid];
      if (datasource) {
        result.push({
          slotName: "data",
          ancestorUuid: parent.uuid,
          ancestorComponentName: parent.componentName,
          keys: keysFromDatasource(datasource),
        });
      }

      current = parent;
    }

    return result;
  });

  return { buckets };
};
