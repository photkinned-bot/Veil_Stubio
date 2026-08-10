import re
with open('assets/js/app.js', 'r') as f:
    c = f.read()

# Fix _singleDirectionalPass to release smpOx etc
# Find the end of _singleDirectionalPass:
#       dstBuf[rowOffset + x] = sum;
#     }
#   }
# }

c = re.sub(r'      dstBuf\[rowOffset \+ x\] = sum;\n    }\n  }\n\}', r'      dstBuf[rowOffset + x] = sum;\n    }\n  }\n\n  if (window.globalBufferPool) {\n    window.globalBufferPool.releaseFloat32(smpOx);\n    window.globalBufferPool.releaseFloat32(smpOy);\n    window.globalBufferPool.releaseFloat32(smpW);\n  }\n}', c)

# Fix weights
c = c.replace('let weights = window.globalBufferPool\n    ? window.globalBufferPool.acquireFloat32(2 * kSize + 1)\n    : new Float32Array(2 * kSize + 1);', 'let weights = new Float32Array(2 * kSize + 1);')
c = c.replace('let weights = window.globalBufferPool ? window.globalBufferPool.acquireFloat32(2 * kSize + 1) : new Float32Array(2 * kSize + 1);', 'let weights = new Float32Array(2 * kSize + 1);')

# Fix lutR
c = c.replace('const lutR = window.globalBufferPool\n  ? window.globalBufferPool.acquireFloat32(256)\n  : new Float32Array(256);', 'const lutR = new Float32Array(256);')
c = c.replace('const lutG = window.globalBufferPool\n  ? window.globalBufferPool.acquireFloat32(256)\n  : new Float32Array(256);', 'const lutG = new Float32Array(256);')
c = c.replace('const lutB = window.globalBufferPool\n  ? window.globalBufferPool.acquireFloat32(256)\n  : new Float32Array(256);', 'const lutB = new Float32Array(256);')

c = c.replace('const lutR = window.globalBufferPool ? window.globalBufferPool.acquireFloat32(256) : new Float32Array(256);', 'const lutR = new Float32Array(256);')
c = c.replace('const lutG = window.globalBufferPool ? window.globalBufferPool.acquireFloat32(256) : new Float32Array(256);', 'const lutG = new Float32Array(256);')
c = c.replace('const lutB = window.globalBufferPool ? window.globalBufferPool.acquireFloat32(256) : new Float32Array(256);', 'const lutB = new Float32Array(256);')


with open('assets/js/app.js', 'w') as f:
    f.write(c)
