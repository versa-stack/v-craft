import { CraftNode } from "../lib/craftNode";
import CraftCanvas from "./CraftCanvas.vue";
import CraftComponentSimpleText from "./CraftComponentSimpleText.vue";
import CraftEditor from "./CraftEditor.vue";
import CraftEditorBlueprint from "./CraftEditorBlueprint.vue";
import CraftEditorPanelBlueprints from "./CraftEditorPanelBlueprints.vue";
import CraftEditorPanelLayers from "./CraftEditorPanelLayers.vue";
import CraftEditorPanelLayout from "./CraftEditorPanelLayout.vue";
import CraftEditorPanelNodeEventsSettings from "./CraftEditorPanelNodeEventsSettings.vue";
import CraftEditorPanelNodeLayer from "./CraftEditorPanelNodeLayer.vue";
import CraftEditorPanelNodeSettings from "./CraftEditorPanelNodeSettings.vue";
import CraftEditorPanelSettings from "./CraftEditorPanelSettings.vue";
import CraftFrame from "./CraftFrame.vue";
import CraftNodeEditor from "./CraftNodeEditor.vue";
import CraftNodeViewer from "./CraftNodeViewer.vue";

export {
  CraftCanvas,
  CraftComponentSimpleText,
  CraftEditor,
  CraftEditorBlueprint,
  CraftEditorPanelBlueprints,
  CraftEditorPanelLayers,
  CraftEditorPanelLayout,
  CraftEditorPanelNodeEventsSettings,
  CraftEditorPanelNodeLayer,
  CraftEditorPanelNodeSettings,
  CraftEditorPanelSettings,
  CraftFrame,
  CraftNodeEditor,
  CraftNodeViewer,
};

export type CraftDataListItem<T extends object> = {
  dataItem: any;
  dataIndex: number;
  childNode: CraftNode<T>;
  childIndex: number;
  key: string;
};
