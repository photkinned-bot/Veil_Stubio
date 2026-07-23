/**
 * Veil Studio - 256x256 Chunked Canvas Tile Engine
 * Renders large image layers in 256x256 pixel grid chunks.
 * Only dirty chunks intersecting the brush bounding box or viewport are redrawn.
 */

export const CHUNK_SIZE = 256;

export class TileChunk {
    constructor(chunkX, chunkY) {
        this.chunkX = chunkX;
        this.chunkY = chunkY;
        this.x = chunkX * CHUNK_SIZE;
        this.y = chunkY * CHUNK_SIZE;
        this.isDirty = true;

        this.canvas = document.createElement('canvas');
        this.canvas.width = CHUNK_SIZE;
        this.canvas.height = CHUNK_SIZE;
        this.ctx = this.canvas.getContext('2d', { alpha: true, willReadFrequently: true });
    }

    clear() {
        this.ctx.clearRect(0, 0, CHUNK_SIZE, CHUNK_SIZE);
        this.isDirty = true;
    }
}

export class TileLayer {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cols = Math.ceil(width / CHUNK_SIZE);
        this.rows = Math.ceil(height / CHUNK_SIZE);
        this.chunks = new Map(); // key: "x_y" -> TileChunk

        this.initGrid();
    }

    getChunkKey(col, row) {
        return `${col}_${row}`;
    }

    initGrid() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const key = this.getChunkKey(c, r);
                this.chunks.set(key, new TileChunk(c, r));
            }
        }
    }

    getChunkAt(col, row) {
        return this.chunks.get(this.getChunkKey(col, row));
    }

    // Returns array of chunks intersecting with bounding box (minX, minY, maxX, maxY)
    getChunksInBounds(minX, minY, maxX, maxY) {
        const startCol = Math.max(0, Math.floor(minX / CHUNK_SIZE));
        const endCol = Math.min(this.cols - 1, Math.floor(maxX / CHUNK_SIZE));
        const startRow = Math.max(0, Math.floor(minY / CHUNK_SIZE));
        const endRow = Math.min(this.rows - 1, Math.floor(maxY / CHUNK_SIZE));

        const result = [];
        for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const chunk = this.getChunkAt(c, r);
                if (chunk) result.push(chunk);
            }
        }
        return result;
    }

    // Paint stroke bounding box update (Only updates intersecting chunks!)
    applyBrushStroke(strokeBounds, drawFn) {
        const dirtyChunks = this.getChunksInBounds(
            strokeBounds.minX,
            strokeBounds.minY,
            strokeBounds.maxX,
            strokeBounds.maxY
        );

        for (const chunk of dirtyChunks) {
            chunk.ctx.save();
            // Translate context to local chunk coordinate space
            chunk.ctx.translate(-chunk.x, -chunk.y);
            drawFn(chunk.ctx, chunk);
            chunk.ctx.restore();
            chunk.isDirty = true;
        }
    }

    // Composite layer onto target viewport canvas
    renderToCanvas(mainCtx, viewportBounds = null) {
        let chunksToRender = this.chunks.values();
        
        if (viewportBounds) {
            chunksToRender = this.getChunksInBounds(
                viewportBounds.minX,
                viewportBounds.minY,
                viewportBounds.maxX,
                viewportBounds.maxY
            );
        }

        for (const chunk of chunksToRender) {
            mainCtx.drawImage(chunk.canvas, chunk.x, chunk.y);
            chunk.isDirty = false;
        }
    }
}
