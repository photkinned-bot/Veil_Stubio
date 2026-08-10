import re

c = """
function applyDirectionalBlur(buf, tmp, w, h, rad, angle = 0, mode = "wrap", cometOptions = {}) {
  if (!rad || rad <= 0) return;
  if (window.CanvasProcessingEngine && window.CanvasProcessingEngine.directionalBlurFloatBuffer) {
    window.CanvasProcessingEngine.directionalBlurFloatBuffer(buf, w, h, rad, angle, cometOptions);
  } else {
    console.warn("CanvasProcessingEngine not found, skipping directional blur");
  }
}
"""

with open('assets/js/app.js', 'r') as f:
    text = f.read()

text = re.sub(r'function applyDirectionalBlur\(buf, tmp, w, h, rad, angle = 0, mode = "wrap", cometOptions = \{\}\) \{.*?\}\n\}', c, text, flags=re.DOTALL)

with open('assets/js/app.js', 'w') as f:
    f.write(text)
