import re

with open('assets/js/app.js', 'r') as f:
    text = f.read()

text = text.replace('  updatePaintBuffer(lay);\n  lay.isDirty = true;', '  updatePaintBuffer(lay);\n  lay.paintRevision = (lay.paintRevision || 0) + 1;\n  lay.isDirty = true;')

with open('assets/js/app.js', 'w') as f:
    f.write(text)
