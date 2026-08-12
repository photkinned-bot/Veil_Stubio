/**
 * Veil Studio - High-Performance WebGL/WebGPU Hardware Acceleration Pipeline
 * Offloads procedural layer deformation, noise generation, blending, and post-effects to GPU via WebGL2/WebGPU.
 */

export class WebGLRenderer {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.gl =
      this.canvas.getContext("webgl2", {
        preserveDrawingBuffer: true,
        alpha: true,
      }) ||
      this.canvas.getContext("webgl", {
        preserveDrawingBuffer: true,
        alpha: true,
      });
    this.isSupported = !!this.gl;
    this.webgpuSupported = false;
    this.gpuAdapter = null;
    this.gpuDevice = null;
    this.programs = new Map();
    this.textures = new Map();
    this.buffers = {};

    if (this.isSupported) {
      this.initGL();
    }
    this.initWebGPU();
  }

  async initWebGPU() {
    if (typeof navigator !== "undefined" && navigator.gpu) {
      try {
        this.gpuAdapter = await navigator.gpu.requestAdapter();
        if (this.gpuAdapter) {
          this.gpuDevice = await this.gpuAdapter.requestDevice();
          this.webgpuSupported = !!this.gpuDevice;
          if (this.webgpuSupported) {
            console.log("⚡ Veil Studio: WebGPU hardware acceleration active!");
          }
        }
      } catch (err) {
        console.warn(
          "WebGPU not available on this device/browser, falling back to WebGL2:",
          err,
        );
        this.webgpuSupported = false;
      }
    }
  }

  initGL() {
    const gl = this.gl;
    if (!gl) return;

    // Vertex quad positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
      ]),
      gl.STATIC_DRAW,
    );
    this.buffers.position = positionBuffer;

    this.initWarpProgram();
    this.initBlendProgram();
    this.initNoiseProgram();
  }

  createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn("WebGL Shader compile error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  createProgram(gl, vsSource, fsSource) {
    const vs = this.createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = this.createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("WebGL Program link error:", gl.getProgramInfoLog(program));
      return null;
    }
    return program;
  }

  initWarpProgram() {
    const gl = this.gl;
    if (!gl) return;

    const vs = `
            attribute vec2 a_position;
            varying vec2 v_texCoord;
            void main() {
                v_texCoord = a_position * 0.5 + 0.5;
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

    // GPU Deformation GLSL Shader
    const fs = `
            precision mediump float;
            varying vec2 v_texCoord;
            uniform sampler2D u_image;
            uniform vec2 u_resolution;
            uniform int u_warpType; // 0: none, 1: vortex, 2: twirl, 3: sine, 4: bulge, 5: polar
            uniform float u_strength;
            uniform float u_freq;

            void main() {
                vec2 st = v_texCoord;
                vec2 cdx = st - vec2(0.5);
                float cdist = length(cdx);

                if (u_warpType == 1) { // Vortex
                    float a = cdist * u_strength * 15.0;
                    st = vec2(
                        0.5 + cdx.x * cos(a) - cdx.y * sin(a),
                        0.5 + cdx.x * sin(a) + cdx.y * cos(a)
                    );
                } else if (u_warpType == 2) { // Twirl
                    float falloff = max(0.0, 1.0 - (cdist / (u_freq * 0.25)));
                    float a = falloff * u_strength * 10.0;
                    st = vec2(
                        0.5 + cdx.x * cos(a) - cdx.y * sin(a),
                        0.5 + cdx.x * sin(a) + cdx.y * cos(a)
                    );
                } else if (u_warpType == 3) { // Sine
                    float waveX = sin(st.y * u_freq * 3.14159265) * u_strength * 0.1;
                    float waveY = cos(st.x * u_freq * 3.14159265) * u_strength * 0.1;
                    st += vec2(waveX, waveY);
                } else if (u_warpType == 4) { // Bulge
                    float power = exp(-cdist * u_freq);
                    float scale = 1.0 + power * u_strength;
                    st = vec2(0.5) + cdx * scale;
                } else if (u_warpType == 5) { // Polar
                    float r = cdist * u_freq;
                    float theta = atan(cdx.y, cdx.x) / (6.2831853);
                    st = vec2(
                        0.5 + r * cos(theta * 6.2831853) * u_strength,
                        0.5 + r * sin(theta * 6.2831853) * u_strength
                    );
                }

                // Clamp to border
                st = clamp(st, 0.0, 1.0);
                gl_FragColor = texture2D(u_image, st);
            }
        `;

    const prog = this.createProgram(gl, vs, fs);
    if (prog) {
      this.programs.set("warp", prog);
    }
  }

  initBlendProgram() {
    const gl = this.gl;
    if (!gl) return;

    const vs = `
            attribute vec2 a_position;
            varying vec2 v_texCoord;
            void main() {
                v_texCoord = a_position * 0.5 + 0.5;
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

    const fs = `
            precision mediump float;
            varying vec2 v_texCoord;
            uniform sampler2D u_base;
            uniform sampler2D u_layer;
            uniform float u_opacity;
            uniform int u_blendMode; // 0: normal, 1: multiply, 2: screen, 3: overlay, 4: difference

            void main() {
                vec4 base = texture2D(u_base, v_texCoord);
                vec4 layer = texture2D(u_layer, v_texCoord);
                vec3 res = layer.rgb;

                if (u_blendMode == 1) { // Multiply
                    res = base.rgb * layer.rgb;
                } else if (u_blendMode == 2) { // Screen
                    res = 1.0 - (1.0 - base.rgb) * (1.0 - layer.rgb);
                } else if (u_blendMode == 3) { // Overlay
                    vec3 cond1 = 2.0 * base.rgb * layer.rgb;
                    vec3 cond2 = 1.0 - 2.0 * (1.0 - base.rgb) * (1.0 - layer.rgb);
                    res = mix(cond1, cond2, step(vec3(0.5), base.rgb));
                } else if (u_blendMode == 4) { // Difference
                    res = abs(base.rgb - layer.rgb);
                }

                gl_FragColor = vec4(mix(base.rgb, res, u_opacity), base.a);
            }
        `;

    const prog = this.createProgram(gl, vs, fs);
    if (prog) {
      this.programs.set("blend", prog);
    }
  }

  renderWarp(sourceCanvas, warpType, strength, freq) {
    if (!this.isSupported) return null;
    const gl = this.gl;
    const prog = this.programs.get("warp");
    if (!prog) return null;

    const w = sourceCanvas.width;
    const h = sourceCanvas.height;
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    gl.useProgram(prog);

    // Upload texture
    let tex = this.textures.get("warp_src");
    if (!tex) {
      tex = gl.createTexture();
      this.textures.set("warp_src", tex);
    }
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      sourceCanvas,
    );

    // Position attribute
    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    gl.uniform2f(gl.getUniformLocation(prog, "u_resolution"), w, h);
    gl.uniform1i(gl.getUniformLocation(prog, "u_warpType"), warpType);
    gl.uniform1f(gl.getUniformLocation(prog, "u_strength"), strength);
    gl.uniform1f(gl.getUniformLocation(prog, "u_freq"), freq);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    return this.canvas;
  }

  initNoiseProgram() {
    const gl = this.gl;
    if (!gl) return;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_texCoord;

      uniform vec2 u_resolution;
      uniform int u_noiseType; // 0: Perlin, 1: Simplex, 2: Voronoi F1, 3: Voronoi F2, 4: Voronoi F2-F1, 5: FBM Perlin, 6: FBM Simplex, 7: Ridged, 8: Cell, 9: Sine, 10: Wave, 11: Grid
      uniform vec2 u_scale;
      uniform int u_octaves;
      uniform float u_lacunarity;
      uniform float u_gain;
      uniform float u_seed;
      uniform float u_jitter;
      uniform int u_metric; // 0: Euclidean, 1: Manhattan, 2: Chebyshev
      uniform float u_brightness;
      uniform float u_contrast;
      uniform int u_invert;
      uniform int u_seamless;
      uniform float u_seamlessSoftness;

      vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
      vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      vec2 hash2(vec2 p) {
        p = vec2(dot(p, vec2(127.1 + u_seed, 311.7 + u_seed * 17.1)),
                 dot(p, vec2(269.5 + u_seed * 3.7, 183.3 + u_seed * 23.3)));
        return fract(sin(p) * 43758.5453123);
      }

      float cnoise(vec2 P) {
        vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
        vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
        Pi = mod(Pi, 289.0);
        vec4 ix = Pi.xzxz;
        vec4 iy = Pi.yyzz;
        vec4 fx = Pf.xzxz;
        vec4 fy = Pf.yyzz;
        vec4 i = permute(permute(ix) + iy);
        vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
        vec4 gy = abs(gx) - 0.5;
        vec4 tx = floor(gx + 0.5);
        gx = gx - tx;
        vec2 g00 = vec2(gx.x, gy.x);
        vec2 g10 = vec2(gx.y, gy.y);
        vec2 g01 = vec2(gx.z, gy.z);
        vec2 g11 = vec2(gx.w, gy.w);
        vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g10, g10), dot(g01, g01), dot(g11, g11)));
        g00 *= norm.x; g10 *= norm.y; g01 *= norm.z; g11 *= norm.w;
        float n00 = dot(g00, vec2(fx.x, fy.x));
        float n10 = dot(g10, vec2(fx.y, fy.y));
        float n01 = dot(g01, vec2(fx.z, fy.z));
        float n11 = dot(g11, vec2(fx.w, fy.w));
        vec2 fade_xy = Pf.xy * Pf.xy * Pf.xy * (Pf.xy * (Pf.xy * 6.0 - 15.0) + 10.0);
        vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
        float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
        return 0.5 + 1.15 * n_xy;
      }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
        m = m * m; m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 0.5 + 0.5 * 130.0 * dot(m, g);
      }

      vec3 voronoi(vec2 x, float jitter, int metric, int mode) {
        vec2 n = floor(x);
        vec2 f = fract(x);
        float m_dist = 8.0;
        float m_dist2 = 8.0;
        vec2 m_point = vec2(0.0);

        for (int j = -1; j <= 1; j++) {
          for (int i = -1; i <= 1; i++) {
            vec2 g = vec2(float(i), float(j));
            vec2 o = hash2(n + g);
            o = 0.5 + 0.5 * sin(6.2831853 * o) * jitter;
            vec2 r = g + o - f;

            float d = 0.0;
            if (metric == 1) {
              d = abs(r.x) + abs(r.y);
            } else if (metric == 2) {
              d = max(abs(r.x), abs(r.y));
            } else {
              d = dot(r, r);
            }

            if (d < m_dist) {
              m_dist2 = m_dist;
              m_dist = d;
              m_point = o;
            } else if (d < m_dist2) {
              m_dist2 = d;
            }
          }
        }

        if (metric == 0) {
          m_dist = sqrt(m_dist);
          m_dist2 = sqrt(m_dist2);
        }

        float val = m_dist;
        if (mode == 1) val = m_dist2;
        else if (mode == 2) val = clamp(m_dist2 - m_dist, 0.0, 1.0);
        else if (mode == 3) val = m_point.x;

        return vec3(val, m_dist, m_dist2);
      }

      float fbm(vec2 st, int octaves, float lacunarity, float gain, int baseType) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for (int i = 0; i < 8; i++) {
          if (i >= octaves) break;
          float n = 0.0;
          if (baseType == 1) {
            n = snoise(st * frequency);
          } else if (baseType == 2) {
            n = voronoi(st * frequency, u_jitter, u_metric, 0).x;
          } else {
            n = cnoise(st * frequency);
          }
          value += amplitude * n;
          frequency *= lacunarity;
          amplitude *= gain;
        }
        return value;
      }

      float ridged(vec2 st, int octaves, float lacunarity, float gain) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        float weight = 1.0;
        for (int i = 0; i < 8; i++) {
          if (i >= octaves) break;
          float n = cnoise(st * frequency);
          n = 1.0 - abs(n * 2.0 - 1.0);
          n = n * n * weight;
          weight = clamp(n * 2.0, 0.0, 1.0);
          value += n * amplitude;
          frequency *= lacunarity;
          amplitude *= gain;
        }
        return value;
      }

      float evalBaseNoise(vec2 p) {
        float v = 0.5;
        if (u_noiseType == 0) {
          v = cnoise(p);
        } else if (u_noiseType == 1) {
          v = snoise(p);
        } else if (u_noiseType == 2) {
          v = voronoi(p, u_jitter, u_metric, 0).x;
        } else if (u_noiseType == 3) {
          v = voronoi(p, u_jitter, u_metric, 1).x;
        } else if (u_noiseType == 4) {
          v = voronoi(p, u_jitter, u_metric, 2).x;
        } else if (u_noiseType == 5) {
          v = fbm(p, u_octaves, u_lacunarity, u_gain, 0);
        } else if (u_noiseType == 6) {
          v = fbm(p, u_octaves, u_lacunarity, u_gain, 1);
        } else if (u_noiseType == 7) {
          v = ridged(p, u_octaves, u_lacunarity, u_gain);
        } else if (u_noiseType == 8) {
          v = voronoi(p, u_jitter, u_metric, 3).x;
        } else if (u_noiseType == 9) {
          v = 0.5 + 0.5 * sin(p.x * 6.2831853);
        } else if (u_noiseType == 10) {
          v = 0.5 + 0.25 * (sin(p.x * 6.2831853) + cos(p.y * 6.2831853));
        } else if (u_noiseType == 11) {
          vec2 g = abs(fract(p - 0.5) - 0.5);
          v = min(g.x, g.y) * 2.0;
        }
        return clamp(v, 0.0, 1.0);
      }

      void main() {
        vec2 st = v_texCoord * u_scale;
        float v = 0.5;

        if (u_seamless == 1) {
          vec2 st00 = mod(st, vec2(u_scale.x, u_scale.y));
          if (st00.x < 0.0) st00.x += u_scale.x;
          if (st00.y < 0.0) st00.y += u_scale.y;

          vec2 fade_xy = st00 * st00 * st00 * (st00 * (st00 * 6.0 - 15.0) + 10.0);
          float wx = mix(u_seamlessSoftness, st00.x, fade_xy.x);
          float wy = mix(u_seamlessSoftness, st00.y, fade_xy.y);

          float v00 = evalBaseNoise(st00);
          float v10 = evalBaseNoise(st00 - vec2(u_scale.x, 0.0));
          float v01 = evalBaseNoise(st00 - vec2(0.0, u_scale.y));
          float v11 = evalBaseNoise(st00 - vec2(u_scale.x, u_scale.y));

          v = mix(mix(v00, v10, wx), mix(v01, v11, wx), wy);
        } else {
          v = evalBaseNoise(st);
        }

        v = v * u_brightness;
        v = (v - 0.5) * u_contrast + 0.5;
        if (u_invert == 1) v = 1.0 - v;
        v = clamp(v, 0.0, 1.0);

        gl_FragColor = vec4(vec3(v), 1.0);
      }
    `;

    const prog = this.createProgram(gl, vs, fs);
    if (prog) {
      this.programs.set("noise", prog);
    }
  }

  /**
   * Render GPU Noise texture onto internal WebGL Canvas
   */
  renderNoiseCanvas(type, width, height, params = {}) {
    if (!this.isSupported) return null;
    const gl = this.gl;
    const prog = this.programs.get("noise");
    if (!prog) return null;

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      gl.viewport(0, 0, width, height);
    }

    gl.useProgram(prog);

    // Map string type to integer enum
    let typeCode = 0;
    const typeStr = String(type || "perlin").toLowerCase();
    if (typeStr === "simplex") typeCode = 1;
    else if (typeStr === "voronoi" || typeStr === "voronoi_f1") typeCode = 2;
    else if (typeStr === "voronoi_f2") typeCode = 3;
    else if (typeStr === "voronoi_f2f1") typeCode = 4;
    else if (typeStr === "fbm" || typeStr === "fbm_perlin") typeCode = 5;
    else if (typeStr === "fbm_simplex") typeCode = 6;
    else if (typeStr === "ridged") typeCode = 7;
    else if (typeStr === "cell") typeCode = 8;
    else if (typeStr === "sine") typeCode = 9;
    else if (typeStr === "wave") typeCode = 10;
    else if (typeStr === "grid") typeCode = 11;

    let metricCode = 0;
    const metricStr = String(params.metric || "euclidean").toLowerCase();
    if (metricStr === "manhattan") metricCode = 1;
    else if (metricStr === "chebyshev") metricCode = 2;

    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const scaleX = params.scaleX !== undefined ? params.scaleX : params.scale || 10;
    const scaleY = params.scaleY !== undefined ? params.scaleY : params.scale || 10;

    gl.uniform2f(gl.getUniformLocation(prog, "u_resolution"), width, height);
    gl.uniform1i(gl.getUniformLocation(prog, "u_noiseType"), typeCode);
    gl.uniform2f(gl.getUniformLocation(prog, "u_scale"), scaleX, scaleY);
    gl.uniform1i(gl.getUniformLocation(prog, "u_octaves"), Math.max(1, Math.min(8, params.octaves || 3)));
    gl.uniform1f(gl.getUniformLocation(prog, "u_lacunarity"), params.lacunarity || 2.0);
    gl.uniform1f(gl.getUniformLocation(prog, "u_gain"), params.gain || 0.5);
    gl.uniform1f(gl.getUniformLocation(prog, "u_seed"), params.seed || 0.0);
    gl.uniform1f(gl.getUniformLocation(prog, "u_jitter"), params.jitter !== undefined ? params.jitter : 1.0);
    gl.uniform1i(gl.getUniformLocation(prog, "u_metric"), metricCode);
    gl.uniform1f(gl.getUniformLocation(prog, "u_brightness"), params.brightness !== undefined ? params.brightness : 1.0);
    gl.uniform1f(gl.getUniformLocation(prog, "u_contrast"), params.contrast !== undefined ? params.contrast : 1.0);
    gl.uniform1i(gl.getUniformLocation(prog, "u_invert"), params.invert ? 1 : 0);
    gl.uniform1i(gl.getUniformLocation(prog, "u_seamless"), params.seamless ? 1 : 0);
    gl.uniform1f(gl.getUniformLocation(prog, "u_seamlessSoftness"), params.seamlessSoftness ?? 1.0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    return this.canvas;
  }

  /**
   * Render GPU Noise directly into a Float32Array grayscale buffer [0..1]
   */
  renderNoiseFloatBuffer(type, width, height, params = {}) {
    const cv = this.renderNoiseCanvas(type, width, height, params);
    if (!cv) return null;

    const gl = this.gl;
    const size = width * height;
    const pixels = new Uint8Array(size * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    const out = window.globalBufferPool
      ? window.globalBufferPool.acquireFloat32(size)
      : new Float32Array(size);

    for (let i = 0; i < size; i++) {
      out[i] = pixels[i * 4] / 255.0;
    }
    return out;
  }
}

export const globalWebGLRenderer = new WebGLRenderer();

if (typeof window !== "undefined") {
  window.WebGLRenderer = WebGLRenderer;
  window.globalWebGLRenderer = globalWebGLRenderer;
}
