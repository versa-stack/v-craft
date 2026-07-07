import { FormKitSchemaDefinition } from "@formkit/core";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, it } from "vitest";
import { defineComponent, nextTick, ref } from "vue";
import CraftCanvas from "../../src/components/CraftCanvas.vue";
import CraftComponentSimpleText from "../../src/components/CraftComponentSimpleText.vue";
import CraftNodeEditor from "../../src/components/CraftNodeEditor.vue";
import CraftNodeViewer from "../../src/components/CraftNodeViewer.vue";
import { CraftNode } from "../../src/lib/craftNode";
import CraftNodeResolver, {
  CraftNodeResolverMap,
} from "../../src/lib/CraftNodeResolver";
import { defaultResolvers } from "../../src/resolvers/default";
import { useEditor } from "../../src/store/editor";

const createSimpleText = (
  content: string = "Hello World",
  componentName: string = "h1",
) => {
  return {
    componentName: "CraftComponentSimpleText",
    props: {
      content,
      componentName,
    },
    slots: {},
    uuid: uuidv4(),
  };
};

const createCanvas = <
  T extends FormKitSchemaDefinition = FormKitSchemaDefinition,
>(
  children: CraftNode[],
) => {
  return {
    componentName: "CraftCanvas",
    props: {
      componentName: "div",
    },
    slots: {
      default: children,
    },
    uuid: uuidv4(),
  };
};

const AsyncLeaf = defineComponent({
  name: "AsyncLeaf",
  template: `<div class="async-leaf">async leaf</div>`,
});

