/**
 * Offscreen Canvas Compositor Worker - Veil Studio
 * Priority 3: Interactive Canvas Compositor offloaded to Web Worker thread.
 * Performs procedural generation, layer blending, warps, blurs, and post-processing
 * on an OffscreenCanvas transferred from the main UI thread.
 */

// Global state inside worker
let offscreenCanvas = null;
let offscreenCtx = null;
let currentWidth = 512;
let currentHeight = 512;
let paintBuffers = new Map(); // layerId -> { paintBufferR, paintBufferG, paintBufferB }
let imageBitmaps = new Map(); // layerId -> ImageBitmap

// Memory buffers
const floatBuffers = new Map();
function getFloatBuffer(key, size) {
  let buf = floatBuffers.get(key);
  if (!buf || buf.length !== size) {
    buf = new Float32Array(size);
    floatBuffers.set(key, buf);
  }
  return buf;
}

// Pseudo-RNG & Noise Primitives
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 8), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pseudoNoise(x, y) {
  let n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

// --- PERLIN NOISE ENGINE ---
const Perlin = (function () {
  const GRAD2D = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [-1, 1], [1, -1], [-1, -1]
  ];
  const permCache = new Map();

  function getPerm(seed = 1337) {
    let s = (seed | 0) & 0x7fffffff;
    if (permCache.has(s)) return permCache.get(s);
    let rng = mulberry32(s || 1337);
    let p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
      let j = Math.floor(rng() * (i + 1));
      let temp = p[i];
      p[i] = p[j];
      p[j] = temp;
    }
    let perm = new Uint8Array(512);
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
    if (permCache.size > 64) {
      let firstKey = permCache.keys().next().value;
      permCache.delete(firstKey);
    }
    permCache.set(s, perm);
    return perm;
  }

  function fadeQuintic(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function fadeCubic(t) { return t * t * (3 - 2 * t); }
  function fadeCosine(t) { return (1 - Math.cos(t * Math.PI)) * 0.5; }

  function getFade(t, curve = "quintic") {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    switch (curve) {
      case "cubic": return fadeCubic(t);
      case "cosine": return fadeCosine(t);
      case "linear": return t;
      default: return fadeQuintic(t);
    }
  }

  function grad2d(hash, x, y) {
    let g = GRAD2D[hash & 7];
    return g[0] * x + g[1] * y;
  }

  function rawNoise(x, y, seed = 1337, curve = "quintic") {
    let perm = getPerm(seed);
    let X = Math.floor(x) & 255;
    let Y = Math.floor(y) & 255;
    let xf = x - Math.floor(x);
    let yf = y - Math.floor(y);

    let u = getFade(xf, curve);
    let v = getFade(yf, curve);

    let n00 = grad2d(perm[X + perm[Y]], xf, yf);
    let n10 = grad2d(perm[X + 1 + perm[Y]], xf - 1, yf);
    let n01 = grad2d(perm[X + perm[Y + 1]], xf, yf - 1);
    let n11 = grad2d(perm[X + 1 + perm[Y + 1]], xf - 1, yf - 1);

    let nx0 = n00 * (1 - u) + n10 * u;
    let nx1 = n01 * (1 - u) + n11 * u;
    return (nx0 * (1 - v) + nx1 * v + 1) * 0.5;
  }

  return {
    fade: fadeQuintic,
    lerp: (a, b, t) => a + t * (b - a),
    eval(tx, ty, sx, sy, p) {
      let x = tx * sx, y = ty * sy;
      let curve = p.fadeCurve || "quintic";
      let oct = p.octaves || 1;
      let seed = p.seed || 1337;
      if (oct <= 1) return rawNoise(x, y, seed, curve);

      let val = 0, amp = 1, maxAmp = 0, freq = 1;
      let lac = p.lacunarity || 2;
      let gain = p.gain || 0.5;
      for (let o = 0; o < oct; o++) {
        val += rawNoise(x * freq, y * freq, seed + o * 101, curve) * amp;
        maxAmp += amp;
        freq *= lac;
        amp *= gain;
      }
      return val / maxAmp;
    }
  };
})();

