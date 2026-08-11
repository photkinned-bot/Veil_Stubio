import re

with open('assets/js/app.js', 'r') as f:
    text = f.read()

text = text.replace('  isPainting = false;\n  paintPoints = [];', '  isPainting = false;\n  isInteracting = false;\n  paintPoints = [];')

with open('assets/js/app.js', 'w') as f:
    f.write(text)
