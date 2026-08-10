import re

with open('assets/js/app.js', 'r') as f:
    text = f.read()

text = text.replace('key === "paintDataUrl" ||', '')

with open('assets/js/app.js', 'w') as f:
    f.write(text)
