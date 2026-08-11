import re

with open('assets/js/modules/canvas-processing-engine.js', 'r') as f:
    text = f.read()

# I will just replace the exact lines:
text = text.replace('    if (window.globalBufferPool) window.globalBufferPool.releaseFloat32(tmp);\n    return out;', '    return out;')

with open('assets/js/modules/canvas-processing-engine.js', 'w') as f:
    f.write(text)
