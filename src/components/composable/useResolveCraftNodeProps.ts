import { JSONPath } from "jsonpath-plus";
import { computed, ComputedRef, MaybeRefOrGetter, toValue } from "vue";
import { CraftNode } from "../../lib/craftNode";
import type CraftNodeResolver from "../../lib/CraftNodeResolver";
import { setValueByPath } from "../../lib/setValueByPath";

/**
 * A bag of named context buckets available to a node, e.g. the scoped slot
 * props exposed by an ancestor's slot, keyed by that slot's name.
 */
export type CraftNodePropsContext = Record<string, Record<string, any>>;

/** Default, resolver-less behavior: bare JSONPath lookup, no formatting. */
const defaultResolveJSONPath = (mapping: unknown, contextData: any): unknown => {
  if (typeof mapping !== "string") return undefined;
  const matches = JSONPath({ path: mapping, json: contextData, resultType: "value" });
  return matches.length ? matches[0] : undefined;
};

const resolveContextProps = (
  slotsPropsPropsMap: CraftNode["slotsPropsPropsMap"],
  context: CraftNodePropsContext,
  resolver?: CraftNodeResolver<any>,
) => {
  const props: Record<string, any> = {};
  if (!slotsPropsPropsMap) return props;

  Object.entries(slotsPropsPropsMap).forEach(([contextKey, fieldMap]) => {
    const contextData = context[contextKey];
    if (contextData === undefined) return;

    Object.entries(fieldMap).forEach(([toPath, mapping]) => {
      const value = resolver
        ? resolver.resolvePropertyValue(mapping, contextData)
        : defaultResolveJSONPath(mapping, contextData);
      if (value === undefined) return;
      setValueByPath(props, toPath, value);
    });
  });

  return props;
};

export const useResolveCraftNodeProps = (
  node: MaybeRefOrGetter<CraftNode>,
  context: MaybeRefOrGetter<CraftNodePropsContext> = {},
  resolver?: MaybeRefOrGetter<CraftNodeResolver<any> | undefined>,
): { props: ComputedRef<Record<string, any>> } => {
  const props = computed(() =>
    resolveContextProps(
      toValue(node)?.slotsPropsPropsMap,
      toValue(context) || {},
      toValue(resolver),
    ),
  );

  return {
    props,
  };
};
