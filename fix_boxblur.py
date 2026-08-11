import re

with open('assets/js/modules/canvas-processing-engine.js', 'r') as f:
    text = f.read()

text = text.replace('    return out;\n  }\n\n  /**', '    if (window.globalBufferPool) window.globalBufferPool.releaseFloat32(tmp);\n    return out;\n  }\n\n  /**')

with open('assets/js/modules/canvas-processing-engine.js', 'w') as f:
    f.write(text)
