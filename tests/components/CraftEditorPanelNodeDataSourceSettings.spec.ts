import { mount } from "@vue/test-utils";
import { plugin, defaultConfig } from "@formkit/vue";
import { v4 as uuidv4 } from "uuid";
import { describe, expect, it } from "vitest";
import CraftEditorPanelNodeDataSourceSettings from "../../src/components/CraftEditorPanelNodeDataSourceSettings.vue";
import { CraftNode } from "../../src/lib/craftNode";

const waitForFormKitDebounce = () => new Promise((resolve) => setTimeout(resolve, 30));

const mountPanel = (props: Record<string, any>) =>
  mount(CraftEditorPanelNodeDataSourceSettings, {
    props,
    global: { plugins: [[plugin, defaultConfig()]] },
  });

describe("CraftEditorPanelNodeDataSourceSettings", () => {
  const craftNode: CraftNode = {
    uuid: uuidv4(),
    componentName: "CraftCanvas",
    props: {},
    slots: {},
  };

  it("emits a single-item datasource from valid JSON", async () => {
    const wrapper = mountPanel({ craftNode });

    await wrapper.find("textarea").setValue('{ "title": "Alice" }');
    await waitForFormKitDebounce();

    const emitted = wrapper.emitted("update:nodeData");
    expect(emitted).toBeTruthy();
    expect(emitted![emitted!.length - 1][0]).toEqual({
      type: "single",
      item: { title: "Alice" },
    });
  });

  it("emits a list datasource when type is set to list", async () => {
    const wrapper = mountPanel({ craftNode });

    await wrapper.find("select").setValue("list");
    await wrapper
      .find("textarea")
      .setValue('[{ "title": "Alice" }, { "title": "Bob" }]');
    await waitForFormKitDebounce();

    const emitted = wrapper.emitted("update:nodeData");
    expect(emitted![emitted!.length - 1][0]).toEqual({
      type: "list",
      list: [{ title: "Alice" }, { title: "Bob" }],
    });
  });

  it("shows an error and does not emit for invalid JSON", async () => {
    const wrapper = mountPanel({ craftNode });

    await wrapper.find("textarea").setValue("{ not valid json");
    await waitForFormKitDebounce();

    expect(wrapper.text()).toContain("Invalid JSON");
    expect(wrapper.emitted("update:nodeData")).toBeFalsy();
  });

  it("pre-fills the draft from an existing nodeData prop", () => {
    const wrapper = mountPanel({
      craftNode,
      nodeData: { type: "single", item: { title: "Existing" } },
    });

    expect(wrapper.find("textarea").element.value).toContain("Existing");
  });
});
