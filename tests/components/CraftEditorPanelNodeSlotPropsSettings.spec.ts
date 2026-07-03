import { mount } from "@vue/test-utils";
import { plugin, defaultConfig } from "@formkit/vue";
import { createPinia, setActivePinia } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { computed } from "vue";
import { beforeEach, describe, expect, it } from "vitest";
import CraftEditorPanelNodeSlotPropsSettings from "../../src/components/CraftEditorPanelNodeSlotPropsSettings.vue";
import CraftNodeResolver from "../../src/lib/CraftNodeResolver";
import { CraftNode } from "../../src/lib/craftNode";
import { useEditor } from "../../src/store/editor";

const resolver = computed(
  () =>
    new CraftNodeResolver({
      ScopedListComponent: {
        componentName: "ScopedListComponent",
        slotsProps: { default: ["item", "index"] },
      },
      TextComponent: { componentName: "TextComponent" },
    }),
);

const mountPanel = (props: Record<string, any>) =>
  mount(CraftEditorPanelNodeSlotPropsSettings, {
    props,
    global: {
      plugins: [[plugin, defaultConfig()]],
      provide: { resolver },
    },
  });

// FormKit text/select inputs debounce their input event (20ms by default)
// before committing the value, so tests must wait past that before
// asserting on emitted events.
const waitForFormKitDebounce = () => new Promise((resolve) => setTimeout(resolve, 30));

describe("CraftEditorPanelNodeSlotPropsSettings", () => {
  let editor: ReturnType<typeof useEditor>;
  let textNode: CraftNode;

  beforeEach(() => {
    setActivePinia(createPinia());
    editor = useEditor();

    textNode = {
      uuid: uuidv4(),
      componentName: "TextComponent",
      props: {},
      slots: {},
    };

    const listNode: CraftNode = {
      uuid: uuidv4(),
      componentName: "ScopedListComponent",
      props: {},
      slots: { default: [textNode] },
    };

    editor.setNodes([listNode]);
    textNode = editor.nodeMap.get(textNode.uuid)!;
  });

  it("offers the ancestor's resolver-declared slot props as a mapping context option", async () => {
    const wrapper = mountPanel({ craftNode: textNode });

    const addGroupButton = wrapper
      .findAll("button")
      .find((b) => b.text() === "+ Add mapping group")!;
    await addGroupButton.trigger("click");

    const options = wrapper.findAll("option").map((o) => o.text());
    expect(options.some((o) => o.includes("default"))).toBe(true);
    expect(options.some((o) => o.includes("item, index"))).toBe(true);
    expect(options.some((o) => o.includes("ScopedListComponent"))).toBe(true);
  });

  it("emits update:slotsPropsPropsMap with the configured mapping", async () => {
    const wrapper = mountPanel({ craftNode: textNode });

    await wrapper
      .findAll("button")
      .find((b) => b.text() === "+ Add mapping group")!
      .trigger("click");

    await wrapper.find("select").setValue("default");

    const inputs = wrapper.findAll("input");
    await inputs[inputs.length - 2].setValue("label");
    await inputs[inputs.length - 1].setValue("$.item.name");
    await waitForFormKitDebounce();

    const emitted = wrapper.emitted("update:slotsPropsPropsMap");
    expect(emitted).toBeTruthy();
    expect(emitted![emitted!.length - 1][0]).toEqual({
      default: { label: "$.item.name" },
    });
  });

  it("offers known component props as a target-prop dropdown when availableProps is given", async () => {
    const wrapper = mountPanel({
      craftNode: textNode,
      availableProps: [
        { value: "label", label: "Label" },
        { value: "class", label: "CSS class(es)" },
      ],
    });

    await wrapper
      .findAll("button")
      .find((b) => b.text() === "+ Add mapping group")!
      .trigger("click");

    const selects = wrapper.findAll("select");
    expect(selects).toHaveLength(2); // context bucket + target prop
    const targetPropSelect = selects[1];
    const optionLabels = targetPropSelect.findAll("option").map((o) => o.text());
    expect(optionLabels).toContain("Label");
    expect(optionLabels).toContain("CSS class(es)");

    // No free-text input should exist for the target prop anymore.
    expect(wrapper.find("input[placeholder='target prop']").exists()).toBe(
      false,
    );

    await targetPropSelect.setValue("class");
    await wrapper.find("input[placeholder='\$.item.name']").setValue("$.item.name");
    await wrapper.find("select").setValue("default");
    await waitForFormKitDebounce();

    const emitted = wrapper.emitted("update:slotsPropsPropsMap");
    expect(emitted![emitted!.length - 1][0]).toEqual({
      default: { class: "$.item.name" },
    });
  });

  it("preserves a legacy target prop value not present in availableProps", async () => {
    const nodeWithLegacyMapping: CraftNode = {
      ...textNode,
      slotsPropsPropsMap: { default: { legacyProp: "$.item.name" } },
    };

    const wrapper = mountPanel({
      craftNode: nodeWithLegacyMapping,
      availableProps: [{ value: "label", label: "Label" }],
    });

    const targetPropSelect = wrapper.findAll("select")[1];
    expect(targetPropSelect.element.value).toBe("legacyProp");
    const optionValues = targetPropSelect
      .findAll("option")
      .map((o) => (o.element as HTMLOptionElement).value);
    expect(optionValues).toContain("legacyProp");
  });

  it("does not render a Slot Context section - slotsProps is resolver-owned, not editable per instance", () => {
    const wrapper = mountPanel({ craftNode: textNode });

    expect(wrapper.text()).not.toContain("Slot Context");
    expect(wrapper.text()).toContain("Props Mapping");
  });

  it("offers the reserved data bucket when an ancestor has a nodeDataMap entry", async () => {
    editor.setNodeData(
      editor.nodeMap.get(textNode.parentUuid!)!.uuid,
      { type: "single", item: { title: "Alice", price: 9.99 } },
    );

    const wrapper = mountPanel({ craftNode: textNode });

    await wrapper
      .findAll("button")
      .find((b) => b.text() === "+ Add mapping group")!
      .trigger("click");

    const options = wrapper.findAll("option").map((o) => o.text());
    expect(options.some((o) => o.includes("data"))).toBe(true);
    expect(options.some((o) => o.includes("title, price"))).toBe(true);
  });
});
