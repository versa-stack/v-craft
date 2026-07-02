import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import CraftStaticRenderer from "../../src/components/CraftStaticRenderer.vue";
import CraftNodeStatic from "../../src/components/CraftNodeStatic.vue";
import CraftCanvas from "../../src/components/CraftCanvas.vue";
import { CraftNode } from "../../src/lib/craftNode";
import { CraftNodeResolverMap } from "../../src/lib/CraftNodeResolver";

const ScopedListComponent = defineComponent({
  name: "ScopedListComponent",
  setup(_, { slots }) {
    return () =>
      h("ul", { class: "scoped-list" }, [
        h(
          "li",
          {},
          slots.default?.({ item: { name: "Alice", role: "Admin" }, index: 3 }),
        ),
      ]);
  },
});

const TextComponent = defineComponent({
  name: "TextComponent",
  props: {
    label: { type: String, default: "" },
  },
  template: `<span class="text-component">{{ label }}</span>`,
});

const resolverMap: CraftNodeResolverMap<any> = {
  ScopedListComponent: {
    componentName: "ScopedListComponent",
    component: ScopedListComponent,
    slots: ["default"],
  },
  TextComponent: { componentName: "TextComponent", component: TextComponent },
};

describe("slot props context mapping", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("maps scoped slot props into a descendant's props via JSONPath", () => {
    const textNode: CraftNode = {
      uuid: uuidv4(),
      componentName: "TextComponent",
      props: {},
      slots: {},
      slotsPropsPropsMap: {
        default: { label: "$.item.name" },
      },
    };

    const listNode: CraftNode = {
      uuid: uuidv4(),
      componentName: "ScopedListComponent",
      props: {},
      slots: { default: [textNode] },
      slotsProps: { default: ["item", "index"] },
    };

    const wrapper = mount(CraftStaticRenderer, {
      props: { nodes: [listNode], resolverMap },
      global: {
        components: { CraftStaticRenderer, CraftNodeStatic, CraftCanvas },
      },
    });

    expect(wrapper.find(".text-component").text()).toBe("Alice");
  });

  it("does not override an explicitly set prop with a mapped context value", () => {
    const textNode: CraftNode = {
      uuid: uuidv4(),
      componentName: "TextComponent",
      props: { label: "Explicit" },
      slots: {},
      slotsPropsPropsMap: {
        default: { label: "$.item.name" },
      },
    };

    const listNode: CraftNode = {
      uuid: uuidv4(),
      componentName: "ScopedListComponent",
      props: {},
      slots: { default: [textNode] },
      slotsProps: { default: ["item", "index"] },
    };

    const wrapper = mount(CraftStaticRenderer, {
      props: { nodes: [listNode], resolverMap },
      global: {
        components: { CraftStaticRenderer, CraftNodeStatic, CraftCanvas },
      },
    });

    expect(wrapper.find(".text-component").text()).toBe("Explicit");
  });
});
