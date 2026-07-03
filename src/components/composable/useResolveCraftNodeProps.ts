import { JSONPath } from "jsonpath-plus";
import { computed, ComputedRef, MaybeRefOrGetter, toValue } from "vue";
import { CraftNode } from "../../lib/craftNode";
import { setValueByPath } from "../../lib/setValueByPath";

/**
 * A bag of named context buckets available to a node, e.g. the scoped slot
 * props exposed by an ancestor's slot, keyed by that slot's name.
 */
export type CraftNodePropsContext = Record<string, Record<string, any>>;

const resolveContextProps = (
  slotsPropsPropsMap: CraftNode["slotsPropsPropsMap"],
  context: CraftNodePropsContext,
) => {
  const props: Record<string, any> = {};
  if (!slotsPropsPropsMap) return props;

  Object.entries(slotsPropsPropsMap).forEach(([contextKey, fieldMap]) => {
    const contextData = context[contextKey];
    if (contextData === undefined) return;

    Object.entries(fieldMap).forEach(([toPath, fromPath]) => {
      const matches = JSONPath({
        path: fromPath,
        json: contextData,
        resultType: "value",
      });
      if (!matches.length) return;
      setValueByPath(props, toPath, matches[0]);
    });
  });

  return props;
};

export const useResolveCraftNodeProps = (
  node: MaybeRefOrGetter<CraftNode>,
  context: MaybeRefOrGetter<CraftNodePropsContext> = {},
): { props: ComputedRef<Record<string, any>> } => {
  const props = computed(() =>
    resolveContextProps(toValue(node)?.slotsPropsPropsMap, toValue(context) || {}),
  );

  return {
    props,
  };
};