// --- SIMPLEX NOISE ENGINE ---
const Simplex = (function () {
  const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
  const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
  const perm = new Uint8Array(512);
  const p = [
    151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,
    8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,
    35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,
    134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,
    55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,
    18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,
    226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,
    17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,
    167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,
    246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
    14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,
    4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,
    156,180
  ];
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  function grad2(hash, x, y) {
    let h = hash & 7;
    let u = h < 4 ? x : y;
    let v = h < 4 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -2.0 * v : 2.0 * v);
  }

  function noise(xin, yin) {
    let n0, n1, n2;
    let s = (xin + yin) * F2;
    let i = Math.floor(xin + s);
    let j = Math.floor(yin + s);
    let t = (i + j) * G2;
    let X0 = i - t;
    let Y0 = j - t;
    let x0 = xin - X0;
    let y0 = yin - Y0;

    let i1, j1;
    if (x0 > y0) { i1 = 1; j1 = 0; }
    else { i1 = 0; j1 = 1; }

    let x1 = x0 - i1 + G2;
    let y1 = y0 - j1 + G2;
    let x2 = x0 - 1.0 + 2.0 * G2;
    let y2 = y0 - 2.0 + 2.0 * G2;

    let ii = i & 255;
    let jj = j & 255;

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) n0 = 0.0;
    else { t0 *= t0; n0 = t0 * t0 * grad2(perm[ii + perm[jj]], x0, y0); }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) n1 = 0.0;
    else { t1 *= t1; n1 = t1 * t1 * grad2(perm[ii + i1 + perm[jj + j1]], x1, y1); }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) n2 = 0.0;
    else { t2 *= t2; n2 = t2 * t2 * grad2(perm[ii + 1 + perm[jj + 1]], x2, y2); }

    return 70.0 * (n0 + n1 + n2);
  }

  return {
    noise,
    eval(tx, ty, sx, sy, params) {
      let x = tx * sx, y = ty * sy;
      let octaves = params.octaves || 1;
      if (octaves <= 1) return (noise(x, y) + 1) / 2;

      let val = 0, amp = 1, maxAmp = 0, freq = 1;
      let lac = params.lacunarity || 2;
      let gain = params.gain || 0.5;
      for (let o = 0; o < octaves; o++) {
        val += ((noise(x * freq, y * freq) + 1) / 2) * amp;
        maxAmp += amp;
        freq *= lac;
        amp *= gain;
      }
      return val / maxAmp;
    }
  };
})();

// --- VORONOI CELLULAR NOISE ENGINE ---
const Voronoi = (function () {
  function hash(x, y) {
    let n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
    return n - Math.floor(n);
  }

  function hash2d(x, y, seed) {
    let h1 = hash(x + seed * 13, y + seed * 37);
    let h2 = hash(x * 3 + seed * 101, y * 7 + seed * 307);
    return [h1, h2];
  }

  function calcDist(dx, dy, metric) {
    let adx = Math.abs(dx), ady = Math.abs(dy);
    switch (metric) {
      case "manhattan": return adx + ady;
      case "chebyshev": return Math.max(adx, ady);
      case "minkowski": return Math.pow(Math.pow(adx, 1.5) + Math.pow(ady, 1.5), 1 / 1.5);
      case "quadratic": return adx * adx + ady * ady;
      default: return Math.sqrt(dx * dx + dy * dy);
    }
  }

  return {
    hash,
    eval(tx, ty, sx, sy, params) {
      let x = tx * sx, y = ty * sy;
      let seed = params.seed || 1337;
      let jitter = params.jitter !== undefined ? params.jitter : 1.0;
      let metric = params.metric || "euclidean";
      let mode = params.mode || "f1";

      let gx = Math.floor(x), gy = Math.floor(y);
      let fx = x - gx, fy = y - gy;

      let minDist1 = 1e9, minDist2 = 1e9, minDist3 = 1e9;
      let closestCellId = 0, closestPtX = 0, closestPtY = 0;

      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          let cx = gx + dx, cy = gy + dy;
          let [hX, hY] = hash2d(cx, cy, seed);
          let px = dx + hX * jitter;
          let py = dy + hY * jitter;
          let d = calcDist(px - fx, py - fy, metric);

          if (d < minDist1) {
            minDist3 = minDist2;
            minDist2 = minDist1;
            minDist1 = d;
            closestCellId = hash(cx, cy);
            closestPtX = px; closestPtY = py;
          } else if (d < minDist2) {
            minDist3 = minDist2;
            minDist2 = d;
          } else if (d < minDist3) {
            minDist3 = d;
          }
        }
      }

      let res = 0;
      switch (mode) {
        case "f2": res = minDist2; break;
        case "f3": res = minDist3; break;
        case "f2_minus_f1": res = minDist2 - minDist1; break;
        case "f1_plus_f2": res = (minDist1 + minDist2) * 0.5; break;
        case "f1_times_f2": res = minDist1 * minDist2; break;
        case "f1_div_f2": res = minDist2 > 0.0001 ? minDist1 / minDist2 : 0; break;
        case "cell_id": res = closestCellId; break;
        case "borders": res = Math.min(1, (minDist2 - minDist1) * 3.0); break;
        case "cracks": res = Math.pow(Math.max(0, 1 - (minDist2 - minDist1) * 4.0), 2); break;
        default: res = minDist1; break;
      }
      return Math.max(0, Math.min(1, res));
    }
  };
})();

// Noise Cache
const NoiseCache = {
  get(x, y) { return (Simplex.noise(x, y) + 1) / 2; }
};

// --- FBM & RIDGED NOISE ---
function fbm(x, y, octaves = 3, lacunarity = 2, gain = 0.5, type = "simplex") {
  let total = 0, frequency = 1, amplitude = 1, maxValue = 0;
  for (let i = 0; i < octaves; i++) {
    let n = type === "perlin"
      ? Perlin.eval(x * frequency, y * frequency, 1, 1, {})
      : (Simplex.noise(x * frequency, y * frequency) + 1) / 2;
    total += n * amplitude;
    maxValue += amplitude;
    amplitude *= gain;
    frequency *= lacunarity;
  }
  return total / maxValue;
}

