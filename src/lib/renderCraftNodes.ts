import { FormKitSchemaDefinition } from "@formkit/core";
import { h, VNode } from "vue";
import { CraftNode, CraftNodeDatasource, isVisible } from "./craftNode";
import type { CraftNodeEventsDispatch } from "../components/composable/useCraftNodeEvents";
import CraftNodeResolver, { CraftNodeResolverMap } from "./CraftNodeResolver";

export interface RenderOptions<
  T extends FormKitSchemaDefinition = FormKitSchemaDefinition,
> {
  resolverMap: CraftNodeResolverMap<T>;
  componentRegistry?: Record<string, unknown>;
  nodeDataMap?: Record<string, CraftNodeDatasource | null>;
  eventsContext?: Record<string, unknown>;
}

function buildEventHandlers(
  node: CraftNode,
  eventsContext: Record<string, unknown>,
): Record<string, (...args: unknown[]) => void> {
  const dispatch = eventsContext.dispatch as CraftNodeEventsDispatch | undefined;
  if (!dispatch) return {};
  return Object.fromEntries(
    (node.interactions || [])
      .map((i) => i?.on)
      .filter((on): on is string => typeof on === "string" && !!on)
      .map((on) => [on, (...args: unknown[]) => dispatch(node, on, args, undefined, {})]),
  );
}

function computeDataChildren(
  node: CraftNode,
  data: CraftNodeDatasource,
  slotName: string = "default",
): CraftNode[] {
  if (!node.slots || !node.slots[slotName]) return [];

  const children = node.slots[slotName];

  if (data.type === "single") {
    return children.map((child) => ({
      ...child,
      uuid: `${child.uuid}-single`,
      props: { ...child.props, ...(data.item || {}) },
    }));
  }

  if (data.type === "list" && data.list) {
    return children.flatMap((child) =>
      data.list!.map((item, index) => ({
        ...child,
        uuid: `${child.uuid}-data-${index}`,
        props: { ...child.props, ...(item || {}) },
      })),
    );
  }

  return [];
}

export function renderCraftNodeToVNode<
  T extends FormKitSchemaDefinition = FormKitSchemaDefinition,
>(
  node: CraftNode,
  resolver: CraftNodeResolver<T>,
  componentRegistry?: Record<string, unknown>,
  nodeDataMap?: Record<string, CraftNodeDatasource | null>,
  eventsContext?: Record<string, unknown>,
): VNode | null {
  if (!isVisible(node)) {
    return null;
  }

  const resolved = resolver.resolveNode(node);
  const componentName = resolved?.componentName || node.componentName;
  const component = componentRegistry?.[componentName] || componentName;

  const props = {
    ...(resolved?.defaultProps || {}),
    ...node.props,
  };

  const eventHandlers = eventsContext
    ? buildEventHandlers(node, eventsContext)
    : {};

  const nodeData = nodeDataMap?.[node.uuid];
  let children: VNode[] | undefined;

  if (nodeData?.type) {
    const dataChildren = computeDataChildren(
      node,
      nodeData,
      nodeData.slotName || "default",
    );
    children = dataChildren
      .map((child) =>
        renderCraftNodeToVNode(
          child,
          resolver,
          componentRegistry,
          nodeDataMap,
          eventsContext,
        ),
      )
      .filter((v): v is VNode => v !== null);
  } else if (node.slots) {
    children = Object.values(node.slots)
      .flat()
      .map((child) =>
        renderCraftNodeToVNode(
          child,
          resolver,
          componentRegistry,
          nodeDataMap,
          eventsContext,
        ),
      )
      .filter((v): v is VNode => v !== null);
  }

  return h(component, { key: node.uuid, ...props, ...eventHandlers }, children);
}

export function renderCraftNodesToVNodes<
  T extends FormKitSchemaDefinition = FormKitSchemaDefinition,
>(nodes: CraftNode[], options: RenderOptions<T>): VNode[] {
  const resolver = new CraftNodeResolver(options.resolverMap);
  return nodes
    .map((node) =>
      renderCraftNodeToVNode(
        node,
        resolver,
        options.componentRegistry,
        options.nodeDataMap,
        options.eventsContext,
      ),
    )
    .filter((v): v is VNode => v !== null);
}
