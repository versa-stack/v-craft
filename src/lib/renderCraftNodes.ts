import { h, VNode } from "vue";
import { CraftNode, CraftNodeDatasource, isVisible } from "./craftNode";
import CraftNodeResolver, { CraftNodeResolverMap } from "./CraftNodeResolver";

export interface RenderOptions<T extends object> {
  resolverMap: CraftNodeResolverMap<T>;
  componentRegistry?: Record<string, any>;
  nodeDataMap?: Record<string, CraftNodeDatasource | null>;
  eventsContext?: Record<string, any>;
}

function buildEventHandlers(
  node: CraftNode,
  eventsContext: Record<string, any>
): Record<string, (...args: any[]) => void> {
  const handlers: Record<string, (...args: any[]) => void> = {};

  if (!node.events || !Object.keys(node.events).length) {
    return handlers;
  }

  Object.entries(node.events).forEach(([eventName, eventCode]) => {
    if (!eventCode?.trim()) return;

    handlers[eventName] = (...args: any[]) => {
      try {
        const eventHandler = new Function("ctx", "craftNode", "args", eventCode);
        eventHandler(eventsContext, node, ...args);
      } catch (e) {
        console.error(`Event code execution failed with code:\n${eventCode}\n\nError:`, e);
      }
    };
  });

  return handlers;
}

function computeDataChildren(
  node: CraftNode,
  data: CraftNodeDatasource,
  slotName: string = 'default'
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
      }))
    );
  }

  return [];
}

export function renderCraftNodeToVNode<T extends object>(
  node: CraftNode,
  resolver: CraftNodeResolver<T>,
  componentRegistry?: Record<string, any>,
  nodeDataMap?: Record<string, CraftNodeDatasource | null>,
  eventsContext?: Record<string, any>
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

  const eventHandlers = eventsContext ? buildEventHandlers(node, eventsContext) : {};

  const nodeData = nodeDataMap?.[node.uuid];
  let children: VNode[] | undefined;

  if (nodeData?.type) {
    const dataChildren = computeDataChildren(node, nodeData, nodeData.slotName || 'default');
    children = dataChildren
      .map((child) => renderCraftNodeToVNode(child, resolver, componentRegistry, nodeDataMap, eventsContext))
      .filter((v): v is VNode => v !== null);
  } else if (node.slots) {
    children = Object.values(node.slots)
      .flat()
      .map((child) => renderCraftNodeToVNode(child, resolver, componentRegistry, nodeDataMap, eventsContext))
      .filter((v): v is VNode => v !== null);
  }

  return h(component, { key: node.uuid, ...props, ...eventHandlers }, children);
}

export function renderCraftNodesToVNodes<T extends object>(
  nodes: CraftNode[],
  options: RenderOptions<T>
): VNode[] {
  const resolver = new CraftNodeResolver(options.resolverMap);
  return nodes
    .map((node) =>
      renderCraftNodeToVNode(
        node,
        resolver,
        options.componentRegistry,
        options.nodeDataMap,
        options.eventsContext
      )
    )
    .filter((v): v is VNode => v !== null);
}
