import re

with open('assets/js/app.js', 'r') as f:
    text = f.read()

replacement = """function applyDirectionalBlur(
  buf,
  tmp,
  w,
  h,
  rad,
  angle = 0,
  mode = "wrap",
  cometOptions = {}
) {
  if (!rad || rad <= 0) return;
  
  let scaledRad = Math.max(1, Math.round(rad * (w / 512)));
  
  if (window.CanvasProcessingEngine && window.CanvasProcessingEngine.directionalBlurFloatBuffer) {
    window.CanvasProcessingEngine.directionalBlurFloatBuffer(buf, w, h, scaledRad, angle, cometOptions);
  } else {
    console.warn("CanvasProcessingEngine not found, skipping directional blur");
  }
}"""

# Since regex is hard with prettier, let's just replace the block.
# I will use a simple split and replace
lines = text.split('\n')
start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if line.startswith("function applyDirectionalBlur("):
        start_idx = i
    if start_idx != -1 and line == "}":
        # The next line is also }
        # wait, let's check
        if "CanvasProcessingEngine not found" in lines[i-1] or "CanvasProcessingEngine not found" in lines[i-2]:
            end_idx = i
            break

if start_idx != -1 and end_idx != -1:
    del lines[start_idx:end_idx+1]
    lines.insert(start_idx, replacement)

with open('assets/js/app.js', 'w') as f:
    f.write('\n'.join(lines))
