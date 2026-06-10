import { v4 as uuidv4 } from "uuid";
import type { CraftNode } from "./craftNode";
import type CraftNodeResolver from "./CraftNodeResolver";
import type { FormKitSchemaDefinition } from "@formkit/core";

const formatComponentName = (vNode) => {
  if (typeof vNode.type === "symbol") {
    return "Fragment";
  }

  if (typeof vNode.type === "string") {
    return vNode.type;
  }

  if (vNode.type.name) {
    return vNode.type.name;
  }

  return "anonmymous";
};

const createNodeFromVNode = <
  T extends FormKitSchemaDefinition = FormKitSchemaDefinition,
>(
  resolver: CraftNodeResolver<T>,
  vNode,
  parentNode: CraftNode | null = null,
) => {
  const componentName = formatComponentName(vNode);
  const { props } = vNode;
  const craftNode: CraftNode = {
    componentName,
    props,
    slots: {},
    parentUuid: parentNode?.uuid ?? null,
    uuid: uuidv4(),
  };

  if (vNode.children) {
    if (typeof vNode.children === "object" && !Array.isArray(vNode.children)) {
      Object.entries(vNode.children).forEach(([slotName, slotFn]) => {
        if (typeof slotFn === "function") {
          const slotChildren = slotFn();
          if (slotChildren) {
            craftNode.slots[slotName] = createChildren<T>(
              resolver,
              slotChildren,
              craftNode,
            );
          }
        }
      });
    } else if (Array.isArray(vNode.children)) {
      craftNode.slots.default = createChildren<T>(
        resolver,
        vNode.children,
        craftNode,
      );
    }
  }

  return craftNode;
};

const createChildren = <
  T extends FormKitSchemaDefinition = FormKitSchemaDefinition,
>(
  resolver,
  vnodeChildren,
  parent,
) => {
  if (!vnodeChildren || !(vnodeChildren instanceof Array))
    return [] as unknown as CraftNode[];
  return vnodeChildren
    .map((childVNode) => createNodeFromVNode<T>(resolver, childVNode, parent))
    .filter((childNode) => !!childNode) as CraftNode[];
};

export default createNodeFromVNode;
