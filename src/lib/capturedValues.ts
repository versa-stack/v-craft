const capturedByRenderer = new WeakMap<object, Set<string>>();

/** The uuids whose runtime `value` was captured from user input, per renderer's runtime-props bag. */
export const capturedFor = (bag: object): Set<string> => {
  let set = capturedByRenderer.get(bag);
  if (!set) capturedByRenderer.set(bag, (set = new Set()));
  return set;
};
