import jp from "jsonpath";

const walk = (
  data: Record<string, any>,
  path: string | string[] | Record<string, any>,
  result: Record<string, any>,
  key: string = ""
) => {
  if (type(path) === "array") {
    return seekArray(data, path as string[], result, key);
  }

  if (type(path) === "object") {
    return seekObject(data, path as Record<string, any>, result, key);
  }

  if (type(path) === "string") {
    return seekSingle(data, path as string, result, key);
  }
};

const type = (test: any) => {
  return Array.isArray(test) ? "array" : typeof test;
};

const seekSingle = (
  data: Record<string, any>,
  pathStr: string,
  result: Record<string, any>,
  key: string = ""
) => {
  if (pathStr.indexOf("$") < 0) {
    result[key] = pathStr;
    return result;
  }

  const seek = jp.query(data, pathStr) || [];

  result[key] = seek.length ? seek[0] : undefined;
  return result;
};

const seekArray = (
  data: Record<string, any>,
  pathArr: string[],
  result: Record<string, any>,
  key: string = ""
) => {
  const subpath = pathArr[1];
  const path = pathArr[0];
  const seek = jp.query(data, path) || [];

  if (seek.length && subpath) {
    result = result[key] = [];

    seek[0].forEach(function (item, index) {
      walk(item, subpath, result, index);
    });

    return result;
  }

  result[key] = seek;
  return result;
};

const seekObject = (
  data: Record<string, any>,
  pathObj: Record<string, any>,
  result: Record<string, any>,
  key: string = ""
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
  data: Record<string, any>,
  path: Record<string, any> | string | string[]
) => {
  return walk(data, path, {});
};
