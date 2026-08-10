import re

with open('assets/js/app.js', 'r') as f:
    text = f.read()

fallback_code = """
          } else if (lay.params && lay.params.paintDataUrl) {
            let bitmap = await loadImageBitmapFromDataUrl(lay.params.paintDataUrl);
            if (bitmap) {
              const crop = lay.params.paintCrop;
              if (crop && typeof crop.x === "number") {
                pCtx.drawImage(bitmap, crop.x, crop.y, crop.w, crop.h);
              } else {
                pCtx.drawImage(bitmap, 0, 0, 1024, 1024);
              }
              if (typeof bitmap.close === "function") bitmap.close();
            }
          }
"""

text = re.sub(
    r'(?<=                img\.src = url;\n              \}\);\n            \}\n          \})(?=\n          updatePaintBuffer\(lay\);\n          lay\.isDirty = true;\n        \}\);\n      await Promise\.all\(paintPromises\);\n    \}\n\n    invalidateCaches\(\);\n    renderLayers\(\);)',
    fallback_code,
    text
)

with open('assets/js/app.js', 'w') as f:
    f.write(text)
