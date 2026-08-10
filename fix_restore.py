import re

with open('assets/js/app.js', 'r') as f:
    text = f.read()

# Add fallback to paintDataUrl in restoreAutoSaveDraftOnBoot
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

text = text.replace('''              });
            }
          }
          updatePaintBuffer(lay);''', '''              });
            }
          }''' + fallback_code + '''          updatePaintBuffer(lay);''')

with open('assets/js/app.js', 'w') as f:
    f.write(text)
