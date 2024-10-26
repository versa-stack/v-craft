// mapGraphqlData.ts

import jp from "jsonpath";
import {
  CraftGraphqlQueryWrapperData,
  CraftGraphqlQueryWrapperPatch,
  CraftGraphqlQueryWrapperPropMap,
} from "../lib/model";
import { setValueByPath } from "./setValueByPath";

export function mapGraphqlData(
  data: any,
  mapConfig: CraftGraphqlQueryWrapperPropMap,
  childRef: any
): CraftGraphqlQueryWrapperData {
  const output: CraftGraphqlQueryWrapperData = {
    type: mapConfig.type,
    item: mapConfig.type === "single" ? {} : undefined,
    list: mapConfig.type === "list" ? [] : undefined,
  };

  const applyPatch = (source: any, patch: CraftGraphqlQueryWrapperPatch) => {
    let patchSource = source;
    if (patch.patchSource === "value") {
      return patch.value ?? patch.default ?? null;
    }

    if (patch.patchSource === "child") {
      patchSource = childRef;
    }

    const value =
      patch.type === "single"
        ? jp.value(patchSource, patch.fromPath)
        : jp.query(patchSource, patch.fromPath);
    return value ?? patch.default ?? null;
  };

  const rootData =
    mapConfig.type === "single"
      ? jp.value(data, mapConfig.fromPath)
      : jp.query(data, mapConfig.fromPath);

  if (mapConfig.type === "single") {
    mapConfig.patches.forEach((patch) => {
      const value = applyPatch(rootData, patch);
      setValueByPath(output.item!, patch.toPath, value);
    });
  } else if (mapConfig.type === "list") {
    output.list = rootData.map((item: any) => {
      const mappedItem: Record<string, any> = {};
      mapConfig.patches.forEach((patch) => {
        const value = applyPatch(item, patch);
        setValueByPath(mappedItem, patch.toPath, value);
      });

      return mappedItem;
    });
  }

  return output;
}
