/**
 * Veil Studio - Web Worker for Heavy Pixel Processing & Seamless Texture Synthesis
 * Offloads Toroidal Guard seam blending and procedural noise calculations from UI thread.
 */

self.onmessage = function (e) {
    const { action, id, buffer, width, height, params } = e.data;

    if (action === 'PROCESS_TOROIDAL_GUARD') {
        const pixels = new Uint8ClampedArray(buffer);
        processToroidalGuard(pixels, width, height, params);

        // Transfer raw ArrayBuffer back to main thread with Zero-Copy
        self.postMessage(
            { action, id, buffer: pixels.buffer, width, height },
            [pixels.buffer]
        );
    } else if (action === 'GENERATE_PERLIN_NOISE') {
        const resultBuffer = generatePerlinNoiseBuffer(width, height, params);
        self.postMessage(
            { action, id, buffer: resultBuffer, width, height },
            [resultBuffer]
        );
    }
};

/**
 * Toroidal Guard Seam Blending Algorithm (Fast Background Execution)
 */
function processToroidalGuard(pixels, w, h, params) {
    const guardW = params.guardWidth || 16;
    const mixStr = (params.guardMixStrength || 85) / 100;
    const preserveDetail = (params.detailPreserve || 70) / 100;

    const copy = new Uint8ClampedArray(pixels);

    // Horizontal Seam Guard
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < guardW; x++) {
            const idxL = (y * w + x) * 4;
            const idxR = (y * w + (w - 1 - x)) * 4;

            const normT = x / guardW;
            const alphaCurve = Math.cos(normT * Math.PI) * 0.5 + 0.5;
            const factor = 0.5 * alphaCurve * mixStr;

            for (let c = 0; c < 3; c++) {
                const valL = copy[idxL + c];
                const valR = copy[idxR + c];

                let newL = valL * (1 - factor) + valR * factor;
                let newR = valR * (1 - factor) + valL * factor;

                if (preserveDetail > 0) {
                    const detailL = valL - ((copy[getPixelIdx(w, h, x - 1, y) + c] + copy[getPixelIdx(w, h, x + 1, y) + c]) / 2);
                    const detailR = valR - ((copy[getPixelIdx(w, h, w - 1 - x - 1, y) + c] + copy[getPixelIdx(w, h, w - 1 - x + 1, y) + c]) / 2);
                    newL += detailL * preserveDetail * (1 - factor);
                    newR += detailR * preserveDetail * (1 - factor);
                }

                pixels[idxL + c] = Math.min(255, Math.max(0, Math.round(newL)));
                pixels[idxR + c] = Math.min(255, Math.max(0, Math.round(newR)));
            }
        }
    }

    // Vertical Seam Guard
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < guardW; y++) {
            const idxT = (y * w + x) * 4;
            const idxB = ((h - 1 - y) * w + x) * 4;

            const normT = y / guardW;
            const alphaCurve = Math.cos(normT * Math.PI) * 0.5 + 0.5;
            const factor = 0.5 * alphaCurve * mixStr;

            for (let c = 0; c < 3; c++) {
                const valT = copy[idxT + c];
                const valB = copy[idxB + c];

                let newT = valT * (1 - factor) + valB * factor;
                let newB = valB * (1 - factor) + valT * factor;

                if (preserveDetail > 0) {
                    const detailT = valT - ((copy[getPixelIdx(w, h, x, y - 1) + c] + copy[getPixelIdx(w, h, x, y + 1) + c]) / 2);
                    const detailB = valB - ((copy[getPixelIdx(w, h, x, h - 1 - y - 1) + c] + copy[getPixelIdx(w, h, x, h - 1 - y + 1) + c]) / 2);
                    newT += detailT * preserveDetail * (1 - factor);
                    newB += detailB * preserveDetail * (1 - factor);
                }

                pixels[idxT + c] = Math.min(255, Math.max(0, Math.round(newT)));
                pixels[idxB + c] = Math.min(255, Math.max(0, Math.round(newB)));
            }
        }
    }
}

function getPixelIdx(w, h, x, y) {
    const wx = (x % w + w) % w;
    const wy = (y % h + h) % h;
    return (wy * w + wx) * 4;
}

function generatePerlinNoiseBuffer(w, h, params) {
    const buffer = new ArrayBuffer(w * h * 4);
    const pixels = new Uint8ClampedArray(buffer);
    const scale = params.scale || 0.05;

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const n = Math.floor((Math.sin(x * scale) * Math.cos(y * scale) + 1) * 127.5);
            pixels[idx] = n;
            pixels[idx + 1] = n;
            pixels[idx + 2] = n;
            pixels[idx + 3] = 255;
        }
    }

    return buffer;
}
