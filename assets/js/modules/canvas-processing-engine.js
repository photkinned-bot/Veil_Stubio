/**
 * CanvasProcessingEngine
 * Utility module for procedural heightmap and PBR texture map generation.
 * Generates Normal, Displacement (Height), Ambient Occlusion (AO), and Specular maps
 * from raster source image data using Sobel/Scharr operators and local kernel sampling.
 */

export class CanvasProcessingEngine {
  /**
   * Helper: Convert ImageData to grayscale float array [0..1]
   */
  static getGrayscaleBuffer(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const length = width * height;
    const gray = new Float32Array(length);

    for (let i = 0; i < length; i++) {
      const idx = i * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3] / 255;
      // Perceptual luminance formula
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      gray[i] = lum * a;
    }
    return gray;
  }

  /**
   * Helper: Fast Box Blur on Float32Array
   */
  static boxBlurFloatBuffer(buffer, width, height, radius) {
    if (!radius || radius < 1) return buffer;
    const r = Math.floor(radius);
    const size = width * height;
    const tmp = new Float32Array(size);
    const out = new Float32Array(size);
    const invWindow = 1 / (2 * r + 1);

    // Horizontal pass
    for (let y = 0; y < height; y++) {
      const row = y * width;
      let sum = 0;
      for (let dx = -r; dx <= r; dx++) {
        const nx = (dx % width + width) % width;
        sum += buffer[row + nx];
      }
      tmp[row] = sum * invWindow;

      for (let x = 1; x < width; x++) {
        const left = (x - r - 1 + width) % width;
        const right = (x + r) % width;
        sum += buffer[row + right] - buffer[row + left];
        tmp[row + x] = sum * invWindow;
      }
    }

    // Vertical pass
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let dy = -r; dy <= r; dy++) {
        const ny = (dy % height + height) % height;
        sum += tmp[ny * width + x];
      }
      out[x] = sum * invWindow;

      for (let y = 1; y < height; y++) {
        const top = (y - r - 1 + height) % height;
        const bottom = (y + r) % height;
        sum += tmp[bottom * width + x] - tmp[top * width + x];
        out[y * width + x] = sum * invWindow;
      }
    }

    return out;
  }

  /**
   * Helper: Sharpen kernel filter on Float32Array
   */
  static sharpenFloatBuffer(buffer, width, height, amount) {
    if (!amount || amount <= 0) return buffer;
    const size = width * height;
    const out = new Float32Array(size);

    for (let y = 0; y < height; y++) {
      const prevY = (y - 1 + height) % height;
      const nextY = (y + 1) % height;
      for (let x = 0; x < width; x++) {
        const prevX = (x - 1 + width) % width;
        const nextX = (x + 1) % width;

        const center = buffer[y * width + x];
        const top = buffer[prevY * width + x];
        const bottom = buffer[nextY * width + x];
        const left = buffer[y * width + prevX];
        const right = buffer[y * width + nextX];

        const laplacian = 4 * center - top - bottom - left - right;
        let val = center + laplacian * amount;
        out[y * width + x] = Math.max(0, Math.min(1, val));
      }
    }
    return out;
  }

  /**
   * Generate Normal Map ImageData
   */
  static generateNormalMap(srcImageData, options = {}) {
    const width = srcImageData.width;
    const height = srcImageData.height;
    const algo = options.algorithm || 'sobel'; // 'sobel' | 'scharr'
    const strength = options.strength !== undefined ? options.strength : 2.5;
    const level = options.level !== undefined ? options.level : 1.0;
    const blurSharpen = options.blurSharpen !== undefined ? options.blurSharpen : 0;
    const invertR = !!options.invertR;
    const invertG = !!options.invertG;
    const invertH = !!options.invertH;

    let gray = this.getGrayscaleBuffer(srcImageData);

    // Apply pre-processing blur/sharpen if needed
    if (blurSharpen > 0) {
      gray = this.boxBlurFloatBuffer(gray, width, height, blurSharpen * 4);
    } else if (blurSharpen < 0) {
      gray = this.sharpenFloatBuffer(gray, width, height, Math.abs(blurSharpen));
    }

    const outImageData = new ImageData(width, height);
    const out = outImageData.data;

    // Convolution weights
    let kx, ky;
    if (algo === 'scharr') {
      // Scharr 3x3 kernel
      kx = [-3, 0, 3, -10, 0, 10, -3, 0, 3];
      ky = [-3, -10, -3, 0, 0, 0, 3, 10, 3];
    } else {
      // Sobel 3x3 kernel
      kx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
      ky = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    }

    const scale = (strength * level * 0.5) / (algo === 'scharr' ? 16 : 4);

    for (let y = 0; y < height; y++) {
      const ym1 = (y - 1 + height) % height;
      const yp1 = (y + 1) % height;

      for (let x = 0; x < width; x++) {
        const xm1 = (x - 1 + width) % width;
        const xp1 = (x + 1) % width;

        // Sample 3x3 neighborhood
        const p00 = gray[ym1 * width + xm1];
        const p10 = gray[ym1 * width + x];
        const p20 = gray[ym1 * width + xp1];

        const p01 = gray[y * width + xm1];
        const p21 = gray[y * width + xp1];

        const p02 = gray[yp1 * width + xm1];
        const p12 = gray[yp1 * width + x];
        const p22 = gray[yp1 * width + xp1];

        let dx = kx[0] * p00 + kx[2] * p20 +
                 kx[3] * p01 + kx[5] * p21 +
                 kx[6] * p02 + kx[8] * p22;

        let dy = ky[0] * p00 + ky[1] * p10 + ky[2] * p20 +
                 ky[6] * p02 + ky[7] * p12 + ky[8] * p22;

        if (invertH) {
          dx = -dx;
          dy = -dy;
        }

        dx *= scale;
        dy *= scale;

        let nx = -dx;
        let ny = -dy;
        let nz = 1.0;

        if (invertR) nx = -nx;
        if (invertG) ny = -ny;

        // Vector normalization
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        nx /= len;
        ny /= len;
        nz /= len;

        // Map [-1..1] to [0..255]
        const r = Math.round((nx * 0.5 + 0.5) * 255);
        const g = Math.round((ny * 0.5 + 0.5) * 255);
        const b = Math.round((nz * 0.5 + 0.5) * 255);

        const idx = (y * width + x) * 4;
        out[idx] = r;
        out[idx + 1] = g;
        out[idx + 2] = b;
        out[idx + 3] = 255;
      }
    }

    return outImageData;
  }

  /**
   * Generate Displacement / Height Map ImageData
   */
  static generateDisplacementMap(srcImageData, options = {}) {
    const width = srcImageData.width;
    const height = srcImageData.height;
    const contrast = options.contrast !== undefined ? options.contrast : 1.0;
    const brightness = options.brightness !== undefined ? options.brightness : 0;
    const blur = options.blur !== undefined ? options.blur : 0;
    const invert = !!options.invert;

    let gray = this.getGrayscaleBuffer(srcImageData);

    if (blur > 0) {
      gray = this.boxBlurFloatBuffer(gray, width, height, blur * 2);
    }

    const outImageData = new ImageData(width, height);
    const out = outImageData.data;

    for (let i = 0; i < gray.length; i++) {
      let val = gray[i];

      if (invert) val = 1.0 - val;
      if (contrast !== 1.0) val = (val - 0.5) * contrast + 0.5;
      val += brightness;

      val = Math.max(0, Math.min(1, val));
      const byteVal = Math.round(val * 255);

      const idx = i * 4;
      out[idx] = byteVal;
      out[idx + 1] = byteVal;
      out[idx + 2] = byteVal;
      out[idx + 3] = 255;
    }

    return outImageData;
  }

  /**
   * Generate Ambient Occlusion (AO) Map ImageData
   */
  static generateAOMap(srcImageData, options = {}) {
    const width = srcImageData.width;
    const height = srcImageData.height;
    const strength = options.strength !== undefined ? options.strength : 1.5;
    const level = options.level !== undefined ? options.level : 1.0;
    const blur = options.blur !== undefined ? options.blur : 1;
    const mean = options.mean !== undefined ? options.mean : 3;
    const range = options.range !== undefined ? options.range : 8;
    const falloff = options.falloff || 'linear'; // 'none' | 'linear' | 'square'
    const invert = !!options.invert;

    let gray = this.getGrayscaleBuffer(srcImageData);

    const outImageData = new ImageData(width, height);
    const outBuffer = new Float32Array(width * height);

    const radius = Math.max(1, Math.min(32, Math.round(range)));
    const sampleStep = Math.max(1, Math.floor(radius / 4));

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const centerIdx = y * width + x;
        const centerH = gray[centerIdx];

        let occlusionSum = 0;
        let totalWeight = 0;

        for (let dy = -radius; dy <= radius; dy += sampleStep) {
          for (let dx = -radius; dx <= radius; dx += sampleStep) {
            if (dx === 0 && dy === 0) continue;
            const dist = Math.hypot(dx, dy);
            if (dist > radius) continue;

            const ny = (y + dy + height) % height;
            const nx = (x + dx + width) % width;
            const sampleH = gray[ny * width + nx];

            const diff = sampleH - centerH;
            let weight = 1.0;

            if (falloff === 'linear') {
              weight = 1.0 - dist / radius;
            } else if (falloff === 'square') {
              const t = 1.0 - dist / radius;
              weight = t * t;
            }

            if (diff > 0) {
              occlusionSum += diff * weight;
            }
            totalWeight += weight;
          }
        }

        const avgOcclusion = totalWeight > 0 ? (occlusionSum / totalWeight) : 0;
        let aoVal = 1.0 - Math.min(1.0, avgOcclusion * strength * level * (mean / 2));

        if (invert) aoVal = 1.0 - aoVal;

        outBuffer[centerIdx] = Math.max(0, Math.min(1, aoVal));
      }
    }

    let finalBuffer = outBuffer;
    if (blur > 0) {
      finalBuffer = this.boxBlurFloatBuffer(outBuffer, width, height, blur * 2);
    }

    const out = outImageData.data;
    for (let i = 0; i < finalBuffer.length; i++) {
      const byteVal = Math.round(finalBuffer[i] * 255);
      const idx = i * 4;
      out[idx] = byteVal;
      out[idx + 1] = byteVal;
      out[idx + 2] = byteVal;
      out[idx + 3] = 255;
    }

    return outImageData;
  }

  /**
   * Generate Specular Map ImageData
   */
  static generateSpecularMap(srcImageData, options = {}) {
    const width = srcImageData.width;
    const height = srcImageData.height;
    const strength = options.strength !== undefined ? options.strength : 1.2;
    const level = options.level !== undefined ? options.level : 1.0;
    const blur = options.blur !== undefined ? options.blur : 0;
    const invert = !!options.invert;

    let gray = this.getGrayscaleBuffer(srcImageData);

    if (blur > 0) {
      gray = this.boxBlurFloatBuffer(gray, width, height, blur * 2);
    }

    const outImageData = new ImageData(width, height);
    const out = outImageData.data;

    for (let y = 0; y < height; y++) {
      const ym1 = (y - 1 + height) % height;
      const yp1 = (y + 1) % height;

      for (let x = 0; x < width; x++) {
        const xm1 = (x - 1 + width) % width;
        const xp1 = (x + 1) % width;

        const center = gray[y * width + x];
        const top = gray[ym1 * width + x];
        const bottom = gray[yp1 * width + x];
        const left = gray[y * width + xm1];
        const right = gray[y * width + xp1];

        // Highlight high frequencies / edges + luminance
        const dx = right - left;
        const dy = bottom - top;
        const edgeMag = Math.hypot(dx, dy);

        let specVal = (center * 0.6 + edgeMag * 0.4) * strength * level;

        if (invert) specVal = 1.0 - specVal;

        specVal = Math.max(0, Math.min(1, specVal));
        const byteVal = Math.round(specVal * 255);

        const idx = (y * width + x) * 4;
        out[idx] = byteVal;
        out[idx + 1] = byteVal;
        out[idx + 2] = byteVal;
        out[idx + 3] = 255;
      }
    }

    return outImageData;
  }

  /**
   * Helper: Convert ImageData to Data URL
   */
  static imageDataToDataURL(imageData, format = 'image/png', quality = 0.92) {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL(format, quality);
  }
}

window.CanvasProcessingEngine = CanvasProcessingEngine;