function ridged(x, y, octaves = 3, lacunarity = 2, gain = 0.5, p = {}) {
  let total = 0, frequency = 1, amplitude = 1, maxValue = 0;
  for (let i = 0; i < octaves; i++) {
    let n = (Simplex.noise(x * frequency, y * frequency) + 1) / 2;
    n = 1 - Math.abs(n * 2 - 1);
    total += n * amplitude;
    maxValue += amplitude;
    amplitude *= gain;
    frequency *= lacunarity;
  }
  return total / maxValue;
}

// --- SPECIAL GENERATORS ---
const SinusoidGenerator = {
  eval(tx, ty, sx, sy, p) {
    let x = tx * sx, y = ty * sy;
    let freq = p.frequency || 4;
    let angleRad = ((p.angle || 0) * Math.PI) / 180;
    let rx = x * Math.cos(angleRad) - y * Math.sin(angleRad);
    let wave = Math.sin(rx * freq * Math.PI * 2);
    return (wave + 1) / 2;
  }
};

const HeartbeatGenerator = {
  eval(tx, ty, sx, sy, p) {
    let x = tx * sx, y = ty * sy;
    let pulse = Math.sin(x * Math.PI * 2 * (p.frequency || 2));
    let spike = Math.exp(-Math.pow((y - 0.5 - pulse * 0.2) * 10, 2));
    return Math.max(0, Math.min(1, spike));
  }
};

const MatrixDigitGenerator = {
  eval(tx, ty, sx, sy, p) {
    let gx = Math.floor(tx * sx), gy = Math.floor(ty * sy);
    let hashVal = Voronoi.hash(gx * 17 + (p.seed || 1337), gy * 31);
    return hashVal > (p.thresholdVal || 50) / 100 ? 1 : 0;
  }
};

const ProceduralGradient = {
  eval(tx, ty, p, sx, sy) {
    let type = p.gradientType || "linear";
    let angleRad = ((p.angle || 0) * Math.PI) / 180;
    let cx = p.centerX ?? 0.5, cy = p.centerY ?? 0.5;
    let dx = tx - cx, dy = ty - cy;

    if (type === "radial") {
      let r = Math.sqrt(dx * dx * sx + dy * dy * sy) * 2;
      return Math.max(0, Math.min(1, r));
    } else if (type === "angle") {
      let a = Math.atan2(dy, dx) / (Math.PI * 2) + 0.5;
      return a;
    } else {
      let rx = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
      return Math.max(0, Math.min(1, rx + 0.5));
    }
  }
};

const Cymatics = {
  getSources(mode, count) {
    let pts = [];
    for (let i = 0; i < count; i++) {
      let a = (i / count) * Math.PI * 2;
      pts.push([0.5 + Math.cos(a) * 0.35, 0.5 + Math.sin(a) * 0.35]);
    }
    return pts;
  },
  noise(tx, ty, p, sources, sx, sy) {
    if (!sources || !sources.length) sources = [[0.5, 0.5]];
    let waveSum = 0;
    let freq = p.frequency || 10;
    for (let i = 0; i < sources.length; i++) {
      let dx = (tx - sources[i][0]) * sx;
      let dy = (ty - sources[i][1]) * sy;
      let dist = Math.sqrt(dx * dx + dy * dy);
      waveSum += Math.cos(dist * freq * Math.PI * 2);
    }
    return (waveSum / sources.length + 1) / 2;
  }
};

const TextGenerator = {
  eval(tx, ty, sx, sy, p, lay) {
    return 0.5;
  }
};

const CanvasDeformerManager = {
  transformPointArray(x, y, points, w, h) {
    if (!points || !points.length) return { x, y };
    let totalWx = 0, totalWy = 0, totalW = 0;
    for (let i = 0; i < points.length; i++) {
      let pt = points[i];
      let dx = x - pt.x, dy = y - pt.y;
      let distSq = dx * dx + dy * dy + 0.0001;
      let wWeight = 1 / distSq;
      totalWx += (x + (pt.targetX - pt.x)) * wWeight;
      totalWy += (y + (pt.targetY - pt.y)) * wWeight;
      totalW += wWeight;
    }
    return { x: totalWx / totalW, y: totalWy / totalW };
  },
  applyZoomStretch(nx, ny, wModifier) {
    let st = (wModifier.strength || 0) / 100;
    let cdx = nx - 0.5, cdy = ny - 0.5;
    let dist = Math.sqrt(cdx * cdx + cdy * cdy);
    let factor = 1 + dist * st;
    return { nx: 0.5 + cdx * factor, ny: 0.5 + cdy * factor };
  }
};

