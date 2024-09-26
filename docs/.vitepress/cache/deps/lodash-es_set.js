import {
  castPath_default,
  toKey_default
} from "./chunk-VRPOTAAS.js";
import "./chunk-PZZYS5PA.js";
import {
  assignValue_default
} from "./chunk-O3NPO42I.js";
import {
  isIndex_default
} from "./chunk-HBQOKEBA.js";
import {
  isObject_default
} from "./chunk-UIPK6E3U.js";
import "./chunk-WAFZBQO4.js";
import "./chunk-7UVSMXVG.js";

// node_modules/lodash-es/_baseSet.js
function baseSet(object, path, value, customizer) {
  if (!isObject_default(object)) {
    return object;
  }
  path = castPath_default(path, object);
  var index = -1, length = path.length, lastIndex = length - 1, nested = object;
  while (nested != null && ++index < length) {
    var key = toKey_default(path[index]), newValue = value;
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return object;
    }
    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : void 0;
      if (newValue === void 0) {
        newValue = isObject_default(objValue) ? objValue : isIndex_default(path[index + 1]) ? [] : {};
      }
    }
    assignValue_default(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}
var baseSet_default = baseSet;

// node_modules/lodash-es/set.js
function set(object, path, value) {
  return object == null ? object : baseSet_default(object, path, value);
}
var set_default = set;
export {
  set_default as default
};
//# sourceMappingURL=lodash-es_set.js.map
