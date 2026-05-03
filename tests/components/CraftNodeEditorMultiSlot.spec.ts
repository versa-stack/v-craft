import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, it } from "vitest";
import { defineComponent, ref } from "vue";
import CraftCanvas from "../../src/components/CraftCanvas.vue";
import CraftNodeEditor from "../../src/components/CraftNodeEditor.vue";
import CraftNodeViewer from "../../src/components/CraftNodeViewer.vue";
import { CraftNode } from "../../src/lib/craftNode";
import CraftNodeResolver, {
  CraftNodeResolverMap,
} from "../../src/lib/CraftNodeResolver";
import CraftComponentSimpleText from "../../src/components/CraftComponentSimpleText.vue";
import { useEditor } from "../../src/store/editor";

const TwoSlotComponent = defineComponent({
  name: "TwoSlotComponent",
  template: `<div class="two-slot"><div class="header-slot"><slot name="header" /></div><div class="body-slot"><slot name="body" /></div></div>`,
});

const SingleSlotComponent = defineComponent({
  name: "SingleSlotComponent",
  template: `<div class="single-slot"><slot /></div>`,
});

const createMultiSlotCanvas = (
  headerChildren: CraftNode[] = [],
  bodyChildren: CraftNode[] = []
) => ({
  componentName: "CraftCanvas",
  props: { componentName: "TwoSlotComponent" },
  slots: {
    header: headerChildren,
    body: bodyChildren,
  },
  uuid: uuidv4(),
});

const createSingleSlotCanvas = (children: CraftNode[] = []) => ({
  componentName: "CraftCanvas",
  props: { componentName: "SingleSlotComponent" },
  slots: {
    default: children,
  },
  uuid: uuidv4(),
});

const createSimpleText = (content = "Hello") => ({
  componentName: "CraftComponentSimpleText",
  props: { content, componentName: "span" },
  slots: {},
  uuid: uuidv4(),
});

const baseResolverMap = (): CraftNodeResolverMap<any> => ({
  CraftCanvas: {
    componentName: "CraftCanvas",
  },
  TwoSlotComponent: {
    componentName: "TwoSlotComponent",
    slots: ["header", "body"],
  },
  SingleSlotComponent: {
    componentName: "SingleSlotComponent",
  },
});

const withSimpleText = (): CraftNodeResolverMap<any> => ({
  ...baseResolverMap(),
  CraftComponentSimpleText: {
    componentName: "CraftComponentSimpleText",
  },
});

const mountEditor = (craftNode: CraftNode, resolver: any, components: Record<string, any> = {}) =>
  mount(CraftNodeEditor, {
    props: { craftNode },
    global: {
      components: {
        CraftNodeViewer,
        CraftCanvas,
        CraftComponentSimpleText,
        TwoSlotComponent,
        SingleSlotComponent,
        ...components,
      },
      provide: { resolver },
    },
  });

const mountViewer = (craftNode: CraftNode, resolver: any, components: Record<string, any> = {}) =>
  mount(CraftNodeViewer, {
    props: { craftNode },
    global: {
      components: {
        CraftNodeViewer,
        CraftCanvas,
        CraftComponentSimpleText,
        TwoSlotComponent,
        SingleSlotComponent,
        ...components,
      },
      provide: { resolver },
    },
  });

