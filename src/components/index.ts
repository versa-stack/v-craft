import { CraftNode } from "../lib/craftNode";
import CraftCanvas from "./CraftCanvas.vue";
import CraftComponentBoxModelContainer from "./CraftComponentBoxModelContainer.vue";
import CraftComponentFlexContainer from "./CraftComponentFlexContainer.vue";
import CraftComponentSimpleContainer from "./CraftComponentSimpleContainer.vue";
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
import CraftGraphqlProvider from "./CraftGraphqlProvider.vue";
import CraftGraphqlQueryWrapper from "./CraftGraphqlQueryWrapper.vue";
import CraftNodeEditor from "./CraftNodeEditor.vue";
import CraftNodeViewer from "./CraftNodeViewer.vue";
import CraftNodeWrapper from "./CraftNodeWrapper.vue";
import GraphqlInputComponent from "./GraphqlInputComponent.vue";
import PatchesInputComponent from "./PatchesInputComponent.vue";

export {
  CraftCanvas,
  CraftComponentBoxModelContainer,
  CraftComponentFlexContainer,
  CraftComponentSimpleContainer,
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
  CraftGraphqlProvider,
  CraftGraphqlQueryWrapper,
  CraftNodeEditor,
  CraftNodeViewer,
  CraftNodeWrapper,
  GraphqlInputComponent,
  PatchesInputComponent,
};

export type CraftDataListItem<T extends object> = {
  dataItem: any;
  dataIndex: number;
  childNode: CraftNode<T>;
  childIndex: number;
  key: string;
};
