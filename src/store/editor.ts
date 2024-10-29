import type { FormKitSchemaFormKit } from "@formkit/core";
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { markRaw } from "vue";
import {
  CraftNode,
  craftNodeCanBeChildOf,
  craftNodeCanBeSiblingOf,
  CraftNodeDatasource,
  isVisible,
  resolveNodeName,
} from "../lib/craftNode";
import CraftNodeResolver from "../lib/CraftNodeResolver";

export type EditorState<T extends object> = {
  nodeMap: Map<string, CraftNode<T>>;
  rootNodes: string[];
  selectedUuid: string | null;
  draggedNode: CraftNode<T> | null;
  enabled: boolean;
  nodeRefsRecord: Record<string, HTMLElement>;
  resolver: CraftNodeResolver<T> | null;
  eventsContext: Record<string, any>;
  nodeDataMap: Record<string, CraftNodeDatasource | null>;
};

export type EditorStoreInstanceType<T extends object = FormKitSchemaFormKit> =
  ReturnType<ReturnType<typeof useEditor<T>>>;

export const useEditor = <T extends object = FormKitSchemaFormKit>() =>
  defineStore("editor", {
    state: (): EditorState<T> => ({
      nodeMap: new Map(),
      rootNodes: [],
      selectedUuid: null,
      draggedNode: null,
      enabled: false,
      nodeRefsRecord: {},
      resolver: null,
      eventsContext: {},
      nodeDataMap: {},
    }),

    actions: {
      clear() {
        this.nodeMap.clear();
        this.rootNodes = [];
        this.selectedUuid = null;
        this.draggedNode = null;
        this.nodeRefsRecord = {};
      },

      enable() {
        this.enabled = true;
      },

      disable() {
        this.enabled = false;
      },

      setResolver(resolver: CraftNodeResolver<T>) {
        this.resolver = resolver;
      },

      setNodeRef(craftNode: CraftNode<T>, ref: HTMLElement) {
        this.nodeRefsRecord[craftNode.uuid] = ref;
      },

      toggleNodeVisibility(craftNode: CraftNode<T>) {
        const node = this.nodeMap.get(craftNode.uuid);
        if (node) {
          node.visible = !isVisible(node);
          if (node.children) {
            const setVisibility = (n: CraftNode<T>) => {
              n.visible = node.visible;
              n.children?.map(setVisibility);
              this.nodeMap.set(n.uuid, n);
              return n;
            };
            node.children.map(setVisibility);
          }
          this.nodeMap.set(node.uuid, node);
        }
      },

      setNodeData(uuid: string, data: CraftNodeDatasource | null) {
        this.nodeDataMap[uuid] = data;
      },

      updateNodeProps(nodeUuid: string, newProps: Record<string, any>) {
        const node = this.nodeMap.get(nodeUuid);
        if (node) {
          Object.assign(node.props, newProps);
        }
      },

      updateNodeEvents(nodeUuid: string, newEvents: Record<string, string>) {
        const node = this.nodeMap.get(nodeUuid);
        if (node) {
          if (!node.events) {
            node.events = {};
          }
          Object.assign(node.events as any, newEvents);
        }
      },

      setNodes(nodes: CraftNode<T>[]) {
        this.clear();
        this.rootNodes = [];

        const addNode = (node: CraftNode<T>) => {
          this.nodeMap.set(node.uuid, { ...node, children: [] });
          if (!node.parentUuid) {
            this.rootNodes.push(node.uuid);
          }
          (node.children || []).forEach((child) => {
            child.parentUuid = node.uuid;
            addNode(child);
            this.nodeMap.get(node.uuid)!.children.push(child);
          });
        };

        nodes.forEach(addNode);
      },

      addNodeRecursively(node: CraftNode<T>, parentUuid: string | null = null) {
        const uuid = node.uuid || uuidv4();
        const newNode = { ...node, uuid, parentUuid };
        this.nodeMap.set(uuid, markRaw(newNode));

        if (!parentUuid) {
          this.rootNodes.push(uuid);
        }

        node.children?.forEach((child) => this.addNodeRecursively(child, uuid));
      },

      selectNode(craftNode: CraftNode<T> | null) {
        this.selectedUuid = craftNode?.uuid ?? null;
      },

      dragNode(craftNode: CraftNode<T> | null) {
        this.draggedNode = craftNode;
      },

      removeNode(craftNode: CraftNode<T>) {
        this.emancipateNode(craftNode);
        if (craftNode.uuid === this.selectedUuid) {
          this.selectedUuid = null;
        }

        const removeDescendants = (node: CraftNode<T>) => {
          node.children?.forEach((child) => {
            this.nodeMap.delete(child.uuid);
            delete this.nodeRefsRecord[child.uuid];
            removeDescendants(child);
          });
        };

        removeDescendants(craftNode);
        this.nodeMap.delete(craftNode.uuid);
        delete this.nodeRefsRecord[craftNode.uuid];

        if (!craftNode.parentUuid) {
          this.rootNodes = this.rootNodes.filter(
            (uuid) => uuid !== craftNode.uuid
          );
        }
      },

      emancipateNode(craftNode: CraftNode<T>) {
        const parentUuid = craftNode.parentUuid;
        if (!parentUuid) return craftNode;

        const parent = this.nodeMap.get(parentUuid);
        if (parent) {
          parent.children = parent.children?.filter(
            (child) => child.uuid !== craftNode.uuid
          );
        }

        craftNode.parentUuid = null;
        this.nodeMap.delete(craftNode.uuid);
        return craftNode;
      },

      addNodeAndChildrenToMap(node: CraftNode<T>) {
        this.nodeMap.set(node.uuid, node);
        node.children?.forEach((child) => this.addNodeAndChildrenToMap(child));
      },

      appendNodeTo(node: CraftNode<T>, targetNode: CraftNode<T>) {
        if (!this.resolver) throw new Error("Resolver is not set.");

        if (!craftNodeCanBeChildOf(node, targetNode, this.resolver)) {
          throw new Error(
            `${resolveNodeName(
              node
            )} is not allowed to be a child of ${resolveNodeName(targetNode)}.`
          );
        }

        node = this.emancipateNode(node);
        node.parentUuid = targetNode.uuid;

        const targetParent = this.nodeMap.get(targetNode.uuid);

        if (targetParent) {
          targetParent.children = targetParent.children || [];
          targetParent.children.push(node);
          this.nodeMap.set(targetParent.uuid, targetParent);
        }

        this.addNodeAndChildrenToMap(node);
      },

      prependNodeTo(node: CraftNode<T>, targetNode: CraftNode<T>) {
        if (!this.resolver) throw new Error("Resolver is not set");

        if (!craftNodeCanBeChildOf(node, targetNode, this.resolver)) {
          throw new Error(
            `${resolveNodeName(
              node
            )} is not allowed to be a child of ${resolveNodeName(targetNode)}.`
          );
        }

        node = this.emancipateNode(node);
        node.parentUuid = targetNode.uuid;

        const targetParent = this.nodeMap.get(targetNode.uuid);

        if (targetParent) {
          targetParent.children = targetParent.children || [];
          targetParent.children.unshift(node);
          this.nodeMap.set(targetParent.uuid, targetParent);
        }

        this.addNodeAndChildrenToMap(node);
      },

      insertNodeBefore(node: CraftNode<T>, targetNode: CraftNode<T>) {
        if (!this.resolver) throw new Error("Resolver is not set");

        if (!craftNodeCanBeSiblingOf(node, targetNode, this.resolver)) {
          throw new Error("Can not be the sibling of the target node.");
        }

        node = this.emancipateNode(node);

        const parentUuid = targetNode.parentUuid;

        if (!parentUuid) throw new Error("Target node has no parent.");

        const parent = this.nodeMap.get(parentUuid);

        if (parent) {
          const index =
            parent.children?.findIndex((n) => n.uuid === targetNode.uuid) ?? -1;

          if (index !== -1) {
            parent.children?.splice(index, 0, node);
            node.parentUuid = parentUuid;
            this.nodeMap.set(parent.uuid, parent);
            this.addNodeAndChildrenToMap(node);
          }
        }
      },

      insertNodeAfter(node: CraftNode<T>, targetNode: CraftNode<T>) {
        if (!this.resolver) throw new Error("Resolver is not set");

        if (!craftNodeCanBeSiblingOf(node, targetNode, this.resolver)) {
          throw new Error("Can not be the sibling of the target node.");
        }

        node = this.emancipateNode(node);

        const parentUuid = targetNode.parentUuid;

        if (!parentUuid) throw new Error("Target node has no parent.");

        const parent = this.nodeMap.get(parentUuid);

        if (parent) {
          const index =
            parent.children?.findIndex((n) => n.uuid === targetNode.uuid) ?? -1;

          if (index !== -1) {
            parent.children?.splice(index + 1, 0, node);
            node.parentUuid = parentUuid;
            this.nodeMap.set(parent.uuid, parent);
            this.addNodeAndChildrenToMap(node);
          }
        }
      },

      setEventsContext(context: Record<string, any>) {
        this.eventsContext = context;
      },
    },

    getters: {
      hasNodes: (state) => state.nodeMap.size > 0,
      selectedNode: (state): CraftNode<T> | null => {
        return state.selectedUuid
          ? state.nodeMap.get(state.selectedUuid) || null
          : null;
      },
      selectedRef: (state) =>
        state.selectedUuid ? state.nodeRefsRecord[state.selectedUuid] : null,
      getRef: (state) => (uuid: string) => state.nodeRefsRecord[uuid],
      allNodes: (state): CraftNode<T>[] => {
        return Array.from(state.nodeMap.values());
      },
      nodeTree: (state): CraftNode<T>[] => {
        const buildTree = (nodeUuid: string): CraftNode<T> => {
          const node = state.nodeMap.get(nodeUuid);
          if (!node) {
            throw new Error(`Node with UUID ${nodeUuid} not found`);
          }

          return {
            ...node,
            children: (node.children || []).map((child) =>
              buildTree(child.uuid)
            ),
          };
        };

        return state.rootNodes.map((rootUuid) => buildTree(rootUuid));
      },
    },
  });
