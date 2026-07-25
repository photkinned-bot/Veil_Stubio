/**
 * Veil Studio - High-Performance WebGL/GPU Shader Acceleration Pipeline
 * Offloads procedural layer deformation, blending, and post-effects to GPU via GLSL shaders.
 */

export class WebGLRenderer {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.gl = this.canvas.getContext('webgl2', { preserveDrawingBuffer: true, alpha: true }) || 
                  this.canvas.getContext('webgl', { preserveDrawingBuffer: true, alpha: true });
        this.isSupported = !!this.gl;
        this.programs = new Map();
        this.textures = new Map();
        this.buffers = {};

        if (this.isSupported) {
            this.initGL();
        }
    }

    initGL() {
        const gl = this.gl;
        // Vertex quad positions
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
            -1.0,  1.0,
             1.0, -1.0,
             1.0,  1.0,
        ]), gl.STATIC_DRAW);
        this.buffers.position = positionBuffer;

        this.initWarpProgram();
    }

    createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.warn('WebGL Shader compile error:', gl.getShaderInfoLog(shader));
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
            console.warn('WebGL Program link error:', gl.getProgramInfoLog(program));
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
            this.programs.set('warp', prog);
        }
    }

    renderWarp(sourceCanvas, warpType, strength, freq) {
        if (!this.isSupported) return null;
        const gl = this.gl;
        const prog = this.programs.get('warp');
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
        let tex = this.textures.get('warp_src');
        if (!tex) {
            tex = gl.createTexture();
            this.textures.set('warp_src', tex);
        }
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);

        // Position attribute
        const posLoc = gl.getAttribLocation(prog, 'a_position');
        gl.enableVertexAttribArray(posLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        // Uniforms
        gl.uniform2f(gl.getUniformLocation(prog, 'u_resolution'), w, h);
        gl.uniform1i(gl.getUniformLocation(prog, 'u_warpType'), warpType);
        gl.uniform1f(gl.getUniformLocation(prog, 'u_strength'), strength);
        gl.uniform1f(gl.getUniformLocation(prog, 'u_freq'), freq);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        return this.canvas;
    }
}

export const globalWebGLRenderer = new WebGLRenderer();

if (typeof window !== 'undefined') {
    window.WebGLRenderer = WebGLRenderer;
    window.globalWebGLRenderer = globalWebGLRenderer;
}
