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
        if (obj && typeof obj.reset === 'function') {
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

// Reusable Pixel Buffer Manager to avoid re-allocating Uint8ClampedArray
export class BufferPool {
    constructor() {
        this.buffers = new Map(); // Key: byteLength, Value: Array of ArrayBuffers
    }

    acquire(byteLength) {
        let list = this.buffers.get(byteLength);
        if (list && list.length > 0) {
            return list.pop();
        }
        return new ArrayBuffer(byteLength);
    }

    release(buffer) {
        if (!buffer || !(buffer instanceof ArrayBuffer)) return;
        let key = buffer.byteLength;
        if (!this.buffers.has(key)) {
            this.buffers.set(key, []);
        }
        this.buffers.get(key).push(buffer);
    }
}

export const brushPointPool = new ObjectPool(() => new BrushPoint(), 250);
export const globalBufferPool = new BufferPool();
