import {
  castPath_default,
  toKey_default
} from "./chunk-FXK466SV.js";
import "./chunk-QYSR3RLP.js";
import "./chunk-7UVSMXVG.js";

// node_modules/lodash-es/_baseGet.js
function baseGet(object, path) {
  path = castPath_default(path, object);
  var index = 0, length = path.length;
  while (object != null && index < length) {
    object = object[toKey_default(path[index++])];
  }
  return index && index == length ? object : void 0;
}
var baseGet_default = baseGet;

// node_modules/lodash-es/get.js
function get(object, path, defaultValue) {
  var result = object == null ? void 0 : baseGet_default(object, path);
  return result === void 0 ? defaultValue : result;
}
var get_default = get;
export {
  get_default as default
};
//# sourceMappingURL=lodash-es_get.js.map
