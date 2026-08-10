/**
 * Veil Studio - High Performance Object Pool & Buffer Reuse System
 * Eliminates Garbage Collection (GC) pauses during fast pointermove brush events.
 */

export class ObjectPool {
  constructor(factoryFn, initialSize = 100) {
    this.factoryFn = factoryFn;
    this.pool = [];
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.factoryFn());
    }
  }

  acquire() {
    return this.pool.length > 0 ? this.pool.pop() : this.factoryFn();
  }

  release(obj) {
    if (obj && typeof obj.reset === "function") {
      obj.reset();
    }
    this.pool.push(obj);
  }
}

// Reusable Brush Point Structure
export class BrushPoint {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.pressure = 1;
    this.timestamp = 0;
  }

  set(x, y, pressure = 1, timestamp = performance.now()) {
    this.x = x;
    this.y = y;
    this.pressure = pressure;
    this.timestamp = timestamp;
    return this;
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.pressure = 1;
    this.timestamp = 0;
  }
}

// Reusable Pixel Buffer Manager to avoid re-allocating Float32Array / Uint8ClampedArray
export class BufferPool {
  constructor() {
    this.buffers = new Map(); // Key: byteLength, Value: Array of ArrayBuffers
    this.float32Pools = new Map(); // Key: length, Value: Array of Float32Arrays
    this.uint8Pools = new Map(); // Key: length, Value: Array of Uint8ClampedArrays
    this.maxPoolPerKey = 16;
    this.hits = 0;
    this.misses = 0;
  }

  acquire(byteLength) {
    let list = this.buffers.get(byteLength);
    if (list && list.length > 0) {
      this.hits++;
      return list.pop();
    }
    this.misses++;
    return new ArrayBuffer(byteLength);
  }

  release(buffer) {
    if (!buffer || !(buffer instanceof ArrayBuffer)) return;
    let key = buffer.byteLength;
    if (!this.buffers.has(key)) {
      this.buffers.set(key, []);
    }
    let list = this.buffers.get(key);
    if (list.length < this.maxPoolPerKey) {
      list.push(buffer);
    }
  }

  acquireFloat32(length, clear = false) {
    let list = this.float32Pools.get(length);
    if (list && list.length > 0) {
      this.hits++;
      let arr = list.pop();
      if (clear) if (clear) arr.fill(0);
      return arr;
    }
    this.misses++;
    return new Float32Array(length);
  }

  releaseFloat32(arr) {
    if (!arr || !(arr instanceof Float32Array)) return;
    let key = arr.length;
    if (!this.float32Pools.has(key)) {
      this.float32Pools.set(key, []);
    }
    let list = this.float32Pools.get(key);
    if (list.length < this.maxPoolPerKey) {
      list.push(arr);
    }
  }

  acquireUint8(length, clear = false) {
    let list = this.uint8Pools.get(length);
    if (list && list.length > 0) {
      this.hits++;
      let arr = list.pop();
      if (clear) if (clear) arr.fill(0);
      return arr;
    }
    this.misses++;
    return new Uint8ClampedArray(length);
  }

  releaseUint8(arr) {
    if (!arr || !(arr instanceof Uint8ClampedArray)) return;
    let key = arr.length;
    if (!this.uint8Pools.has(key)) {
      this.uint8Pools.set(key, []);
    }
    let list = this.uint8Pools.get(key);
    if (list.length < this.maxPoolPerKey) {
      list.push(arr);
    }
  }

  prune() {
    this.buffers.clear();
    this.float32Pools.clear();
    this.uint8Pools.clear();
    this.hits = 0;
    this.misses = 0;
  }
}

export const brushPointPool = new ObjectPool(() => new BrushPoint(), 250);
export const globalBufferPool = new BufferPool();

if (typeof window !== "undefined") {
  window.ObjectPool = ObjectPool;
  window.BrushPoint = BrushPoint;
  window.BufferPool = BufferPool;
  window.brushPointPool = brushPointPool;
  window.globalBufferPool = globalBufferPool;
}