// --- BLEND MODES DICTIONARY ---
const Blend = {
  normal: (b, s) => s,
  multiply: (b, s) => b * s,
  screen: (b, s) => 1 - (1 - b) * (1 - s),
  overlay: (b, s) => (b < 0.5 ? 2 * b * s : 1 - 2 * (1 - b) * (1 - s)),
  darken: (b, s) => Math.min(b, s),
  lighten: (b, s) => Math.max(b, s),
  colorDodge: (b, s) => (s >= 1 ? 1 : Math.min(1, b / (1 - s + 0.0001))),
  colorBurn: (b, s) => (s <= 0 ? 0 : Math.max(0, 1 - (1 - b) / (s + 0.0001))),
  hardLight: (b, s) => (s < 0.5 ? 2 * b * s : 1 - 2 * (1 - b) * (1 - s)),
  softLight: (b, s) =>
    s < 0.5 ? b - (1 - 2 * s) * b * (1 - b) : b + (2 * s - 1) * (Math.sqrt(b) - b),
  difference: (b, s) => Math.abs(b - s),
  exclusion: (b, s) => b + s - 2 * b * s,
  add: (b, s) => Math.min(1, b + s),
  lineardodge: (b, s) => Math.min(1, b + s),
  subtract: (b, s) => Math.max(0, b - s),
  divide: (b, s) => (s <= 0 ? 1 : Math.min(1, b / (s + 0.0001)))
};

