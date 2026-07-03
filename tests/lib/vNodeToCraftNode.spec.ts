import { beforeEach, describe, expect, it } from "vitest";
import { h } from "vue";
import { CraftNode } from "../../src/lib/craftNode";
import CraftNodeResolver from "../../src/lib/CraftNodeResolver";
import createNodeFromVNode from "../../src/lib/vNodeToCraftNode";
import { defaultResolvers } from "../../src/resolvers/default";

describe("vNodeToCraftNode", () => {
  let resolver: CraftNodeResolver<any>;

  beforeEach(() => {
    resolver = new CraftNodeResolver({
      CraftComponentSimpleText: defaultResolvers.CraftComponentSimpleText as any,
    });
  });

  const TestComponent = { name: "TestComponent" };

  describe("formatComponentName", () => {
    it("should return string for string type", () => {
      const vnode = h("div", {});
      const result = createNodeFromVNode(resolver, vnode);
      expect(result.componentName).toBe("div");
    });

    it("should return component name for object type with name", () => {
      const vnode = h(TestComponent, {});
      const result = createNodeFromVNode(resolver, vnode);
      expect(result.componentName).toBe("TestComponent");
    });

    it("should return 'anonymous' for object type without name", () => {
      const vnode = h({}, {});
      const result = createNodeFromVNode(resolver, vnode);
      expect(result.componentName).toBe("anonmymous");
    });
  });

  describe("createNodeFromVNode", () => {
    it("should create node with props", () => {
      const vnode = h(TestComponent, { text: "hello", count: 5 });
      const result = createNodeFromVNode(resolver, vnode);

      expect(result.props).toEqual({ text: "hello", count: 5 });
    });

    it("should generate UUID", () => {
      const vnode = h(TestComponent, {});
      const result = createNodeFromVNode(resolver, vnode);

      expect(result.uuid).toBeDefined();
      expect(result.uuid).toHaveLength(36);
    });

    it("should set parentUuid when parentNode provided", () => {
      const parentNode: CraftNode = {
        uuid: "parent-uuid",
        componentName: "Parent",
        props: {},
        slots: {},
      };
      const vnode = h(TestComponent, {});
      const result = createNodeFromVNode(resolver, vnode, parentNode);

      expect(result.parentUuid).toBe("parent-uuid");
    });

    it("should set parentUuid to null when parentNode not provided", () => {
      const vnode = h(TestComponent, {});
      const result = createNodeFromVNode(resolver, vnode);

      expect(result.parentUuid).toBeNull();
    });

    it("should initialize empty slots object", () => {
      const vnode = h(TestComponent, {});
      const result = createNodeFromVNode(resolver, vnode);

      expect(result.slots).toEqual({});
    });

    it("should handle array children in default slot", () => {
      const childVNode = h("div", {});
      const vnode = h(TestComponent, {}, () => [childVNode]);
      const result = createNodeFromVNode(resolver, vnode);

      expect(result.slots.default).toHaveLength(1);
      expect(result.slots.default[0].componentName).toBe("div");
    });

    it("should handle object children as named slots", () => {
      const childVNode = h("div", {});
      const vnode = h(TestComponent, {}, {
        header: () => [childVNode],
        footer: () => [],
      });
      const result = createNodeFromVNode(resolver, vnode);

      expect(result.slots.header).toHaveLength(1);
      expect(result.slots.header[0].componentName).toBe("div");
      expect(result.slots.footer).toHaveLength(0);
    });

    it("should handle nested children", () => {
      const grandchildVNode = h("span", {});
      const childVNode = h("div", {}, () => [grandchildVNode]);
      const vnode = h(TestComponent, {}, () => [childVNode]);
      const result = createNodeFromVNode(resolver, vnode);

      expect(result.slots.default).toHaveLength(1);
      expect(result.slots.default[0].slots.default).toHaveLength(1);
      expect(result.slots.default[0].slots.default[0].componentName).toBe("span");
    });

    it("should set parent UUID on nested children", () => {
      const childVNode = h("div", {});
      const vnode = h(TestComponent, {}, () => [childVNode]);
      const result = createNodeFromVNode(resolver, vnode);

      expect(result.slots.default[0].parentUuid).toBe(result.uuid);
    });

    it("should handle null children", () => {
      const vnode = h(TestComponent, {});
      vnode.children = null;
      const result = createNodeFromVNode(resolver, vnode);

      expect(result.slots).toEqual({});
    });

    it("should handle undefined children", () => {
      const vnode = h(TestComponent, {});
      (vnode as any).children = undefined;
      const result = createNodeFromVNode(resolver, vnode);

      expect(result.slots).toEqual({});
    });

    it("should handle empty array children", () => {
      const vnode = h(TestComponent, {}, []);
      const result = createNodeFromVNode(resolver, vnode);

      expect(result.slots.default).toHaveLength(0);
    });
  });
});