describe("CraftNodeEditor", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders the correct component based on the craftNode", async () => {
    const craftNode = ref(createSimpleText());

    const resolver = ref(
      new CraftNodeResolver({
        CraftComponentSimpleText: defaultResolvers.CraftComponentSimpleText,
      } as CraftNodeResolverMap<any>),
    );

    const wrapper = mount(CraftNodeEditor, {
      props: {
        craftNode: craftNode.value,
      },
      global: {
        components: {
          CraftNodeViewer,
          CraftComponentSimpleText,
        },
        provide: {
          resolver,
        },
      },
    });

    expect(
      wrapper.findComponent({ name: "CraftComponentSimpleText" }).exists(),
    ).toBe(true);
    expect(
      wrapper
        .findComponent({
          name: "CraftComponentSimpleText",
        })
        .element.tagName.toLowerCase(),
    ).toBe("h1");
    expect(wrapper.text()).toContain("Hello World");

    craftNode.value.props.componentName = "p";
    await nextTick();

    expect(
      wrapper
        .findComponent({
          name: "CraftComponentSimpleText",
        })
        .element.tagName.toLowerCase(),
    ).toBe("p");
  });

  it("renders the correct component tree based on craftNode", async () => {
    const craftNode = ref(createCanvas([createSimpleText()]));
    const editor = useEditor();
    editor.enable();

    const resolver = ref(
      new CraftNodeResolver({
        CraftComponentSimpleText: defaultResolvers.CraftComponentSimpleText,
        CraftCanvas: defaultResolvers.CraftCanvas,
        div: {
          componentName: "div",
        },
      } as CraftNodeResolverMap<any>),
    );

    const wrapper = mount(CraftNodeEditor, {
      props: {
        craftNode: craftNode.value,
      },
      global: {
        components: {
          CraftNodeViewer,
          CraftComponentSimpleText,
          CraftCanvas,
        },
        provide: {
          resolver,
        },
      },
    });

    expect(wrapper.findComponent({ name: "CraftCanvas" }).exists()).toBe(true);

    expect(
      wrapper.findComponent({ name: "CraftComponentSimpleText" }).exists(),
    ).toBe(true);

    expect(
      wrapper
        .findComponent({
          name: "CraftComponentSimpleText",
        })
        .element.tagName.toLowerCase(),
    ).toBe("h1");
    expect(wrapper.text()).toContain("Hello World");

    craftNode.value.slots.default[0].props.componentName = "p";
    await nextTick();

    expect(
      wrapper
        .findComponent({
          name: "CraftComponentSimpleText",
        })
        .element.tagName.toLowerCase(),
    ).toBe("p");
  });

  it("sets the CraftNode to selected when clicked.", async () => {
    const editor = useEditor();
    editor.enable();
    await nextTick();

    const simpleText = createSimpleText();
    editor.setNodes([simpleText]);
    const craftNode = ref<CraftNode | null>(
      editor.nodeMap.get(simpleText.uuid) || null,
    );

    if (!craftNode) {
      throw Error("Craft node was not found.");
    }

    const resolver = ref(
      new CraftNodeResolver<any>({
        CraftComponentSimpleText: defaultResolvers.CraftComponentSimpleText,
      }),
    );

    const wrapper = mount(CraftNodeEditor, {
      props: {
        craftNode: craftNode.value as CraftNode,
      },
      global: {
        components: {
          CraftComponentSimpleText,
          CraftNodeViewer,
        },
        provide: {
          craftNode,
          resolver,
        },
      },
    });

    const node = wrapper.findComponent({ name: "CraftComponentSimpleText" });
    await node.trigger("click");

    expect(editor.selectedNode?.uuid).toBe(simpleText.uuid);
    expect(node.classes()).toContain("v-craft-node-selected");
  });

  it("does not render slot templates for non-canvas nodes with empty slots", () => {
    const craftNode = ref({
      componentName: "div",
      props: {},
      slots: { default: [] },
      uuid: uuidv4(),
    });

    const resolver = ref(
      new CraftNodeResolver({
        div: { componentName: "div" },
      } as CraftNodeResolverMap<any>),
    );

    const wrapper = mount(CraftNodeEditor, {
      props: {
        craftNode: craftNode.value,
      },
      global: {
        components: {
          CraftNodeViewer,
        },
        provide: {
          resolver,
        },
      },
    });

    expect(wrapper.find("div").exists()).toBe(true);
    expect(wrapper.findAllComponents({ name: "CraftNodeViewer" })).toHaveLength(
      0,
    );
  });

  it("renders slot templates for canvas nodes with empty slots", () => {
    const craftNode = ref(createCanvas([]));
    const editor = useEditor();
    editor.enable();

    const resolver = ref(
      new CraftNodeResolver({
        CraftCanvas: defaultResolvers.CraftCanvas,
        div: { componentName: "div" },
      } as CraftNodeResolverMap<any>),
    );

    const wrapper = mount(CraftNodeEditor, {
      props: {
        craftNode: craftNode.value,
      },
      global: {
        components: {
          CraftNodeViewer,
          CraftCanvas,
        },
        provide: {
          resolver,
        },
      },
    });

    expect(wrapper.findComponent({ name: "CraftCanvas" }).exists()).toBe(true);
    expect(wrapper.find(".v-craft-drop-text").exists()).toBe(true);
  });

  it("renders drop text for HTML canvas elements with empty slots", () => {
    const craftNode = ref({
      componentName: "CraftCanvas",
      props: {
        componentName: "footer",
      },
      slots: {
        default: [],
      },
      uuid: uuidv4(),
    });
    const editor = useEditor();
    editor.enable();

    const resolver = ref(
      new CraftNodeResolver({
        CraftCanvas: defaultResolvers.CraftCanvas,
        footer: {
          componentName: "craftCanvas",
          props: { componentName: "footer" },
          slots: ["default"],
        },
      } as CraftNodeResolverMap<any>),
    );

    const wrapper = mount(CraftNodeEditor, {
      props: {
        craftNode: craftNode.value,
      },
      global: {
        components: {
          CraftNodeViewer,
          CraftCanvas,
        },
        provide: {
          resolver,
        },
      },
    });

    expect(wrapper.find("footer").exists()).toBe(true);
    expect(wrapper.find(".v-craft-drop-text").exists()).toBe(true);
  });

  it("does NOT render drop text for HTML canvas elements without slots property", () => {
    const craftNode = ref({
      componentName: "CraftCanvas",
      props: {
        componentName: "footer",
      },
      uuid: uuidv4(),
      slots: {
      },
    });
    const editor = useEditor();
    editor.enable();

    const resolver = ref(
      new CraftNodeResolver({
        CraftCanvas: defaultResolvers.CraftCanvas,
        footer: {
          componentName: "CraftCanvas",
          props: { componentName: "footer" },
          slots: ["default"],
        },
      } as CraftNodeResolverMap<any>),
    );

    const wrapper = mount(CraftNodeEditor, {
      props: {
        craftNode: craftNode.value,
      },
      global: {
        components: {
          CraftNodeViewer,
          CraftCanvas,
        },
        provide: {
          resolver,
        },
      },
    });

    expect(wrapper.find("footer").exists()).toBe(true);
    expect(wrapper.find(".v-craft-drop-text").exists()).toBe(false);
  });

  it("renders slot templates for non-canvas nodes with non-empty slots", () => {
    const craftNode = ref({
      componentName: "div",
      props: {},
      slots: { default: [createSimpleText()] },
      uuid: uuidv4(),
    });

    const resolver = ref(
      new CraftNodeResolver({
        div: { componentName: "div" },
        CraftComponentSimpleText: defaultResolvers.CraftComponentSimpleText,
      } as CraftNodeResolverMap<any>),
    );

    const wrapper = mount(CraftNodeEditor, {
      props: {
        craftNode: craftNode.value,
      },
      global: {
        components: {
          CraftNodeViewer,
          CraftComponentSimpleText,
        },
        provide: {
          resolver,
        },
      },
    });

    expect(wrapper.find("div").exists()).toBe(true);
    expect(
      wrapper.findComponent({ name: "CraftComponentSimpleText" }).exists(),
    ).toBe(true);
  });

  it("does not render slot templates for void HTML elements with empty slots", () => {
    const craftNode = ref({
      componentName: "img",
      props: { src: "https://example.com/image.jpg", class: "w-full" },
      slots: { default: [] },
      uuid: uuidv4(),
    });

    const resolver = ref(
      new CraftNodeResolver({
        img: { componentName: "img" },
      } as CraftNodeResolverMap<any>),
    );

    const wrapper = mount(CraftNodeEditor, {
      props: {
        craftNode: craftNode.value,
      },
      global: {
        components: {
          CraftNodeViewer,
        },
        provide: {
          resolver,
        },
      },
    });

    expect(wrapper.find("img").exists()).toBe(true);
    expect(wrapper.findAllComponents({ name: "CraftNodeViewer" })).toHaveLength(
      0,
    );
  });

  it("renders a node from an async component factory", async () => {
    const craftNode = ref({
      componentName: "AsyncLeaf",
      props: {},
      slots: {},
      uuid: uuidv4(),
    });

    const resolver = ref(
      new CraftNodeResolver({
        AsyncLeaf: {
          componentName: "AsyncLeaf",
          component: () => Promise.resolve(AsyncLeaf),
        },
      } as CraftNodeResolverMap<any>),
    );

    const wrapper = mount(CraftNodeEditor, {
      props: { craftNode: craftNode.value },
      global: {
        components: { CraftNodeViewer },
        provide: { resolver },
      },
    });

    await flushPromises();

    expect(wrapper.find(".async-leaf").exists()).toBe(true);
    expect(wrapper.text()).toBe("async leaf");
  });

  it("renders child nodes inside an async parent component", async () => {
    const editor = useEditor();
    editor.enable();

    const AsyncParent = defineComponent({
      name: "AsyncParent",
      template: `<div class="async-parent"><slot /></div>`,
    });

    const craftNode = ref({
      componentName: "AsyncParent",
      props: {},
      slots: {
        default: [
          {
            componentName: "AsyncLeaf",
            props: {},
            slots: {},
            uuid: uuidv4(),
          },
        ],
      },
      uuid: uuidv4(),
    });

    const resolver = ref(
      new CraftNodeResolver({
        AsyncParent: {
          componentName: "AsyncParent",
          component: () => Promise.resolve(AsyncParent),
        },
        AsyncLeaf: {
          componentName: "AsyncLeaf",
          component: () => Promise.resolve(AsyncLeaf),
        },
      } as CraftNodeResolverMap<any>),
    );

    const wrapper = mount(CraftNodeEditor, {
      props: { craftNode: craftNode.value },
      global: {
        components: { CraftNodeViewer, CraftNodeEditor },
        provide: { resolver },
      },
    });

    await flushPromises();

    expect(wrapper.find(".async-parent").exists()).toBe(true);
    expect(wrapper.find(".async-leaf").exists()).toBe(true);
  });

  it("uses custom component resolution hook when provided", async () => {
    const CustomComponent = defineComponent({
      name: "CustomComponent",
      template: `<div class="custom-hook">custom hook</div>`,
    });

    const craftNode = ref({
      componentName: "CustomComponent",
      props: {},
      slots: {},
      uuid: uuidv4(),
    });

    const resolver = ref(
      new CraftNodeResolver({
        CustomComponent: { componentName: "CustomComponent" },
      } as CraftNodeResolverMap<any>),
    );

    resolver.value.onResolveComponent((craftNode, defaultResolver) => {
      if (craftNode.componentName === "CustomComponent") {
        return CustomComponent;
      }
      return defaultResolver(craftNode.componentName);
    });

    const wrapper = mount(CraftNodeEditor, {
      props: { craftNode: craftNode.value },
      global: {
        components: { CraftNodeViewer },
        provide: { resolver },
      },
    });

    expect(wrapper.find(".custom-hook").exists()).toBe(true);
    expect(wrapper.text()).toBe("custom hook");
  });

  it("falls back to default resolver when hook returns undefined", async () => {
    const DefaultComponent = defineComponent({
      name: "DefaultComponent",
      template: `<div class="default">default</div>`,
    });

    const craftNode = ref({
      componentName: "DefaultComponent",
      props: {},
      slots: {},
      uuid: uuidv4(),
    });

    const resolver = ref(
      new CraftNodeResolver({
        DefaultComponent: {
          componentName: "DefaultComponent",
          component: DefaultComponent,
        },
      } as CraftNodeResolverMap<any>),
    );

    resolver.value.onResolveComponent((craftNode, defaultResolver) => {
      if (craftNode.componentName === "NonExistent") {
        return DefaultComponent;
      }
      return defaultResolver(craftNode.componentName);
    });

    const wrapper = mount(CraftNodeEditor, {
      props: { craftNode: craftNode.value },
      global: {
        components: { CraftNodeViewer },
        provide: { resolver },
      },
    });

    expect(wrapper.find(".default").exists()).toBe(true);
    expect(wrapper.text()).toBe("default");
  });

  it("renders drop text for canvas nodes with empty slots when content is loaded", async () => {
    const MultiSlotComponent = defineComponent({
      name: "MultiSlotComponent",
      template: `
        <div>
          <header><slot name="header" /></header>
          <main><slot name="body" /></main>
        </div>
      `,
    });

    const craftNode = ref({
      componentName: "CraftCanvas",
      props: {
        componentName: "MultiSlotComponent",
      },
      slots: {
        header: [],
        body: [],
      },
      uuid: uuidv4(),
    });

    const resolver = ref(
      new CraftNodeResolver({
        ...defaultResolvers,
        MultiSlotComponent: {
          componentName: "MultiSlotComponent",
          slots: ["header", "body"],
        },
      } as CraftNodeResolverMap<any>),
    );

    const wrapper = mount(CraftNodeEditor, {
      props: { craftNode: craftNode.value },
      global: {
        components: { CraftNodeViewer, MultiSlotComponent, CraftCanvas },
        provide: { resolver },
      },
    });

    await flushPromises();
    await nextTick();

    // Verify drop text is rendered in both slots
    const dropTextElements = wrapper.findAll(".v-craft-drop-text");
    expect(dropTextElements.length).toBe(2);

    // Verify drop text has correct slot names
    const headerDropText = dropTextElements.find(
      (el) => el.attributes("data-slot-name") === "header",
    );
    const bodyDropText = dropTextElements.find(
      (el) => el.attributes("data-slot-name") === "body",
    );

    expect(headerDropText).toBeDefined();
    expect(bodyDropText).toBeDefined();
    expect(headerDropText?.text()).toContain("Drop a component here");
    expect(headerDropText?.text()).toContain("header");
    expect(bodyDropText?.text()).toContain("Drop a component here");
    expect(bodyDropText?.text()).toContain("body");
  });

  it("renders drop text for canvas node with default slot when content is loaded", async () => {
    const craftNode = ref({
      componentName: "CraftCanvas",
      props: {
        componentName: "div",
      },
      slots: {
        default: [],
      },
      uuid: uuidv4(),
    });

    const resolver = ref(
      new CraftNodeResolver({
        ...defaultResolvers,
      } as CraftNodeResolverMap<any>),
    );

    const wrapper = mount(CraftNodeEditor, {
      props: { craftNode: craftNode.value },
      global: {
        components: { CraftNodeViewer, CraftCanvas },
        provide: { resolver },
      },
    });

    await flushPromises();
    await nextTick();

    // Verify drop text is rendered in default slot
    const dropTextElement = wrapper.find(".v-craft-drop-text");
    expect(dropTextElement.exists()).toBe(true);
    expect(dropTextElement.attributes("data-slot-name")).toBe("default");
    expect(dropTextElement.text()).toContain("Drop a component here");
    expect(dropTextElement.text()).toContain("default");
  });

  describe("runtime event ctx via the editor store (nodeValues, setNodeProps, state, getNode)", () => {
    const mountNode = (
      craftNode: CraftNode,
      resolverMap: CraftNodeResolverMap<any>,
    ) =>
      mount(CraftNodeEditor, {
        props: { craftNode },
        global: {
          components: { CraftNodeViewer, CraftComponentSimpleText },
          provide: { resolver: ref(new CraftNodeResolver(resolverMap)) },
        },
      });

    it("captures a native input's typed value and exposes it to another node's click handler via ctx.nodeValues, resolving the target through ctx.getNode", async () => {
      const editor = useEditor();
      editor.enable();

      const inputNode = { uuid: uuidv4(), componentName: "input", props: {}, slots: {} };
      const outputNode = createSimpleText("before", "span");
      const triggerNode = {
        ...createSimpleText("trigger", "button"),
        events: {
          click: `if (ctx.getNode("${outputNode.uuid}") && Object.keys(ctx.getNodes() || {}).length > 0) ctx.setNodeProps("${outputNode.uuid}", { content: ctx.nodeValues["${inputNode.uuid}"]?.value ?? "" })`,
        },
      };

      editor.setNodes([inputNode, outputNode, triggerNode]);

      const resolverMap: CraftNodeResolverMap<any> = {
        ...defaultResolvers,
        input: { componentName: "input" },
      };

      const inputWrapper = mountNode(
        editor.nodeMap.get(inputNode.uuid)!,
        resolverMap,
      );
      const outputWrapper = mountNode(
        editor.nodeMap.get(outputNode.uuid)!,
        resolverMap,
      );
      const triggerWrapper = mountNode(
        editor.nodeMap.get(triggerNode.uuid)!,
        resolverMap,
      );

      await inputWrapper.find("input").setValue("typed value");
      await triggerWrapper.trigger("click");
      await nextTick();

      expect(outputWrapper.text()).toBe("typed value");
    });

    it("shares ctx.state across separately mounted nodes", async () => {
      const editor = useEditor();
      editor.enable();

      const counterNode = createSimpleText("0", "span");
      const makeIncrementNode = () => ({
        ...createSimpleText("click", "button"),
        events: {
          click: `ctx.state.count = (ctx.state.count || 0) + 1; ctx.setNodeProps("${counterNode.uuid}", { content: String(ctx.state.count) })`,
        },
      });
      const firstNode = makeIncrementNode();
      const secondNode = makeIncrementNode();

      editor.setNodes([counterNode, firstNode, secondNode]);

      const resolverMap: CraftNodeResolverMap<any> = { ...defaultResolvers };
      const counterWrapper = mountNode(
        editor.nodeMap.get(counterNode.uuid)!,
        resolverMap,
      );
      const firstWrapper = mountNode(
        editor.nodeMap.get(firstNode.uuid)!,
        resolverMap,
      );
      const secondWrapper = mountNode(
        editor.nodeMap.get(secondNode.uuid)!,
        resolverMap,
      );

      await firstWrapper.trigger("click");
      await secondWrapper.trigger("click");
      await nextTick();

      expect(counterWrapper.text()).toBe("2");
    });
  });
});
