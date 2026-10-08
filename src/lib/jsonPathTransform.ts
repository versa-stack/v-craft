import { JSONPath } from "jsonpath-plus";

type PathSpec = string | string[] | { [name: string]: PathSpec };
// Arrays and objects are both filled by key, so results are indexed loosely.
type Bucket = Record<string | number, unknown>;

const walk = (
  data: Record<string, unknown>,
  path: PathSpec,
  result: Bucket,
  key: string | number = ""
) => {
  if (type(path) === "array") {
    return seekArray(data, path as string[], result, key);
  }

  if (type(path) === "object") {
    return seekObject(data, path as { [name: string]: PathSpec }, result, key);
  }

  if (type(path) === "string") {
    return seekSingle(data, path as string, result, key);
  }
};

const type = (test: unknown) => {
  return Array.isArray(test) ? "array" : typeof test;
};

const seekSingle = (
  data: Record<string, unknown>,
  pathStr: string,
  result: Bucket,
  key: string | number = ""
) => {
  if (pathStr.indexOf("$") < 0) {
    result[key] = pathStr;
    return result;
  }

  const seek = JSONPath({ path: pathStr, json: data }) || [];

  result[key] = seek.length ? seek[0] : undefined;
  return result;
};

const seekArray = (
  data: Record<string, unknown>,
  pathArr: string[],
  result: Bucket,
  key: string | number = ""
) => {
  const subpath = pathArr[1];
  const path = pathArr[0];
  const seek = JSONPath({ path, json: data }) || [];

  if (seek.length && subpath) {
    const list: unknown[] = [];
    result[key] = list;
    result = list as unknown as Bucket;

    seek[0].forEach(function (item, index) {
      walk(item, subpath, result, index);
    });

    return result;
  }

  result[key] = seek;
  return result;
};

const seekObject = (
  data: Record<string, unknown>,
  pathObj: { [name: string]: PathSpec },
  result: Bucket,
  key: string | number = ""
) => {
  if (key !== "") {
    result = result[key] = {};
  }

  Object.keys(pathObj).forEach(function (name) {
    walk(data, pathObj[name], result, name);
  });

  return result;
};

export default (
  data: Record<string, unknown>,
  path: PathSpec
) => {
  return walk(data, path, {});
};
