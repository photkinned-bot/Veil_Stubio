import re

c = """
function applyGaussianBlur(buf, tmp, w, h, rad, mode = "wrap") {
  if (!rad || rad <= 0) return;
  let scaledRad = Math.max(1, Math.round(rad * (w / 512)));
  let r = scaledRad;
  let invWindow = 1 / (2 * r + 1);

  // Horizontal pass
  for (let y = 0; y < h; y++) {
    let rowOffset = y * w;
    let sum = 0;
    for (let dx = -r; dx <= r; dx++) {
      let nx = ((dx % w) + w) % w;
      sum += buf[rowOffset + nx];
    }
    tmp[rowOffset] = sum * invWindow;

    for (let x = 1; x < w; x++) {
      let left = (x - r - 1 + w) % w;
      let right = (x + r) % w;
      sum += buf[rowOffset + right] - buf[rowOffset + left];
      tmp[rowOffset + x] = sum * invWindow;
    }
  }

  // Vertical pass
  for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let dy = -r; dy <= r; dy++) {
      let ny = ((dy % h) + h) % h;
      sum += tmp[ny * w + x];
    }
    buf[x] = sum * invWindow;

    for (let y = 1; y < h; y++) {
      let top = (y - r - 1 + h) % h;
      let bottom = (y + r) % h;
      sum += tmp[bottom * w + x] - tmp[top * w + x];
      buf[y * w + x] = sum * invWindow;
    }
  }
}
"""

with open('assets/js/app.js', 'r') as f:
    text = f.read()

# Replace applyGaussianBlur
import re
text = re.sub(r'function applyGaussianBlur\(buf, tmp, w, h, rad, mode = "wrap"\) \{.*?\n\}\n\nfunction applyZoomBlur', c + '\nfunction applyZoomBlur', text, flags=re.DOTALL)

with open('assets/js/app.js', 'w') as f:
    f.write(text)
