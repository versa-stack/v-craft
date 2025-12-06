import { describe, expect, it } from "vitest";
import { h, defineComponent, render as vueRender, createApp } from "vue";
import { renderCraftNodesToVNodes, renderCraftNodeToVNode } from "../../src/lib/renderCraftNodes";
import { CraftNode } from "../../src/lib/craftNode";
import { CraftNodeResolverMap } from "../../src/lib/CraftNodeResolver";
import CraftNodeResolver from "../../src/lib/CraftNodeResolver";

const TestComponent = defineComponent({
  name: "TestComponent",
  props: {
    text: { type: String, default: "" },
  },
  setup(props, { slots }) {
    return () => h("div", { class: "test-component" }, [props.text, slots.default?.()]);
  },
});

describe("renderCraftNodes", () => {
  const resolverMap: CraftNodeResolverMap<any> = {
    TestComponent: {
      componentName: "TestComponent",
      defaultProps: { text: "default" },
    },
  };

  describe("renderCraftNodeToVNode", () => {
    it("creates a VNode from a CraftNode", () => {
      const node: CraftNode = {
        uuid: "1",
        componentName: "TestComponent",
        props: { text: "Hello" },
        children: [],
      };

      const resolver = new CraftNodeResolver(resolverMap);
      const vnode = renderCraftNodeToVNode(node, resolver, { TestComponent });

      expect(vnode).not.toBeNull();
      expect(vnode!.type).toBe(TestComponent);
      expect(vnode!.props?.text).toBe("Hello");
      expect(vnode!.key).toBe("1");
    });

    it("merges default props with node props", () => {
      const node: CraftNode = {
        uuid: "1",
        componentName: "TestComponent",
        props: {},
        children: [],
      };

      const resolver = new CraftNodeResolver(resolverMap);
      const vnode = renderCraftNodeToVNode(node, resolver, { TestComponent });

      expect(vnode).not.toBeNull();
      expect(vnode!.props?.text).toBe("default");
    });

    it("node props override default props", () => {
      const node: CraftNode = {
        uuid: "1",
        componentName: "TestComponent",
        props: { text: "override" },
        children: [],
      };

      const resolver = new CraftNodeResolver(resolverMap);
      const vnode = renderCraftNodeToVNode(node, resolver, { TestComponent });

      expect(vnode).not.toBeNull();
      expect(vnode!.props?.text).toBe("override");
    });

    it("renders children recursively", () => {
      const node: CraftNode = {
        uuid: "1",
        componentName: "TestComponent",
        props: {},
        children: [
          {
            uuid: "2",
            componentName: "TestComponent",
            props: { text: "child" },
            children: [],
          },
        ],
      };

      const resolver = new CraftNodeResolver(resolverMap);
      const vnode = renderCraftNodeToVNode(node, resolver, { TestComponent });

      expect(vnode).not.toBeNull();
      expect(vnode!.children).toHaveLength(1);
      expect((vnode!.children as any[])[0].props?.text).toBe("child");
    });

    it("returns null for hidden nodes", () => {
      const node: CraftNode = {
        uuid: "1",
        componentName: "TestComponent",
        props: {},
        children: [],
        visible: false,
      };

      const resolver = new CraftNodeResolver(resolverMap);
      const vnode = renderCraftNodeToVNode(node, resolver, { TestComponent });

      expect(vnode).toBeNull();
    });
  });

  describe("renderCraftNodesToVNodes", () => {
    it("renders multiple nodes", () => {
      const nodes: CraftNode[] = [
        {
          uuid: "1",
          componentName: "TestComponent",
          props: { text: "First" },
          children: [],
        },
        {
          uuid: "2",
          componentName: "TestComponent",
          props: { text: "Second" },
          children: [],
        },
      ];

      const vnodes = renderCraftNodesToVNodes(nodes, {
        resolverMap,
        componentRegistry: { TestComponent },
      });

      expect(vnodes).toHaveLength(2);
      expect(vnodes[0].props?.text).toBe("First");
      expect(vnodes[1].props?.text).toBe("Second");
    });

    it("returns empty array for empty nodes", () => {
      const vnodes = renderCraftNodesToVNodes([], { resolverMap });
      expect(vnodes).toHaveLength(0);
    });
  });
});