// --- COLOR LUT & ADJUSTMENT HELPERS ---
function hexToRgbNormalized(hex) {
  if (!hex || hex[0] !== "#") return [0, 0, 0];
  let h = hex.slice(1);
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  let num = parseInt(h, 16);
  return [(num >> 16) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

function buildLayerColorLUT(p, genType) {
  let lutR = new Float32Array(256);
  let lutG = new Float32Array(256);
  let lutB = new Float32Array(256);

  let colorA = hexToRgbNormalized(p.colorA || "#ffffff");
  let colorB = hexToRgbNormalized(p.colorB || "#000000");

  for (let i = 0; i < 256; i++) {
    let t = i / 255;
    lutR[i] = colorB[0] * (1 - t) + colorA[0] * t;
    lutG[i] = colorB[1] * (1 - t) + colorA[1] * t;
    lutB[i] = colorB[2] * (1 - t) + colorA[2] * t;
  }
  return { lutR, lutG, lutB };
}

function applyRgbColorAdjustments(rgb, hueShift, sat, vib) {
  let r = rgb[0], g = rgb[1], b = rgb[2];
  if (sat !== 100 || vib !== 0) {
    let lum = 0.299 * r + 0.587 * g + 0.114 * b;
    let sFactor = sat / 100;
    r = lum + (r - lum) * sFactor;
    g = lum + (g - lum) * sFactor;
    b = lum + (b - lum) * sFactor;
  }
  return [
    Math.max(0, Math.min(1, r)),
    Math.max(0, Math.min(1, g)),
    Math.max(0, Math.min(1, b))
  ];
}

// --- BLURRING ALGORITHMS ---
function applyBoxBlur(buf, tmp, w, h, rad, mode = "wrap") {
  if (!rad || rad <= 0) return;
  let scaledRad = rad * (w / 512.0);
  if (scaledRad <= 0.001) return;
  applyBoxBlurRaw(buf, tmp, w, h, scaledRad, mode);
}

function applyGaussianBlur(buf, tmp, w, h, rad, mode = "wrap") {
  if (!rad || rad <= 0) return;
  let scaledRad = rad * (w / 512.0);
  if (scaledRad <= 0.001) return;
  let sigma = scaledRad / 2.0;
  let wBox = Math.sqrt(4.0 * sigma * sigma + 1.0);
  let rBox = (wBox - 1.0) / 2.0;
  for (let i = 0; i < 3; i++) {
    applyBoxBlurRaw(buf, tmp, w, h, rBox, mode);
  }
}

function applyBoxBlurRaw(buf, tmp, w, h, r, mode = "wrap") {
  if (r <= 0.001) return;
  let effectiveMode = mode;
  if (typeof mode === "boolean") {
    effectiveMode = mode ? "clamp" : "wrap";
  }
  let rInt = Math.floor(r);
  let f = r - rInt;
  let invWindow = 1.0 / (2.0 * r + 1.0);

  // Horizontal Pass O(1) moving sum with exact fractional weights
  for (let y = 0; y < h; y++) {
    let rowOffset = y * w;
    let sum = 0;

    if (effectiveMode === "clamp") {
      let idxL = Math.max(0, Math.min(w - 1, -rInt - 1));
      sum += f * buf[rowOffset + idxL];
      for (let dx = -rInt; dx <= rInt; dx++) {
        let idx = Math.max(0, Math.min(w - 1, dx));
        sum += buf[rowOffset + idx];
      }
      let idxR = Math.max(0, Math.min(w - 1, rInt + 1));
      sum += f * buf[rowOffset + idxR];

      tmp[rowOffset] = sum * invWindow;

      for (let x = 1; x < w; x++) {
        if (x % 32 === 0) {
          sum = 0;
          let iL = Math.max(0, Math.min(w - 1, x - rInt - 1));
          sum += f * buf[rowOffset + iL];
          for (let dx = -rInt; dx <= rInt; dx++) {
            let iM = Math.max(0, Math.min(w - 1, x + dx));
            sum += buf[rowOffset + iM];
          }
          let iR = Math.max(0, Math.min(w - 1, x + rInt + 1));
          sum += f * buf[rowOffset + iR];
        } else {
          let o1 = Math.max(0, Math.min(w - 1, x - 1 - rInt - 1));
          let o2 = Math.max(0, Math.min(w - 1, x - 1 - rInt));
          let i1 = Math.max(0, Math.min(w - 1, x - 1 + rInt + 1));
          let i2 = Math.max(0, Math.min(w - 1, x - 1 + rInt + 2));

          sum += f * buf[rowOffset + i2] + (1.0 - f) * buf[rowOffset + i1]
               - (1.0 - f) * buf[rowOffset + o2] - f * buf[rowOffset + o1];
        }
        tmp[rowOffset + x] = sum * invWindow;
      }
    } else {
      sum += f * buf[rowOffset + (((-rInt - 1) % w + w) % w)];
      for (let dx = -rInt; dx <= rInt; dx++) {
        sum += buf[rowOffset + (((dx) % w + w) % w)];
      }
      sum += f * buf[rowOffset + (((rInt + 1) % w + w) % w)];

      tmp[rowOffset] = sum * invWindow;

      for (let x = 1; x < w; x++) {
        if (x % 32 === 0) {
          sum = 0;
          sum += f * buf[rowOffset + (((x - rInt - 1) % w + w) % w)];
          for (let dx = -rInt; dx <= rInt; dx++) {
            sum += buf[rowOffset + (((x + dx) % w + w) % w)];
          }
          sum += f * buf[rowOffset + (((x + rInt + 1) % w + w) % w)];
        } else {
          let o1 = ((x - 1 - rInt - 1) % w + w) % w;
          let o2 = ((x - 1 - rInt) % w + w) % w;
          let i1 = ((x - 1 + rInt + 1) % w + w) % w;
          let i2 = ((x - 1 + rInt + 2) % w + w) % w;

          sum += f * buf[rowOffset + i2] + (1.0 - f) * buf[rowOffset + i1]
               - (1.0 - f) * buf[rowOffset + o2] - f * buf[rowOffset + o1];
        }
        tmp[rowOffset + x] = sum * invWindow;
      }
    }
  }

  // Vertical Pass O(1) moving sum with exact fractional weights
  for (let x = 0; x < w; x++) {
    let sum = 0;

    if (effectiveMode === "clamp") {
      let idxL = Math.max(0, Math.min(h - 1, -rInt - 1));
      sum += f * tmp[idxL * w + x];
      for (let dy = -rInt; dy <= rInt; dy++) {
        let idx = Math.max(0, Math.min(h - 1, dy));
        sum += tmp[idx * w + x];
      }
      let idxR = Math.max(0, Math.min(h - 1, rInt + 1));
      sum += f * tmp[idxR * w + x];

      buf[x] = sum * invWindow;

      for (let y = 1; y < h; y++) {
        if (y % 32 === 0) {
          sum = 0;
          let iL = Math.max(0, Math.min(h - 1, y - rInt - 1));
          sum += f * tmp[iL * w + x];
          for (let dy = -rInt; dy <= rInt; dy++) {
            let iM = Math.max(0, Math.min(h - 1, y + dy));
            sum += tmp[iM * w + x];
          }
          let iR = Math.max(0, Math.min(h - 1, y + rInt + 1));
          sum += f * tmp[iR * w + x];
        } else {
          let o1 = Math.max(0, Math.min(h - 1, y - 1 - rInt - 1));
          let o2 = Math.max(0, Math.min(h - 1, y - 1 - rInt));
          let i1 = Math.max(0, Math.min(h - 1, y - 1 + rInt + 1));
          let i2 = Math.max(0, Math.min(h - 1, y - 1 + rInt + 2));

          sum += f * tmp[i2 * w + x] + (1.0 - f) * tmp[i1 * w + x]
               - (1.0 - f) * tmp[o2 * w + x] - f * tmp[o1 * w + x];
        }
        buf[y * w + x] = sum * invWindow;
      }
    } else {
      sum += f * tmp[(((-rInt - 1) % h + h) % h) * w + x];
      for (let dy = -rInt; dy <= rInt; dy++) {
        sum += tmp[(((dy) % h + h) % h) * w + x];
      }
      sum += f * tmp[(((rInt + 1) % h + h) % h) * w + x];

      buf[x] = sum * invWindow;

      for (let y = 1; y < h; y++) {
        if (y % 32 === 0) {
          sum = 0;
          sum += f * tmp[(((y - rInt - 1) % h + h) % h) * w + x];
          for (let dy = -rInt; dy <= rInt; dy++) {
            sum += tmp[(((y + dy) % h + h) % h) * w + x];
          }
          sum += f * tmp[(((y + rInt + 1) % h + h) % h) * w + x];
        } else {
          let o1 = ((y - 1 - rInt - 1) % h + h) % h;
          let o2 = ((y - 1 - rInt) % h + h) % h;
          let i1 = ((y - 1 + rInt + 1) % h + h) % h;
          let i2 = ((y - 1 + rInt + 2) % h + h) % h;

          sum += f * tmp[i2 * w + x] + (1.0 - f) * tmp[i1 * w + x]
               - (1.0 - f) * tmp[o2 * w + x] - f * tmp[o1 * w + x];
        }
        buf[y * w + x] = sum * invWindow;
      }
    }
  }
}

function applyDirectionalBlur(buffer, temp, w, h, radius, angle, mode) {
  if (radius <= 0) return;
  temp.set(buffer);
  let radAngle = (angle * Math.PI) / 180;
  let dx = Math.cos(radAngle);
  let dy = Math.sin(radAngle);
  let steps = Math.min(Math.floor(radius), 32);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let i = -steps; i <= steps; i++) {
        let sx = Math.round(x + dx * i);
        let sy = Math.round(y + dy * i);
        if (mode === "wrap") {
          sx = ((sx % w) + w) % w;
          sy = ((sy % h) + h) % h;
        } else {
          sx = Math.max(0, Math.min(w - 1, sx));
          sy = Math.max(0, Math.min(h - 1, sy));
        }
        sum += temp[sy * w + sx];
      }
      buffer[y * w + x] = sum / (2 * steps + 1);
    }
  }
}

