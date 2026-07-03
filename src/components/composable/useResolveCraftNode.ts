import {
  computed,
  ComputedRef,
  defineAsyncComponent,
  inject,
  MaybeRefOrGetter,
  Ref,
} from "vue";
import type { Component } from "vue";
import { CraftNode } from "../../lib/craftNode";
import { FormKitSchemaDefinition } from '@formkit/core';
import CraftNodeResolver, {
  CraftNodeComponentMap,
} from "../../lib/CraftNodeResolver";
import {
  CraftNodePropsContext,
  useResolveCraftNodeProps,
} from "./useResolveCraftNodeProps";

const resolveComponent = (
  resolver: CraftNodeResolver<any> | undefined,
  craftNode: CraftNode
): string | Component => {
  if (!resolver) {
    return craftNode.componentName;
  }

  const resolvedComponent = resolver.resolveComponent(craftNode);

  if (!resolvedComponent) {
    const resolvedNode = resolver.resolve(craftNode.componentName);
    return resolvedNode?.componentName || craftNode.componentName;
  }

  if (
    typeof resolvedComponent === "function" &&
    !("setup" in resolvedComponent) &&
    !("render" in resolvedComponent)
  ) {
    return defineAsyncComponent(resolvedComponent as () => Promise<Component>);
  }

  return resolvedComponent;
};

export const useResolveCraftNode = <T extends FormKitSchemaDefinition = FormKitSchemaDefinition>(
  craftNode: Ref<CraftNode>,
  context: MaybeRefOrGetter<CraftNodePropsContext> = {}
) => {
  const resolver = inject<ComputedRef<CraftNodeResolver<T>>>("resolver")!;
  const resolvedNode = computed(() => {
    if (!resolver || !craftNode?.value) return {} as CraftNodeComponentMap<T>;
    return resolver.value.resolve(
      craftNode.value.componentName
    ) as CraftNodeComponentMap<T>;
  });

  const defaultProps = computed(() => resolvedNode.value?.defaultProps || {});

  const componentToRender = computed(() =>
    resolveComponent(resolver?.value, craftNode.value)
  );

  const { props: contextProps } = useResolveCraftNodeProps(craftNode, context);

  // contextProps only ever contains keys the user explicitly targeted via
  // slotsPropsPropsMap, so it's placed last: a configured mapping is an
  // active choice and should win over whatever static value happens to sit
  // in craftNode.props for that same key (e.g. a blueprint's placeholder
  // default) - props the user didn't map are untouched either way.
  const props = computed(() => ({
    ...defaultProps.value,
    ...craftNode.value?.props,
    ...contextProps.value,
  }));

  return {
    resolvedNode,
    resolver,
    defaultProps,
    componentToRender,
    props,
  };
};
