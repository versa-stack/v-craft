import { createPinia, setActivePinia } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, it } from "vitest";
import { CraftNodeResolver } from "../../src";
import { CraftNode } from "../../src/lib/craftNode";
import { useEditor } from "../../src/store/editor";

describe("useEditor", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const createTestNode = (
    overrides: Partial<CraftNode<any>> = {}
  ): CraftNode<any> => ({
    children: [],
    componentName: "TestComponent",
    props: {},
    uuid: uuidv4(),
    visible: true,
    ...overrides,
  });

  it("should initialize with empty state", () => {
    const store = useEditor()();
    expect(store.nodeMap.size).toBe(0);
    expect(store.rootNodes).toEqual([]);
    expect(store.selectedUuid).toBeNull();
    expect(store.draggedNode).toBeNull();
    expect(store.enabled).toBe(false);
    expect(store.nodeRefsRecord).toEqual({});
  });

  it("should set and clear nodes", () => {
    const store = useEditor()();
    const rootNode = createTestNode({ componentName: "CraftCanvas" });
    const childNode = createTestNode({ parentUuid: rootNode.uuid });
    rootNode.children = [childNode];

    store.setNodes([rootNode]);
    expect(store.nodeMap.size).toBe(2);
    expect(store.rootNodes).toEqual([rootNode.uuid]);

    store.clear();
    expect(store.nodeMap.size).toBe(0);
    expect(store.rootNodes).toEqual([]);
  });

  it("should toggle node visibility", () => {
    const store = useEditor()();
    const testNode = createTestNode();

    store.setNodes([testNode]);
    store.toggleNodeVisibility(testNode);

    const updatedNode = store.nodeMap.get(testNode.uuid);
    expect(updatedNode?.visible).toBe(false);
  });

  it("should update node props", () => {
    const store = useEditor()();
    const testNode = createTestNode({ props: { foo: "bar" } });

    store.setNodes([testNode]);
    store.updateNodeProps(testNode.uuid, { foo: "baz", newProp: 123 });

    const updatedNode = store.nodeMap.get(testNode.uuid);
    expect(updatedNode?.props).toEqual({ foo: "baz", newProp: 123 });
  });

  it("should select and drag nodes", () => {
    const store = useEditor()();
    const testNode = createTestNode();

    store.selectNode(testNode);
    expect(store.selectedUuid).toBe(testNode.uuid);

    store.dragNode(testNode);
    expect(store.draggedNode?.uuid).toBe(testNode.uuid);
  });

  it("should remove nodes", () => {
    const store = useEditor()();
    const parentNode = createTestNode({ componentName: "CraftCanvas" });
    const childNode = createTestNode({ parentUuid: parentNode.uuid });
    parentNode.children = [childNode];

    store.setNodes([parentNode]);
    store.removeNode(childNode);

    expect(store.nodeMap.has(childNode.uuid)).toBe(false);
    expect(store.nodeMap.get(parentNode.uuid)?.children).toEqual([]);
  });

  it("should append nodes", () => {
    const store = useEditor()();
    const resolver = new CraftNodeResolver<any>();
    store.setResolver(resolver);

    const parentNode = createTestNode({ componentName: "CraftCanvas" });
    const childNode = createTestNode();

    store.setNodes([parentNode]);
    store.appendNodeTo(childNode, parentNode);

    const updatedParent = store.nodeMap.get(parentNode.uuid);
    expect(updatedParent?.children[0].uuid).toBe(childNode.uuid);
    expect(store.nodeMap.get(childNode.uuid)?.parentUuid).toBe(parentNode.uuid);
  });

  it("should prepend nodes", () => {
    const store = useEditor()();
    const resolver = new CraftNodeResolver<any>();
    store.setResolver(resolver);

    const parentNode = createTestNode({ componentName: "CraftCanvas" });
    const existingChild = createTestNode({ parentUuid: parentNode.uuid });
    parentNode.children = [existingChild];
    const newChild = createTestNode();

    store.setNodes([parentNode, existingChild]);
    store.prependNodeTo(newChild, parentNode);

    const updatedParent = store.nodeMap.get(parentNode.uuid);
    expect(updatedParent?.children.map((c) => c.uuid)).toEqual([
      newChild.uuid,
      existingChild.uuid,
    ]);
  });

  it("should insert nodes before and after", () => {
    const store = useEditor()();
    const resolver = new CraftNodeResolver<any>();
    store.setResolver(resolver);

    const parentNode = createTestNode({ componentName: "CraftCanvas" });
    const child1 = createTestNode({ parentUuid: parentNode.uuid });
    const child2 = createTestNode({ parentUuid: parentNode.uuid });
    parentNode.children = [child1, child2];
    const newNode = createTestNode();

    store.setNodes([parentNode, child1, child2]);

    store.insertNodeBefore(newNode, child2);
    expect(
      store.nodeMap.get(parentNode.uuid)?.children.map((c) => c.uuid)
    ).toEqual([child1.uuid, newNode.uuid, child2.uuid]);

    const anotherNode = createTestNode();
    store.insertNodeAfter(anotherNode, child2);
    expect(
      store.nodeMap.get(parentNode.uuid)?.children.map((c) => c.uuid)
    ).toEqual([child1.uuid, newNode.uuid, child2.uuid, anotherNode.uuid]);
  });

  it("should handle events context", () => {
    const store = useEditor()();
    const context = { foo: "bar" };
    store.setEventsContext(context);
    expect(store.eventsContext).toEqual(context);
  });

  it("should return correct getters", () => {
    const store = useEditor()();
    const rootNode = createTestNode({ componentName: "CraftCanvas" });
    const childNode = createTestNode({ parentUuid: rootNode.uuid });
    rootNode.children = [childNode];

    store.setNodes([rootNode]);
    store.selectNode(childNode);

    expect(store.hasNodes).toBe(true);
    expect(store.selectedNode?.uuid).toBe(childNode.uuid);
    expect(store.allNodes.length).toBe(2);
    expect(store.nodeTree.length).toBe(1);
    expect(store.nodeTree[0].children.length).toBe(1);
  });

  it("should ensure nodeTree always represents the actual state of nodeMap", () => {
    const store = useEditor()();
    const resolver = new CraftNodeResolver<any>();
    store.setResolver(resolver);

    const rootNode = createTestNode({ componentName: "CraftCanvas" });
    const child1 = createTestNode({ parentUuid: rootNode.uuid });
    const child2 = createTestNode({ parentUuid: rootNode.uuid });
    const grandchild1 = createTestNode({ parentUuid: child1.uuid });
    rootNode.children = [child1, child2];
    child1.children = [grandchild1];

    store.setNodes([rootNode, child1, child2, grandchild1]);

    const verifyNodeTreeConsistency = (operation: string) => {
      const flattenTree = (nodes: CraftNode<any>[]): string[] => {
        return nodes.flatMap((node) => [
          node.uuid,
          ...flattenTree(node.children || []),
        ]);
      };

      const treeUuids = flattenTree(store.nodeTree);
      const mapUuids = Array.from(store.nodeMap.keys());
      expect(new Set(treeUuids)).toEqual(new Set(mapUuids));
      expect(treeUuids.length).toBe(mapUuids.length);
    };

    verifyNodeTreeConsistency("initial setup");

    store.removeNode(child2);
    verifyNodeTreeConsistency("removing child2");

    const newChild = createTestNode();
    store.appendNodeTo(newChild, rootNode);
    verifyNodeTreeConsistency("appending newChild");

    store.insertNodeBefore(grandchild1, child1);
    verifyNodeTreeConsistency("inserting grandchild1 before child1");

    store.updateNodeProps(child1.uuid, { testProp: "updated" });
    verifyNodeTreeConsistency("updating child1 props");

    store.toggleNodeVisibility(newChild);
    verifyNodeTreeConsistency("toggling newChild visibility");

    expect(store.nodeTree.length).toBe(1); // Root node
    expect(store.nodeTree[0].children.length).toBe(3); // grandchild1, child1, newChild
    expect(store.nodeTree[0].children[1].children.length).toBe(0); // child1 no longer has children
    expect(store.nodeMap.size).toBe(4); // root, grandchild1, child1, newChild
  });
});