function applyZoomBlur(buffer, temp, w, h, radius, cx, cy, strength, mode) {
  if (radius <= 0) return;
  temp.set(buffer);
  let steps = Math.min(Math.floor(radius), 24);
  let centerX = cx * w;
  let centerY = cy * h;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let vx = (x - centerX) / w;
      let vy = (y - centerY) / h;
      for (let i = 0; i < steps; i++) {
        let scale = 1 - (i / steps) * (strength / 100) * 0.1;
        let sx = Math.round(centerX + vx * scale * w);
        let sy = Math.round(centerY + vy * scale * h);
        sx = Math.max(0, Math.min(w - 1, sx));
        sy = Math.max(0, Math.min(h - 1, sy));
        sum += temp[sy * w + sx];
      }
      buffer[y * w + x] = sum / steps;
    }
  }
}

function applyRadialBlur(buffer, temp, w, h, radius, globalState, mode) {
  if (radius <= 0) return;
  temp.set(buffer);
  let steps = Math.min(Math.floor(radius), 24);
  let centerX = w / 2, centerY = h / 2;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let angle = Math.atan2(y - centerY, x - centerX);
      let dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

      for (let i = -steps; i <= steps; i++) {
        let a = angle + (i / steps) * 0.05;
        let sx = Math.round(centerX + Math.cos(a) * dist);
        let sy = Math.round(centerY + Math.sin(a) * dist);
        sx = Math.max(0, Math.min(w - 1, sx));
        sy = Math.max(0, Math.min(h - 1, sy));
        sum += temp[sy * w + sx];
      }
      buffer[y * w + x] = sum / (2 * steps + 1);
    }
  }
}

// --- EVALUATE GENERATOR PIXEL ---
function evalGeneratorPixelWorker(type, tx, ty, sx, sy, p, lay) {
  let v = 0.5;
  switch (type) {
    case "gradient": v = ProceduralGradient.eval(tx, ty, p, sx, sy); break;
    case "cymatics": v = Cymatics.noise(tx, ty, p, null, sx, sy); break;
    case "simplex": v = Simplex.eval(tx, ty, sx, sy, p); break;
    case "perlin": v = Perlin.eval(tx, ty, sx, sy, p); break;
    case "voronoi": v = Voronoi.eval(tx, ty, sx, sy, p); break;
    case "fbm": v = fbm(tx * sx, ty * sy, p.octaves || 3, p.lacunarity ?? 2, p.gain ?? 0.5, "simplex"); break;
    case "ridged": v = ridged(tx * sx, ty * sy, p.octaves || 3, p.lacunarity ?? 2, p.gain ?? 0.5, p); break;
    case "sine": v = SinusoidGenerator.eval(tx, ty, sx, sy, p); break;
    case "heartbeat": v = HeartbeatGenerator.eval(tx, ty, sx, sy, p); break;
    case "matrix_digits": v = MatrixDigitGenerator.eval(tx, ty, sx, sy, p); break;
    case "radial": {
      let rdx = (tx - 0.5) * sx, rdy = (ty - 0.5) * sy;
      let dc = Math.sqrt(rdx * rdx + rdy * rdy);
      v = (Math.sin(dc * Math.PI * 2) + 1) / 2;
      break;
    }
    case "spiral": {
      let sdx = (tx - 0.5) * sx, sdy = (ty - 0.5) * sy;
      let ds = Math.sqrt(sdx * sdx + sdy * sdy);
      let as = Math.atan2(sdy, sdx);
      v = (Math.sin(ds * Math.PI * 2 + as * (p.octaves || 3)) + 1) / 2;
      break;
    }
    case "hexagon": {
      let hc = Math.cos(tx * sx * Math.PI * 2) +
               Math.cos((tx * sx * 0.5 + ty * sy * 0.866025) * Math.PI * 2) +
               Math.cos((tx * sx * 0.5 - ty * sy * 0.866025) * Math.PI * 2);
      v = (hc + 1.5) / 4.5;
      break;
    }
    default:
      v = Simplex.eval(tx, ty, sx, sy, p);
      break;
  }

  if (p.brightness !== undefined) v *= p.brightness;
  if (p.contrast !== undefined) v = (v - 0.5) * p.contrast + 0.5;
  if (p.invert) v = 1 - v;
  return Math.max(0, Math.min(1, v));
}

