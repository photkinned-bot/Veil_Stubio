        const $ = id => document.getElementById(id);

        const viewport = {
            scale: 1, angle: 0, x: 0, y: 0, isDragging: false, startX: 0, startY: 0,
            update: function() {
                $('canvas').style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.scale}) rotate(${this.angle}deg)`;
                $('viewScaleInfo').innerText = Math.round(this.scale * 100) + '%';
            },
            zoom: function(delta) { this.scale = Math.max(0.1, this.scale + delta); this.update(); },
            rotate: function(deg) { this.angle += deg; this.update(); },
            reset: function() { this.scale = 1; this.angle = 0; this.x = 0; this.y = 0; this.update(); }
        };

        $('canvasWrapper').addEventListener('wheel', e => { e.preventDefault(); viewport.zoom(e.deltaY > 0 ? -0.1 : 0.1); });
        $('canvasWrapper').addEventListener('mousedown', e => {
            if(e.button === 1 || e.button === 2 || (e.button === 0 && e.shiftKey)) {
                viewport.isDragging = true; viewport.startX = e.clientX - viewport.x; viewport.startY = e.clientY - viewport.y;
            }
        });
        window.addEventListener('mousemove', e => { if(viewport.isDragging) { viewport.x = e.clientX - viewport.startX; viewport.y = e.clientY - viewport.startY; viewport.update(); } });
        window.addEventListener('mouseup', () => viewport.isDragging = false);
        $('canvasWrapper').addEventListener('contextmenu', e => e.preventDefault());

        // --- iPad-жести на канвасі: pinch=zoom, 2 пальці=пан, поворот=обертання ---
        let activeTouchCount = 0;

        const touchGesture = { active:false, maxTouches:0, startTime:0, moved:false,
            startCenter:{x:0,y:0}, startDist:0, startAngle:0, startScale:1, startViewAngle:0, startViewX:0, startViewY:0 };

        function resetTouchGesture() {
            touchGesture.active = false;
            touchGesture.maxTouches = 0;
            touchGesture.moved = false;
            touchGesture.startTime = 0;
            activeTouchCount = 0;
        }

        function tCenter(touches){ let x=0,y=0; for(const t of touches){ x+=t.clientX; y+=t.clientY; } return {x:x/touches.length, y:y/touches.length}; }
        function tDist(touches){ if(touches.length<2) return 0; let dx=touches[0].clientX-touches[1].clientX, dy=touches[0].clientY-touches[1].clientY; return Math.hypot(dx,dy); }
        function tAngle(touches){ if(touches.length<2) return 0; return Math.atan2(touches[1].clientY-touches[0].clientY, touches[1].clientX-touches[0].clientX)*180/Math.PI; }

        const canvasWrapperEl = $('canvasWrapper');

        window.addEventListener('touchstart', e => {
            activeTouchCount = e.touches ? e.touches.length : 0;
            if (activeTouchCount > 1) cancelPainting();
        }, {passive: true, capture: true});

        window.addEventListener('touchmove', e => {
            activeTouchCount = e.touches ? e.touches.length : 0;
            if (activeTouchCount > 1) cancelPainting();
        }, {passive: true, capture: true});

        canvasWrapperEl.addEventListener('touchstart', e => {
            activeTouchCount = e.touches ? e.touches.length : 0;
            if (activeTouchCount >= 2) e.preventDefault(); // не дати сторінці зробити свій pinch-zoom/scroll
            if (activeTouchCount > 1) cancelPainting();

            if (!touchGesture.active || touchGesture.maxTouches === 0) {
                touchGesture.active = true;
                touchGesture.maxTouches = activeTouchCount;
                touchGesture.moved = false;
                touchGesture.startTime = Date.now();
                touchGesture.startCenter = tCenter(e.touches);
            } else {
                touchGesture.maxTouches = Math.max(touchGesture.maxTouches, activeTouchCount);
            }

            if (e.touches.length >= 2) {
                touchGesture.startDist = tDist(e.touches);
                touchGesture.startAngle = tAngle(e.touches);
                touchGesture.startScale = viewport.scale;
                touchGesture.startViewAngle = viewport.angle;
                touchGesture.startViewX = viewport.x; touchGesture.startViewY = viewport.y;
                touchGesture.startCenter = tCenter(e.touches);
            }
        }, {passive:false});

        canvasWrapperEl.addEventListener('touchmove', e => {
            activeTouchCount = e.touches ? e.touches.length : 0;
            if (!touchGesture.active) return;
            if (e.touches.length >= 2) {
                e.preventDefault();
                cancelPainting();
                const c = tCenter(e.touches);
                const dx = c.x - touchGesture.startCenter.x, dy = c.y - touchGesture.startCenter.y;
                if (Math.hypot(dx,dy) > 8) touchGesture.moved = true;

                const dist = tDist(e.touches);
                if (touchGesture.startDist > 0) {
                    const factor = dist / touchGesture.startDist;
                    if (Math.abs(factor-1) > 0.03) touchGesture.moved = true;
                    viewport.scale = Math.max(0.1, Math.min(10, touchGesture.startScale * factor));
                }
                const angle = tAngle(e.touches);
                const angleDelta = angle - touchGesture.startAngle;
                if (Math.abs(angleDelta) > 3) touchGesture.moved = true;
                viewport.angle = touchGesture.startViewAngle + angleDelta;

                viewport.x = touchGesture.startViewX + dx;
                viewport.y = touchGesture.startViewY + dy;
                viewport.update();
            } else if (e.touches.length === 1) {
                const c = tCenter(e.touches);
                const dx = c.x - touchGesture.startCenter.x, dy = c.y - touchGesture.startCenter.y;
                if (Math.hypot(dx,dy) > 8) touchGesture.moved = true;
            }
        }, {passive:false});

        const handleCanvasTouchEnd = e => {
            activeTouchCount = e.touches ? e.touches.length : 0;
            if (activeTouchCount > 0) {
                if (activeTouchCount > 1) cancelPainting();
                return;
            }

            if (touchGesture.active) {
                cancelPainting();
                resetTouchGesture();
            }
        };

        window.addEventListener('touchend', handleCanvasTouchEnd, {passive:true});
        window.addEventListener('touchcancel', handleCanvasTouchEnd, {passive:true});

        const Perlin = {
            p: new Uint8Array(512),
            init() {
                let a = new Uint8Array(256);
                for(let i=0;i<256;i++) a[i]=i;
                for(let i=255;i>0;i--){ let j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
                for(let i=0;i<512;i++) this.p[i]=a[i&255];
            },
            fade: t => t*t*t*(t*(t*6-15)+10),
            lerp: (t,a,b) => a+t*(b-a),
            grad(h,x,y){ let u=h<4?x:y, v=h<4?y:x; return ((h&1)?-u:u)+((h&2)?-2.0*v:2.0*v); },
            noise(x,y){
                let X=Math.floor(x)&255, Y=Math.floor(y)&255; x-=Math.floor(x); y-=Math.floor(y);
                let u=this.fade(x), v=this.fade(y), A=this.p[X]+Y, B=this.p[X+1]+Y;
                return this.lerp(v, this.lerp(u, this.grad(this.p[A],x,y), this.grad(this.p[B],x-1,y)),
                                    this.lerp(u, this.grad(this.p[A+1],x,y-1), this.grad(this.p[B+1],x-1,y-1)));
            }
        }; Perlin.init();

        const NoiseCache = {
            size: 1024,
            data: null,
            init() {
                this.data = new Float32Array(this.size * this.size);
                for(let y=0; y<this.size; y++) {
                    for(let x=0; x<this.size; x++) {
                        this.data[y*this.size + x] = Perlin.noise(x/20, y/20);
                    }
                }
            },
            get(x, y) {
                let px = (x % this.size + this.size) % this.size;
                let py = (y % this.size + this.size) % this.size;
                let x0 = Math.floor(px), y0 = Math.floor(py);
                let x1 = (x0 + 1) % this.size, y1 = (y0 + 1) % this.size;
                let fx = px - x0, fy = py - y0;
                let v00 = this.data[y0*this.size + x0];
                let v10 = this.data[y1*this.size + x0];
                let v01 = this.data[y0*this.size + x1];
                let v11 = this.data[y1*this.size + x1];
                return Perlin.lerp(fy, Perlin.lerp(fx, v00, v10), Perlin.lerp(fx, v01, v11));
            }
        }; NoiseCache.init();

        const Simplex = {
            F2: 0.5*(Math.sqrt(3)-1), G2: (3-Math.sqrt(3))/6,
            grad: Perlin.grad,
            noise(x,y){
                let s=(x+y)*this.F2, i=Math.floor(x+s), j=Math.floor(y+s), t=(i+j)*this.G2;
                let x0=x-(i-t), y0=y-(j-t), i1=x0>y0?1:0, j1=x0>y0?0:1;
                let x1=x0-i1+this.G2, y1=y0-j1+this.G2, x2=x0-1+2*this.G2, y2=y0-1+2*this.G2;
                let ii=i&255, jj=j&255;
                let g0=Perlin.p[ii+Perlin.p[jj]]%12, g1=Perlin.p[ii+i1+Perlin.p[jj+j1]]%12, g2=Perlin.p[ii+1+Perlin.p[jj+1]]%12;
                let t0=0.5-x0*x0-y0*y0, n0=t0<0?0:t0*t0*t0*t0*this.grad(g0,x0,y0);
                let t1=0.5-x1*x1-y1*y1, n1=t1<0?0:t1*t1*t1*t1*this.grad(g1,x1,y1);
                let t2=0.5-x2*x2-y2*y2, n2=t2<0?0:t2*t2*t2*t2*this.grad(g2,x2,y2);
                return 70*(n0+n1+n2);
            }
        };

        const Voronoi = {
            hash: (x,y) => { let h=Math.sin(x*127.1+y*311.7)*43758.5453; return h-Math.floor(h); },
            dist: (px,py,qx,qy,m,e) => {
                let dx=Math.abs(px-qx), dy=Math.abs(py-qy);
                if(m==='manhattan') return dx+dy; if(m==='chebyshev') return Math.max(dx,dy);
                if(m==='minkowski') return Math.pow(Math.pow(dx,e)+Math.pow(dy,e),1/e);
                return Math.sqrt(dx*dx+dy*dy);
            },
            noise(x,y,mode='f1',m='euclidean',e=2){
                let ix=Math.floor(x), iy=Math.floor(y), fx=x-ix, fy=y-iy;
                let d1=8, d2=8;
                for(let j=-1;j<=1;j++) for(let i=-1;i<=1;i++){
                    let px=i+this.hash(ix+i,iy+j), py=j+this.hash(ix+i+31,iy+j+47);
                    let d = this.dist(fx,fy,px,py,m,e);
                    if(d<d1){ d2=d1; d1=d; } else if(d<d2) d2=d;
                }
                return mode==='f2_minus_f1'?Math.abs(d2-d1):mode==='f2'?d2:d1;
            }
        };

        const Cymatics = {
            getSources(mode, count) {
                let s = [];
                switch (mode) {
                    case 'Center': s.push({x: 0, y: 0}); break;
                    case 'Corners': s.push({x: -1, y: -1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: 1, y: 1}); break;
                    case 'Edges': s.push({x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}); break;
                    case 'Ring': 
                        for(let i=0; i<count; i++) { let a = (i/count) * Math.PI * 2; s.push({x: Math.cos(a)*0.5, y: Math.sin(a)*0.5}); } break;
                    case 'Polygon':
                        for(let i=0; i<count; i++) { let a = (i/count) * Math.PI * 2; s.push({x: Math.cos(a)*0.8, y: Math.sin(a)*0.8}); } break;
                    case 'Random':
                        for(let i=0; i<count; i++) { s.push({x: (Math.sin(i * 12.9898) * 43758.5453 % 1) * 2 - 1, y: (Math.sin(i * 78.233) * 43758.5453 % 1) * 2 - 1}); } break;
                }
                return s;
            },
            noise(x, y, p, precalculatedSources = null) {
                let sx = x * 2 - 1, sy = y * 2 - 1;
                const symParam = p.symmetry || 1;
                if (symParam > 1) {
                    let angle = Math.atan2(sy, sx), radius = Math.sqrt(sx * sx + sy * sy), slice = (Math.PI * 2) / symParam;
                    angle = angle % slice; if (angle < 0) angle += slice;
                    if (angle > slice / 2) angle = slice - angle;
                    sx = Math.cos(angle) * radius; sy = Math.sin(angle) * radius;
                }
                let sum = 0;
                let sources = precalculatedSources || this.getSources(p.sourceMode||'Corners', p.sourcesCount||4);
                for (let i = 0; i < sources.length; i++) {
                    let s = sources[i];
                    let dx = sx - s.x, dy = sy - s.y;
                    sum += Math.sin(Math.sqrt(dx * dx + dy * dy) * (p.frequency||50)*0.1 + (p.phase||0) * (Math.PI / 180));
                }
                let thickness = 0.05 + (1 - (p.isolineWidth||0.5)) * 0.1;
                return Math.abs(sum / sources.length) < thickness ? 1 : 0;
            }
        };

        const fbm = (x,y,oct,lac=2,gain=0.5,t='perlin') => {
            let v=0, a=1, f=1, max=0, fn=t==='simplex'?Simplex.noise.bind(Simplex):Perlin.noise.bind(Perlin);
            for(let i=0;i<oct;i++){ v+=a*(fn(x*f,y*f)+1)/2; max+=a; a*=gain; f*=lac; }
            return v/max;
        };

        const ridged = (x,y,oct,lac=2,gain=0.5) => {
            let v=0, a=1, f=1, max=0;
            for(let i=0;i<oct;i++){ let n=1-Math.abs(Perlin.noise(x*f,y*f)); v+=n*n*a; max+=a; a*=gain; f*=lac; }
            return v/max;
        };

        const smoothstep = (edge0, edge1, x) => {
            let t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
            return t * t * (3 - 2 * t);
        };

        // Глобальний тайлінг: перетворення координати в межах одного періоду.
        // wrapFold — чисте повторення (період 1, розрив на межі, якщо генератор не періодичний).
        // mirrorFold — дзеркальне складання (період 2, ЗАВЖДИ безшовне на межі, незалежно від генератора).
        const wrapFold = t => { t = t % 1; if (t < 0) t += 1; return t; };
        const mirrorFold = t => { t = t % 2; if (t < 0) t += 2; if (t > 1) t = 2 - t; return t; };

        let currentTab = 'layer', canvas, ctx;
        let canvasResolution = parseInt(localStorage.getItem('veil_canvas_resolution')) || 512;
        let lowResOnEdit = localStorage.getItem('veil_low_res_on_edit') === 'true';
        let b_width=0, b_height=0, blendBuffer, layerBuffer, blurTemp, dispBuffer, pendingMaskTargetBuffer, pendingMaskAlphaBuffer;

        function ensureBuffers(w,h){
            if(b_width!==w || b_height!==h){
                let size=w*h; b_width=w; b_height=h;
                blendBuffer=new Float32Array(size); layerBuffer=new Float32Array(size);
                blurTemp=new Float32Array(size); dispBuffer=new Float32Array(size);
                pendingMaskTargetBuffer=new Float32Array(size); // буфер для шару, що очікує накладання маски(ок) зверху
                pendingMaskAlphaBuffer=new Float32Array(size); // накопичена альфа від маски(ок) — окремо від контенту, щоб 0 = "просвічує низ", а не "чорний колір"
            }
        }

        let state = {
            layers: [{
                id: 'l1', name: 'Procedural Web', visible: true, opacity: 100, blendMode: 'normal', generatorType: 'spider_web', isMask: false,
                params: { 
                    seamless: false, scale: 10, scaleX: 10, scaleY: 10, layerScale: 1, contrast: 1, invert: false, blur: 0, 
                    offsetX: 0, offsetY: 0, angle: 0, 
                    warps: [],
                    useThreshold: false, thresholdVal: 50,
                    useLevels: false, levelMin: 0, levelMax: 100,
                    usePosterize: false, posterizeLevels: 4,
                    useFindEdges: false,
                    radialCount: 18, ringCount: 22, ringThick: 0.04, radThick: 0.025,
                    wobble: 0.03, jitter: 8, ringSineAmp: 0, ringSineFreq: 5,
                    radSineAmp: 0, radSineFreq: 10, fractal: 0
                }
            }],
            selectedLayerId: 'l1',
            global: freshGlobalSettings()
        };

        const Blend = {
            normal:(b,t)=>t, multiply:(b,t)=>b*t, screen:(b,t)=>1-(1-b)*(1-t), overlay:(b,t)=>b<0.5?2*b*t:1-2*(1-b)*(1-t),
            difference:(b,t)=>Math.abs(b-t), colorburn:(b,t)=>t===0?0:Math.max(0,1-(1-b)/t), colordodge:(b,t)=>t===1?1:Math.min(1,b/(1-t)), heightblend:(b,t)=>Math.max(b,t),
            exclusion:(b,t)=>b+t-2*b*t, hardlight:(b,t)=>t<0.5?2*b*t:1-2*(1-b)*(1-t), 
            lineardodge:(b,t)=>Math.min(1,b+t), linearburn:(b,t)=>Math.max(0,b+t-1)
        };

        function applyBoxBlur(buf, tmp, w, h, rad) {
            let scaledRad = Math.max(0, Math.round(rad * (w / 512)));
            if (scaledRad<=0) return;
            for(let y=0;y<h;y++) for(let x=0;x<w;x++){
                let sum=0, c=0;
                for(let dx=-scaledRad;dx<=scaledRad;dx++){ let nx=x+dx; if(nx>=0&&nx<w){ sum+=buf[y*w+nx]; c++; } }
                tmp[y*w+x] = sum/c;
            }
            for(let x=0;x<w;x++) for(let y=0;y<h;y++){
                let sum=0, c=0;
                for(let dy=-scaledRad;dy<=scaledRad;dy++){ let ny=y+dy; if(ny>=0&&ny<h){ sum+=tmp[ny*w+x]; c++; } }
                buf[y*w+x] = sum/c;
            }
        }

        function applyEdgeDetection(buf, tmp, w, h) {
            let step = Math.max(1, Math.round(w / 512));
            for(let i=0;i<w*h;i++) tmp[i]=buf[i];
            for(let y=step;y<h-step;y++) for(let x=step;x<w-step;x++){
                let i=y*w+x, val = tmp[i]*4 - tmp[i-step] - tmp[i+step] - tmp[i-w*step] - tmp[i+w*step];
                buf[i] = Math.max(0, Math.min(1, Math.abs(val)));
            }
        }

        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 255, g: 255, b: 255 };
        }

        function ensureLayerPaintCanvas(lay, forceReloadFromDataUrl = false) {
            if (!lay.paintCanvas || typeof lay.paintCanvas.getContext !== 'function') {
                lay.paintCanvas = document.createElement('canvas');
                lay.paintCanvas.width = 1024;
                lay.paintCanvas.height = 1024;
                let ctx = lay.paintCanvas.getContext('2d');
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, 1024, 1024);
                
                if (lay.params && lay.params.paintDataUrl) {
                    let img = new Image();
                    img.onload = () => {
                        ctx.clearRect(0, 0, 1024, 1024);
                        ctx.drawImage(img, 0, 0);
                        updatePaintBuffer(lay);
                        lay.isDirty = true;
                        invalidateCaches();
                        requestRender();
                    };
                    img.src = lay.params.paintDataUrl;
                    if (img.complete && img.naturalWidth) {
                        ctx.clearRect(0, 0, 1024, 1024);
                        ctx.drawImage(img, 0, 0);
                        updatePaintBuffer(lay);
                        lay.isDirty = true;
                        invalidateCaches();
                    }
                } else {
                    updatePaintBuffer(lay);
                }
            } else if (forceReloadFromDataUrl) {
                let ctx = lay.paintCanvas.getContext('2d');
                ctx.clearRect(0, 0, 1024, 1024);
                if (lay.params && lay.params.paintDataUrl) {
                    let img = new Image();
                    img.onload = () => {
                        ctx.clearRect(0, 0, 1024, 1024);
                        ctx.drawImage(img, 0, 0);
                        updatePaintBuffer(lay);
                        lay.isDirty = true;
                        invalidateCaches();
                        requestRender();
                    };
                    img.src = lay.params.paintDataUrl;
                    if (img.complete && img.naturalWidth) {
                        ctx.clearRect(0, 0, 1024, 1024);
                        ctx.drawImage(img, 0, 0);
                        updatePaintBuffer(lay);
                        lay.isDirty = true;
                        invalidateCaches();
                    }
                } else {
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(0, 0, 1024, 1024);
                    updatePaintBuffer(lay);
                    lay.isDirty = true;
                    invalidateCaches();
                    requestRender();
                }
            } else if (!lay.paintBuffer) {
                updatePaintBuffer(lay);
            }
        }

        function updatePaintBuffer(lay) {
            if (!lay.paintCanvas) return;
            let w = lay.paintCanvas.width;
            let h = lay.paintCanvas.height;
            let ctx = lay.paintCanvas.getContext('2d');
            let imgData = ctx.getImageData(0, 0, w, h);
            let data = imgData.data;
            if (!lay.paintBuffer || lay.paintBuffer.length !== w * h) {
                lay.paintBuffer = new Float32Array(w * h);
            }
            for (let i = 0; i < w * h; i++) {
                let r = data[i * 4];
                let g = data[i * 4 + 1];
                let b = data[i * 4 + 2];
                let a = data[i * 4 + 3] / 255;
                let lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                lay.paintBuffer[i] = lum * a;
            }
        }

        function drawBrushDot(lay, x, y, pressure = 1, targetCtx = null) {
            ensureLayerPaintCanvas(lay);
            let lp = lay.params;
            let size = lp.brushSize || 20;
            let softness = lp.brushSoftness !== undefined ? lp.brushSoftness : 0.5;
            let tool = lp.brushTool || 'brush';

            const dynamicPressure = Math.pow(pressure, 0.5);
            const finalSize = size * (0.1 + 0.9 * dynamicPressure);

            let pCtx = targetCtx || lay.paintCanvas.getContext('2d');

            pCtx.save();
            pCtx.globalAlpha = 1.0;

            let color = tool === 'eraser' ? '#ffffff' : (lp.brushColor || '#ffffff');
            pCtx.fillStyle = color;

            const effectiveSoftness = softness <= 0.05 ? 0 : softness;
            if (effectiveSoftness > 0) {
                pCtx.shadowColor = color;
                pCtx.shadowBlur = finalSize * effectiveSoftness;
            }

            pCtx.beginPath();
            pCtx.arc(x, y, finalSize, 0, Math.PI * 2);
            pCtx.fill();
            pCtx.restore();
            
            lay.isDirty = true;
        }

        function drawBrushLineSegment(lay, x0, y0, x1, y1, cpX, cpY, pressure = 1, targetCtx = null) {
            ensureLayerPaintCanvas(lay);
            let lp = lay.params;
            let size = lp.brushSize || 20;
            let softness = lp.brushSoftness !== undefined ? lp.brushSoftness : 0.5;
            let tool = lp.brushTool || 'brush';

            const dynamicPressure = Math.pow(pressure, 0.5);
            const finalSize = size * (0.1 + 0.9 * dynamicPressure);

            let pCtx = targetCtx || lay.paintCanvas.getContext('2d');

            pCtx.save();
            
            pCtx.lineCap = 'round';
            pCtx.lineJoin = 'round';
            pCtx.globalAlpha = 1.0;

            let color = tool === 'eraser' ? '#ffffff' : (lp.brushColor || '#ffffff');
            
            pCtx.strokeStyle = color;
            pCtx.lineWidth = finalSize * 2; // radius to diameter

            const effectiveSoftness = softness <= 0.05 ? 0 : softness;
            if (effectiveSoftness > 0) {
                pCtx.shadowColor = color;
                pCtx.shadowBlur = finalSize * effectiveSoftness;
            }

            pCtx.beginPath();
            pCtx.moveTo(x0, y0);
            if (cpX !== undefined && cpY !== undefined) {
                pCtx.quadraticCurveTo(cpX, cpY, x1, y1);
            } else {
                pCtx.lineTo(x1, y1);
            }
            pCtx.stroke();
            
            pCtx.restore();
            
            lay.isDirty = true;
        }

        // --- PaintModule Centralized Class ---
        class PaintModule {
            constructor() {
                this.wrapper = null;
                this.canvas = null;
            }

            init(wrapperElem, canvasElem) {
                this.wrapper = wrapperElem;
                this.canvas = canvasElem;
            }

            getCoordinates(input, param2, param3) {
                let clientX, clientY, targetCanvas;
                if (typeof input === 'object' && input !== null) {
                    clientX = input.clientX;
                    clientY = input.clientY;
                    if (input.touches && input.touches.length > 0) {
                        clientX = input.touches[0].clientX;
                        clientY = input.touches[0].clientY;
                    }
                    targetCanvas = param2;
                } else {
                    clientX = input;
                    clientY = param2;
                    targetCanvas = param3;
                }

                const canvas = targetCanvas || this.canvas || $('canvas');
                if (!canvas) return { x: 0, y: 0 };

                // Get exact current physical bounding rect of the preview canvas element on screen
                const rect = canvas.getBoundingClientRect();
                if (!rect || rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };

                // Target paint bitmap dimensions (lay.paintCanvas is 1024x1024)
                let targetW = 1024;
                let targetH = 1024;
                if (typeof state !== 'undefined' && state && state.layers) {
                    let lay = state.layers.find(l => l.id === state.selectedLayerId);
                    if (lay && lay.paintCanvas) {
                        targetW = lay.paintCanvas.width || 1024;
                        targetH = lay.paintCanvas.height || 1024;
                    }
                }

                let normX = 0;
                let normY = 0;

                // 1. Direct normalized position for unrotated viewport
                if (!viewport || !viewport.angle) {
                    normX = (clientX - rect.left) / rect.width;
                    normY = (clientY - rect.top) / rect.height;
                } else {
                    // 2. Vector offset relative to canvas center for rotated viewport
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    const dx = clientX - centerX;
                    const dy = clientY - centerY;

                    // Unrotate
                    const rad = -viewport.angle * Math.PI / 180;
                    const cos = Math.cos(rad);
                    const sin = Math.sin(rad);
                    const rotX = dx * cos - dy * sin;
                    const rotY = dx * sin + dy * cos;

                    const scale = (viewport && viewport.scale) || 1;
                    const cssW = (canvas.offsetWidth || rect.width / scale || 512) * scale;
                    const cssH = (canvas.offsetHeight || rect.height / scale || 512) * scale;

                    normX = rotX / cssW + 0.5;
                    normY = rotY / cssH + 0.5;
                }

                // Map normalized canvas position [0..1] to paint layer bitmap coordinates [0..1024]
                const rx = normX * targetW;
                const ry = normY * targetH;

                return { x: rx, y: ry };
            }

            getPaintCoordinates(input, param2, param3) {
                return this.getCoordinates(input, param2, param3);
            }

            isValidPointer(e) {
                if (e.touches && e.touches.length > 1) return false;
                if (e.targetTouches && e.targetTouches.length > 1) return false;
                if (typeof activeTouchCount !== 'undefined' && activeTouchCount > 1) return false;
                if (typeof touchGesture !== 'undefined' && touchGesture.maxTouches > 1) return false;
                if (e.pointerType === 'touch' && !e.isPrimary) return false;
                return true;
            }
        }

        const paintModule = new PaintModule();
        window.PaintModule = PaintModule;
        window.paintModule = paintModule;

        function getPaintCoordinates(a, b, c) {
            return paintModule.getCoordinates(a, b, c);
        }

        function getPaintCanvasCoordinates(a, b, c) {
            return paintModule.getCoordinates(a, b, c);
        }

        window.getPaintCoordinates = getPaintCoordinates;
        window.getPaintCanvasCoordinates = getPaintCanvasCoordinates;

        window.clearPaintCanvas = function() {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || lay.generatorType !== 'paint') return;
            
            ensureLayerPaintCanvas(lay);
            let pCanvas = lay.paintCanvas;
            let pCtx = pCanvas.getContext('2d');
            pCtx.fillStyle = '#000000';
            pCtx.fillRect(0, 0, 1024, 1024);
            
            updatePaintBuffer(lay);
            lay.isDirty = true;
            requestRender();
            commitHistorySnapshot();
        };

        window.updateBrushPreview = function() {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || lay.generatorType !== 'paint') return;
            let previewCanvas = $('brushPreview');
            if (!previewCanvas) return;
            let pCtx = previewCanvas.getContext('2d');
            pCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            
            let lp = lay.params;
            let size = lp.brushSize || 20;
            let opacity = (lp.brushOpacity !== undefined ? lp.brushOpacity : 100) / 100;
            let softness = lp.brushSoftness !== undefined ? lp.brushSoftness : 0.5;
            let falloff = lp.brushFalloff !== undefined ? lp.brushFalloff : 1.0;
            let angle = (lp.brushAngle || 0) * (Math.PI / 180);
            let squash = lp.brushSquash !== undefined ? lp.brushSquash : 1.0;
            let spacingVal = (lp.brushSpacing !== undefined ? lp.brushSpacing : 10) / 100;
            let color = lp.brushColor || '#ffffff';
            let tool = lp.brushTool || 'brush';
            
            if (softness <= 0.05 && spacingVal < 0.1) {
                spacingVal = 0.1;
            }
            
            const centerX = previewCanvas.width / 2;
            const centerY = previewCanvas.height / 2;
            
            pCtx.save();
            if (size > 30) {
                const scale = 30 / size;
                pCtx.translate(centerX, centerY);
                pCtx.scale(scale, scale);
                pCtx.translate(-centerX, -centerY);
            }

            const startX = centerX - 25;
            const startY = centerY + 25;
            const endX = centerX + 25;
            const endY = centerY - 25;
            
            const dx = endX - startX;
            const dy = endY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const step = Math.max(1, size * spacingVal);
            const stampAngle = Math.atan2(dy, dx);
            
            for (let i = 0; i <= distance; i += step) {
                const x = startX + Math.cos(stampAngle) * i;
                const y = startY + Math.sin(stampAngle) * i;
                
                pCtx.save();
                pCtx.translate(x, y);
                pCtx.rotate(angle);
                pCtx.scale(1, squash);
                
                pCtx.globalAlpha = opacity;
                pCtx.beginPath();
                
                const effectiveSoftness = softness <= 0.05 ? 0 : softness;
                if (effectiveSoftness > 0) {
                    let rgb = hexToRgb(color);
                    const innerRadius = Math.max(0.001, size * (1 - effectiveSoftness));
                    const grad = pCtx.createRadialGradient(0, 0, innerRadius, 0, 0, size);
                    grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
                    const steps = 5;
                    for (let j = 1; j < steps; j++) {
                        const stepPos = j / steps;
                        const stopOpacity = Math.pow(1 - stepPos, falloff);
                        grad.addColorStop(stepPos, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${stopOpacity.toFixed(3)})`);
                    }
                    grad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
                    pCtx.fillStyle = grad;
                } else {
                    pCtx.fillStyle = color;
                }
                pCtx.arc(0, 0, size, 0, Math.PI * 2);
                pCtx.fill();
                pCtx.restore();
            }
            pCtx.restore();
        };

        // --- Progress Loader UI Helpers ---
        function showProgressLoader(title = "Обробка...", subtext = "") {
            let modal = $('progressModal');
            if (modal) {
                let tEl = $('progressTitle');
                let sEl = $('progressSubtext');
                if (tEl) tEl.textContent = title;
                if (sEl) sEl.textContent = subtext;
                modal.style.display = 'flex';
            }
        }

        function updateProgressLoaderSubtext(subtext = "") {
            let sEl = $('progressSubtext');
            if (sEl) sEl.textContent = subtext;
        }

        function hideProgressLoader() {
            let modal = $('progressModal');
            if (modal) {
                modal.style.display = 'none';
            }
        }

        // --- Data Compression: Crop Paint Canvas to Bounding Box & Convert to WebP ---
        function compressPaintCanvas(canvas) {
            if (!canvas) return { dataUrl: null, crop: null };
            let w = canvas.width, h = canvas.height;
            let ctx = canvas.getContext('2d');
            let imgData = ctx.getImageData(0, 0, w, h);
            let data = imgData.data;

            let minX = w, minY = h, maxX = -1, maxY = -1;
            let hasPixels = false;

            // 4px step scan for ultra-fast bounding box estimation
            for (let y = 0; y < h; y += 4) {
                for (let x = 0; x < w; x += 4) {
                    let idx = (y * w + x) * 4;
                    if (data[idx + 3] > 0 && (data[idx] > 2 || data[idx + 1] > 2 || data[idx + 2] > 2)) {
                        hasPixels = true;
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            if (!hasPixels) {
                return { dataUrl: null, crop: null };
            }

            // Expand bounding box slightly to avoid cutting smooth brush anti-aliasing edges
            minX = Math.max(0, minX - 4);
            minY = Math.max(0, minY - 4);
            maxX = Math.min(w - 1, maxX + 4);
            maxY = Math.min(h - 1, maxY + 4);

            let bw = maxX - minX + 1;
            let bh = maxY - minY + 1;

            let temp = document.createElement('canvas');
            temp.width = bw;
            temp.height = bh;
            let tCtx = temp.getContext('2d');
            tCtx.drawImage(canvas, minX, minY, bw, bh, 0, 0, bw, bh);

            let dataUrl = temp.toDataURL('image/webp', 0.85);
            if (!dataUrl || !dataUrl.startsWith('data:image/webp')) {
                dataUrl = temp.toDataURL('image/png');
            }

            let crop = (bw === w && bh === h && minX === 0 && minY === 0) ? null : { x: minX, y: minY, w: bw, h: bh };

            return { dataUrl, crop };
        }

        function prepareStateForSerialization() {
            if (!state || !state.layers) return;
            state.layers.forEach(lay => {
                if (lay.generatorType === 'paint') {
                    ensureLayerPaintCanvas(lay);
                    if (lay.paintCanvas) {
                        let comp = compressPaintCanvas(lay.paintCanvas);
                        if (lay.params) {
                            lay.params.paintDataUrl = comp.dataUrl;
                            lay.params.paintCrop = comp.crop;
                        }
                    }
                }
            });
        }

        function serializeState(s) {
            prepareStateForSerialization();
            return JSON.stringify(s, (key, value) => {
                if (key === 'paintCanvas' || key === 'paintBuffer') {
                    return undefined;
                }
                return value;
            });
        }

        // --- Fast Re-hydration with createImageBitmap + Promise.all ---
        async function loadImageBitmapFromDataUrl(dataUrl) {
            if (!dataUrl) return null;
            try {
                if (typeof fetch === 'function' && typeof createImageBitmap === 'function') {
                    const res = await fetch(dataUrl);
                    const blob = await res.blob();
                    return await createImageBitmap(blob);
                }
            } catch (e) {
                // Fallback to standard Image
            }
            return new Promise(resolve => {
                let img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => resolve(null);
                img.src = dataUrl;
            });
        }

        async function rehydrateAllPaintLayersAsync(layers) {
            if (!layers || !Array.isArray(layers)) return;
            let paintLayers = layers.filter(l => l.generatorType === 'paint');
            if (paintLayers.length === 0) return;

            let promises = paintLayers.map(async (lay) => {
                ensureLayerPaintCanvas(lay, false);
                let pCtx = lay.paintCanvas.getContext('2d');
                pCtx.fillStyle = '#000000';
                pCtx.fillRect(0, 0, 1024, 1024);

                if (lay.params && lay.params.paintDataUrl) {
                    let dataUrl = lay.params.paintDataUrl;
                    let crop = lay.params.paintCrop;
                    let bitmap = await loadImageBitmapFromDataUrl(dataUrl);
                    if (bitmap) {
                        if (crop && typeof crop.x === 'number') {
                            pCtx.drawImage(bitmap, crop.x, crop.y, crop.w, crop.h);
                        } else {
                            pCtx.drawImage(bitmap, 0, 0, 1024, 1024);
                        }
                        if (typeof bitmap.close === 'function') bitmap.close();
                    }
                }
                updatePaintBuffer(lay);
                lay.isDirty = true;
            });

            await Promise.all(promises);
        }

        // --- Non-blocking Asynchronous Project Loader ---
        async function loadProjectObjectAsync(p) {
            if (!p || !p.layers || !Array.isArray(p.layers)) {
                throw new Error("Невірна структура файлу проєкту (відсутній масив layers)");
            }

            showProgressLoader("Завантаження проєкту...", "Підготовка шарів...");
            await new Promise(res => setTimeout(res, 30));

            setState(p);
            if (!state.global) state.global = freshGlobalSettings();

            state.layers.forEach(l => {
                l.isDirty = true;
                if (!l.params) l.params = freshLayerParams();
                if (!l.params.warps) l.params.warps = [];
            });

            if (!state.layers.find(l => l.id === state.selectedLayerId)) {
                state.selectedLayerId = state.layers.length ? state.layers[0].id : null;
            }

            updateProgressLoaderSubtext("Декодування растрових зображень...");
            await new Promise(res => setTimeout(res, 20));
            await rehydrateAllPaintLayersAsync(state.layers);

            updateProgressLoaderSubtext("Оновлення рендеру...");
            await new Promise(res => setTimeout(res, 20));

            invalidateCaches();
            renderLayers();
            if (typeof currentTab !== 'undefined' && currentTab === 'global') renderGlobal(); else renderProps();
            requestRender();
            initHistory();

            hideProgressLoader();
        }

        let isPainting = false;
        let lastPaintX = 0, lastPaintY = 0;
        let smoothedPressure = 1;
        let paintMoved = false;
        let paintPoints = []; // Stores raw pointer coordinates of the current stroke
        let paintQueue = [];  // Queue for processing inputs in requestAnimationFrame
        let paintAnimationFrameId = null;

        let strokeCanvas = null;
        let strokeBackupCanvas = null;
        let strokeBackupActive = false;

        function cancelPainting() {
            clearTimeout(historyTimer);
            isPainting = false;
            paintPoints = [];
            paintQueue = [];
            if (paintAnimationFrameId) {
                cancelAnimationFrame(paintAnimationFrameId);
                paintAnimationFrameId = null;
            }
            if (strokeBackupActive) {
                strokeBackupActive = false;
                let lay = state.layers.find(l => l.id === state.selectedLayerId);
                if (lay && lay.generatorType === 'paint' && lay.paintCanvas) {
                    let pCtx = lay.paintCanvas.getContext('2d');
                    pCtx.clearRect(0, 0, 1024, 1024);
                    pCtx.drawImage(getStrokeBackupCanvas(), 0, 0);
                    let sCtx = getStrokeCanvas().getContext('2d');
                    sCtx.clearRect(0, 0, 1024, 1024);
                    if (lay.params) {
                        lay.params.paintDataUrl = lay.paintCanvas.toDataURL();
                    }
                    updatePaintBuffer(lay);
                    lay.isDirty = true;
                    invalidateCaches();
                    requestRender();
                }
            }
        }

        function getStrokeCanvas() {
            if (!strokeCanvas) {
                strokeCanvas = document.createElement('canvas');
                strokeCanvas.width = 1024;
                strokeCanvas.height = 1024;
            }
            return strokeCanvas;
        }

        function getStrokeBackupCanvas() {
            if (!strokeBackupCanvas) {
                strokeBackupCanvas = document.createElement('canvas');
                strokeBackupCanvas.width = 1024;
                strokeBackupCanvas.height = 1024;
            }
            return strokeBackupCanvas;
        }

        function combineStrokeAndBackup(lay, opacity) {
            let pCanvas = lay.paintCanvas;
            let pCtx = pCanvas.getContext('2d');
            pCtx.clearRect(0, 0, 1024, 1024);
            pCtx.drawImage(getStrokeBackupCanvas(), 0, 0);

            pCtx.save();
            pCtx.globalAlpha = opacity;
            let lp = lay.params;
            let tool = lp.brushTool || 'brush';
            if (tool === 'eraser') {
                pCtx.globalCompositeOperation = 'destination-out';
            } else {
                pCtx.globalCompositeOperation = 'source-over';
            }
            pCtx.drawImage(getStrokeCanvas(), 0, 0);
            pCtx.restore();
            
            lay.isDirty = true;
        }

        function handleCanvasPointerDown(e) {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || lay.generatorType !== 'paint' || !lay.visible) return;

            if (e.button !== 0 || e.shiftKey) return;

            if (!paintModule.isValidPointer(e)) {
                cancelPainting();
                return;
            }

            if (isPainting) {
                cancelPainting();
                return;
            }

            viewport.isDragging = false;

            isPainting = true;
            strokeBackupActive = true;
            paintMoved = false;

            ensureLayerPaintCanvas(lay);

            let pos = getPaintCanvasCoordinates(e.clientX, e.clientY);
            lastPaintX = pos.x;
            lastPaintY = pos.y;

            let rawPressure = (e.pointerType === 'pen' && e.pressure > 0) ? e.pressure : 1;
            smoothedPressure = rawPressure;

            // Initialize point history with start point
            paintPoints = [{ x: pos.x, y: pos.y, pressure: rawPressure }];
            paintQueue = [];

            // Prepare offscreen stroke canvases
            let sCanvas = getStrokeCanvas();
            let sCtx = sCanvas.getContext('2d');
            sCtx.clearRect(0, 0, 1024, 1024);

            let bCanvas = getStrokeBackupCanvas();
            let bCtx = bCanvas.getContext('2d');
            bCtx.clearRect(0, 0, 1024, 1024);
            bCtx.drawImage(lay.paintCanvas, 0, 0);

            // Draw a single dot immediately on press onto stroke canvas
            drawBrushDot(lay, pos.x, pos.y, rawPressure, sCtx);
            
            // Combine stroke and backup onto the active layer
            let lp = lay.params;
            let opacity = (lp.brushOpacity !== undefined ? lp.brushOpacity : 100) / 100;
            combineStrokeAndBackup(lay, opacity);

            // Queue immediate render of the dot
            updatePaintBuffer(lay);
            requestRender();

            // Start processing the paint movement queue in animation frames
            if (!paintAnimationFrameId) {
                paintAnimationFrameId = requestAnimationFrame(processPaintQueue);
            }

            e.stopPropagation();
            e.preventDefault();
        }

        function handleCanvasPointerMove(e) {
            if (!isPainting) return;

            if (!paintModule.isValidPointer(e)) {
                cancelPainting();
                return;
            }

            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || lay.generatorType !== 'paint') {
                cancelPainting();
                return;
            }

            let pos = getPaintCanvasCoordinates(e.clientX, e.clientY);
            paintMoved = true;

            let rawPressure = e.pointerType === 'pen' ? e.pressure : 1;
            if (e.pointerType === 'pen' && rawPressure <= 0) rawPressure = 0.1;

            // Smooth pressure values
            smoothedPressure = smoothedPressure * 0.88 + rawPressure * 0.12;

            // Push event into the queue to be processed on requestAnimationFrame
            paintQueue.push({ x: pos.x, y: pos.y, pressure: smoothedPressure });

            e.stopPropagation();
            e.preventDefault();
        }

        function processPaintQueue() {
            if (!isPainting && paintQueue.length === 0) {
                paintAnimationFrameId = null;
                return;
            }

            if (activeTouchCount > 1 || touchGesture.maxTouches > 1) {
                cancelPainting();
                return;
            }

            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || lay.generatorType !== 'paint') {
                cancelPainting();
                return;
            }

            let updated = false;
            let sCtx = getStrokeCanvas().getContext('2d');

            while (paintQueue.length > 0) {
                let pt = paintQueue.shift();
                let lastPt = paintPoints[paintPoints.length - 1];

                // Ignore points that are extremely close to the last one
                if (lastPt && Math.hypot(pt.x - lastPt.x, pt.y - lastPt.y) < 0.5) {
                    continue;
                }

                paintPoints.push(pt);
                updated = true;

                if (paintPoints.length === 2) {
                    // Two points: simple line segment between first and second point
                    drawBrushLineSegment(lay, lastPt.x, lastPt.y, pt.x, pt.y, undefined, undefined, pt.pressure, sCtx);
                } else if (paintPoints.length > 2) {
                    // Three or more points: draw smooth quadratic curve between midpoints
                    let p2 = paintPoints[paintPoints.length - 1]; // current point
                    let p1 = paintPoints[paintPoints.length - 2]; // control point
                    let p0 = paintPoints[paintPoints.length - 3]; // previous point

                    let midX0 = (p0.x + p1.x) / 2;
                    let midY0 = (p0.y + p1.y) / 2;
                    let midX1 = (p1.x + p2.x) / 2;
                    let midY1 = (p1.y + p2.y) / 2;

                    drawBrushLineSegment(lay, midX0, midY0, midX1, midY1, p1.x, p1.y, p1.pressure, sCtx);
                }
            }

            if (updated) {
                let lp = lay.params;
                let opacity = (lp.brushOpacity !== undefined ? lp.brushOpacity : 100) / 100;
                combineStrokeAndBackup(lay, opacity);
                updatePaintBuffer(lay);
                requestRender();
            }

            if (isPainting) {
                paintAnimationFrameId = requestAnimationFrame(processPaintQueue);
            } else {
                paintAnimationFrameId = null;
            }
        }

        function handleCanvasPointerUp(e) {
            if (!isPainting) return;

            if (!paintModule.isValidPointer(e)) {
                cancelPainting();
                return;
            }

            isPainting = false;
            strokeBackupActive = false;
            
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (lay && lay.generatorType === 'paint') {
                let sCtx = getStrokeCanvas().getContext('2d');
                // Connect the last midpoint to the final point to complete the line beautifully
                if (paintPoints.length > 1) {
                    let lastPt = paintPoints[paintPoints.length - 1];
                    let prevPt = paintPoints[paintPoints.length - 2];
                    let midX = (prevPt.x + lastPt.x) / 2;
                    let midY = (prevPt.y + lastPt.y) / 2;
                    drawBrushLineSegment(lay, midX, midY, lastPt.x, lastPt.y, undefined, undefined, lastPt.pressure, sCtx);
                }
                
                let lp = lay.params;
                let opacity = (lp.brushOpacity !== undefined ? lp.brushOpacity : 100) / 100;
                combineStrokeAndBackup(lay, opacity);
                updatePaintBuffer(lay);
                commitHistorySnapshot();
            }

            paintPoints = [];
            paintQueue = [];
        }

        function evalGenerator(type, tx, ty, sx, sy, p, cymaticsSources = null, lay = null) {
            let v = 0.5;
            switch(type){
                case 'paint': {
                    if (lay && lay.paintBuffer) {
                        let scaleFactorX = (sx || 10) / 10;
                        let scaleFactorY = (sy || 10) / 10;
                        let stx = (tx - 0.5) * scaleFactorX + 0.5;
                        let sty = (ty - 0.5) * scaleFactorY + 0.5;
                        let px = (stx % 1 + 1) % 1;
                        let py = (sty % 1 + 1) % 1;
                        let pw = 1024;
                        let ph = 1024;
                        let x = px * (pw - 1);
                        let y = py * (ph - 1);
                        let x0 = Math.floor(x);
                        let y0 = Math.floor(y);
                        let x1 = Math.min(pw - 1, x0 + 1);
                        let y1 = Math.min(ph - 1, y0 + 1);
                        let fx = x - x0;
                        let fy = y - y0;
                        let v00 = lay.paintBuffer[y0 * pw + x0];
                        let v10 = lay.paintBuffer[y0 * pw + x1];
                        let v01 = lay.paintBuffer[y1 * pw + x0];
                        let v11 = lay.paintBuffer[y1 * pw + x1];
                        v = (1 - fy) * ((1 - fx) * v00 + fx * v10) + fy * ((1 - fx) * v01 + fx * v11);
                    } else {
                        v = 0;
                    }
                    break;
                }
                case 'cymatics': v = Cymatics.noise(tx, ty, p, cymaticsSources); break;
                case 'simplex': v=(Simplex.noise(tx*sx,ty*sy)+1)/2; break;
                case 'perlin': v=(Perlin.noise(tx*sx,ty*sy)+1)/2; break;
                case 'voronoi': v=Voronoi.noise(tx*sx,ty*sy,p.mode||'f1',p.metric||'euclidean',p.distExp||2); break;
                case 'fbm': v=fbm(tx*sx,ty*sy,p.octaves||3,p.lacunarity??2,p.gain??0.5,'simplex'); break;
                case 'ridged': v=ridged(tx*sx,ty*sy,p.octaves||3,p.lacunarity??2,p.gain??0.5); break;
                case 'sine': v=(Math.sin(tx*sx*Math.PI*2+(p.phase||0))+Math.cos(ty*sy*Math.PI*2+(p.phase||0))+2)/4; break;
                case 'radial': let dc=Math.sqrt((tx-(p.centerX??0.5))**2+(ty-(p.centerY??0.5))**2); v=(Math.sin(dc*sx*Math.PI*2)+1)/2; break;
                case 'spiral': let ds=Math.sqrt((tx-(p.centerX??0.5))**2+(ty-(p.centerY??0.5))**2), as=Math.atan2(ty-(p.centerY??0.5),tx-(p.centerX??0.5)); v=(Math.sin(ds*sx*Math.PI*2+as*(p.octaves||3))+1)/2; break;
                case 'hexagon': let hc=Math.cos(tx*sx*Math.PI*2)+Math.cos((tx*sx*0.5+ty*sy*0.866025)*Math.PI*2)+Math.cos((tx*sx*0.5-ty*sy*0.866025)*Math.PI*2); v=(hc+1.5)/4.5; break;
                case 'pixel_noise': v=Voronoi.hash(Math.floor(tx*sx), Math.floor(ty*sy)); break;
                case 'white_noise': v=Voronoi.hash(Math.floor(tx*sx*256)+(p.seed||0)*31, Math.floor(ty*sy*256)+(p.seed||0)*17); break;
                case 'checkerboard': v=(Math.floor(tx*sx)+Math.floor(ty*sy))%2===0?1:0; break;
                case 'dots': let rdx=(tx*sx)%1-0.5, rdy=(ty*sy)%1-0.5; v=Math.sqrt(rdx*rdx+rdy*rdy)<(p.dotSize??0.3)?1:0; break;
                case 'weave': let wx=Math.sin(tx*sx*Math.PI*2), wy=Math.sin(ty*sy*Math.PI*2); v=(wx*wy+1)/2; break;
                case 'value_noise': 
                    let ix=Math.floor(tx*sx), iy=Math.floor(ty*sy), fx=(tx*sx)-ix, fy=(ty*sy)-iy;
                    let v00=Voronoi.hash(ix,iy), v10=Voronoi.hash(ix+1,iy), v01=Voronoi.hash(ix,iy+1), v11=Voronoi.hash(ix+1,iy+1);
                    v=Perlin.lerp(Perlin.fade(fy), Perlin.lerp(Perlin.fade(fx),v00,v10), Perlin.lerp(Perlin.fade(fx),v01,v11)); break;
                case 'cellular': v=1-Voronoi.noise(tx*sx,ty*sy,'f1'); break;
                case 'spider_web': {
                    let ux = (tx - 0.5) * (sx / 10);
                    let uy = (ty - 0.5) * (sy / 10);
                    let r = Math.sqrt(ux*ux + uy*uy);
                    let a = Math.atan2(uy, ux);
                    let radSineAmp = p.radSineAmp || 0;
                    let radSineFreq = p.radSineFreq || 10;
                    let ringSineAmp = p.ringSineAmp || 0;
                    let ringSineFreq = p.ringSineFreq || 5;
                    let jitter = p.jitter || 8;
                    let wobble = p.wobble || 0.03;
                    let fractal = p.fractal || 0;
                    let radialCount = p.radialCount || 18;
                    let radThick = p.radThick || 0.025;
                    let ringCount = p.ringCount || 22;
                    let ringThick = p.ringThick || 0.04;
                    a += radSineAmp * Math.sin(r * radSineFreq);
                    let ringOffset = ringSineAmp * Math.sin(a * ringSineFreq);
                    let d1 = Math.sin(a * jitter);
                    let mix_val = d1 * (1 - fractal) + (Math.abs(d1) * 2.0 - 1.0) * fractal;
                    let combinedWobble = wobble * mix_val;
                    let rad_arg = ((a + combinedWobble) / (2.0 * Math.PI)) * radialCount;
                    let rad_fract = rad_arg - Math.floor(rad_arg);
                    let radial = Math.abs(rad_fract - 0.5);
                    radial = smoothstep(radThick, 0.0, radial);
                    let sin_a_jit = Math.sin(a * jitter);
                    let mix_ring = sin_a_jit * (1 - fractal) + Math.abs(sin_a_jit) * fractal;
                    let rr = r + ringOffset + (wobble * mix_ring);
                    let ring_arg = rr * ringCount;
                    let ring_fract = ring_arg - Math.floor(ring_arg);
                    let ring = Math.abs(ring_fract - 0.5);
                    ring = smoothstep(ringThick, 0.0, ring);
                    let fade = smoothstep(0.0, 0.05, r);
                    let edge = 1.0 - smoothstep(0.8, 1.0, r);
                    v = Math.max(radial, ring) * fade * edge;
                    break;
                }
            }
            return v;
        }

        function renderProject(tgtCanvas=null) {
            let isExport = !!tgtCanvas, cv = tgtCanvas||canvas, cx = cv.getContext('2d');
            let w = cv.width, h = cv.height, start = performance.now();
            ensureBuffers(w,h);
            
            let imgData = cx.createImageData(w,h), data = imgData.data;
            blendBuffer.fill(0); dispBuffer.fill(0.5);

            // --- Dynamic Resolution Metadata ---
            if ($('resolutionInfo')) {
                $('resolutionInfo').textContent = isExport ? `${w} × ${h}` : `${w} × ${h}${w === 256 ? ' (Чернетка)' : ''}`;
            }

            // --- Глобальна трансформація (Zoom/Rotate/Offset) + глобальний тайлінг ---
            // Читаємо один раз на рендер; застосовується до КОЖНОГО шару однаково,
            // як "камера" над усією композицією, ще ДО власних (локальних)
            // масштабу/повороту/зсуву/warp'ів кожного шару окремо.
            let gZoom = state.global.globalZoom || 1;
            let gRot = state.global.globalRotation || 0;
            let gOffX = state.global.globalOffsetX || 0;
            let gOffY = state.global.globalOffsetY || 0;
            let gTileMode = state.global.tileMode || 'off';
            let gRepX = Math.max(1, state.global.tileRepeatX || 1);
            let gRepY = Math.max(1, state.global.tileRepeatY || 1);
            let gMirX = state.global.tileMirrorX !== false;
            let gMirY = state.global.tileMirrorY !== false;
            // Зсув шва: дозволяє "посунути" повторювані/дзеркальні копії одна відносно
            // одної, щоб підібрати позицію, де природні деталі візерунка збігаються
            // і шов візуально менш помітний.
            let gSeamOffX = state.global.tileSeamOffsetX || 0;
            let gSeamOffY = state.global.tileSeamOffsetY || 0;
            // "Примусова м'яка безшовність" (і режим 'blend') — перевикористовують вже
            // наявний per-layer 4-семпловий seamless-блендинг (нижче, п.`p.seamless`),
            // просто вмикаючи його для КОЖНОГО шару одразу, з єдиною глобальною
            // м'якістю шва. Крива згладжування — додаткове тонке налаштування
            // характеру переходу (плавний spline чи прямий лінійний).
            let gForceSeamless = !!state.global.forceSeamless || gTileMode === 'blend';
            let gForceSoftness = state.global.forceSeamlessSoftness ?? 1;
            let gBlendCurve = state.global.blendCurve || 'smooth';

            // --- Шар-маска (Clipping Mask): мапінг маска -> ціль ---
            // state.layers[0] — верхній шар списку/стеку; більший index — нижче.
            // Порахований тут раз на кожен renderProject(), тому переміщення шарів
            // у списку одразу дає ефект на наступному кадрі.
            let { maskTargetIndex, clippedByMasks } = computeMaskRelationships();
            // Стан "відкладеного" (pending) цільового шару, що чекає накладання
            // однієї чи кількох масок над ним, перш ніж потрапити у blendBuffer.
            let pendingRemaining = 0, pendingOp = 1, pendingBlendFn = Blend.normal;

            // Check if displacement warp is used by any visible layer to avoid compute cost of dispBuffer
            let hasDisplacement = false;
            for (let i = 0; i < state.layers.length; i++) {
                let l = state.layers[i];
                if (l.visible && l.params.warps) {
                    for (let wIdx = 0; wIdx < l.params.warps.length; wIdx++) {
                        if (l.params.warps[wIdx].type === 'displacement' && l.params.warps[wIdx].visible !== false) {
                            hasDisplacement = true;
                            break;
                        }
                    }
                }
                if (hasDisplacement) break;
            }

            let dispBufferPopulated = false;
            let firstBlend = true;     // тепер окремо: пряме присвоєння vs блендинг у blendBuffer (маски самі в blendBuffer не пишуть)

            for(let lIdx=state.layers.length-1; lIdx>=0; lIdx--){
                let lay = state.layers[lIdx]; if(!lay.visible) continue;
                let op = lay.opacity/100, bFn = Blend[lay.blendMode] || Blend.normal, p = lay.params;
                let lScale = p.layerScale || 1;

                if (lay.generatorType === 'paint') {
                    ensureLayerPaintCanvas(lay);
                }

                if (hasDisplacement && !dispBufferPopulated) {
                    for(let i=0; i<w*h; i++) {
                        let y=Math.floor(i/w), x=i%w, nx=x/w, ny=y/h, sc=p.scale||4;
                        dispBuffer[i] = lay.generatorType==='simplex'?(Simplex.noise(nx*sc,ny*sc)+1)/2:(Perlin.noise(nx*sc,ny*sc)+1)/2;
                    }
                    dispBufferPopulated = true;
                }

                // Per-layer Caching Mechanism
                if (!lay.cachedBuffer || lay.isDirty || lay.cachedW !== w || lay.cachedH !== h) {
                    if (!lay.cachedBuffer || lay.cachedBuffer.length !== w * h) {
                        lay.cachedBuffer = new Float32Array(w * h);
                    }
                    lay.cachedW = w;
                    lay.cachedH = h;
                    lay.isDirty = false;

                    let activeCymaticsSources = null;
                    if (lay.generatorType === 'cymatics') {
                        activeCymaticsSources = Cymatics.getSources(p.sourceMode||'Corners', p.sourcesCount||4);
                    }

                    for(let y=0; y<h; y++){
                        const baseY = y/h;
                        for(let x=0; x<w; x++){
                            let nx = x/w, ny = baseY, idx = y*w+x;

                            // --- Глобальна трансформація + тайлінг (однаково для всіх шарів) ---
                            if (gZoom !== 1 || gRot || gOffX || gOffY || gTileMode !== 'off') {
                                nx -= 0.5; ny -= 0.5;
                                if (gZoom !== 1) { nx /= gZoom; ny /= gZoom; }
                                if (gRot) {
                                    let gr = -gRot * Math.PI / 180;
                                    let grx = nx * Math.cos(gr) - ny * Math.sin(gr);
                                    let gry = nx * Math.sin(gr) + ny * Math.cos(gr);
                                    nx = grx; ny = gry;
                                }
                                nx -= gOffX; ny -= gOffY;
                                if (gTileMode !== 'off') {
                                    let rx = nx * gRepX + 0.5 + gSeamOffX, ry = ny * gRepY + 0.5 + gSeamOffY;
                                    if (gTileMode === 'wrap' || gTileMode === 'blend') {
                                        rx = wrapFold(rx); ry = wrapFold(ry);
                                    } else if (gTileMode === 'mirror') {
                                        rx = gMirX ? mirrorFold(rx) : wrapFold(rx);
                                        ry = gMirY ? mirrorFold(ry) : wrapFold(ry);
                                    }
                                    nx = rx - 0.5; ny = ry - 0.5;
                                }
                                nx += 0.5; ny += 0.5;
                            }
                            // --- кінець глобального блоку; далі — незмінна логіка шару ---
                            
                            nx -= 0.5; ny -= 0.5;
                            nx /= lScale; ny /= lScale;

                            if(p.angle) { 
                                // Sampling uses the inverse transform so a positive angle rotates content clockwise.
                                let r = -p.angle * Math.PI / 180;
                                let rnx = nx * Math.cos(r) - ny * Math.sin(r); 
                                let rny = nx * Math.sin(r) + ny * Math.cos(r); 
                                nx = rnx; ny = rny;
                            }
                            
                            nx += 0.5; ny += 0.5;

                            if(p.warps && p.warps.length > 0){
                                for (let wIdx = 0; wIdx < p.warps.length; wIdx++) {
                                    let wModifier = p.warps[wIdx];
                                    if(wModifier.type === 'none' || wModifier.visible === false) continue;
                                    let st = Number(wModifier.strength) / 100;
                                    let fq = Math.max(0.1, Number(wModifier.freq) || 4);
                                    
                                    let cdx = nx - 0.5, cdy = ny - 0.5;
                                    let cdist = Math.sqrt(cdx*cdx + cdy*cdy);

                                    if(wModifier.type==='displacement'){ 
                                        let ox = dispBuffer[idx]-0.5;
                                        let oy = NoiseCache.get(nx*fq + 37, ny*fq + 71)-0.5;
                                        nx += ox*st; ny += oy*st;
                                    }
                                    else if(wModifier.type==='vortex'){ 
                                        let a = cdist * st * 15; 
                                        nx = 0.5 + cdx*Math.cos(a) - cdy*Math.sin(a); 
                                        ny = 0.5 + cdx*Math.sin(a) + cdy*Math.cos(a); 
                                    }
                                    else if(wModifier.type==='twirl'){ 
                                        let falloff = Math.max(0, 1 - (cdist / (fq * 0.25))); 
                                        let a = falloff * st * 10;
                                        nx = 0.5 + cdx*Math.cos(a) - cdy*Math.sin(a);
                                        ny = 0.5 + cdx*Math.sin(a) + cdy*Math.cos(a);
                                    }
                                    else if(wModifier.type==='sine'){ 
                                        const waveX = Math.sin(ny * fq * Math.PI) * st * 0.1;
                                        const waveY = Math.cos(nx * fq * Math.PI) * st * 0.1;
                                        nx += waveX; ny += waveY;
                                    }
                                    else if(wModifier.type==='bulge'){ 
                                        let power = Math.exp(-cdist * fq);
                                        let scale = 1 + power * st;
                                        nx = 0.5 + cdx * scale;
                                        ny = 0.5 + cdy * scale;
                                    }
                                    else if(wModifier.type==='noise'){ 
                                        let noX = NoiseCache.get(nx*fq, ny*fq) - 0.5; 
                                        let noY = NoiseCache.get(nx*fq + 100, ny*fq + 100) - 0.5; 
                                        nx += noX * (st * 0.2); 
                                        ny += noY * (st * 0.2); 
                                    }
                                    else if(wModifier.type==='domain_warp'){
                                        let offX = (NoiseCache.get(nx*fq, ny*fq) - 0.5) * st;
                                        let offY = (NoiseCache.get(nx*fq + 100, ny*fq + 100) - 0.5) * st;
                                        nx += offX; ny += offY;
                                    }
                                    else if(wModifier.type==='distortion'){
                                        nx += Math.sin(cdx * fq * Math.PI) * (st * 0.1);
                                        ny += Math.cos(cdy * fq * Math.PI) * (st * 0.1);
                                    }
                                    else if(wModifier.type==='polar'){
                                        let r = cdist * fq;
                                        let theta = Math.atan2(cdy, cdx) / (Math.PI * 2);
                                        nx = 0.5 + r * Math.cos(theta * Math.PI * 2) * st;
                                        ny = 0.5 + r * Math.sin(theta * Math.PI * 2) * st;
                                    }
                                }
                            }

                            let tx = nx + (p.offsetX||0) + (p.seed||0)*0.013, ty = ny + (p.offsetY||0) + (p.seed||0)*0.021;
                            let sx=p.scaleX||10, sy=p.scaleY||10;
                            let v = 0;

                            if (p.seamless || gForceSeamless) {
                                let tx0 = tx % 1.0; if (tx0 < 0) tx0 += 1.0;
                                let ty0 = ty % 1.0; if (ty0 < 0) ty0 += 1.0;
                                let v00 = evalGenerator(lay.generatorType, tx0, ty0, sx, sy, p, activeCymaticsSources, lay);
                                let v10 = evalGenerator(lay.generatorType, tx0 - 1, ty0, sx, sy, p, activeCymaticsSources, lay);
                                let v01 = evalGenerator(lay.generatorType, tx0, ty0 - 1, sx, sy, p, activeCymaticsSources, lay);
                                let v11 = evalGenerator(lay.generatorType, tx0 - 1, ty0 - 1, sx, sy, p, activeCymaticsSources, lay);
                                let softness = gForceSeamless ? Math.max(0, Math.min(1, gForceSoftness)) : Math.max(0, Math.min(1, p.seamlessSoftness ?? 1));
                                let curveX = gBlendCurve === 'linear' ? tx0 : Perlin.fade(tx0);
                                let curveY = gBlendCurve === 'linear' ? ty0 : Perlin.fade(ty0);
                                let u = Perlin.lerp(softness, tx0, curveX);
                                let v_blend = Perlin.lerp(softness, ty0, curveY);
                                v = Perlin.lerp(v_blend, Perlin.lerp(u, v00, v10), Perlin.lerp(u, v01, v11));
                            } else {
                                v = evalGenerator(lay.generatorType, tx, ty, sx, sy, p, activeCymaticsSources, lay);
                            }

                            if(p.brightness!==undefined) v=v*p.brightness;
                            if(p.contrast!==undefined) v=(v-0.5)*p.contrast+0.5;
                            if(p.invert) v=1-v;

                            if (p.useLevels) {
                                let min = (p.levelMin||0)/100, max = (p.levelMax||100)/100;
                                if (max > min) v = (v - min) / (max - min);
                            }
                            if (p.useThreshold) v = v >= (p.thresholdVal||50)/100 ? 1 : 0;
                            
                            if (p.usePosterize) {
                                let levels = Math.max(2, p.posterizeLevels || 4);
                                v = Math.floor(v * levels) / (levels - 1);
                            }

                            lay.cachedBuffer[idx] = Math.max(0, Math.min(1, v));
                        }
                    }

                    if(p.useFindEdges) applyEdgeDetection(lay.cachedBuffer, blurTemp, w, h);
                    if(p.blur>0) applyBoxBlur(lay.cachedBuffer, blurTemp, w, h, parseInt(p.blur));
                }

                layerBuffer.set(lay.cachedBuffer);

                if (lay.isMask) {
                    // Шар-маска сам НІКОЛИ не потрапляє у blendBuffer напряму — його
                    // яскравість (0..1) стає ПОПІКСЕЛЬНОЮ АЛЬФОЮ цільового шару під ним:
                    // біле в масці = ціль повністю видима, чорне = ціль прозора і крізь
                    // неї видно те, що НИЖЧЕ по стеку (а не суцільний чорний колір).
                    // Якщо цілі немає (низ стеку) — pendingRemaining==0, маска ігнорується.
                    if (pendingRemaining > 0) {
                        for (let i=0;i<w*h;i++) pendingMaskAlphaBuffer[i] *= layerBuffer[i];
                        pendingRemaining--;
                        if (pendingRemaining === 0) {
                            if (firstBlend) {
                                // Немає нічого нижче (чорний канвас) — контент лише применшується
                                // альфою маски; власна opacity шару тут теж ігнорується, так само
                                // як і для звичайного немаскованого нижнього шару вище.
                                for(let i=0;i<w*h;i++) blendBuffer[i] = pendingMaskTargetBuffer[i]*pendingMaskAlphaBuffer[i];
                            } else {
                                for(let i=0;i<w*h;i++) {
                                    let a = pendingMaskAlphaBuffer[i]*pendingOp;
                                    blendBuffer[i] = blendBuffer[i]*(1-a) + pendingBlendFn(blendBuffer[i],pendingMaskTargetBuffer[i])*a;
                                }
                            }
                            firstBlend = false;
                        }
                    }
                } else if (clippedByMasks[lIdx]) {
                    // Цей шар кліпається однією чи кількома масками, що йдуть далі в цьому
                    // ж циклі (вони завжди йдуть одразу за ним — тільки маски можуть бути
                    // між ним і його масками). Відкладаємо блендинг до їх повного накладання:
                    // контент і альфа зберігаються ОКРЕМО, щоб чорне в масці не "фарбувало"
                    // піксель, а робило його прозорим для шару(ів) під ним.
                    pendingMaskTargetBuffer.set(layerBuffer);
                    pendingMaskAlphaBuffer.fill(1);
                    pendingOp = op; pendingBlendFn = bFn;
                    pendingRemaining = clippedByMasks[lIdx].length;
                } else {
                    // Звичайний шар без маскування — поведінка як і раніше
                    for(let i=0;i<w*h;i++) blendBuffer[i] = firstBlend ? layerBuffer[i] : blendBuffer[i]*(1-op) + bFn(blendBuffer[i],layerBuffer[i])*op;
                    firstBlend = false;
                }
            }

            if(state.global.blur>0) applyBoxBlur(blendBuffer, blurTemp, w, h, parseInt(state.global.blur));

            let gg=state.global.gamma||1, gc=state.global.contrast||1, gv=state.global.vignette||0, gr=state.global.grain||0, gi=state.global.invert===true;

            for(let y=0; y<h; y++){
                let dy=y/h-0.5;
                for(let x=0; x<w; x++){
                    let px_idx = y*w+x, v = blendBuffer[px_idx];

                    if(gi) v=1-v;
                    if(gc!==1) v=(v-0.5)*gc+0.5;
                    if(gg!==1 && v>0) v=Math.pow(v,1/gg);
                    if(gv>0) v*=Math.max(0, 1-Math.sqrt((x/w-0.5)**2+dy**2)*gv*1.5);
                    if(gr>0) v+=(Math.random()-0.5)*(gr/255);
                    
                    let cv=Math.max(0,Math.min(255,Math.floor(v*255))), px=px_idx*4;
                    data[px]=cv; data[px+1]=cv; data[px+2]=cv; data[px+3]=255;
                }
            }

            cx.putImageData(imgData,0,0);
            if(!isExport) $('renderTime').textContent = `${(performance.now()-start).toFixed(1)} ms`;
        }

        function switchRightTab(tab) {
            currentTab = tab;
            $('btnTabLayer').className = tab==='layer'?'btn btn-primary':'btn btn-secondary';
            $('btnTabGlobal').className = tab==='global'?'btn btn-primary':'btn btn-secondary';
            $('rightPanelTitle').innerText = tab==='layer'?"Властивості шару":"Глобальні ефекти";
            tab==='layer'?renderProps():renderGlobal();
        }

        function renderLayers() {
            let { maskTargetIndex, clippedByMasks } = computeMaskRelationships();
            $('layersList').innerHTML = state.layers.map((l,i) => {
                let isMasked = !!clippedByMasks[i]; // цей шар кліпається маскою(ами), що йдуть над ним
                let maskHasNoTarget = l.isMask && maskTargetIndex[i] === -1; // маска в самому низу — не відображається
                return `
                <div class="layer-card ${l.id===state.selectedLayerId?'active':''} ${l.isMask?'is-mask':''} ${maskHasNoTarget?'is-mask-empty':''} ${isMasked?'is-masked-target':''} ${!l.visible?'is-hidden':''}" onclick="state.selectedLayerId='${l.id}';switchRightTab('layer');renderLayers();renderProps();">
                    <div class="layer-row-top">
                        <div class="layer-info">${isMasked?'<span class="mask-link-icon" title="Кліпується маскою зверху">⤷</span>':''}<button onclick="event.stopPropagation(); toggleLayerVisibility(${i})" class="layer-btn ${l.visible?'layer-visible':'layer-hidden'}" title="${l.visible?'Приховати шар':'Показати шар'}" style="padding:0; margin-right:4px;">${l.visible?'👁':'🕶'}</button><span class="layer-name">${l.name}</span>${l.isMask?`<span class="mask-badge" title="${maskHasNoTarget?'Маска: немає шару знизу — не відображається':'Цей шар працює як маска для шару знизу'}">МАСКА</span>`:''}</div>
                        <div class="layer-controls">
                            <button onclick="event.stopPropagation(); toggleMask(${i})" class="layer-btn ${l.isMask?'layer-btn-mask-active':''}" title="Використати як маску">🎭</button>
                            <button onclick="event.stopPropagation(); duplicateLayer(${i})" class="layer-btn" title="Дублювати шар">📋</button>
                            <button onclick="event.stopPropagation(); moveLayer(${i},-1)" class="layer-btn">▲</button>
                            <button onclick="event.stopPropagation(); moveLayer(${i},1)" class="layer-btn">▼</button>
                            <button onclick="event.stopPropagation(); deleteLayer(${i})" class="layer-btn layer-btn-delete">✕</button>
                        </div>
                    </div>
                    <div class="layer-meta"><span>${l.generatorType.toUpperCase()}</span><span>${l.blendMode.toUpperCase()} | ${l.opacity}%</span></div>
                </div>`;
            }).join('');
        }

        function toggleLayerVisibility(i) {
            let lay = state.layers[i];
            if (!lay) return;
            lay.visible = !lay.visible;
            lay.isDirty = true;
            renderLayers();
            renderProps();
            requestRender();
            commitHistorySnapshot();
        }

        // Базові (спільні для всіх типів генератора) параметри нового/скинутого шару.
        // Параметри, специфічні для конкретного алгоритму (frequency, radialCount,
        // metric, octaves...), свідомо ВІДСУТНІ тут — вони підхоплюють власні
        // значення за замовчуванням через || / ?? у renderProps()/evalGenerator()
        // самі, щойно з'являються на екрані для свого типу генератора.
        function freshLayerParams() {
            return { seamless:false, scale:10, scaleX:10, scaleY:10, lockScale:true, layerScale:1, contrast:1, brightness:1, angle:0, blur:0,
                offsetX:0, offsetY:0, invert:false, warps:[],
                useThreshold:false, thresholdVal:50, useLevels:false, levelMin:0, levelMax:100,
                usePosterize:false, posterizeLevels:4, useFindEdges:false };
        }

        function freshGlobalSettings() {
            return { gamma:1, contrast:1, vignette:0, grain:10, blur:0,
                globalZoom:1, globalRotation:0, globalOffsetX:0, globalOffsetY:0,
                tileMode:'off', tileRepeatX:2, tileRepeatY:2, tileMirrorX:true, tileMirrorY:true,
                tileSeamOffsetX:0, tileSeamOffsetY:0, blendCurve:'smooth',
                forceSeamless:false, forceSeamlessSoftness:1 };
        }

        function addLayer(){
            let id='l'+Date.now();
            state.layers.unshift({id, name:'Новий шар', visible:true, opacity:100, blendMode:'normal', generatorType:'simplex', isMask:false, params: freshLayerParams()});
            state.selectedLayerId=id; 
            commitHistorySnapshot();
            renderLayers(); switchRightTab('layer'); requestRender();
        }
        function duplicateLayer(i){
            prepareStateForSerialization();
            let orig = state.layers[i];
            let newL = JSON.parse(JSON.stringify(orig));
            newL.id = 'l' + Date.now();
            newL.name = orig.name + ' (Копія)';
            state.layers.splice(i, 0, newL);
            state.selectedLayerId = newL.id; 
            commitHistorySnapshot();
            renderLayers(); switchRightTab('layer'); requestRender();
        }
        function deleteLayer(i){
            if (i >= 0 && i < state.layers.length) {
                state.layers.splice(i, 1);
                if (!state.layers.find(l => l.id === state.selectedLayerId)) {
                    state.selectedLayerId = state.layers.length ? state.layers[0].id : null;
                }
                commitHistorySnapshot();
                renderLayers();
                renderProps();
                requestRender();
            }
        }
        function moveLayer(i,d){ 
            if(i+d>=0 && i+d<state.layers.length){ 
                [state.layers[i],state.layers[i+d]]=[state.layers[i+d],state.layers[i]]; 
                commitHistorySnapshot();
                renderLayers(); requestRender(); 
            } 
        }
        function toggleMask(i) {
            let lay = state.layers[i];
            if (!lay) return;
            lay.isMask = !lay.isMask;
            renderLayers();
            requestRender();
            commitHistorySnapshot();
        }

        // --- Custom Confirm Modal & State Management ---
        function customConfirm(message, onConfirm) {
            console.log("customConfirm called with message:", message);
            const msgEl = $('confirmModalMessage');
            const btnEl = $('confirmModalBtn');
            const modalEl = $('confirmModal');
            if (msgEl && btnEl && modalEl) {
                msgEl.innerText = message;
                btnEl.onclick = function() {
                    modalEl.style.display = 'none';
                    if (onConfirm) onConfirm();
                };
                modalEl.style.display = 'flex';
            } else {
                if (confirm(message)) {
                    if (onConfirm) onConfirm();
                }
            }
        }

        function setState(v) {
            state = v;
            window.state = state;
        }

        // --- Скидання (Reset) ---
        function resetLayer(i) {
            console.log("resetLayer called for index:", i);
            let lay = state.layers[i];
            if (!lay) {
                console.error("resetLayer error: Layer not found at index", i);
                return;
            }
            customConfirm(`Скинути всі параметри шару "${lay.name}" до значень за замовчуванням?`, () => {
                console.log("resetLayer confirmed for:", lay.name);
                lay.params = freshLayerParams();
                lay.isDirty = true;
                renderProps(); requestRender();
            });
        }
        function resetGlobalSettings() {
            console.log("resetGlobalSettings called");
            customConfirm("Скинути всі глобальні налаштування (корекції, трансформацію, тайлінг) до значень за замовчуванням?", () => {
                console.log("resetGlobalSettings confirmed");
                state.global = freshGlobalSettings();
                invalidateCaches();
                renderGlobal(); requestRender();
            });
        }
        function resetProject() {
            console.log("resetProject called");
            customConfirm("Скинути ВЕСЬ проєкт до початкового стану? Усі шари та глобальні налаштування буде втрачено.", () => {
                console.log("resetProject confirmed");
                let id = 'l'+Date.now();
                setState({
                    layers: [{ id, name:'Шар 1', visible:true, opacity:100, blendMode:'normal', generatorType:'simplex', isMask:false, params: freshLayerParams() }],
                    selectedLayerId: id,
                    global: freshGlobalSettings()
                });
                invalidateCaches();
                renderLayers(); switchRightTab('layer'); requestRender();
            });
        }

        // --- Рандомізація ---
        const GENERATOR_TYPES = ['simplex','perlin','voronoi','fbm','ridged','sine','radial','spiral','hexagon','pixel_noise','white_noise','checkerboard','dots','weave','value_noise','cellular','spider_web','cymatics', 'paint'];

        // Рандомізує ОДИН шар: випадковий тип генератора + всі його повзунки (в
        // межах їхніх власних min/max) + помірний шанс увімкнути локальні ефекти.
        // Непрозорість (opacity) свідомо НЕ чіпається, щоб шар не "зникав".
        // skipRender=true — для пакетного виклику з randomizeAllLayers(), щоб не
        // тригерити повний рендер після кожного окремого шару в циклі.
        function randomizeLayer(idx, skipRender) {
            console.log("randomizeLayer called for index:", idx, "skipRender:", skipRender);
            let lay = state.layers[idx];
            if (!lay) return;
            // Keep the current generatorType unchanged
            lay.params.useThreshold = Math.random() < 0.25;
            lay.params.useLevels = Math.random() < 0.2;
            lay.params.usePosterize = Math.random() < 0.2;
            lay.params.useFindEdges = Math.random() < 0.15;
            lay.params.invert = Math.random() < 0.25;
            lay.isDirty = true;
            state.selectedLayerId = lay.id;
            renderProps();
            randomizeSlidersIn($('propertiesPanel'));
            if (!skipRender) { renderProps(); renderLayers(); requestRender(); }
        }

        function randomizeGlobalSettings() {
            console.log("randomizeGlobalSettings called");
            let g = state.global;
            g.gamma = 0.5 + Math.random() * 1.5;
            g.contrast = 0.7 + Math.random() * 0.8;
            g.vignette = Math.random() < 0.5 ? 0 : Math.random() * 0.6;
            g.grain = Math.random() < 0.3 ? 0 : Math.round(Math.random() * 25);
            g.blur = Math.random() < 0.75 ? 0 : Math.round(Math.random() * 5);
            
            g.globalZoom = 0.8 + Math.random() * 1.7;
            g.globalRotation = Math.round((Math.random() - 0.5) * 180);
            g.globalOffsetX = (Math.random() - 0.5) * 1.0;
            g.globalOffsetY = (Math.random() - 0.5) * 1.0;
            
            if (g.tileMode !== 'off') {
                g.tileRepeatX = 1 + Math.floor(Math.random() * 4);
                g.tileRepeatY = 1 + Math.floor(Math.random() * 4);
                g.tileSeamOffsetX = (Math.random() - 0.5) * 0.5;
                g.tileSeamOffsetY = (Math.random() - 0.5) * 0.5;
                g.forceSeamless = Math.random() < 0.4;
                g.forceSeamlessSoftness = 0.2 + Math.random() * 0.8;
            }
        }

        function randomizeAllLayers() {
            console.log("randomizeAllLayers called");
            if (!state.layers.length) return;
            customConfirm(`Рандомізувати ВСІ шари проєкту (${state.layers.length}) та глобальні налаштування?`, () => {
                console.log("randomizeAllLayers confirmed");
                state.layers.forEach((_, i) => randomizeLayer(i, true));
                randomizeGlobalSettings();
                invalidateCaches();
                commitHistorySnapshot();
                renderProps(); renderLayers(); requestRender();
            });
        }

        // Шар-маска (Clipping Mask): для кожної маски знаходить перший ВИДИМИЙ
        // НЕМАСКОВИЙ шар під нею (невидимі шари й інші маски підряд пропускаються
        // прозоро — п.5 ТЗ). Використовується і рендером, і панеллю шарів (UI),
        // щоб не дублювати логіку зв'язку маска -> ціль.
        function computeMaskRelationships() {
            let maskTargetIndex = new Array(state.layers.length).fill(-1); // маска -> індекс цілі (-1 = цілі немає)
            let clippedByMasks = new Array(state.layers.length).fill(null); // ціль -> список індексів масок, що її кліпають
            for (let i = 0; i < state.layers.length; i++) {
                if (!state.layers[i].visible || !state.layers[i].isMask) continue;
                let j = i + 1;
                while (j < state.layers.length && (!state.layers[j].visible || state.layers[j].isMask)) j++;
                if (j < state.layers.length) {
                    maskTargetIndex[i] = j;
                    (clippedByMasks[j] || (clippedByMasks[j] = [])).push(i);
                }
            }
            return { maskTargetIndex, clippedByMasks };
        }

        // Прапорець для пакетного застосування значень (рандомізація): поки true,
        // upd()/updateWarp()/updateScaleAxis() лише пишуть у стан, БЕЗ виклику
        // renderProject() на кожен окремий повзунок — інакше рандомізація шару з
        // десятком повзунків означала б десяток повних перерендерів поспіль.
        let suppressRender = false;

        // Скидає ОДИН повзунок (range або number) до значення за замовчуванням.
        // Використовується і кнопкою ↺, і подвійним тапом/кліком по самому повзунку.
        window.resetSliderEl = function(el, defaultVal) {
            if (!el) return;
            el.value = defaultVal;
            let sib = (el.nextElementSibling && el.nextElementSibling.tagName === 'INPUT') ? el.nextElementSibling
                     : (el.previousElementSibling && el.previousElementSibling.tagName === 'INPUT') ? el.previousElementSibling : null;
            if (sib) sib.value = defaultVal;
            el.dispatchEvent(new Event('input', {bubbles:true}));
        };

        // Рандомізує КОЖЕН видимий повзунок (крім позначених data-no-random) у
        // вказаному контейнері: випадкове значення в межах його ж min/max, з
        // прив'язкою до step, через ту саму подію 'input' (тобто відпрацьовує
        // вже наявний обробник кожного конкретного повзунка).
        function randomizeSlidersIn(containerEl) {
            suppressRender = true;
            containerEl.querySelectorAll('input[type=range]:not([data-no-random])').forEach(el => {
                let min = parseFloat(el.min), max = parseFloat(el.max), step = parseFloat(el.step) || 1;
                if (isNaN(min) || isNaN(max) || max <= min) return;
                let steps = Math.max(1, Math.round((max - min) / step));
                let val = min + Math.round(Math.random() * steps) * step;
                val = Math.min(max, Math.max(min, val));
                el.value = val;
                let sib = (el.nextElementSibling && el.nextElementSibling.tagName === 'INPUT') ? el.nextElementSibling : null;
                if (sib) sib.value = val;
                el.dispatchEvent(new Event('input', {bubbles:true}));
            });
            suppressRender = false;
        }

        window.addWarp = function() {
            let lay = state.layers.find(l=>l.id===state.selectedLayerId);
            if (!lay) return;
            if(!lay.params.warps) lay.params.warps = [];
            lay.params.warps.push({type: 'none', strength: 10, freq: 4, visible: true});
            lay.isDirty = true;
            renderProps();
            requestRender();
            commitHistorySnapshot();
        };

        window.removeWarp = function(idx) {
            let lay = state.layers.find(l=>l.id===state.selectedLayerId);
            if (!lay || !lay.params || !lay.params.warps) return;
            lay.params.warps.splice(idx, 1);
            lay.isDirty = true;
            renderProps();
            requestRender();
            commitHistorySnapshot();
        };

        window.toggleWarp = function(idx) {
            let lay = state.layers.find(l=>l.id===state.selectedLayerId);
            if (!lay || !lay.params || !lay.params.warps || !lay.params.warps[idx]) return;
            lay.params.warps[idx].visible = lay.params.warps[idx].visible === false ? true : false;
            lay.isDirty = true;
            renderProps();
            requestRender();
            commitHistorySnapshot();
        };

        window.moveWarp = function(idx, direction) {
            let lay = state.layers.find(l=>l.id===state.selectedLayerId);
            if (!lay || !lay.params || !lay.params.warps) return;
            moveDeformer(lay.id, idx, direction);
        };

        window.moveDeformer = function(layerId, index, direction) {
            let lay = state.layers.find(l=>l.id===layerId);
            if (!lay || !lay.params || !lay.params.warps) return;
            let warps = lay.params.warps;
            let targetIdx = index + direction;
            if (targetIdx < 0 || targetIdx >= warps.length) return;

            let temp = warps[index];
            warps[index] = warps[targetIdx];
            warps[targetIdx] = temp;

            lay.isDirty = true;
            renderProps();
            requestRender();
            commitHistorySnapshot();
        };

        window.updateWarp = function(idx, key, val) {
            let lay = state.layers.find(l=>l.id===state.selectedLayerId);
            if (!lay || !lay.params || !lay.params.warps || !lay.params.warps[idx]) return;
            triggerInteraction();
            lay.params.warps[idx][key] = (key==='type') ? val : parseFloat(val);
            lay.isDirty = true;
            if(key==='type') renderProps();
            if(!suppressRender) requestRender();
            if (key === 'type') {
                commitHistorySnapshot();
            } else {
                scheduleHistorySnapshot();
            }
        };

        // label, key, min, max, step, val, isLay, def (за замовчуванням = val), noRandom (виключити з рандомізації)
        function createSlider(label, key, min, max, step, val, isLay, def, noRandom) {
            let id = isLay ? 'lay_'+key : 'glob_'+key;
            if (def === undefined) def = val;
            let nr = noRandom ? ' data-no-random' : '';
            return `<div class="property-group">
                <label class="property-label">${label}</label>
                <div style="display:flex; gap:6px; align-items:center;">
                    <input type="range" id="rng_${id}" min="${min}" max="${max}" step="${step}" value="${val}"${nr} oninput="$('num_${id}').value=this.value; upd('${key}',this.value,${isLay})" onchange="commitHistorySnapshot();" ondblclick="resetSliderEl(this,${def})">
                    <input type="number" class="num-input" id="num_${id}" step="${step}" value="${val}" oninput="$('rng_${id}').value=this.value; upd('${key}',this.value,${isLay})" onchange="commitHistorySnapshot();" ondblclick="resetSliderEl(this,${def})">
                    <button type="button" class="reset-btn" title="Скинути за замовчуванням (${def})" onclick="resetSliderEl($('rng_${id}'),${def})">↺</button>
                </div>
            </div>`;
        }

        // Легкий варіант без id — для одноразових (ad-hoc) повзунків типу Threshold/Levels/Warp,
        // де inline-обробник вже сам синхронізує пару range/number через сусідні елементи.
        function sliderRow(min, max, step, val, def, onInputExpr) {
            return `<div style="display:flex; gap:6px; align-items:center;">
                <input type="range" min="${min}" max="${max}" step="${step}" value="${val}" oninput="this.nextElementSibling.value=this.value; ${onInputExpr}" onchange="commitHistorySnapshot();" ondblclick="resetSliderEl(this,${def})">
                <input type="number" class="num-input" step="${step}" value="${val}" oninput="this.previousElementSibling.value=this.value; ${onInputExpr}" onchange="commitHistorySnapshot();" ondblclick="resetSliderEl(this,${def})">
                <button type="button" class="reset-btn" title="Скинути за замовчуванням (${def})" onclick="resetSliderEl(this.parentElement.querySelector('input[type=range]'),${def})">↺</button>
            </div>`;
        }

        function createScaleSlider(label, key, val) {
            const id = `scale_${key}`;
            return `<div class="property-group">
                <label class="property-label">${label}</label>
                <div style="display:flex; gap:6px; align-items:center;">
                    <input type="range" id="rng_${id}" min="1" max="100" step="0.5" value="${val}" oninput="$('num_${id}').value=this.value; updateScaleAxis('${key}', this.value)" onchange="commitHistorySnapshot();" ondblclick="resetSliderEl(this,10)">
                    <input type="number" class="num-input" id="num_${id}" min="1" max="100" step="0.5" value="${val}" oninput="$('rng_${id}').value=this.value; updateScaleAxis('${key}', this.value)" onchange="commitHistorySnapshot();" ondblclick="resetSliderEl(this,10)">
                    <button type="button" class="reset-btn" title="Скинути за замовчуванням (10)" onclick="resetSliderEl($('rng_${id}'),10)">↺</button>
                </div>
            </div>`;
        }

        function updateScaleAxis(key, value) {
            const lay = state.layers.find(layer => layer.id === state.selectedLayerId);
            if(!lay) return;
            triggerInteraction();
            const scale = Math.max(1, Math.min(100, parseFloat(value) || 1));
            lay.params[key] = scale;
            lay.isDirty = true;
            if(lay.params.lockScale) {
                const otherKey = key === 'scaleX' ? 'scaleY' : 'scaleX';
                lay.params[otherKey] = scale;
                const otherId = `num_scale_${otherKey}`;
                const otherRange = `rng_scale_${otherKey}`;
                if($(otherId)) $(otherId).value = scale;
                if($(otherRange)) $(otherRange).value = scale;
            }
            if(!suppressRender) requestRender();
        }


        function renderProps() {
            let lay=state.layers.find(l=>l.id===state.selectedLayerId), p=$('propertiesPanel');
            if(!lay) return p.innerHTML = '<div class="empty-state">Виберіть шар</div>';
            let lp = lay.params;
            ['offsetX','offsetY','angle','phase'].forEach(k=>lp[k]=lp[k]||0);
            ['scaleX','scaleY'].forEach(k=>lp[k]=lp[k]||lp.scale||10);
            if(lp.layerScale===undefined) lp.layerScale=1;
            if(lp.lockScale===undefined) lp.lockScale=true;
            if(lp.brightness===undefined) lp.brightness=1;
            if(!lp.warps) lp.warps = [];

            if (lay.generatorType === 'cymatics') {
                if (lp.frequency === undefined) lp.frequency = 50;
                if (lp.phase === undefined) lp.phase = 0;
                if (lp.sourcesCount === undefined) lp.sourcesCount = 4;
                if (lp.symmetry === undefined) lp.symmetry = 1;
                if (lp.isolineWidth === undefined) lp.isolineWidth = 0.5;
            }

            let genHTML=createSlider("Зсув X", "offsetX", -2, 2, 0.05, lp.offsetX, false, 0) +
                        createSlider("Зсув Y", "offsetY", -2, 2, 0.05, lp.offsetY, false, 0) +
                        `<div class="property-group"><label class="property-label">Масштаб по осях <button type="button" class="layer-btn" title="${lp.lockScale?'Масштаб X/Y пов’язаний':'Масштаб X/Y незалежний'}" onclick="upd('lockScale',${!lp.lockScale}); renderProps();">${lp.lockScale?'🔒':'🔓'}</button></label></div>` +
                        createScaleSlider("Масштаб X (Noise/Web)", "scaleX", lp.scaleX) +
                        createScaleSlider("Масштаб Y (Noise/Web)", "scaleY", lp.scaleY) +
                        createSlider("Масштаб Шару (Zoom)", "layerScale", 0.1, 10, 0.1, lp.layerScale, false, 1) +
                        createSlider("Кут обертання (−180° … +180°)", "angle", -180, 180, 1, lp.angle, false, 0);
            
            if (lay.generatorType === 'paint') {
                ensureLayerPaintCanvas(lay);
                lp.brushColor = lp.brushColor || '#ffffff';
                lp.brushSize = lp.brushSize || 20;
                lp.brushSpacing = lp.brushSpacing !== undefined ? lp.brushSpacing : 10;
                lp.brushOpacity = lp.brushOpacity !== undefined ? lp.brushOpacity : 100;
                lp.brushSoftness = lp.brushSoftness !== undefined ? lp.brushSoftness : 0.5;
                lp.brushFalloff = lp.brushFalloff !== undefined ? lp.brushFalloff : 1.0;
                lp.brushAngle = lp.brushAngle !== undefined ? lp.brushAngle : 0;
                lp.brushSquash = lp.brushSquash !== undefined ? lp.brushSquash : 1.0;
                lp.brushTool = lp.brushTool || 'brush';

                genHTML += `
                <div class="section-title">Малювання (Brush Canvas)</div>
                <div class="property-group">
                    <label class="property-label">Інструмент</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(2,1fr);">
                        <button onclick="upd('brushTool','brush')" class="gen-btn ${lp.brushTool==='brush'?'active':''}">Пензель</button>
                        <button onclick="upd('brushTool','eraser')" class="gen-btn ${lp.brushTool==='eraser'?'active':''}">Гумка</button>
                    </div>
                </div>
                <div class="property-group">
                    <label class="property-label">Колір пензля (висота/маска)</label>
                    <input type="color" value="${lp.brushColor}" oninput="upd('brushColor', this.value)" style="width:100%; height:32px; background:none; border:1px solid var(--border-color); border-radius:4px; cursor:pointer;">
                </div>
                ${createSlider("Розмір пензля", "brushSize", 1, 200, 1, lp.brushSize, false, 20)}
                ${createSlider("Інтервал (Крок)", "brushSpacing", 1, 200, 1, lp.brushSpacing, false, 10)}
                ${createSlider("Сила (Непрозорість %)", "brushOpacity", 1, 100, 1, lp.brushOpacity, false, 100)}
                ${createSlider("Зона м'якості", "brushSoftness", 0, 1, 0.01, lp.brushSoftness, false, 0.5)}
                ${createSlider("Спад градієнта", "brushFalloff", 0.1, 4, 0.1, lp.brushFalloff, false, 1.0)}
                ${createSlider("Кут нахилу пензля", "brushAngle", -180, 180, 1, lp.brushAngle, false, 0)}
                ${createSlider("Форма (Стиснення)", "brushSquash", 0.1, 1, 0.05, lp.brushSquash, false, 1.0)}
                
                <div style="margin-top:12px; display:flex; gap:10px;">
                    <button onclick="clearPaintCanvas()" class="btn btn-secondary" style="color:#ef4444; border-color:rgba(239,68,68,0.2); width:100%;">Очистити полотно</button>
                </div>
                `;

                setTimeout(() => { updateBrushPreview(); }, 0);
            }

            if (lay.generatorType === 'cymatics') {
                genHTML += `<div class="section-title">Cymatics</div>`;
                genHTML += createSlider("Частота", "frequency", 1, 300, 1, lp.frequency, false, 50);
                genHTML += createSlider("Фаза", "phase", 0, 360, 1, lp.phase, false, 0);
                genHTML += `<div class="property-group"><label class="property-label">Джерело (Source)</label><select class="form-control" onchange="upd('sourceMode', this.value)"><option value="Center" ${lp.sourceMode==='Center'?'selected':''}>Center</option><option value="Corners" ${lp.sourceMode==='Corners'?'selected':''}>Corners</option><option value="Edges" ${lp.sourceMode==='Edges'?'selected':''}>Edges</option><option value="Ring" ${lp.sourceMode==='Ring'?'selected':''}>Ring</option><option value="Polygon" ${lp.sourceMode==='Polygon'?'selected':''}>Polygon</option><option value="Random" ${lp.sourceMode==='Random'?'selected':''}>Random</option></select></div>`;
                genHTML += createSlider("К-ть Джерел", "sourcesCount", 1, 64, 1, lp.sourcesCount, false, 4);
                genHTML += createSlider("Симетрія", "symmetry", 1, 24, 1, lp.symmetry, false, 1);
                genHTML += createSlider("Товщина лінії", "isolineWidth", 0, 1, 0.01, lp.isolineWidth, false, 0.5);
            }

            if (lay.generatorType === 'spider_web') {
                genHTML += `<div class="section-title">Spider Web</div>`;
                genHTML += createSlider("Кількість променів", "radialCount", 4, 64, 1, lp.radialCount || 18, false, 18);
                genHTML += createSlider("Кількість кілець", "ringCount", 4, 64, 1, lp.ringCount || 22, false, 22);
                genHTML += createSlider("Товщина кілець", "ringThick", 0.01, 0.2, 0.01, lp.ringThick || 0.04, false, 0.04);
                genHTML += createSlider("Товщина променів", "radThick", 0.01, 0.2, 0.01, lp.radThick || 0.025, false, 0.025);
                genHTML += createSlider("Wobble (Хвилювання)", "wobble", 0, 0.5, 0.01, lp.wobble || 0.03, false, 0.03);
                genHTML += createSlider("Jitter (Джиттер)", "jitter", 0, 20, 0.5, lp.jitter || 8, false, 8);
                genHTML += createSlider("Fractal (Фрактал)", "fractal", 0, 1, 0.05, lp.fractal || 0, false, 0);
                genHTML += createSlider("Ампл. кілець (Sine)", "ringSineAmp", 0, 1, 0.05, lp.ringSineAmp || 0, false, 0);
                genHTML += createSlider("Частота кілець (Sine)", "ringSineFreq", 1, 20, 1, lp.ringSineFreq || 5, false, 5);
                genHTML += createSlider("Ампл. променів (Sine)", "radSineAmp", 0, 1, 0.05, lp.radSineAmp || 0, false, 0);
                genHTML += createSlider("Частота променів (Sine)", "radSineFreq", 1, 20, 1, lp.radSineFreq || 10, false, 10);
            }
            
            if(['perlin','fbm','ridged','spiral'].includes(lay.generatorType)) genHTML+=createSlider(lay.generatorType==='spiral'?'Кількість рукавів (Arms)':'Октави', "octaves", 1, 10, 1, lp.octaves||3, false, 3);
            if(lay.generatorType==='voronoi') genHTML+=`<div class="property-group grid-2"><div><label class="property-label">Метрика</label><select class="form-control" onchange="upd('metric',this.value)"><option value="euclidean" ${lp.metric==='euclidean'?'selected':''}>Euclidean</option><option value="manhattan" ${lp.metric==='manhattan'?'selected':''}>Manhattan</option><option value="chebyshev" ${lp.metric==='chebyshev'?'selected':''}>Chebyshev</option></select></div><div><label class="property-label">Режим</label><select class="form-control" onchange="upd('mode',this.value)"><option value="f1" ${lp.mode==='f1'?'selected':''}>F1</option><option value="f2" ${lp.mode==='f2'?'selected':''}>F2</option><option value="f2_minus_f1" ${lp.mode==='f2_minus_f1'?'selected':''}>F2-F1</option></select></div></div>`;
            if(lay.generatorType==='sine') genHTML+=createSlider("Фаза зсуву", "phase", 0, 6.28, 0.1, lp.phase||0, false, 0);
            
            let warpsHTML = lp.warps.map((w, idx) => `
                <div class="warp-card" style="${w.visible===false?'opacity:0.5;':''}">
                    <div class="warp-controls">
                        <button type="button" class="warp-btn" title="Перемістити вгору" onclick="moveWarp(${idx}, -1)" ${idx === 0 ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''}>▲</button>
                        <button type="button" class="warp-btn" title="Перемістити вниз" onclick="moveWarp(${idx}, 1)" ${idx === lp.warps.length - 1 ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''}>▼</button>
                        <button type="button" class="warp-toggle" onclick="toggleWarp(${idx})" title="${w.visible!==false?'Приховати':'Показати'}">${w.visible!==false?'👁':'🕶'}</button>
                        <button type="button" class="warp-del" onclick="removeWarp(${idx})" title="Видалити">✕</button>
                    </div>
                    <label class="property-label" style="margin-top:2px;">Деформатор №${idx+1}</label>
                    <select onchange="updateWarp(${idx}, 'type', this.value)" class="form-control" style="margin-bottom:8px; margin-top:4px;">
                        <option value="none" ${w.type==='none'?'selected':''}>Немає</option>
                        <option value="displacement" ${w.type==='displacement'?'selected':''}>Displacement</option>
                        <option value="vortex" ${w.type==='vortex'?'selected':''}>Vortex</option>
                        <option value="twirl" ${w.type==='twirl'?'selected':''}>Twirl (Spiral Falloff)</option>
                        <option value="sine" ${w.type==='sine'?'selected':''}>Sine</option>
                        <option value="bulge" ${w.type==='bulge'?'selected':''}>Pinch/Bulge</option>
                        <option value="noise" ${w.type==='noise'?'selected':''}>Perlin Noise</option>
                        <option value="domain_warp" ${w.type==='domain_warp'?'selected':''}>Domain Warp</option>
                        <option value="distortion" ${w.type==='distortion'?'selected':''}>Дісторсія</option>
                        <option value="polar" ${w.type==='polar'?'selected':''}>Полярні координати</option>
                    </select>
                    ${w.type !== 'none' ? `
                    <div style="margin-bottom:4px;">${sliderRow(-100, 100, 1, w.strength, 10, `updateWarp(${idx}, 'strength', this.value)`)}</div>
                    ${sliderRow(0.1, 20, 0.1, w.freq, 4, `updateWarp(${idx}, 'freq', this.value)`)}` : ''}
                </div>
            `).join('');

            p.innerHTML = `
                <div class="property-group">
                    <label class="property-label">Алгоритм (Algorithm)</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(3,1fr);">
                        ${['paint','simplex','perlin','voronoi','fbm','ridged','sine','radial','spiral','hexagon','pixel_noise','white_noise','checkerboard','dots','weave','value_noise','cellular','spider_web', 'cymatics'].map(t=>`<button onclick="upd('generatorType','${t}',true)" class="gen-btn ${lay.generatorType===t?'active':''}">${t}</button>`).join('')}
                    </div>
                </div>
                <hr>

                <div class="property-group"><label class="property-label">Назва шару</label><input type="text" value="${lay.name}" onchange="lay.name=this.value;renderLayers()" class="form-control"></div>
                <div class="property-group grid-2">
                    <button onclick="randomizeLayer(state.layers.findIndex(l=>l.id==='${lay.id}'))" class="btn btn-secondary" title="Рандомізувати цей шар (тип, параметри, ефекти)">🎲 Рандом (шар)</button>
                    <button onclick="resetLayer(state.layers.findIndex(l=>l.id==='${lay.id}'))" class="btn btn-secondary" title="Скинути ВСІ параметри цього шару">↺ Скинути шар</button>
                </div>
                <div class="property-group" style="margin-top:8px;">
                    <label class="property-label">Режим накладання (Blend Mode)</label>
                    <select onchange="upd('blendMode',this.value,true)" class="form-control" style="height:34px; width: 100%;">
                        ${['normal','multiply','screen','overlay','difference','colorburn','colordodge','heightblend','exclusion','hardlight','lineardodge','linearburn'].map(o=>`<option value="${o}" ${lay.blendMode===o?'selected':''}>${o}</option>`).join('')}
                    </select>
                </div>
                ${createSlider("Непрозорість (%)", "opacity", 0, 100, 1, lay.opacity, true, 100, true)}
                <div class="property-group">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <label class="property-label" style="margin:0;">Базова Безшовність (Tileable)</label>
                        <input type="checkbox" ${lp.seamless ? 'checked' : ''} onchange="upd('seamless', this.checked)">
                    </div>
                </div>
                <hr>

                ${genHTML}
                <hr>
                
                <div class="section-title">Локальні ефекти</div>
                <div class="property-group">
                    <label class="property-label"><input type="checkbox" ${lp.useThreshold?'checked':''} onchange="upd('useThreshold',this.checked)"> Threshold (Поріг)</label>
                    ${lp.useThreshold ? sliderRow(0, 100, 1, lp.thresholdVal||50, 50, "upd('thresholdVal',this.value)") : ''}
                </div>
                <div class="property-group">
                    <label class="property-label"><input type="checkbox" ${lp.useLevels?'checked':''} onchange="upd('useLevels',this.checked)"> Levels (Рівні)</label>
                    ${lp.useLevels ? `<div style="display:flex;gap:4px;margin-bottom:4px;align-items:center;"><span style="color:#a1a1aa;font-size:10px;width:30px;">Min</span>${sliderRow(0, 100, 1, lp.levelMin||0, 0, "upd('levelMin',this.value)")}</div><div style="display:flex;gap:4px;align-items:center;"><span style="color:#a1a1aa;font-size:10px;width:30px;">Max</span>${sliderRow(0, 100, 1, lp.levelMax||100, 100, "upd('levelMax',this.value)")}</div>`:''}
                </div>
                <div class="property-group">
                    <label class="property-label"><input type="checkbox" ${lp.usePosterize?'checked':''} onchange="upd('usePosterize',this.checked)"> Постеризація (Quantization)</label>
                    ${lp.usePosterize ? sliderRow(2, 16, 1, lp.posterizeLevels||4, 4, "upd('posterizeLevels',this.value)") : ''}
                </div>
                <div class="property-group">
                    <label class="property-label"><input type="checkbox" ${lp.useFindEdges?'checked':''} onchange="upd('useFindEdges',this.checked)"> Find Edges (Знайти краї)</label>
                </div>
                <div class="property-group">
                    <label class="property-label"><input type="checkbox" ${lp.invert?'checked':''} onchange="upd('invert',this.checked)"> Інверсія кольорів (Invert)</label>
                </div>
                ${createSlider("Яскравість шару", "brightness", 0, 2, 0.05, lp.brightness, false, 1)}
                ${createSlider("Контраст шару", "contrast", 0.1, 3, 0.05, lp.contrast, false, 1)}
                ${createSlider("Розмиття (px)", "blur", 0, 15, 1, lp.blur||0, false, 0)}
                <hr>

                <div class="property-group">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <label class="property-label" style="margin:0;">Деформації (Warps)</label>
                        <button onclick="addWarp()" class="btn btn-primary" style="padding:4px 8px; font-size:10px;">+ Додати</button>
                    </div>
                    ${warpsHTML}
                </div>
            `;
            window.lay = lay; 
        }


        function renderGlobal() {
            let g = state.global;
            let modeBtn = (m, label) => `<button onclick="setTileMode('${m}')" class="gen-btn ${g.tileMode===m?'active':''}">${label}</button>`;

            $('propertiesPanel').innerHTML = `
                <div class="property-group">
                    <button onclick="resetGlobalSettings()" class="btn btn-secondary" style="width:100%;" title="Скинути корекції, трансформацію і тайлінг до значень за замовчуванням">↺ Скинути глобальні налаштування</button>
                </div>
                <hr>
                <div class="section-title" style="margin-top:0;">Глобальна трансформація</div>
                ${createSlider("Масштаб (Zoom)", "globalZoom", 0.1, 5, 0.05, g.globalZoom, true, 1)}
                ${createSlider("Поворот", "globalRotation", -180, 180, 1, g.globalRotation, true, 0)}
                ${createSlider("Зсув X", "globalOffsetX", -2, 2, 0.02, g.globalOffsetX, true, 0)}
                ${createSlider("Зсув Y", "globalOffsetY", -2, 2, 0.02, g.globalOffsetY, true, 0)}
                <hr>
                <div class="section-title">Глобальний Тайлінг</div>
                <div class="property-group">
                    <label class="property-label">Режим</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(2,1fr);">
                        ${modeBtn('off','Вимкнено')}${modeBtn('wrap','Повторення')}${modeBtn('mirror','Дзеркало')}${modeBtn('blend','Зсув + Блендинг')}
                    </div>
                </div>
                ${g.tileMode !== 'off' ? createSlider("Тайлів по X", "tileRepeatX", 1, 12, 1, g.tileRepeatX, true, 2) + createSlider("Тайлів по Y", "tileRepeatY", 1, 12, 1, g.tileRepeatY, true, 2) : ''}
                ${g.tileMode !== 'off' ? `
                    <div class="property-group"><label class="property-label" style="margin-bottom:0;">Зсув шва — посунути копії, щоб підібрати збіг деталей</label></div>
                    ${createSlider("Зсув шва X", "tileSeamOffsetX", -0.5, 0.5, 0.01, g.tileSeamOffsetX, true, 0)}
                    ${createSlider("Зсув шва Y", "tileSeamOffsetY", -0.5, 0.5, 0.01, g.tileSeamOffsetY, true, 0)}
                ` : ''}
                ${g.tileMode === 'mirror' ? `
                    <div class="property-group">
                        <label class="checkbox-label"><input type="checkbox" ${g.tileMirrorX?'checked':''} onchange="state.global.tileMirrorX=this.checked; invalidateCaches(); requestRender();"> Дзеркалити по X (інакше — повторення)</label>
                        <label class="checkbox-label"><input type="checkbox" ${g.tileMirrorY?'checked':''} onchange="state.global.tileMirrorY=this.checked; invalidateCaches(); requestRender();"> Дзеркалити по Y (інакше — повторення)</label>
                    </div>
                ` : ''}
                ${(g.tileMode === 'wrap' || g.tileMode === 'mirror') ? `
                    <div class="property-group">
                        <label class="checkbox-label"><input type="checkbox" ${g.forceSeamless?'checked':''} onchange="state.global.forceSeamless=this.checked; invalidateCaches(); renderGlobal(); requestRender();"> Змішування країв (додаткове згладжування шва)</label>
                    </div>
                ` : ''}
                ${g.tileMode === 'blend' ? `<div class="property-group"><label class="property-label" style="margin-bottom:0;">Змішування країв — увімкнено для цього режиму</label></div>` : ''}
                ${(g.tileMode !== 'off' && (g.forceSeamless || g.tileMode === 'blend')) ? `
                    ${createSlider("Ширина змішування (м'якість шва)", "forceSeamlessSoftness", 0, 1, 0.05, g.forceSeamlessSoftness, true, 1)}
                    <div class="property-group">
                        <label class="property-label">Крива згладжування шва</label>
                        <div class="gen-grid" style="grid-template-columns:repeat(2,1fr);">
                            <button onclick="setBlendCurve('smooth')" class="gen-btn ${g.blendCurve!=='linear'?'active':''}">Плавна (spline)</button>
                            <button onclick="setBlendCurve('linear')" class="gen-btn ${g.blendCurve==='linear'?'active':''}">Лінійна</button>
                        </div>
                    </div>
                ` : ''}
                <hr>
                <div class="section-title">Корекція</div>
                ${createSlider("Контраст", "contrast", 0.5, 2, 0.05, g.contrast, true, 1)}
                ${createSlider("Гамма", "gamma", 0.2, 3, 0.05, g.gamma, true, 1)}
                ${createSlider("Віньєтка", "vignette", 0, 1, 0.05, g.vignette, true, 0)}
                ${createSlider("Глобальне розмиття", "blur", 0, 20, 1, g.blur||0, true, 0)}
                ${createSlider("Зерно", "grain", 0, 50, 1, g.grain, true, 10)}
            `;
        }

        function setTileMode(mode) {
            state.global.tileMode = mode;
            if (mode === 'off') {
                state.global.forceSeamless = false;
            }
            invalidateCaches();
            renderGlobal();
            requestRender();
        }

        function setBlendCurve(curve) {
            state.global.blendCurve = curve;
            invalidateCaches();
            renderGlobal();
            requestRender();
        }

        // --- Історія (Undo/Redo) ---
        let history = []; // Array of { snap: string, paintData: { [layerId]: ImageData } }
        let historyIndex = -1;
        let historyTimer = null;
        let historyReady = false;
        let isRestoringHistory = false;
        const MAX_HISTORY = 60;
        const HISTORY_DEBOUNCE_MS = 450;

        function capturePaintCanvasesForHistory() {
            let data = {};
            if (state && state.layers) {
                state.layers.forEach(lay => {
                    if (lay.generatorType === 'paint') {
                        ensureLayerPaintCanvas(lay);
                        if (lay.paintCanvas) {
                            let pCtx = lay.paintCanvas.getContext('2d');
                            data[lay.id] = pCtx.getImageData(0, 0, 1024, 1024);
                            if (lay.params) {
                                lay.params.paintDataUrl = lay.paintCanvas.toDataURL();
                            }
                        }
                    }
                });
            }
            return data;
        }

        function restorePaintCanvasesFromHistory(entry) {
            if (!state || !state.layers || !entry) return;
            state.layers.forEach(lay => {
                if (lay.generatorType === 'paint') {
                    ensureLayerPaintCanvas(lay);
                    let pCtx = lay.paintCanvas.getContext('2d');
                    if (entry.paintData && entry.paintData[lay.id]) {
                        pCtx.putImageData(entry.paintData[lay.id], 0, 0);
                        updatePaintBuffer(lay);
                        lay.isDirty = true;
                    } else if (lay.params && lay.params.paintDataUrl) {
                        let img = new Image();
                        img.onload = () => {
                            pCtx.clearRect(0, 0, 1024, 1024);
                            pCtx.drawImage(img, 0, 0);
                            updatePaintBuffer(lay);
                            lay.isDirty = true;
                            invalidateCaches();
                            requestRender();
                        };
                        img.src = lay.params.paintDataUrl;
                    } else {
                        pCtx.clearRect(0, 0, 1024, 1024);
                        updatePaintBuffer(lay);
                        lay.isDirty = true;
                    }
                }
            });
        }

        function initHistory() {
            let snap = serializeState(state);
            let paintData = capturePaintCanvasesForHistory();
            history = [{ snap, paintData }];
            historyIndex = 0;
            historyReady = true;
            updateHistoryButtons();
        }

        function scheduleHistorySnapshot() {
            if (!historyReady || isPainting || strokeBackupActive || isRestoringHistory) return;
            clearTimeout(historyTimer);
            historyTimer = setTimeout(() => {
                if (!isPainting && !strokeBackupActive && !isRestoringHistory) {
                    commitHistorySnapshot();
                }
            }, HISTORY_DEBOUNCE_MS);
        }

        function commitHistorySnapshot() {
            if (!historyReady || isPainting || strokeBackupActive || isRestoringHistory) return;
            clearTimeout(historyTimer);
            let snap = serializeState(state);
            if (history[historyIndex] && history[historyIndex].snap === snap) return;

            history = history.slice(0, historyIndex + 1);

            let paintData = capturePaintCanvasesForHistory();
            history.push({ snap, paintData });
            if (history.length > MAX_HISTORY) { history.shift(); }
            historyIndex = history.length - 1;
            updateHistoryButtons();
        }

        function undo() {
            if (!historyReady) return;
            clearTimeout(historyTimer);
            if (isPainting || strokeBackupActive) {
                cancelPainting();
            }
            if (historyIndex <= 0) { updateHistoryButtons(); return; }

            isRestoringHistory = true;
            historyIndex--;
            let entry = history[historyIndex];
            setState(JSON.parse(entry.snap));
            restorePaintCanvasesFromHistory(entry);
            afterHistoryRestore();
            isRestoringHistory = false;
        }

        function redo() {
            if (!historyReady) return;
            clearTimeout(historyTimer);
            if (isPainting || strokeBackupActive) {
                cancelPainting();
            }
            if (historyIndex >= history.length - 1) { updateHistoryButtons(); return; }

            isRestoringHistory = true;
            historyIndex++;
            let entry = history[historyIndex];
            setState(JSON.parse(entry.snap));
            restorePaintCanvasesFromHistory(entry);
            afterHistoryRestore();
            isRestoringHistory = false;
        }

        function afterHistoryRestore() {
            if (!state.layers.find(l => l.id === state.selectedLayerId)) {
                state.selectedLayerId = state.layers.length ? state.layers[0].id : null;
            }
            if (state.layers) {
                state.layers.forEach(l => {
                    l.isDirty = true;
                    if (!l.params) l.params = freshLayerParams();
                    if (!l.params.warps) l.params.warps = [];
                });
            }
            invalidateCaches();
            renderLayers();
            if (currentTab === 'global') renderGlobal(); else renderProps();
            requestRender();
            updateHistoryButtons();
        }

        function updateHistoryButtons() {
            if ($('btnUndo')) $('btnUndo').disabled = (historyIndex <= 0);
            if ($('btnRedo')) $('btnRedo').disabled = (historyIndex >= history.length - 1 || historyIndex < 0);
        }

        document.addEventListener('keydown', e => {
            const mod = e.ctrlKey || e.metaKey;
            if (!mod) return;
            if (e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
            else if ((e.key.toLowerCase() === 'z' && e.shiftKey) || e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
        });

        let renderRequested = false;
        let isInteracting = false;
        let interactionTimer = null;

        function invalidateCaches() {
            for (let i = 0; i < state.layers.length; i++) {
                state.layers[i].isDirty = true;
            }
        }

        function requestRender() {
            if (renderRequested) return;
            renderRequested = true;
            requestAnimationFrame(() => {
                renderRequested = false;
                if (!suppressRender) {
                    if (isInteracting && lowResOnEdit) {
                        if (canvas.width !== 256) {
                            canvas.width = 256;
                            canvas.height = 256;
                        }
                    } else {
                        if (canvas.width !== canvasResolution) {
                            canvas.width = canvasResolution;
                            canvas.height = canvasResolution;
                        }
                    }
                }
                renderProject();
            });
        }

        function triggerInteraction() {
            isInteracting = true;
            clearTimeout(interactionTimer);
            interactionTimer = setTimeout(() => {
                isInteracting = false;
                requestRender();
            }, 250);
        }

        function upd(k,v,isLay=false){
            let lay=state.layers.find(l=>l.id===state.selectedLayerId);
            triggerInteraction();
            if(isLay && k in state.global) { 
                state.global[k] = parseFloat(v);
                const COORD_PARAMS = ['globalZoom', 'globalRotation', 'globalOffsetX', 'globalOffsetY', 'tileRepeatX', 'tileRepeatY', 'tileSeamOffsetX', 'tileSeamOffsetY', 'forceSeamlessSoftness'];
                if (COORD_PARAMS.includes(k)) {
                    invalidateCaches();
                }
                if(!suppressRender) requestRender();
                scheduleHistorySnapshot();
                return;
            }
            if(lay){
                let val = v;
                if (v === 'true' || v === true) val = true;
                else if (v === 'false' || v === false) val = false;
                else if (!isNaN(v)) val = parseFloat(v);

                lay.isDirty = true;

                if(isLay) {
                    lay[k]=val;
                    if(k==='visible'||k==='generatorType') { renderProps(); renderLayers(); }
                } else {
                    lay.params[k]=val;
                    if(k==='seamless'||k==='useThreshold'||k==='useLevels'||k==='useFindEdges'||k==='usePosterize'||k==='brushTool') renderProps();
                    if(String(k).startsWith('brush')) updateBrushPreview();
                }
                if(!suppressRender) requestRender();
                scheduleHistorySnapshot();
            }
        }

        function showModal(id){ $(id).style.display='flex'; }
        let currentExportRes = 1024;
        function openPNGExportModal(){ showModal('pngModal'); renderExportPreview(currentExportRes); }
        function renderExportPreview(res) {
            currentExportRes = res;
            ['1024','2048','4096','8192'].forEach(r => { let b = $('exportRes'+r); if (b) b.classList.toggle('active', +r === res); });
            // Невеликий timeout, щоб браузер встиг перемалювати підсвітку кнопки й
            // індикатор "Рендеринг..." ДО важкого синхронного рендеру великих розмірів.
            $('exportRenderingIndicator').style.display = 'block';
            $('modalPngPreview').style.opacity = '0.3';
            setTimeout(() => {
                let tc = document.createElement('canvas'); tc.width = res; tc.height = res;
                renderProject(tc);
                $('modalPngPreview').src = tc.toDataURL('image/png');
                $('modalPngPreview').style.opacity = '1';
                $('exportRenderingIndicator').style.display = 'none';
            }, 30);
        }
        // --- .veil File Export & Import ---
        async function exportVeilFile() {
            showProgressLoader("Генерація файлу проєкту...", "Стиснення шарів...");
            await new Promise(res => setTimeout(res, 20));
            try {
                let serialized = serializeState(state);
                let blob = new Blob([serialized], { type: 'application/json' });
                let url = URL.createObjectURL(blob);

                let d = new Date();
                let dateStr = d.getFullYear() +
                    String(d.getMonth() + 1).padStart(2, '0') +
                    String(d.getDate()).padStart(2, '0') + '_' +
                    String(d.getHours()).padStart(2, '0') +
                    String(d.getMinutes()).padStart(2, '0');
                let fileName = `veil_project_${dateStr}.veil`;

                let a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 1000);

                hideProgressLoader();
            } catch (e) {
                hideProgressLoader();
                alert("Помилка при експорті файлу .veil: " + e.message);
            }
        }

        function triggerVeilImport() {
            let fileInput = $('importVeilFile');
            if (fileInput) {
                fileInput.click();
            }
        }

        function importProjectFile(e) {
            let file = e.target.files && e.target.files[0];
            if (!file) return;

            showProgressLoader("Читання файлу...", file.name);

            if (typeof file.text === 'function') {
                file.text().then(async text => {
                    try {
                        updateProgressLoaderSubtext("Парсинг тексту проєкту...");
                        await new Promise(res => setTimeout(res, 20));
                        let p = JSON.parse(text);
                        closeModal('projectManagerModal');
                        await loadProjectObjectAsync(p);
                    } catch (er) {
                        hideProgressLoader();
                        alert("Помилка зчитування файлу .veil / .json: " + er.message);
                    }
                    e.target.value = '';
                }).catch(err => {
                    hideProgressLoader();
                    alert("Помилка роботи з файлом: " + err.message);
                    e.target.value = '';
                });
            } else {
                let r = new FileReader();
                r.onload = async ev => {
                    try {
                        updateProgressLoaderSubtext("Парсинг тексту проєкту...");
                        await new Promise(res => setTimeout(res, 20));
                        let p = JSON.parse(ev.target.result);
                        closeModal('projectManagerModal');
                        await loadProjectObjectAsync(p);
                    } catch (er) {
                        hideProgressLoader();
                        alert("Помилка зчитування файлу .veil / .json: " + er.message);
                    }
                    e.target.value = '';
                };
                r.readAsText(file);
            }
        }

        // --- IndexedDB Local Fast Storage Service (VeilIDB) ---
        const IDB_NAME = 'VeilStudioDB';
        const IDB_VERSION = 1;
        const IDB_STORE = 'projects';

        function openVeilIDB() {
            return new Promise((resolve, reject) => {
                const req = indexedDB.open(IDB_NAME, IDB_VERSION);
                req.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(IDB_STORE)) {
                        db.createObjectStore(IDB_STORE, { keyPath: 'id' });
                    }
                };
                req.onsuccess = (e) => resolve(e.target.result);
                req.onerror = (e) => reject(e.target.error);
            });
        }

        function canvasToBlobAsync(canvas) {
            return new Promise((resolve) => {
                if (!canvas) { resolve(null); return; }
                canvas.toBlob((blob) => resolve(blob), 'image/png');
            });
        }

        async function saveCurrentProjectToIDB() {
            let input = $('idbSlotNameInput');
            let customName = input ? input.value.trim() : '';

            showProgressLoader("Збереження у браузері...", "Обробка растрових даних...");
            await new Promise(res => setTimeout(res, 20));

            try {
                const db = await openVeilIDB();
                const paintBlobs = {};
                const paintCrops = {};

                if (state && state.layers) {
                    for (const lay of state.layers) {
                        if (lay.generatorType === 'paint') {
                            ensureLayerPaintCanvas(lay);
                            if (lay.paintCanvas) {
                                const comp = compressPaintCanvas(lay.paintCanvas);
                                if (comp.dataUrl) {
                                    const blob = await canvasToBlobAsync(lay.paintCanvas);
                                    if (blob) {
                                        paintBlobs[lay.id] = blob;
                                        paintCrops[lay.id] = comp.crop;
                                    }
                                }
                            }
                        }
                    }
                }

                const stateClean = JSON.parse(JSON.stringify(state, (key, value) => {
                    if (key === 'paintCanvas' || key === 'paintBuffer' || key === 'paintDataUrl') {
                        return undefined;
                    }
                    return value;
                }));

                const now = new Date();
                const defaultName = `Проєкт ${now.toLocaleDateString('uk-UA')} ${now.toLocaleTimeString('uk-UA', {hour:'2-digit', minute:'2-digit'})}`;
                const name = customName || defaultName;
                const id = 'slot_' + Date.now();

                const record = {
                    id,
                    name,
                    updatedAt: Date.now(),
                    dateStr: `${now.toLocaleDateString('uk-UA')} ${now.toLocaleTimeString('uk-UA', {hour:'2-digit', minute:'2-digit'})}`,
                    layerCount: state.layers ? state.layers.length : 0,
                    state: stateClean,
                    paintBlobs,
                    paintCrops
                };

                const tx = db.transaction(IDB_STORE, 'readwrite');
                const store = tx.objectStore(IDB_STORE);
                await new Promise((resolve, reject) => {
                    const req = store.put(record);
                    req.onsuccess = resolve;
                    req.onerror = reject;
                });

                if (input) input.value = '';
                hideProgressLoader();
                await renderIDBSlotsList();
            } catch (e) {
                hideProgressLoader();
                alert("Помилка збереження в IndexedDB: " + e.message);
            }
        }

        async function getIDBSlotsList() {
            try {
                const db = await openVeilIDB();
                const tx = db.transaction(IDB_STORE, 'readonly');
                const store = tx.objectStore(IDB_STORE);
                return new Promise((resolve, reject) => {
                    const req = store.getAll();
                    req.onsuccess = () => {
                        const list = req.result || [];
                        list.sort((a, b) => b.updatedAt - a.updatedAt);
                        resolve(list);
                    };
                    req.onerror = reject;
                });
            } catch (e) {
                return [];
            }
        }

        async function renderIDBSlotsList() {
            let container = $('idbSlotsContainer');
            let badge = $('idbSlotCountBadge');
            if (!container) return;

            let slots = await getIDBSlotsList();
            if (badge) badge.textContent = slots.length ? `(всього: ${slots.length})` : '';

            if (slots.length === 0) {
                container.innerHTML = `<div style="text-align:center; padding:16px; color:var(--text-muted); font-size:12px;">Немає збережених слотів у цьому браузері.</div>`;
                return;
            }

            container.innerHTML = slots.map(slot => {
                let layersText = `${slot.layerCount || 0} ${slot.layerCount === 1 ? 'шар' : (slot.layerCount >= 2 && slot.layerCount <= 4) ? 'шари' : 'шарів'}`;
                return `
                <div class="idb-slot-card">
                    <div class="idb-slot-info">
                        <div class="idb-slot-title">${slot.name}</div>
                        <div class="idb-slot-meta">${slot.dateStr} | ${layersText}</div>
                    </div>
                    <div style="display:flex; gap:4px; flex-shrink:0;">
                        <button class="btn btn-primary" style="padding:4px 8px; font-size:11px;" onclick="loadProjectFromIDB('${slot.id}')">Завантажити</button>
                        <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; color:#ef4444;" onclick="deleteIDBSlot('${slot.id}')">🗑️</button>
                    </div>
                </div>`;
            }).join('');
        }

        async function loadProjectFromIDB(id) {
            showProgressLoader("Завантаження з IDB...", "Читання слоту...");
            await new Promise(res => setTimeout(res, 20));

            try {
                const db = await openVeilIDB();
                const tx = db.transaction(IDB_STORE, 'readonly');
                const store = tx.objectStore(IDB_STORE);
                const record = await new Promise((resolve, reject) => {
                    const req = store.get(id);
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = reject;
                });

                if (!record) throw new Error("Слот не знайдено");

                setState(record.state);
                if (!state.global) state.global = freshGlobalSettings();

                state.layers.forEach(l => {
                    l.isDirty = true;
                    if (!l.params) l.params = freshLayerParams();
                    if (!l.params.warps) l.params.warps = [];
                });

                if (!state.layers.find(l => l.id === state.selectedLayerId)) {
                    state.selectedLayerId = state.layers.length ? state.layers[0].id : null;
                }

                if (record.paintBlobs) {
                    updateProgressLoaderSubtext("Декодування растрових шарів...");
                    const paintPromises = state.layers.filter(l => l.generatorType === 'paint').map(async (lay) => {
                        ensureLayerPaintCanvas(lay, false);
                        const pCtx = lay.paintCanvas.getContext('2d');
                        pCtx.fillStyle = '#000000';
                        pCtx.fillRect(0, 0, 1024, 1024);

                        const blob = record.paintBlobs[lay.id];
                        if (blob) {
                            let bitmap = null;
                            if (typeof createImageBitmap === 'function') {
                                try { bitmap = await createImageBitmap(blob); } catch(e){}
                            }
                            if (bitmap) {
                                const crop = record.paintCrops ? record.paintCrops[lay.id] : null;
                                if (crop && typeof crop.x === 'number') {
                                    pCtx.drawImage(bitmap, crop.x, crop.y, crop.w, crop.h);
                                } else {
                                    pCtx.drawImage(bitmap, 0, 0, 1024, 1024);
                                }
                                if (typeof bitmap.close === 'function') bitmap.close();
                            } else {
                                const url = URL.createObjectURL(blob);
                                await new Promise((res) => {
                                    const img = new Image();
                                    img.onload = () => {
                                        pCtx.drawImage(img, 0, 0, 1024, 1024);
                                        URL.revokeObjectURL(url);
                                        res();
                                    };
                                    img.onerror = () => { URL.revokeObjectURL(url); res(); };
                                    img.src = url;
                                });
                            }
                        }
                        updatePaintBuffer(lay);
                        lay.isDirty = true;
                    });

                    await Promise.all(paintPromises);
                }

                invalidateCaches();
                renderLayers();
                if (typeof currentTab !== 'undefined' && currentTab === 'global') renderGlobal(); else renderProps();
                requestRender();
                initHistory();

                hideProgressLoader();
                closeModal('projectManagerModal');
            } catch (e) {
                hideProgressLoader();
                alert("Помилка завантаження слоту IDB: " + e.message);
            }
        }

        async function deleteIDBSlot(id) {
            if (!confirm("Видалити цей слот з локального сховища браузера?")) return;
            try {
                const db = await openVeilIDB();
                const tx = db.transaction(IDB_STORE, 'readwrite');
                const store = tx.objectStore(IDB_STORE);
                await new Promise((resolve, reject) => {
                    const req = store.delete(id);
                    req.onsuccess = resolve;
                    req.onerror = reject;
                });
                await renderIDBSlotsList();
            } catch (e) {
                alert("Помилка видалення: " + e.message);
            }
        }

        // --- Modal & Navigation Helpers ---
        function closeModal(id) {
            let el = $(id);
            if (el) el.style.display = 'none';
        }

        function openProjectManagerModal(tab = 'file') {
            switchProjectTab(tab);
            showModal('projectManagerModal');
        }

        function switchProjectTab(tab) {
            ['file', 'idb', 'text'].forEach(t => {
                let btn = $('tabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
                let content = $('projectTab' + t.charAt(0).toUpperCase() + t.slice(1));
                if (btn) btn.classList.toggle('active', t === tab);
                if (content) content.style.display = (t === tab) ? 'block' : 'none';
            });
            if (tab === 'idb') {
                renderIDBSlotsList();
            } else if (tab === 'text') {
                try {
                    let txtEl = $('projectJsonText');
                    if (txtEl) txtEl.value = serializeState(state);
                } catch(e){}
            }
        }

        async function openSaveModal() {
            openProjectManagerModal('file');
        }

        function copyProjectCode() {
            let t = $('projectJsonText');
            if (!t) return;
            t.select();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(t.value).then(() => {
                    let b = $('copyJsonBtn');
                    if (b) {
                        b.innerText = "Скопійовано у буфер!";
                        setTimeout(() => { if ($('copyJsonBtn')) $('copyJsonBtn').innerText = "Скопіювати у буфер"; }, 2000);
                    }
                }).catch(() => {
                    document.execCommand('copy');
                    let b = $('copyJsonBtn');
                    if (b) b.innerText = "Скопійовано!";
                });
            } else {
                document.execCommand('copy');
                let b = $('copyJsonBtn');
                if (b) b.innerText = "Скопійовано!";
            }
        }

        async function loadProjectFromText() {
            let textarea = $('importJsonText');
            let text = textarea ? textarea.value.trim() : '';
            if (!text) {
                alert("Будь ласка, вставте JSON код проєкту в текстове поле");
                return;
            }

            showProgressLoader("Імпорт проєкту...", "Парсинг JSON даних...");
            await new Promise(res => setTimeout(res, 30));

            try {
                let p = JSON.parse(text);
                closeModal('projectManagerModal');
                if (textarea) textarea.value = '';
                await loadProjectObjectAsync(p);
            } catch (e) {
                hideProgressLoader();
                alert("Помилка JSON проєкту: " + e.message);
            }
        }

        async function pasteFromClipboardAndLoad() {
            try {
                if (!navigator.clipboard || !navigator.clipboard.readText) {
                    alert("Ваш браузер не підтримує читання з буфера обміну. Будь ласка, вставте код в текстове поле вручну.");
                    return;
                }

                showProgressLoader("Зчитування з буфера...", "Отримання коду...");
                let text = await navigator.clipboard.readText();
                text = text ? text.trim() : '';
                if (!text) {
                    hideProgressLoader();
                    alert("Буфер обміну порожній!");
                    return;
                }

                updateProgressLoaderSubtext("Парсинг JSON даних...");
                await new Promise(res => setTimeout(res, 20));

                let p = JSON.parse(text);
                closeModal('projectManagerModal');
                await loadProjectObjectAsync(p);
            } catch (e) {
                hideProgressLoader();
                alert("Не вдалося прочитати з буфера обміну або помилка JSON: " + e.message);
            }
        }

        function importProject(e) {
            importProjectFile(e);
        }

        // --- Розтяжні панелі (Шари / Властивості) ---
        // Тягнути за смужку між панеллю та канвасом — ширина зберігається між
        // сесіями (localStorage), окремо від самого проєкту (це UI-налаштування,
        // не частина .json проєкту).
        function setupResizeHandle(handleId, panel, side) {
            const handle = $(handleId);
            if (!handle || !panel) return;
            const MIN_W = 220, MAX_W = 560;
            let dragging = false, startX = 0, startWidth = 0;

            function begin(clientX) {
                dragging = true; startX = clientX; startWidth = panel.getBoundingClientRect().width;
                handle.classList.add('dragging');
                document.body.style.userSelect = 'none';
            }
            function move(clientX) {
                if (!dragging) return;
                let delta = clientX - startX;
                if (side === 'right') delta = -delta;
                let newWidth = Math.max(MIN_W, Math.min(MAX_W, startWidth + delta));
                panel.style.width = newWidth + 'px';
            }
            function end() {
                if (!dragging) return;
                dragging = false;
                handle.classList.remove('dragging');
                document.body.style.userSelect = '';
                try { localStorage.setItem('veil_panel_' + handleId, panel.style.width); } catch(e) {}
            }

            handle.addEventListener('mousedown', e => { e.preventDefault(); begin(e.clientX); });
            window.addEventListener('mousemove', e => move(e.clientX));
            window.addEventListener('mouseup', end);
            handle.addEventListener('touchstart', e => { begin(e.touches[0].clientX); }, {passive:true});
            handle.addEventListener('touchmove', e => { move(e.touches[0].clientX); e.preventDefault(); }, {passive:false});
            handle.addEventListener('touchend', end);
            handle.addEventListener('dblclick', () => {
                panel.style.width = '';
                try { localStorage.removeItem('veil_panel_' + handleId); } catch(e) {}
            });

            try {
                let saved = localStorage.getItem('veil_panel_' + handleId);
                if (saved) panel.style.width = saved;
            } catch(e) {}
        }

        window.setCanvasResolution = function(res) {
            canvasResolution = res;
            try { localStorage.setItem('veil_canvas_resolution', res); } catch(e) {}
            ['512', '1024'].forEach(r => {
                let btn = $('resBtn' + r);
                if (btn) btn.classList.toggle('active', parseInt(r) === res);
            });
            requestRender();
        };

        window.setLowResOnEdit = function(val) {
            lowResOnEdit = val;
            try { localStorage.setItem('veil_low_res_on_edit', val); } catch(e) {}
            if ($('chkLowRes')) $('chkLowRes').checked = val;
            requestRender();
        };

        // Expose all state and action handlers to window globally
        window.exportVeilFile = exportVeilFile;
        window.triggerVeilImport = triggerVeilImport;
        window.importProjectFile = importProjectFile;
        window.saveCurrentProjectToIDB = saveCurrentProjectToIDB;
        window.loadProjectFromIDB = loadProjectFromIDB;
        window.deleteIDBSlot = deleteIDBSlot;
        window.openProjectManagerModal = openProjectManagerModal;
        window.switchProjectTab = switchProjectTab;
        window.closeModal = closeModal;
        window.commitHistorySnapshot = commitHistorySnapshot;
        window.scheduleHistorySnapshot = scheduleHistorySnapshot;
        window.state = state;
        window.viewport = viewport;
        window.undo = undo;
        window.redo = redo;
        window.randomizeAllLayers = randomizeAllLayers;
        window.resetProject = resetProject;
        window.resetGlobalSettings = resetGlobalSettings;
        window.addLayer = addLayer;
        window.switchRightTab = switchRightTab;
        window.openSaveModal = openSaveModal;
        window.openPNGExportModal = openPNGExportModal;
        window.renderExportPreview = renderExportPreview;
        window.loadProjectFromText = loadProjectFromText;
        window.pasteFromClipboardAndLoad = pasteFromClipboardAndLoad;
        window.showProgressLoader = showProgressLoader;
        window.hideProgressLoader = hideProgressLoader;
        window.copyProjectCode = copyProjectCode;
        window.importProject = importProject;
        window.toggleLayerVisibility = toggleLayerVisibility;
        window.toggleMask = toggleMask;
        window.duplicateLayer = duplicateLayer;
        window.deleteLayer = deleteLayer;
        window.moveLayer = moveLayer;
        window.randomizeLayer = randomizeLayer;
        window.resetLayer = resetLayer;
        window.upd = upd;
        window.showModal = showModal;
        window.renderLayers = renderLayers;
        window.renderProps = renderProps;
        window.requestRender = requestRender;

        function initCanvasControlsUI() {
            if ($('chkLowRes')) $('chkLowRes').checked = lowResOnEdit;
            ['512', '1024'].forEach(r => {
                let btn = $('resBtn' + r);
                if (btn) btn.classList.toggle('active', parseInt(r) === canvasResolution);
            });
        }

        document.addEventListener('DOMContentLoaded', () => { 
            canvas=$('canvas'); 
            ctx=canvas.getContext('2d'); 
            initCanvasControlsUI();

            // Register pointer events for painting
            let wrapper = $('canvasWrapper');
            if (wrapper) {
                paintModule.init(wrapper, canvas);
                wrapper.addEventListener('pointerdown', handleCanvasPointerDown);
                wrapper.addEventListener('pointermove', handleCanvasPointerMove);
                window.addEventListener('pointerup', handleCanvasPointerUp);
                window.addEventListener('pointercancel', handleCanvasPointerUp);

                // Prevent text selection and drag highlights when painting with mouse
                wrapper.addEventListener('mousedown', e => {
                    let lay = state.layers.find(l => l.id === state.selectedLayerId);
                    if (lay && lay.generatorType === 'paint' && lay.visible && e.button === 0) {
                        e.preventDefault();
                    }
                });
                wrapper.addEventListener('mousemove', e => {
                    if (isPainting) e.preventDefault();
                });
                wrapper.addEventListener('selectstart', e => e.preventDefault());
                wrapper.addEventListener('dragstart', e => e.preventDefault());
            }

            if (canvas) {
                canvas.addEventListener('selectstart', e => e.preventDefault());
                canvas.addEventListener('dragstart', e => e.preventDefault());
            }

            renderLayers(); 
            switchRightTab('layer'); 
            requestRender(); 
            initHistory(); 
            setupResizeHandle('resizeLeft', document.querySelector('aside:not(.right-panel)'), 'left'); 
            setupResizeHandle('resizeRight', document.querySelector('.right-panel'), 'right'); 
        });
