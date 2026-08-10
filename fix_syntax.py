import re

with open('assets/js/app.js', 'r') as f:
    text = f.read()

text = text.replace('}\n          } else if (lay.params && lay.params.paintDataUrl) {', '} else if (lay.params && lay.params.paintDataUrl) {')

with open('assets/js/app.js', 'w') as f:
    f.write(text)