describe("CraftNodeEditor - multi-slot components", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const editor = useEditor();
    editor.enable();
  });

  it("renders a CraftCanvas wrapping a multi-slot component", () => {
    const craftNode = createMultiSlotCanvas();
    const resolver = ref(new CraftNodeResolver(baseResolverMap()));

    const wrapper = mountEditor(craftNode as CraftNode, resolver);

    expect(wrapper.findComponent({ name: "CraftCanvas" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "TwoSlotComponent" }).exists()).toBe(true);
  });

  it("shows drop placeholders for each slot when empty", () => {
    const craftNode = createMultiSlotCanvas();
    const resolver = ref(new CraftNodeResolver(baseResolverMap()));

    const wrapper = mountEditor(craftNode as CraftNode, resolver);

    const placeholders = wrapper.findAll(".v-craft-drop-text");
    expect(placeholders.length).toBe(2);

    const slotNames = placeholders.map((p) => p.attributes("data-slot-name"));
    expect(slotNames).toContain("header");
    expect(slotNames).toContain("body");
  });

  it("shows only one drop placeholder when one slot is populated", async () => {
    const craftNode = createMultiSlotCanvas([createSimpleText("Header content") as CraftNode]);
    const resolver = ref(new CraftNodeResolver(withSimpleText()));

    const wrapper = mountEditor(craftNode as CraftNode, resolver);

    const placeholders = wrapper.findAll(".v-craft-drop-text");
    expect(placeholders.length).toBe(1);
    expect(placeholders[0].attributes("data-slot-name")).toBe("body");
  });

  it("shows no drop placeholders when all slots are populated", () => {
    const craftNode = createMultiSlotCanvas(
      [createSimpleText("Header") as CraftNode],
      [createSimpleText("Body") as CraftNode]
    );
    const resolver = ref(new CraftNodeResolver(withSimpleText()));

    const wrapper = mountEditor(craftNode as CraftNode, resolver);

    expect(wrapper.findAll(".v-craft-drop-text").length).toBe(0);
  });

  it("renders children in the correct slots", () => {
    const headerText = createSimpleText("In Header");
    const bodyText = createSimpleText("In Body");
    const craftNode = createMultiSlotCanvas(
      [headerText as CraftNode],
      [bodyText as CraftNode]
    );
    const resolver = ref(new CraftNodeResolver(withSimpleText()));

    const wrapper = mountEditor(craftNode as CraftNode, resolver);

    const twoSlot = wrapper.findComponent({ name: "TwoSlotComponent" });
    expect(twoSlot.find(".header-slot").text()).toContain("In Header");
    expect(twoSlot.find(".body-slot").text()).toContain("In Body");
  });

  it("single-slot component shows one default placeholder when empty", () => {
    const craftNode = createSingleSlotCanvas();
    const resolver = ref(new CraftNodeResolver(baseResolverMap()));

    const wrapper = mountEditor(craftNode as CraftNode, resolver);

    const placeholders = wrapper.findAll(".v-craft-drop-text");
    expect(placeholders.length).toBe(1);
    expect(placeholders[0].attributes("data-slot-name")).toBe("default");
  });

  it("availableSlots falls back to default for components with no resolver slots", () => {
    const craftNode = {
      componentName: "CraftCanvas",
      props: { componentName: "div" },
      slots: { default: [] },
      uuid: uuidv4(),
    };
    const resolver = ref(new CraftNodeResolver<any>({
      CraftCanvas: { componentName: "CraftCanvas" },
      div: { componentName: "div" },
    }));

    const wrapper = mountEditor(craftNode as CraftNode, resolver);

    const placeholders = wrapper.findAll(".v-craft-drop-text");
    expect(placeholders.length).toBe(1);
    expect(placeholders[0].attributes("data-slot-name")).toBe("default");
  });
});

describe("CraftNodeViewer - multi-slot components", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const editor = useEditor();
    editor.enable();
  });

  it("renders children in the correct slots", () => {
    const headerText = createSimpleText("In Header");
    const bodyText = createSimpleText("In Body");
    const craftNode = createMultiSlotCanvas(
      [headerText as CraftNode],
      [bodyText as CraftNode]
    );
    const resolver = ref(new CraftNodeResolver(withSimpleText()));

    const wrapper = mountViewer(craftNode as CraftNode, resolver);

    const twoSlot = wrapper.findComponent({ name: "TwoSlotComponent" });
    expect(twoSlot.find(".header-slot").text()).toContain("In Header");
    expect(twoSlot.find(".body-slot").text()).toContain("In Body");
  });

  it("renders single-slot component with children", () => {
    const childText = createSimpleText("Child content");
    const craftNode = createSingleSlotCanvas([childText as CraftNode]);
    const resolver = ref(new CraftNodeResolver(withSimpleText()));

    const wrapper = mountViewer(craftNode as CraftNode, resolver);

    const singleSlot = wrapper.findComponent({ name: "SingleSlotComponent" });
    expect(singleSlot.text()).toContain("Child content");
  });
});