// --- MAIN PROJECT COMPOSITOR WORKER PIPELINE ---
function renderProjectWorker(state, options) {
  if (!offscreenCanvas || !offscreenCtx) return;

  const start = performance.now();
  const w = options.width || currentWidth;
  const h = options.height || currentHeight;

  if (!offscreenCanvas || currentWidth !== w || currentHeight !== h) {
    currentWidth = w;
    currentHeight = h;
    if (typeof OffscreenCanvas !== "undefined") {
      offscreenCanvas = new OffscreenCanvas(w, h);
      offscreenCtx = offscreenCanvas.getContext("2d", { willReadFrequently: true });
    }
  } else if (offscreenCanvas) {
    if (offscreenCanvas.width !== w || offscreenCanvas.height !== h) {
      offscreenCanvas.width = w;
      offscreenCanvas.height = h;
    }
  }

  const blendBufferR = getFloatBuffer("blendBufferR", w * h);
  const blendBufferG = getFloatBuffer("blendBufferG", w * h);
  const blendBufferB = getFloatBuffer("blendBufferB", w * h);

  const layerBufferR = getFloatBuffer("layerBufferR", w * h);
  const layerBufferG = getFloatBuffer("layerBufferG", w * h);
  const layerBufferB = getFloatBuffer("layerBufferB", w * h);

  const blurTempR = getFloatBuffer("blurTempR", w * h);
  const blurTempG = getFloatBuffer("blurTempG", w * h);
  const blurTempB = getFloatBuffer("blurTempB", w * h);

  blendBufferR.fill(0);
  blendBufferG.fill(0);
  blendBufferB.fill(0);

  const imgData = offscreenCtx.createImageData(w, h);
  const data = imgData.data;

  const layers = state.layers || [];
  const global = state.global || {};

  let firstBlend = true;

  for (let lIdx = 0; lIdx < layers.length; lIdx++) {
    let lay = layers[lIdx];
    if (!lay || !lay.visible) continue;

    let op = lay.opacity / 100;
    let bFn = Blend[lay.blendMode] || Blend.normal;
    let p = lay.params || {};

    let sx = p.scaleX !== undefined ? p.scaleX : (p.scale || 10);
    let sy = p.scaleY !== undefined ? p.scaleY : (p.scale || 10);
    let genType = lay.generatorType || "simplex";

    const { lutR, lutG, lutB } = buildLayerColorLUT(p, genType);

    for (let y = 0; y < h; y++) {
      let ny = y / h;
      for (let x = 0; x < w; x++) {
        let nx = x / w;
        let idx = y * w + x;

        let v = evalGeneratorPixelWorker(genType, nx, ny, sx, sy, p, lay);
        let lutIdx = Math.max(0, Math.min(255, (v * 255.99) | 0));

        layerBufferR[idx] = lutR[lutIdx];
        layerBufferG[idx] = lutG[lutIdx];
        layerBufferB[idx] = lutB[lutIdx];
      }
    }

    if (p.blur > 0) {
      applyGaussianBlur(layerBufferR, blurTempR, w, h, p.blur, "wrap");
      applyGaussianBlur(layerBufferG, blurTempG, w, h, p.blur, "wrap");
      applyGaussianBlur(layerBufferB, blurTempB, w, h, p.blur, "wrap");
    }

    if (firstBlend) {
      blendBufferR.set(layerBufferR);
      blendBufferG.set(layerBufferG);
      blendBufferB.set(layerBufferB);
      firstBlend = false;
    } else {
      let oneMinusOp = 1 - op;
      for (let i = 0; i < w * h; i++) {
        let br = blendBufferR[i], bg = blendBufferG[i], bb = blendBufferB[i];
        let lr = layerBufferR[i], lg = layerBufferG[i], lb = layerBufferB[i];
        blendBufferR[i] = br * oneMinusOp + bFn(br, lr) * op;
        blendBufferG[i] = bg * oneMinusOp + bFn(bg, lg) * op;
        blendBufferB[i] = bb * oneMinusOp + bFn(bb, lb) * op;
      }
    }
  }

  // --- GLOBAL POST-PROCESSING ---
  if (global.blur > 0) {
    applyGaussianBlur(blendBufferR, blurTempR, w, h, global.blur, "wrap");
    applyGaussianBlur(blendBufferG, blurTempG, w, h, global.blur, "wrap");
    applyGaussianBlur(blendBufferB, blurTempB, w, h, global.blur, "wrap");
  }

  let gc = global.contrast || 1;
  let gg = global.gamma || 1;
  let gr = global.grain || 0;
  let gi = global.invert === true;

  let vAmt = global.vignetteAmount !== undefined ? global.vignetteAmount : (global.vignette ? -Math.round(global.vignette * 100) : 0);
  let hasVignette = vAmt !== 0;
  let amtNorm = vAmt / 100;

  for (let y = 0; y < h; y++) {
    let ny = y / h - 0.5;
    for (let x = 0; x < w; x++) {
      let nx = x / w - 0.5;
      let px_idx = y * w + x;
      let vr = blendBufferR[px_idx];
      let vg = blendBufferG[px_idx];
      let vb = blendBufferB[px_idx];

      if (gi) { vr = 1 - vr; vg = 1 - vg; vb = 1 - vb; }
      if (gc !== 1) {
        vr = (vr - 0.5) * gc + 0.5;
        vg = (vg - 0.5) * gc + 0.5;
        vb = (vb - 0.5) * gc + 0.5;
      }
      if (gg !== 1) {
        if (vr > 0) vr = Math.pow(vr, 1 / gg);
        if (vg > 0) vg = Math.pow(vg, 1 / gg);
        if (vb > 0) vb = Math.pow(vb, 1 / gg);
      }

      if (hasVignette) {
        let d = 2.0 * Math.sqrt(nx * nx + ny * ny);
        let factor = 1.0 - Math.max(0, Math.min(1, d)) * Math.abs(amtNorm);
        vr *= factor; vg *= factor; vb *= factor;
      }

      if (gr > 0) {
        let gVal = (pseudoNoise(px_idx, 999) - 0.5) * (gr / 255);
        vr += gVal; vg += gVal; vb += gVal;
      }

      let px = px_idx * 4;
      data[px] = Math.max(0, Math.min(255, Math.floor(vr * 255)));
      data[px + 1] = Math.max(0, Math.min(255, Math.floor(vg * 255)));
      data[px + 2] = Math.max(0, Math.min(255, Math.floor(vb * 255)));
      data[px + 3] = 255;
    }
  }

  // Draw directly onto OffscreenCanvas context
  offscreenCtx.putImageData(imgData, 0, 0);

  const duration = performance.now() - start;
  return duration;
}

