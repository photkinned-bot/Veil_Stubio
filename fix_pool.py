import re
with open('assets/js/modules/object-pool.js', 'r') as f:
    c = f.read()

c = c.replace('acquireFloat32(length) {', 'acquireFloat32(length, clear = false) {')
c = c.replace('arr.fill(0);\n      return arr;', 'if (clear) arr.fill(0);\n      return arr;')

c = c.replace('acquireUint8(length) {', 'acquireUint8(length, clear = false) {')
c = c.replace('arr.fill(0);\n      return arr;', 'if (clear) arr.fill(0);\n      return arr;')

with open('assets/js/modules/object-pool.js', 'w') as f:
    f.write(c)
