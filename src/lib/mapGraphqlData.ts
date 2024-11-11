import {
  CraftGraphqlQueryWrapperData,
  CraftGraphqlQueryWrapperPatch,
  CraftGraphqlQueryWrapperPropMap,
} from "../lib/model";
import { mapData } from "./mapData";

export const mapGraphqlData = mapData<
  CraftGraphqlQueryWrapperPropMap,
  CraftGraphqlQueryWrapperData,
  CraftGraphqlQueryWrapperPatch
>;