// --- WORKER MESSAGE HANDLER ---
self.onmessage = function (e) {
  const data = e.data;
  if (!data) return;

  switch (data.type) {
    case "INIT": {
      currentWidth = data.width || 512;
      currentHeight = data.height || 512;
      if (data.canvas) {
        offscreenCanvas = data.canvas;
      } else if (typeof OffscreenCanvas !== "undefined") {
        offscreenCanvas = new OffscreenCanvas(currentWidth, currentHeight);
      }
      if (offscreenCanvas) {
        offscreenCtx = offscreenCanvas.getContext("2d", { willReadFrequently: true });
      }
      console.log(`[OffscreenWorker] Canvas initialized (${currentWidth}x${currentHeight})`);
      break;
    }

    case "RESIZE": {
      if (data.width && data.height) {
        currentWidth = data.width;
        currentHeight = data.height;
        if (offscreenCanvas) {
          offscreenCanvas.width = currentWidth;
          offscreenCanvas.height = currentHeight;
        }
      }
      break;
    }

    case "RENDER": {
      const renderId = data.renderId;
      const state = data.state || {};
      const options = data.options || {};
      const duration = renderProjectWorker(state, options);

      let bitmap = null;
      if (offscreenCanvas && typeof offscreenCanvas.transferToImageBitmap === "function") {
        try {
          bitmap = offscreenCanvas.transferToImageBitmap();
        } catch (err) {
          console.warn("[OffscreenWorker] transferToImageBitmap error:", err);
        }
      }

      if (bitmap) {
        self.postMessage({
          type: "RENDER_COMPLETE",
          renderId,
          renderTime: duration,
          bitmap,
          width: currentWidth,
          height: currentHeight,
          isDraft: !!options.isDraft
        }, [bitmap]);
      } else {
        self.postMessage({
          type: "RENDER_COMPLETE",
          renderId,
          renderTime: duration,
          width: currentWidth,
          height: currentHeight,
          isDraft: !!options.isDraft
        });
      }
      break;
    }

    case "UPDATE_PAINT_BUFFER": {
      if (data.layerId && data.paintBufferR) {
        paintBuffers.set(data.layerId, {
          R: new Float32Array(data.paintBufferR),
          G: new Float32Array(data.paintBufferG),
          B: new Float32Array(data.paintBufferB)
        });
      }
      break;
    }
  }
};
