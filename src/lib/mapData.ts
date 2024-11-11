import jp from "jsonpath";
import { setValueByPath } from "./setValueByPath";
import { CraftDataWrapperPropMap, CraftDataWrapperPatch } from "./model";
import { CraftNodeDatasource } from "./craftNode";

export const mapData = <
  M extends CraftDataWrapperPropMap = CraftDataWrapperPropMap<any, any>,
  D extends CraftNodeDatasource = CraftNodeDatasource,
  P extends CraftDataWrapperPatch = CraftDataWrapperPatch<any, any>
>(
  data: any,
  mapConfig: M,
  childRef: any
) => {
  const output = {
    type: mapConfig.type,
    item: mapConfig.type === "single" ? {} : undefined,
    list: mapConfig.type === "list" ? [] : undefined,
  } as D;

  const applyPatch = (source: any, patch: P) => {
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
    //@ts-ignore
    mapConfig.patches.forEach((patch: P) => {
      const value = applyPatch(rootData, patch);
      setValueByPath(output.item!, patch.toPath, value);
    });
  } else if (mapConfig.type === "list") {
    output.list = rootData.map((item: any) => {
      const mappedItem: Record<string, any> = {};
      mapConfig.patches.forEach((patch) => {
        //@ts-ignore
        const value = applyPatch(item, patch);
        setValueByPath(mappedItem, patch.toPath, value);
      });

      return mappedItem;
    });
  }

  return output;
};
