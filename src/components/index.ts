import { CraftNode } from "../lib/craftNode";
import CraftCanvas from "./CraftCanvas.vue";
import CraftComponentSimpleText from "./CraftComponentSimpleText.vue";
import CraftEditor from "./CraftEditor.vue";
import CraftEditorBlueprint from "./CraftEditorBlueprint.vue";
import CraftEditorBlueprintsList from "./CraftEditorBlueprintsList.vue";
import CraftEditorPanelBlueprints from "./CraftEditorPanelBlueprints.vue";
import CraftEditorPanelForm from "./CraftEditorPanelForm.vue";
import CraftEditorPanelLayers from "./CraftEditorPanelLayers.vue";
import CraftEditorPanelLayout from "./CraftEditorPanelLayout.vue";
import CraftEditorPanelNodeEventsSettings from "./CraftEditorPanelNodeEventsSettings.vue";
import CraftEditorPanelNodeLayer from "./CraftEditorPanelNodeLayer.vue";
import CraftEditorPanelNodeSettings from "./CraftEditorPanelNodeSettings.vue";
import CraftEditorPanelSettings from "./CraftEditorPanelSettings.vue";
import CraftFrame from "./CraftFrame.vue";
import CraftNodeEditor from "./CraftNodeEditor.vue";
import CraftNodeViewer from "./CraftNodeViewer.vue";
import CraftIframe from "./CraftIframe.vue";
import CraftStaticRenderer from "./CraftStaticRenderer.vue";

import * as Utils from "./utils";

export {
  CraftCanvas,
  CraftComponentSimpleText,
  CraftEditor,
  CraftEditorBlueprint,
  CraftEditorBlueprintsList,
  CraftEditorPanelBlueprints,
  CraftEditorPanelForm,
  CraftEditorPanelLayers,
  CraftEditorPanelLayout,
  CraftEditorPanelNodeEventsSettings,
  CraftEditorPanelNodeLayer,
  CraftEditorPanelNodeSettings,
  CraftEditorPanelSettings,
  CraftFrame,
  CraftIframe,
  CraftNodeEditor,
  CraftNodeViewer,
  CraftStaticRenderer,
  Utils,
};

export type CraftDataListItem<T extends object> = {
  dataItem: any;
  dataIndex: number;
  childNode: CraftNode;
  childIndex: number;
  key: string;
};
