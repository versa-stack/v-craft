import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, it } from "vitest";
import CraftEditorPanelNodeSlotPropsSettings from "../../src/components/CraftEditorPanelNodeSlotPropsSettings.vue";
import { CraftNode } from "../../src/lib/craftNode";
import { useEditor } from "../../src/store/editor";

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
      slotsProps: { default: ["item", "index"] },
    };

    editor.setNodes([listNode]);
    textNode = editor.nodeMap.get(textNode.uuid)!;
  });

  it("offers the ancestor's exposed slot props as a mapping context option", async () => {
    const wrapper = mount(CraftEditorPanelNodeSlotPropsSettings, {
      props: { craftNode: textNode, availableSlots: ["default"] },
    });

    const addGroupButton = wrapper.findAll("button").find(
      (b) => b.text() === "+ Add mapping group",
    )!;
    await addGroupButton.trigger("click");

    const options = wrapper.findAll("option").map((o) => o.text());
    expect(options.some((o) => o.includes("default"))).toBe(true);
    expect(options.some((o) => o.includes("item, index"))).toBe(true);
    expect(options.some((o) => o.includes("ScopedListComponent"))).toBe(true);
  });

  it("emits update:slotsPropsPropsMap with the configured mapping", async () => {
    const wrapper = mount(CraftEditorPanelNodeSlotPropsSettings, {
      props: { craftNode: textNode, availableSlots: ["default"] },
    });

    await wrapper
      .findAll("button")
      .find((b) => b.text() === "+ Add mapping group")!
      .trigger("click");

    await wrapper.find("select").setValue("default");

    const inputs = wrapper.findAll("input");
    await inputs[inputs.length - 2].setValue("label");
    await inputs[inputs.length - 1].setValue("$.item.name");

    const emitted = wrapper.emitted("update:slotsPropsPropsMap");
    expect(emitted).toBeTruthy();
    expect(emitted![emitted!.length - 1][0]).toEqual({
      default: { label: "$.item.name" },
    });
  });

  it("offers known component props as a target-prop dropdown when availableProps is given", async () => {
    const wrapper = mount(CraftEditorPanelNodeSlotPropsSettings, {
      props: {
        craftNode: textNode,
        availableSlots: ["default"],
        availableProps: [
          { value: "label", label: "Label" },
          { value: "class", label: "CSS class(es)" },
        ],
      },
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

    const wrapper = mount(CraftEditorPanelNodeSlotPropsSettings, {
      props: {
        craftNode: nodeWithLegacyMapping,
        availableSlots: ["default"],
        availableProps: [{ value: "label", label: "Label" }],
      },
    });

    const targetPropSelect = wrapper.findAll("select")[1];
    expect(targetPropSelect.element.value).toBe("legacyProp");
    const optionValues = targetPropSelect
      .findAll("option")
      .map((o) => (o.element as HTMLOptionElement).value);
    expect(optionValues).toContain("legacyProp");
  });

  it("hides the Slot Context section when the component declares no slots", () => {
    const leafNode: CraftNode = {
      uuid: uuidv4(),
      componentName: "CraftComponentSimpleText",
      props: {},
      slots: {},
    };

    const wrapper = mount(CraftEditorPanelNodeSlotPropsSettings, {
      props: { craftNode: leafNode, availableSlots: [] },
    });

    expect(wrapper.text()).not.toContain("Slot Context");
    expect(wrapper.find(".v-craft-slot-props-row").exists()).toBe(false);
    // Props Mapping stays available regardless - a leaf node can still
    // consume an ancestor's exposed context.
    expect(wrapper.text()).toContain("Props Mapping");
  });

  it("shows the Slot Context section when availableSlots is non-empty", () => {
    const wrapper = mount(CraftEditorPanelNodeSlotPropsSettings, {
      props: { craftNode: textNode, availableSlots: ["default"] },
    });

    expect(wrapper.text()).toContain("Slot Context");
    expect(wrapper.find(".v-craft-slot-props-row").exists()).toBe(true);
  });

  it("emits update:slotsProps from the exposed-keys input", async () => {
    const listNode: CraftNode = {
      uuid: uuidv4(),
      componentName: "ScopedListComponent",
      props: {},
      slots: {},
    };

    const wrapper = mount(CraftEditorPanelNodeSlotPropsSettings, {
      props: { craftNode: listNode, availableSlots: ["default"] },
    });

    await wrapper.find("input").setValue("item, index");

    const emitted = wrapper.emitted("update:slotsProps");
    expect(emitted).toBeTruthy();
    expect(emitted![emitted!.length - 1][0]).toEqual({
      default: ["item", "index"],
    });
  });
});
