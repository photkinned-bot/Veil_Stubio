import re

with open('assets/js/modules/canvas-processing-engine.js', 'r') as f:
    c = f.read()

# For boxBlurFloatBuffer:
c = re.sub(r'if \(!radius \|\| radius < 1\)\s*if \(window\.globalBufferPool\) window\.globalBufferPool\.releaseFloat32\(tmp\);\s*return buffer;', r'if (!radius || radius < 1) return buffer;', c)

with open('assets/js/modules/canvas-processing-engine.js', 'w') as f:
    f.write(c)
