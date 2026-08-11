function serializeState(s, forExport = false) {
  return JSON.stringify(s, (key, value) => {
    if (
      key === "paintCanvas" ||
      key.startsWith("paintBuffer") ||
      key.startsWith("cachedBuffer") ||
      key.startsWith("draftBuffer") ||
      key.startsWith("fullBuffer") ||
      key.startsWith("_")
    ) {
      return undefined;
    }
    return value;
  });
}

let state = {
  layers: [
    { id: "l1", generatorType: "paint", paintRevision: 1, paintCanvas: "abc" }
  ]
};

console.log(serializeState(state));
