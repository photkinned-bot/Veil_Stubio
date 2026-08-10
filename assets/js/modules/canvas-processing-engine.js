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
  static buildCurveLUT(points) {
    if (!points || !Array.isArray(points) || points.length < 2) {
      return null;
    }
    const sorted = points.slice().sort((a, b) => a.x - b.x);

    const cleanPts = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
      if (Math.abs(sorted[i].x - cleanPts[cleanPts.length - 1].x) > 0.0001) {
        cleanPts.push(sorted[i]);
      }
    }
    if (cleanPts.length < 2) return null;

    if (
      cleanPts.length === 2 &&
      Math.abs(cleanPts[0].x - 0) < 0.001 &&
      Math.abs(cleanPts[0].y - 0) < 0.001 &&
      Math.abs(cleanPts[1].x - 1) < 0.001 &&
      Math.abs(cleanPts[1].y - 1) < 0.001
    ) {
      return null;
    }

    const n = cleanPts.length;
    const x = new Float32Array(n);
    const y = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      x[i] = Math.max(0, Math.min(1, cleanPts[i].x));
      y[i] = Math.max(0, Math.min(1, cleanPts[i].y));
    }

    const m = new Float32Array(n - 1);
    for (let i = 0; i < n - 1; i++) {
      let dx = x[i + 1] - x[i];
      m[i] = dx > 0 ? (y[i + 1] - y[i]) / dx : 0;
    }

    const d = new Float32Array(n);
    d[0] = m[0];
    d[n - 1] = m[n - 2];
    for (let i = 1; i < n - 1; i++) {
      if (m[i - 1] * m[i] <= 0) {
        d[i] = 0;
      } else {
        d[i] = (m[i - 1] + m[i]) * 0.5;
      }
    }

    for (let i = 0; i < n - 1; i++) {
      if (m[i] === 0) {
        d[i] = 0;
        d[i + 1] = 0;
      } else {
        let alpha = d[i] / m[i];
        let beta = d[i + 1] / m[i];
        let sumSq = alpha * alpha + beta * beta;
        if (sumSq > 9) {
          let tau = 3 / Math.sqrt(sumSq);
          d[i] = tau * alpha * m[i];
          d[i + 1] = tau * beta * m[i];
        }
      }
    }

    const lut = new Float32Array(256);
    for (let k = 0; k < 256; k++) {
      let vx = k / 255;
      if (vx <= x[0]) {
        lut[k] = Math.max(0, Math.min(1, y[0]));
        continue;
      }
      if (vx >= x[n - 1]) {
        lut[k] = Math.max(0, Math.min(1, y[n - 1]));
        continue;
      }

      let i = 0;
      while (i < n - 2 && x[i + 1] < vx) {
        i++;
      }

      let h = x[i + 1] - x[i];
      if (h <= 0) {
        lut[k] = Math.max(0, Math.min(1, y[i]));
        continue;
      }
      let t = (vx - x[i]) / h;
      let t2 = t * t;
      let t3 = t2 * t;

      let h00 = 2 * t3 - 3 * t2 + 1;
      let h10 = t3 - 2 * t2 + t;
      let h01 = -2 * t3 + 3 * t2;
      let h11 = t3 - t2;

      let val =
        h00 * y[i] + h10 * h * d[i] + h01 * y[i + 1] + h11 * h * d[i + 1];
      lut[k] = Math.max(0, Math.min(1, val));
    }

    return lut;
  }

  /**
   * Helper: Apply LUT to Float32Array buffer with linear interpolation
   * @param {Float32Array} buf
   * @param {Float32Array} lut
   */
  static applyLUTToBuffer(buf, lut) {
    if (!lut || !buf) return;
    const len = buf.length;
    for (let i = 0; i < len; i++) {
      let v = buf[i];
      if (v <= 0) {
        buf[i] = lut[0];
      } else if (v >= 1) {
        buf[i] = lut[255];
      } else {
        let idx = v * 255;
        let i0 = idx | 0;
        let frac = idx - i0;
        if (i0 >= 255) buf[i] = lut[255];
        else buf[i] = lut[i0] + frac * (lut[i0 + 1] - lut[i0]);
      }
    }
  }

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
    const tmp = window.globalBufferPool
      ? window.globalBufferPool.acquireFloat32(size)
      : new Float32Array(size);
    const out = new Float32Array(size);
    const invWindow = 1 / (2 * r + 1);

    // Horizontal pass
    for (let y = 0; y < height; y++) {
      const row = y * width;
      let sum = 0;
      for (let dx = -r; dx <= r; dx++) {
        const nx = ((dx % width) + width) % width;
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
        const ny = ((dy % height) + height) % height;
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

    if (window.globalBufferPool) window.globalBufferPool.releaseFloat32(tmp);
    return out;
  }

  /**
   * Helper: Directional Blur on Float32Array
   */
  static directionalBlurFloatBuffer(
    buffer,
    width,
    height,
    radius,
    angle = 0,
    cometOptions = {},
  ) {
    if (!radius || radius < 1) return buffer;
    const r = Math.floor(radius);
    const cStr = Math.max(0, Math.min(100, cometOptions.blurComet || 0)) / 100;

    const tmp = window.globalBufferPool
      ? window.globalBufferPool.acquireFloat32(width * height)
      : new Float32Array(width * height);
    if (cStr <= 0 && r > 16) {
      const halfR = r * 0.5;
      CanvasProcessingEngine._singleDirectionalPass(
        buffer,
        tmp,
        width,
        height,
        halfR,
        angle,
        17,
        {},
      );
      CanvasProcessingEngine._singleDirectionalPass(
        tmp,
        buffer,
        width,
        height,
        halfR,
        angle,
        17,
        {},
      );
      if (window.globalBufferPool) window.globalBufferPool.releaseFloat32(tmp);
      return buffer;
    }

    CanvasProcessingEngine._singleDirectionalPass(
      buffer,
      tmp,
      width,
      height,
      r,
      angle,
      21,
      cometOptions,
    );
    buffer.set(tmp);
    if (window.globalBufferPool) window.globalBufferPool.releaseFloat32(tmp);
    return buffer;
  }

  static _singleDirectionalPass(
    srcBuf,
    dstBuf,
    width,
    height,
    radius,
    angle,
    maxSteps = 21,
    cometOptions = {},
  ) {
    const radAngle = ((angle || 0) * Math.PI) / 180;
    const dirX = Math.cos(radAngle);
    const dirY = Math.sin(radAngle);
    const cStr = Math.max(0, Math.min(100, cometOptions.blurComet || 0)) / 100;

    const kernelSamples = [];
    let totalWeight = 0;

    if (cStr <= 0) {
      let steps = maxSteps;
      if (steps % 2 === 0) steps += 1;
      const half = (steps - 1) / 2;
      const stepLen = radius / half;
      for (let s = -half; s <= half; s++) {
        const ox = s * stepLen * dirX;
        const oy = s * stepLen * dirY;
        const wt = Math.exp(-0.5 * Math.pow((s / half) * 1.8, 2));
        kernelSamples.push({ ox, oy, w: wt });
        totalWeight += wt;
      }
    } else {
      const headSize =
        (cometOptions.cometHeadSize !== undefined
          ? cometOptions.cometHeadSize
          : 100) / 100;
      const bulbWidth =
        (cometOptions.cometBulbWidth !== undefined
          ? cometOptions.cometBulbWidth
          : 100) / 100;
      const tailDecay =
        (cometOptions.cometTailFade !== undefined
          ? cometOptions.cometTailFade
          : 50) / 100;
      const asymSign =
        (cometOptions.cometAsymmetry !== undefined
          ? cometOptions.cometAsymmetry
          : 100) >= 0
          ? 1
          : -1;

      const perpX = -dirY;
      const perpY = dirX;

      const tailSteps = Math.max(8, Math.min(21, Math.round(radius * 0.4) | 1));
      const headSteps = Math.max(
        3,
        Math.min(7, Math.round(radius * 0.15 * headSize * cStr) | 1),
      );

      for (let i = 0; i <= tailSteps; i++) {
        const t = i / tailSteps;
        const sLong = asymSign * t * radius * (1 + 0.3 * cStr);
        const decayPow = 0.5 + tailDecay * 1.5;
        const wtLong = Math.pow(1 - t, decayPow);
        const bulbRadius =
          radius *
          0.35 *
          cStr *
          bulbWidth *
          headSize *
          Math.sqrt(Math.max(0, 1 - t * 0.85));

        const ox = sLong * dirX;
        const oy = sLong * dirY;
        kernelSamples.push({ ox, oy, w: wtLong });
        totalWeight += wtLong;

        if (bulbRadius > 0.5) {
          const crossSubSteps = Math.max(
            1,
            Math.min(2, Math.round(bulbRadius * 0.3)),
          );
          const wtCross = (wtLong * 0.5) / crossSubSteps;
          for (let b = 1; b <= crossSubSteps; b++) {
            const bOff = bulbRadius * (b / crossSubSteps);
            kernelSamples.push({
              ox: ox + perpX * bOff,
              oy: oy + perpY * bOff,
              w: wtCross,
            });
            kernelSamples.push({
              ox: ox - perpX * bOff,
              oy: oy - perpY * bOff,
              w: wtCross,
            });
            totalWeight += wtCross * 2;
          }
        }
      }

      for (let i = 1; i <= headSteps; i++) {
        const hFrac = i / headSteps;
        const sLong = -asymSign * hFrac * radius * 0.25 * headSize * cStr;
        const headShape = Math.sqrt(Math.max(0, 1 - hFrac * hFrac));
        const wtLong = headShape;
        const bulbRadius =
          radius * 0.35 * cStr * bulbWidth * headSize * headShape;

        const ox = sLong * dirX;
        const oy = sLong * dirY;
        kernelSamples.push({ ox, oy, w: wtLong });
        totalWeight += wtLong;

        if (bulbRadius > 0.5) {
          const crossSubSteps = Math.max(
            1,
            Math.min(2, Math.round(bulbRadius * 0.3)),
          );
          const wtCross = (wtLong * 0.5) / crossSubSteps;
          for (let b = 1; b <= crossSubSteps; b++) {
            const bOff = bulbRadius * (b / crossSubSteps);
            kernelSamples.push({
              ox: ox + perpX * bOff,
              oy: oy + perpY * bOff,
              w: wtCross,
            });
            kernelSamples.push({
              ox: ox - perpX * bOff,
              oy: oy - perpY * bOff,
              w: wtCross,
            });
            totalWeight += wtCross * 2;
          }
        }
      }
    }

    const invTotalWeight = totalWeight > 0 ? 1 / totalWeight : 1;
    const kLen = kernelSamples.length;
    const smpOx = window.globalBufferPool
      ? window.globalBufferPool.acquireFloat32(kLen)
      : new Float32Array(kLen);
    const smpOy = window.globalBufferPool
      ? window.globalBufferPool.acquireFloat32(kLen)
      : new Float32Array(kLen);
    const smpW = window.globalBufferPool
      ? window.globalBufferPool.acquireFloat32(kLen)
      : new Float32Array(kLen);
    for (let k = 0; k < kLen; k++) {
      smpOx[k] = kernelSamples[k].ox;
      smpOy[k] = kernelSamples[k].oy;
      smpW[k] = kernelSamples[k].w * invTotalWeight;
    }

    for (let y = 0; y < height; y++) {
      const rowOffset = y * width;
      for (let x = 0; x < width; x++) {
        let sum = 0;
        for (let k = 0; k < kLen; k++) {
          const sx = x + smpOx[k];
          const sy = y + smpOy[k];

          let x0 = Math.floor(sx);
          let y0 = Math.floor(sy);
          const fx = sx - x0;
          const fy = sy - y0;
          let x1 = x0 + 1;
          let y1 = y0 + 1;

          x0 = ((x0 % width) + width) % width;
          x1 = ((x1 % width) + width) % width;
          y0 = ((y0 % height) + height) % height;
          y1 = ((y1 % height) + height) % height;

          const v00 = srcBuf[y0 * width + x0];
          const v10 = srcBuf[y0 * width + x1];
          const v01 = srcBuf[y1 * width + x0];
          const v11 = srcBuf[y1 * width + x1];

          sum +=
            ((1 - fx) * (1 - fy) * v00 +
              fx * (1 - fy) * v10 +
              (1 - fx) * fy * v01 +
              fx * fy * v11) *
            smpW[k];
        }
        dstBuf[rowOffset + x] = sum;
      }
    }
    if (window.globalBufferPool) {
      window.globalBufferPool.releaseFloat32(smpOx);
      window.globalBufferPool.releaseFloat32(smpOy);
      window.globalBufferPool.releaseFloat32(smpW);
    }
  }

  /**
   * Helper: Zoom / Radial Blur on Float32Array
   */
  static zoomBlurFloatBuffer(
    buffer,
    width,
    height,
    radius,
    cx = 0.5,
    cy = 0.5,
    strength = 1.0,
  ) {
    if (!radius || radius < 1) return buffer;
    const size = width * height;
    const out = new Float32Array(size);
    const centerX = cx * width;
    const centerY = cy * height;
    const str = strength !== undefined ? strength : 1.0;
    const factor = (radius / 100) * str * 0.5;

    let steps = Math.max(
      9,
      Math.min(121, Math.round(radius * str * (width / 512) * 1.5) | 1),
    );
    if (steps % 2 === 0) steps += 1;
    const halfSteps = (steps - 1) / 2;
    const invSteps = 1 / steps;

    for (let y = 0; y < height; y++) {
      const rowOffset = y * width;
      const dy = y - centerY;
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        let sum = 0;

        for (let k = -halfSteps; k <= halfSteps; k++) {
          const s = k / halfSteps;
          const sx = x + dx * s * factor;
          const sy = y + dy * s * factor;

          let x0 = Math.floor(sx),
            y0 = Math.floor(sy);
          let x1 = x0 + 1,
            y1 = y0 + 1;
          const fx = sx - x0,
            fy = sy - y0;

          x0 = ((x0 % width) + width) % width;
          x1 = ((x1 % width) + width) % width;
          y0 = ((y0 % height) + height) % height;
          y1 = ((y1 % height) + height) % height;

          const v00 = buffer[y0 * width + x0];
          const v10 = buffer[y0 * width + x1];
          const v01 = buffer[y1 * width + x0];
          const v11 = buffer[y1 * width + x1];

          sum +=
            (1 - fx) * (1 - fy) * v00 +
            fx * (1 - fy) * v10 +
            (1 - fx) * fy * v01 +
            fx * fy * v11;
        }
        out[rowOffset + x] = sum * invSteps;
      }
    }
    if (window.globalBufferPool) window.globalBufferPool.releaseFloat32(tmp);
    return out;
  }

  /**
   * Helper: Radial Blur with Influence Zone (Ring/Disk) and Edge Softness
   */
  static radialBlurFloatBuffer(
    buffer,
    width,
    height,
    radius,
    params = {},
    mode = "wrap",
  ) {
    if (!radius || radius < 1) return buffer;
    const size = width * height;
    const out = new Float32Array(size);

    const cx =
      params.radialBlurCenterX !== undefined
        ? parseFloat(params.radialBlurCenterX)
        : 0.5;
    const cy =
      params.radialBlurCenterY !== undefined
        ? parseFloat(params.radialBlurCenterY)
        : 0.5;
    const innerR =
      (params.radialBlurInnerRadius !== undefined
        ? parseFloat(params.radialBlurInnerRadius)
        : 0) / 100;
    const widthR =
      (params.radialBlurWidth !== undefined
        ? parseFloat(params.radialBlurWidth)
        : 100) / 100;
    const softness =
      (params.radialBlurSoftness !== undefined
        ? parseFloat(params.radialBlurSoftness)
        : 40) / 100;
    const rMode = params.radialBlurMode || "spin";
    const spinAngle =
      ((params.radialBlurAngle !== undefined
        ? parseFloat(params.radialBlurAngle)
        : 15) *
        Math.PI) /
      180;

    const centerX = cx * width;
    const centerY = cy * height;
    const maxRadius = Math.sqrt(width * width + height * height) * 0.5;
    const rIn = innerR * maxRadius;
    const rOut = rIn + widthR * maxRadius;
    const soft = Math.max(1, softness * maxRadius * 0.5);

    const scaledRad = radius * (width / 512);
    let numSteps = Math.max(5, Math.min(19, Math.round(scaledRad * 0.3) | 1));
    if (numSteps % 2 === 0) numSteps += 1;
    const halfSteps = (numSteps - 1) / 2;
    const isClamp = mode === "clamp";

    const stepsT = new Float32Array(numSteps);
    const stepsW = new Float32Array(numSteps);
    let totalWeightSum = 0;
    for (let k = -halfSteps; k <= halfSteps; k++) {
      const idx = k + halfSteps;
      const t = k / halfSteps;
      const wt = Math.exp(-2.0 * t * t);
      stepsT[idx] = t;
      stepsW[idx] = wt;
      totalWeightSum += wt;
    }

    for (let y = 0; y < height; y++) {
      const rowOffset = y * width;
      const dy = y - centerY;
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let mask = 1.0;
        if (dist < rIn) {
          if (innerR <= 0) {
            mask = 1.0;
          } else if (dist < rIn - soft) {
            mask = 0.0;
          } else {
            const t = (dist - (rIn - soft)) / (2 * soft);
            mask = t * t * (3 - 2 * t);
          }
        } else if (dist > rOut) {
          if (dist > rOut + soft) {
            mask = 0.0;
          } else {
            const t = (rOut + soft - dist) / (2 * soft);
            mask = t * t * (3 - 2 * t);
          }
        } else {
          let inFade = 1.0;
          let outFade = 1.0;
          if (innerR > 0 && dist - rIn < soft) {
            const t = (dist - rIn + soft) / (2 * soft);
            inFade = t * t * (3 - 2 * t);
          }
          if (rOut - dist < soft) {
            const t = (rOut + soft - dist) / (2 * soft);
            outFade = t * t * (3 - 2 * t);
          }
          mask = Math.min(inFade, outFade);
        }

        if (mask <= 0.001) {
          out[rowOffset + x] = buffer[rowOffset + x];
          continue;
        }

        const effAngle = spinAngle * mask;
        const effZoom = (scaledRad / 100) * 0.25 * mask;

        let sum = 0;
        let wSum = 0;

        for (let i = 0; i < numSteps; i++) {
          const t = stepsT[i];
          const wt = stepsW[i];

          let sdx = dx;
          let sdy = dy;

          if (rMode === "spin" || rMode === "both") {
            const ang = t * effAngle;
            const ca = Math.cos(ang);
            const sa = Math.sin(ang);
            sdx = dx * ca - dy * sa;
            sdy = dx * sa + dy * ca;
          }

          if (rMode === "zoom" || rMode === "both") {
            const scale = 1.0 + t * effZoom;
            sdx *= scale;
            sdy *= scale;
          }

          let sx = centerX + sdx;
          let sy = centerY + sdy;

          let x0 = Math.floor(sx),
            y0 = Math.floor(sy);
          let x1 = x0 + 1,
            y1 = y0 + 1;
          const fx = sx - x0,
            fy = sy - y0;

          if (isClamp) {
            x0 = x0 < 0 ? 0 : x0 >= width ? width - 1 : x0;
            x1 = x1 < 0 ? 0 : x1 >= width ? width - 1 : x1;
            y0 = y0 < 0 ? 0 : y0 >= height ? height - 1 : y0;
            y1 = y1 < 0 ? 0 : y1 >= height ? height - 1 : y1;
          } else {
            x0 = ((x0 % width) + width) % width;
            x1 = ((x1 % width) + width) % width;
            y0 = ((y0 % height) + height) % height;
            y1 = ((y1 % height) + height) % height;
          }

          const v00 = buffer[y0 * width + x0];
          const v10 = buffer[y0 * width + x1];
          const v01 = buffer[y1 * width + x0];
          const v11 = buffer[y1 * width + x1];

          const val =
            (1 - fx) * (1 - fy) * v00 +
            fx * (1 - fy) * v10 +
            (1 - fx) * fy * v01 +
            fx * fy * v11;
          sum += val * wt;
          wSum += wt;
        }

        const blurredVal = sum / wSum;
        out[rowOffset + x] =
          buffer[rowOffset + x] * (1 - mask) + blurredVal * mask;
      }
    }
    if (window.globalBufferPool) window.globalBufferPool.releaseFloat32(tmp);
    return out;
  }

  /**
   * Helper: Sharpen kernel filter on Float32Array
   */
  static sharpenFloatBuffer(buffer, width, height, amount) {
    if (!amount || amount <= 0)
      if (window.globalBufferPool) window.globalBufferPool.releaseFloat32(tmp);
    return buffer;
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
    if (window.globalBufferPool) window.globalBufferPool.releaseFloat32(tmp);
    return out;
  }

  /**
   * Generate Normal Map ImageData
   */
  static generateNormalMap(srcImageData, options = {}) {
    const width = srcImageData.width;
    const height = srcImageData.height;
    const algo = options.algorithm || "sobel"; // 'sobel' | 'scharr' | 'prewitt'
    const strength = options.strength !== undefined ? options.strength : 2.5;
    const level = options.level !== undefined ? options.level : 1.0;
    const blur =
      options.blur !== undefined
        ? options.blur
        : options.blurSharpen && options.blurSharpen > 0
          ? options.blurSharpen
          : 0;
    const sharp =
      options.sharp !== undefined
        ? options.sharp
        : options.blurSharpen && options.blurSharpen < 0
          ? Math.abs(options.blurSharpen)
          : 0;
    const invert = !!options.invert;
    const invertR = !!options.invertR;
    const invertG = !!options.invertG;
    const invertH = !!options.invertH || invert;

    let gray = this.getGrayscaleBuffer(srcImageData);

    if (blur > 0) {
      gray = this.boxBlurFloatBuffer(gray, width, height, blur * 2);
    }
    if (sharp > 0) {
      gray = this.sharpenFloatBuffer(gray, width, height, sharp * 0.5);
    }

    const outImageData = new ImageData(width, height);
    const out = outImageData.data;

    // Convolution weights
    let kx, ky, divisor;
    if (algo === "scharr") {
      kx = [-3, 0, 3, -10, 0, 10, -3, 0, 3];
      ky = [-3, -10, -3, 0, 0, 0, 3, 10, 3];
      divisor = 16;
    } else if (algo === "prewitt") {
      kx = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
      ky = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
      divisor = 3;
    } else {
      // Sobel 3x3 kernel default
      kx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
      ky = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
      divisor = 4;
    }

    const scale = (strength * level * 0.5) / divisor;

    for (let y = 0; y < height; y++) {
      const ym1 = (y - 1 + height) % height;
      const yp1 = (y + 1) % height;

      for (let x = 0; x < width; x++) {
        const xm1 = (x - 1 + width) % width;
        const xp1 = (x + 1) % width;

        const p00 = gray[ym1 * width + xm1];
        const p10 = gray[ym1 * width + x];
        const p20 = gray[ym1 * width + xp1];

        const p01 = gray[y * width + xm1];
        const p21 = gray[y * width + xp1];

        const p02 = gray[yp1 * width + xm1];
        const p12 = gray[yp1 * width + x];
        const p22 = gray[yp1 * width + xp1];

        let dx =
          kx[0] * p00 +
          kx[2] * p20 +
          kx[3] * p01 +
          kx[5] * p21 +
          kx[6] * p02 +
          kx[8] * p22;

        let dy =
          ky[0] * p00 +
          ky[1] * p10 +
          ky[2] * p20 +
          ky[6] * p02 +
          ky[7] * p12 +
          ky[8] * p22;

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

        const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        nx /= len;
        ny /= len;
        nz /= len;

        const r = ((nx * 0.5 + 0.5) * 255 + 0.5) | 0;
        const g = ((ny * 0.5 + 0.5) * 255 + 0.5) | 0;
        const b = ((nz * 0.5 + 0.5) * 255 + 0.5) | 0;

        const idx = (y * width + x) * 4;
        out[idx] = r;
        out[idx + 1] = g;
        out[idx + 2] = b;
        out[idx + 3] = 255;
      }
    }

    if (window.globalBufferPool) {
      window.globalBufferPool.releaseFloat32(outBuffer);
      if (finalBuffer !== outBuffer)
        window.globalBufferPool.releaseFloat32(finalBuffer);
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
    const brightness =
      options.brightness !== undefined ? options.brightness : 0;
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

    if (window.globalBufferPool) {
      window.globalBufferPool.releaseFloat32(outBuffer);
      if (finalBuffer !== outBuffer)
        window.globalBufferPool.releaseFloat32(finalBuffer);
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
    const sharp = options.sharp !== undefined ? options.sharp : 0;
    const mean = options.mean !== undefined ? options.mean : 3;
    const range = options.range !== undefined ? options.range : 8;
    const falloff = options.falloff || "linear"; // 'none' | 'linear' | 'square'
    const invert = !!options.invert;

    let gray = this.getGrayscaleBuffer(srcImageData);

    if (sharp > 0) {
      gray = this.sharpenFloatBuffer(gray, width, height, sharp * 0.5);
    }

    const outImageData = new ImageData(width, height);
    const outBuffer = window.globalBufferPool
      ? window.globalBufferPool.acquireFloat32(width * height)
      : new Float32Array(width * height);

    const radius = Math.max(1, Math.min(32, Math.round(range)));
    let sampleStep = Math.max(1, Math.floor(radius / 4));
    if (width >= 4096) {
      sampleStep = Math.max(sampleStep, Math.floor(width / 1024));
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const centerIdx = y * width + x;
        const centerH = gray[centerIdx];

        let occlusionSum = 0;
        let totalWeight = 0;

        for (let dy = -radius; dy <= radius; dy += sampleStep) {
          for (let dx = -radius; dx <= radius; dx += sampleStep) {
            if (dx === 0 && dy === 0) continue;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > radius) continue;

            const ny = (y + dy + height) % height;
            const nx = (x + dx + width) % width;
            const sampleH = gray[ny * width + nx];

            const diff = sampleH - centerH;
            let weight = 1.0;

            if (falloff === "linear") {
              weight = 1.0 - dist / radius;
            } else if (falloff === "square") {
              const t = 1.0 - dist / radius;
              weight = t * t;
            }

            if (diff > 0) {
              occlusionSum += diff * weight;
            }
            totalWeight += weight;
          }
        }

        const avgOcclusion = totalWeight > 0 ? occlusionSum / totalWeight : 0;
        let aoVal =
          1.0 - Math.min(1.0, avgOcclusion * strength * level * (mean / 2));

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

    if (window.globalBufferPool) {
      window.globalBufferPool.releaseFloat32(outBuffer);
      if (finalBuffer !== outBuffer)
        window.globalBufferPool.releaseFloat32(finalBuffer);
    }
    return outImageData;
  }

  /**
   * Generate Specular Map ImageData
   */
  static generateSpecularMap(srcImageData, options = {}) {
    const width = srcImageData.width;
    const height = srcImageData.height;
    const mean = options.mean !== undefined ? options.mean : 0.5;
    const range = options.range !== undefined ? options.range : 1.0;
    const falloff = options.falloff || "linear"; // 'none' | 'linear' | 'square'
    const strength = options.strength !== undefined ? options.strength : 1.2;
    const level = options.level !== undefined ? options.level : 1.0;
    const blur = options.blur !== undefined ? options.blur : 0;
    const sharp = options.sharp !== undefined ? options.sharp : 0;
    const invert = !!options.invert;

    let gray = this.getGrayscaleBuffer(srcImageData);

    if (blur > 0) {
      gray = this.boxBlurFloatBuffer(gray, width, height, blur * 2);
    }
    if (sharp > 0) {
      gray = this.sharpenFloatBuffer(gray, width, height, sharp * 0.5);
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

        const dx = right - left;
        const dy = bottom - top;
        const edgeMag = Math.sqrt(dx * dx + dy * dy);

        let rawSpec = (center * 0.6 + edgeMag * 0.4) * strength * level;
        let specVal = (rawSpec - mean * 0.5) * range + mean * 0.2;

        specVal = Math.max(0, Math.min(1, specVal));

        if (falloff === "square") {
          specVal = specVal * specVal;
        } else if (falloff === "none") {
          specVal = specVal > mean * 0.8 ? 1.0 : 0.0;
        }

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

    if (window.globalBufferPool) {
      window.globalBufferPool.releaseFloat32(outBuffer);
      if (finalBuffer !== outBuffer)
        window.globalBufferPool.releaseFloat32(finalBuffer);
    }
    return outImageData;
  }

  /**
   * Helper: Convert ImageData to Data URL
   */
  static imageDataToDataURL(imageData, format = "image/png", quality = 0.92) {
    const canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL(format, quality);
  }
}

window.CanvasProcessingEngine = CanvasProcessingEngine;
