import re

with open('assets/js/app.js', 'r') as f:
    text = f.read()

replacement = """
  let lay = state.layers.find((l) => l.id === state.selectedLayerId);
  if (lay && lay.generatorType === "paint") {
    lay.paintRevision = (lay.paintRevision || 0) + 1;
    let lp = lay.params;"""

text = text.replace("""  let lay = state.layers.find((l) => l.id === state.selectedLayerId);
  if (lay && lay.generatorType === "paint") {
    let lp = lay.params;""", replacement)

with open('assets/js/app.js', 'w') as f:
    f.write(text)
