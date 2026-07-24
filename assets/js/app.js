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
            if (activeTouchCount > 1) { cancelPainting(); cancelStamping(); cancelMaskBrushing(); }
        }, {passive: true, capture: true});

        window.addEventListener('touchmove', e => {
            activeTouchCount = e.touches ? e.touches.length : 0;
            if (activeTouchCount > 1) { cancelPainting(); cancelStamping(); cancelMaskBrushing(); }
        }, {passive: true, capture: true});

        canvasWrapperEl.addEventListener('touchstart', e => {
            activeTouchCount = e.touches ? e.touches.length : 0;
            if (activeTouchCount >= 2) e.preventDefault(); // не дати сторінці зробити свій pinch-zoom/scroll
            if (activeTouchCount > 1) { cancelPainting(); cancelStamping(); cancelMaskBrushing(); }

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
                cancelPainting(); cancelStamping(); cancelMaskBrushing();
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
                if (activeTouchCount > 1) { cancelPainting(); cancelStamping(); cancelMaskBrushing(); }
                return;
            }

            if (touchGesture.active) {
                cancelPainting(); cancelStamping(); cancelMaskBrushing();
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
            noise(x, y, p, precalculatedSources = null, scaleX = 10, scaleY = 10) {
                let scaleFactorX = (scaleX !== undefined ? scaleX : (p && p.scaleX !== undefined ? p.scaleX : 10)) / 10;
                let scaleFactorY = (scaleY !== undefined ? scaleY : (p && p.scaleY !== undefined ? p.scaleY : 10)) / 10;
                let sx = (x - 0.5) * 2 * scaleFactorX;
                let sy = (y - 0.5) * 2 * scaleFactorY;
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

        const ProceduralGradient = {
            eval(tx, ty, p, sx, sy) {
                let gradType = p.gradType || 'linear';
                let spreadMethod = p.spreadMethod || 'clamp';
                let cx = p.centerX !== undefined ? p.centerX : 0.5;
                let cy = p.centerY !== undefined ? p.centerY : 0.5;
                let angleRad = ((p.angle || 0) * Math.PI) / 180;
                let aspect = Math.max(0.01, p.aspectRatio || 1.0);
                let scaleX = (sx || 10) / 10;
                let scaleY = (sy || 10) / 10;

                // Relative position centered at (cx, cy)
                let dx = (tx - cx) * scaleX;
                let dy = (ty - cy) * scaleY;

                // Rotated coordinates
                let cosA = Math.cos(-angleRad);
                let sinA = Math.sin(-angleRad);
                let rx = dx * cosA - dy * sinA;
                let ry = dx * sinA + dy * cosA;

                let u = 0;
                switch (gradType) {
                    case 'linear':
                        u = rx + 0.5;
                        break;
                    case 'radial':
                        u = Math.sqrt(rx * rx + ry * ry) * 2;
                        break;
                    case 'elliptical':
                        u = Math.sqrt(rx * rx + (ry / aspect) * (ry / aspect)) * 2;
                        break;
                    case 'conical': {
                        let ang = Math.atan2(ry, rx);
                        u = (ang + Math.PI) / (2 * Math.PI);
                        break;
                    }
                    case 'reflected':
                        u = Math.abs(rx) * 2;
                        break;
                    case 'diamond':
                        u = (Math.abs(rx) + Math.abs(ry) / aspect) * 2;
                        break;
                    default:
                        u = rx + 0.5;
                }

                // Spread methods
                let t = 0;
                if (spreadMethod === 'clamp') {
                    t = Math.max(0, Math.min(1, u));
                } else if (spreadMethod === 'repeat') {
                    t = u - Math.floor(u);
                    if (t < 0) t += 1;
                } else if (spreadMethod === 'reflect') {
                    let fu = Math.abs(u);
                    let m = Math.floor(fu);
                    let rem = fu - m;
                    t = (m % 2 === 0) ? rem : (1 - rem);
                }

                // Midpoint shift curve
                let mid = p.midpoint !== undefined ? p.midpoint : 0.5;
                if (mid !== 0.5 && mid > 0 && mid < 1) {
                    let exp = Math.log(0.5) / Math.log(mid);
                    t = Math.pow(Math.max(0, Math.min(1, t)), exp);
                }

                // Evaluate color stops or return t
                if (p.stops && Array.isArray(p.stops) && p.stops.length > 0) {
                    if (!p._sortedStops || p._stopsDirty) {
                        p._sortedStops = p.stops.slice().sort((a, b) => a.pos - b.pos);
                        p._stopsDirty = false;
                    }
                    return this.evalStopsVal(t, p._sortedStops);
                }
                return Math.max(0, Math.min(1, t));
            },

            evalStopsVal(t, sortedStops) {
                if (!sortedStops || sortedStops.length === 0) return t;
                if (sortedStops.length === 1) return sortedStops[0].val !== undefined ? sortedStops[0].val : 1;

                if (t <= sortedStops[0].pos) return sortedStops[0].val !== undefined ? sortedStops[0].val : 0;
                if (t >= sortedStops[sortedStops.length - 1].pos) return sortedStops[sortedStops.length - 1].val !== undefined ? sortedStops[sortedStops.length - 1].val : 1;

                for (let i = 0; i < sortedStops.length - 1; i++) {
                    let s1 = sortedStops[i];
                    let s2 = sortedStops[i + 1];
                    if (t >= s1.pos && t <= s2.pos) {
                        let range = s2.pos - s1.pos;
                        let factor = range > 0 ? (t - s1.pos) / range : 0;
                        let v1 = s1.val !== undefined ? s1.val : s1.pos;
                        let v2 = s2.val !== undefined ? s2.val : s2.pos;
                        return v1 + (v2 - v1) * factor;
                    }
                }
                return t;
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
        let showCanvasBorder = localStorage.getItem('veil_show_canvas_border') !== 'false';
        let canvasBorderIntensity = parseFloat(localStorage.getItem('veil_canvas_border_intensity'));
        if (isNaN(canvasBorderIntensity)) canvasBorderIntensity = 1.0;
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

        function applyBoxBlur(buf, tmp, w, h, rad, mode = 'wrap') {
            let scaledRad = Math.max(0, Math.round(rad * (w / 512)));
            if (scaledRad<=0) return;
            
            let effectiveMode = mode;
            if (typeof mode === 'boolean') {
                effectiveMode = mode ? 'clamp' : 'wrap';
            }

            for(let y=0;y<h;y++) {
                let rowOffset = y*w;
                for(let x=0;x<w;x++){
                    let sum=0, c=0;
                    for(let dx=-scaledRad;dx<=scaledRad;dx++){
                        let nx=x+dx;
                        if (effectiveMode === 'clamp') {
                            if (nx < 0) nx = 0;
                            else if (nx >= w) nx = w - 1;
                            sum += buf[rowOffset + nx];
                            c++;
                        } else if (effectiveMode === 'wrap') {
                            nx = (nx % w + w) % w;
                            sum += buf[rowOffset + nx];
                            c++;
                        } else {
                            if (nx >= 0 && nx < w) {
                                sum += buf[rowOffset + nx];
                                c++;
                            }
                        }
                    }
                    tmp[rowOffset + x] = sum/c;
                }
            }
            for(let x=0;x<w;x++) {
                for(let y=0;y<h;y++){
                    let sum=0, c=0;
                    for(let dy=-scaledRad;dy<=scaledRad;dy++){
                        let ny=y+dy;
                        if (effectiveMode === 'clamp') {
                            if (ny < 0) ny = 0;
                            else if (ny >= h) ny = h - 1;
                            sum += tmp[ny * w + x];
                            c++;
                        } else if (effectiveMode === 'wrap') {
                            ny = (ny % h + h) % h;
                            sum += tmp[ny * w + x];
                            c++;
                        } else {
                            if (ny >= 0 && ny < h) {
                                sum += tmp[ny * w + x];
                                c++;
                            }
                        }
                    }
                    buf[y*w+x] = sum/c;
                }
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
                if (key === 'paintCanvas' || key === 'paintBuffer' || key.startsWith('_')) {
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
            if (currentTab === 'tiling') {
                if (!paintModule.isValidPointer(e) || (e.touches && e.touches.length > 1) || (typeof activeTouchCount !== 'undefined' && activeTouchCount > 1) || (touchGesture && touchGesture.maxTouches > 1)) {
                    cancelStamping();
                    cancelMaskBrushing();
                    return;
                }
                if (selectingStampSource || e.shiftKey || e.altKey) {
                    let pos = getCanvasPos(e);
                    initialStampSource = { x: pos.x, y: pos.y };
                    stampSource = { x: pos.x, y: pos.y };
                    selectingStampSource = false;
                    renderTilingPanel();
                    renderTilingView();
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }

                if (tilingState.stamp_enable) {
                    if (!stampSource && tilingState.stamp_mode !== 'erase') {
                        alert('Спочатку оберіть джерело клонування! Натисніть кнопку "🎯 Обрати точку джерела" або затисніть SHIFT та торкніться полотна.');
                        return;
                    }
                    isStamping = true;
                    backupTilingStamp();
                    let pos = getCanvasPos(e);
                    lastDrawPos = { x: pos.x, y: pos.y };
                    stampCursorX = pos.x; stampCursorY = pos.y;
                    applyTilingStamp(pos.x, pos.y, stampSource ? stampSource.x : pos.x, stampSource ? stampSource.y : pos.y);
                    renderTilingView();
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }

                if (tilingState.mask_brush_enable) {
                    isMaskBrushing = true;
                    backupTilingMask();
                    let pos = getCanvasPos(e);
                    stampCursorX = pos.x; stampCursorY = pos.y;
                    applyTilingMaskBrush(pos.x, pos.y);
                    runTilingPipeline();
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }
            }

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
            if (currentTab === 'tiling') {
                if (!paintModule.isValidPointer(e) || (e.touches && e.touches.length > 1) || (typeof activeTouchCount !== 'undefined' && activeTouchCount > 1) || (touchGesture && touchGesture.maxTouches > 1)) {
                    cancelStamping();
                    cancelMaskBrushing();
                    renderTilingView();
                    return;
                }
                let pos = getCanvasPos(e);
                stampCursorX = pos.x; stampCursorY = pos.y;

                if (isStamping && tilingState.stamp_enable) {
                    if (tilingState.stamp_mode === 'erase') {
                        applyTilingStamp(pos.x, pos.y, pos.x, pos.y);
                    } else if (stampSource && lastDrawPos) {
                        let dx = pos.x - lastDrawPos.x;
                        let dy = pos.y - lastDrawPos.y;
                        if (tilingState.stamp_aligned) {
                            stampSource.x += dx;
                            stampSource.y += dy;
                        } else if (initialStampSource) {
                            stampSource = { x: initialStampSource.x, y: initialStampSource.y };
                        }
                        applyTilingStamp(pos.x, pos.y, stampSource.x, stampSource.y);
                    }
                    lastDrawPos = { x: pos.x, y: pos.y };
                    renderTilingView();
                } else if (isMaskBrushing && tilingState.mask_brush_enable) {
                    applyTilingMaskBrush(pos.x, pos.y);
                    runTilingPipeline();
                } else {
                    renderTilingView();
                }
                return;
            }

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
            if (currentTab === 'tiling') {
                if (isStamping) {
                    isStamping = false;
                    if (initialStampSource && stampSource) {
                        stampSource = { x: initialStampSource.x, y: initialStampSource.y };
                    }
                    commitHistorySnapshot();
                }
                if (isMaskBrushing) {
                    isMaskBrushing = false;
                    commitHistorySnapshot();
                }
                renderTilingView();
                return;
            }

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
                case 'gradient': v = ProceduralGradient.eval(tx, ty, p, sx, sy); break;
                case 'cymatics': v = Cymatics.noise(tx, ty, p, cymaticsSources, sx, sy); break;
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
                    if(p.blur>0) {
                        let isTiled = (state.global.tileMode && state.global.tileMode !== 'off') || !!p.seamless;
                        let blurMode = isTiled ? 'wrap' : (p.blurClampEdge ? 'clamp' : 'wrap');
                        applyBoxBlur(lay.cachedBuffer, blurTemp, w, h, parseInt(p.blur), blurMode);
                    }
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

            if(state.global.blur>0) {
                let isGlobalTiled = (state.global.tileMode && state.global.tileMode !== 'off');
                let globalBlurMode = isGlobalTiled ? 'wrap' : (state.global.blurClampEdge ? 'clamp' : 'wrap');
                applyBoxBlur(blendBuffer, blurTemp, w, h, parseInt(state.global.blur), globalBlurMode);
            }

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
            if ($('btnTabLayer')) $('btnTabLayer').className = tab==='layer'?'btn btn-primary':'btn btn-secondary';
            if ($('btnTabGlobal')) $('btnTabGlobal').className = tab==='global'?'btn btn-primary':'btn btn-secondary';
            if ($('btnTabTiling')) $('btnTabTiling').className = tab==='tiling'?'btn btn-primary':'btn btn-secondary';

            if (tab === 'tiling') {
                $('rightPanelTitle').innerText = "Безшовний Тайлінг PRO";
                if (!tilingState.hasImage) {
                    captureProjectToTiling();
                } else {
                    renderTilingPanel();
                    requestRender();
                }
            } else {
                $('rightPanelTitle').innerText = tab==='layer'?"Властивості шару":"Глобальні ефекти";
                if (tilingState.stamp_enable) {
                    toggleTilingStamp(false);
                }
                tab==='layer'?renderProps():renderGlobal();
                requestRender();
            }
        }

        let pointerLayerDragState = null;

        window.handleLayerPointerDown = function(e, idx) {
            if (e.button !== undefined && e.button !== 0) return;
            e.stopPropagation();
            let handle = e.currentTarget;
            let card = handle.closest('.layer-card');
            if (!card) return;

            pointerLayerDragState = {
                fromIdx: idx,
                cardEl: card
            };

            try { handle.setPointerCapture(e.pointerId); } catch(err) {}
            card.classList.add('dragging');

            handle.onpointermove = function(ev) {
                if (!pointerLayerDragState) return;
                let targetEl = document.elementFromPoint(ev.clientX, ev.clientY);
                let targetCard = targetEl ? targetEl.closest('.layer-card') : null;
                document.querySelectorAll('.layer-card').forEach(c => c.classList.remove('drag-over'));
                if (targetCard && targetCard !== pointerLayerDragState.cardEl) {
                    targetCard.classList.add('drag-over');
                }
            };

            handle.onpointerup = handle.onpointercancel = function(ev) {
                if (!pointerLayerDragState) return;
                let targetEl = document.elementFromPoint(ev.clientX, ev.clientY);
                let targetCard = targetEl ? targetEl.closest('.layer-card') : null;
                if (targetCard && targetCard.dataset.layerIndex !== undefined) {
                    let targetIdx = parseInt(targetCard.dataset.layerIndex, 10);
                    if (!isNaN(targetIdx) && targetIdx !== pointerLayerDragState.fromIdx) {
                        let [movedLayer] = state.layers.splice(pointerLayerDragState.fromIdx, 1);
                        state.layers.splice(targetIdx, 0, movedLayer);
                        commitHistorySnapshot();
                        renderLayers();
                        requestRender();
                    }
                }
                document.querySelectorAll('.layer-card').forEach(c => c.classList.remove('dragging', 'drag-over'));
                try { handle.releasePointerCapture(ev.pointerId); } catch(err) {}
                handle.onpointermove = null;
                handle.onpointerup = null;
                handle.onpointercancel = null;
                pointerLayerDragState = null;
            };
        };

        function renderLayers() {
            let { maskTargetIndex, clippedByMasks } = computeMaskRelationships();
            $('layersList').innerHTML = state.layers.map((l,i) => {
                let isMasked = !!clippedByMasks[i]; // цей шар кліпається маскою(ами), що йдуть над ним
                let maskHasNoTarget = l.isMask && maskTargetIndex[i] === -1; // маска в самому низу — не відображається
                return `
                <div class="layer-card ${l.id===state.selectedLayerId?'active':''} ${l.isMask?'is-mask':''} ${maskHasNoTarget?'is-mask-empty':''} ${isMasked?'is-masked-target':''} ${!l.visible?'is-hidden':''}" 
                     data-layer-id="${l.id}" 
                     data-layer-index="${i}" 
                     onclick="state.selectedLayerId='${l.id}';switchRightTab('layer');renderLayers();renderProps();">
                    <div class="layer-row-top">
                        <div class="layer-info">
                            <span class="drag-handle" title="Затисніть мишою або пальцем та перетягніть шар" onpointerdown="handleLayerPointerDown(event, ${i})" onclick="event.stopPropagation()">⣿</span>
                            ${isMasked?'<span class="mask-link-icon" title="Кліпується маскою зверху">⤷</span>':''}
                            <button onclick="event.stopPropagation(); toggleLayerVisibility(${i})" class="layer-btn ${l.visible?'layer-visible':'layer-hidden'}" title="${l.visible?'Приховати шар':'Показати шар'}" style="padding:0; margin-right:4px;">${l.visible?'👁':'🕶'}</button>
                            <span class="layer-name">${l.name}</span>
                            ${l.isMask?`<span class="mask-badge" title="${maskHasNoTarget?'Маска: немає шару знизу — не відображається':'Цей шар працює як маска для шару знизу'}">МАСКА</span>`:''}
                        </div>
                        <div class="layer-controls">
                            <button onclick="event.stopPropagation(); toggleMask(${i})" class="layer-btn ${l.isMask?'layer-btn-mask-active':''}" title="Використати як маску">🎭</button>
                            <button onclick="event.stopPropagation(); duplicateLayer(${i})" class="layer-btn" title="Дублювати шар">📋</button>
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
            return { seamless:false, scale:10, scaleX:10, scaleY:10, lockScale:true, layerScale:1, contrast:1, brightness:1, angle:0, blur:0, blurClampEdge:false,
                offsetX:0, offsetY:0, invert:false, warps:[],
                useThreshold:false, thresholdVal:50, useLevels:false, levelMin:0, levelMax:100,
                usePosterize:false, posterizeLevels:4, useFindEdges:false };
        }

        function freshGlobalSettings() {
            return { gamma:1, contrast:1, vignette:0, grain:10, blur:0, blurClampEdge:false,
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
        const GENERATOR_TYPES = ['gradient','simplex','perlin','voronoi','fbm','ridged','sine','radial','spiral','hexagon','pixel_noise','white_noise','checkerboard','dots','weave','value_noise','cellular','spider_web','cymatics', 'paint'];

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

        window.addGradientStop = function() {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params) return;
            if (!lay.params.stops) lay.params.stops = [];
            let newPos = 0.5;
            if (lay.params.stops.length >= 2) {
                let sorted = lay.params.stops.slice().sort((a, b) => a.pos - b.pos);
                newPos = (sorted[0].pos + sorted[sorted.length - 1].pos) / 2;
            }
            lay.params.stops.push({ pos: newPos, color: '#888888', val: 0.5 });
            lay.params.stops.sort((a, b) => a.pos - b.pos);
            lay.isDirty = true;
            lay.params._stopsDirty = true;
            renderProps();
            requestRender();
            commitHistorySnapshot();
        };

        window.removeGradientStop = function(idx) {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params || !lay.params.stops || lay.params.stops.length <= 2) return;
            lay.params.stops.splice(idx, 1);
            lay.isDirty = true;
            lay.params._stopsDirty = true;
            renderProps();
            requestRender();
            commitHistorySnapshot();
        };

        window.updateGradientStop = function(idx, key, val) {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params || !lay.params.stops || !lay.params.stops[idx]) return;
            triggerInteraction();
            let stop = lay.params.stops[idx];
            if (key === 'color') {
                stop.color = val;
            } else {
                stop[key] = parseFloat(val);
            }
            lay.isDirty = true;
            lay.params._stopsDirty = true;

            let lblPos = $('lbl_stop_pos_' + idx);
            if (lblPos) lblPos.innerText = 'Поз: ' + Math.round(stop.pos * 100) + '%';

            let lblVal = $('lbl_stop_val_' + idx);
            if (lblVal) lblVal.innerText = 'Вис: ' + (stop.val !== undefined ? stop.val : stop.pos).toFixed(2);

            let sortedStops = lay.params.stops.slice().sort((a, b) => a.pos - b.pos);
            let cssStopsStr = sortedStops.map(s => `${s.color || '#888888'} ${Math.round(s.pos * 100)}%`).join(', ');
            let rampEl = $('gradientRampPreview');
            if (rampEl) rampEl.style.background = `linear-gradient(to right, ${cssStopsStr})`;

            if (!suppressRender) requestRender();
        };

        window.finishGradientStopEdit = function() {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params || !lay.params.stops) return;
            lay.params.stops.sort((a, b) => a.pos - b.pos);
            lay.params._stopsDirty = true;
            renderProps();
            commitHistorySnapshot();
        };

        window.applyGradientPreset = function(presetName) {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params) return;
            switch (presetName) {
                case 'bw':
                    lay.params.stops = [
                        { pos: 0.0, color: '#000000', val: 0.0 },
                        { pos: 1.0, color: '#ffffff', val: 1.0 }
                    ];
                    break;
                case 'chrome':
                    lay.params.stops = [
                        { pos: 0.0, color: '#111111', val: 0.0 },
                        { pos: 0.25, color: '#ffffff', val: 1.0 },
                        { pos: 0.48, color: '#222222', val: 0.1 },
                        { pos: 0.5, color: '#ffffff', val: 1.0 },
                        { pos: 0.75, color: '#333333', val: 0.2 },
                        { pos: 1.0, color: '#eeeeee', val: 0.9 }
                    ];
                    break;
                case 'gold':
                    lay.params.stops = [
                        { pos: 0.0, color: '#4a2c00', val: 0.1 },
                        { pos: 0.35, color: '#ffd700', val: 0.8 },
                        { pos: 0.5, color: '#fff8dc', val: 1.0 },
                        { pos: 0.65, color: '#daa520', val: 0.7 },
                        { pos: 1.0, color: '#3b2200', val: 0.1 }
                    ];
                    break;
                case 'sunset':
                    lay.params.stops = [
                        { pos: 0.0, color: '#2d0b5a', val: 0.0 },
                        { pos: 0.4, color: '#c72c61', val: 0.4 },
                        { pos: 0.7, color: '#ff6b35', val: 0.7 },
                        { pos: 1.0, color: '#f7c548', val: 1.0 }
                    ];
                    break;
                case 'cyber':
                    lay.params.stops = [
                        { pos: 0.0, color: '#00f2fe', val: 0.0 },
                        { pos: 0.5, color: '#4facfe', val: 0.5 },
                        { pos: 1.0, color: '#000000', val: 1.0 }
                    ];
                    break;
                case 'rainbow':
                    lay.params.stops = [
                        { pos: 0.0, color: '#ff0000', val: 0.0 },
                        { pos: 0.2, color: '#ffff00', val: 0.2 },
                        { pos: 0.4, color: '#00ff00', val: 0.4 },
                        { pos: 0.6, color: '#00ffff', val: 0.6 },
                        { pos: 0.8, color: '#0000ff', val: 0.8 },
                        { pos: 1.0, color: '#ff00ff', val: 1.0 }
                    ];
                    break;
            }
            lay.isDirty = true;
            lay.params._stopsDirty = true;
            renderProps();
            requestRender();
            commitHistorySnapshot();
        };

        // --- Accordion Blocks & Drag-and-Drop Reordering State ---
        let accordionConfig = {
            layer: {
                order: ['algo', 'blend', 'transform', 'fx', 'warps'],
                states: { algo: false, blend: false, transform: false, fx: false, warps: false }
            },
            global: {
                order: ['fx', 'transform', 'tiling'],
                states: { fx: false, transform: false, tiling: false }
            }
        };

        try {
            let savedAcc = localStorage.getItem('veil_accordion_config');
            if (savedAcc) {
                let parsed = JSON.parse(savedAcc);
                if (parsed.layer && Array.isArray(parsed.layer.order)) {
                    accordionConfig.layer.order = parsed.layer.order;
                    if (parsed.layer.states) accordionConfig.layer.states = parsed.layer.states;
                }
                if (parsed.global && Array.isArray(parsed.global.order)) {
                    accordionConfig.global.order = parsed.global.order;
                    if (parsed.global.states) accordionConfig.global.states = parsed.global.states;
                }
            }
        } catch(e) {}

        function saveAccordionConfig() {
            try {
                localStorage.setItem('veil_accordion_config', JSON.stringify(accordionConfig));
            } catch(e) {}
        }

        window.toggleAccordionBlock = function(tab, id) {
            if (accordionConfig[tab] && accordionConfig[tab].states) {
                accordionConfig[tab].states[id] = !accordionConfig[tab].states[id];
                saveAccordionConfig();
                if (tab === 'layer') renderProps();
                else if (tab === 'global') renderGlobal();
            }
        };

        let pointerAccDragState = null;

        window.handleAccPointerDown = function(e, tab, id) {
            if (e.button !== undefined && e.button !== 0) return;
            e.stopPropagation();
            let handle = e.currentTarget;
            let block = handle.closest('.accordion-block');
            if (!block) return;

            pointerAccDragState = {
                tab: tab,
                id: id,
                blockEl: block
            };

            try { handle.setPointerCapture(e.pointerId); } catch(err) {}
            block.classList.add('dragging');

            handle.onpointermove = function(ev) {
                if (!pointerAccDragState) return;
                let targetEl = document.elementFromPoint(ev.clientX, ev.clientY);
                let targetBlock = targetEl ? targetEl.closest('.accordion-block') : null;
                document.querySelectorAll('.accordion-block').forEach(b => b.classList.remove('drag-over'));
                if (targetBlock && targetBlock !== pointerAccDragState.blockEl && targetBlock.dataset.accTab === pointerAccDragState.tab) {
                    targetBlock.classList.add('drag-over');
                }
            };

            handle.onpointerup = handle.onpointercancel = function(ev) {
                if (!pointerAccDragState) return;
                let targetEl = document.elementFromPoint(ev.clientX, ev.clientY);
                let targetBlock = targetEl ? targetEl.closest('.accordion-block') : null;
                if (targetBlock && targetBlock.dataset.accTab === pointerAccDragState.tab && targetBlock.dataset.accId !== pointerAccDragState.id) {
                    let targetId = targetBlock.dataset.accId;
                    let tab = pointerAccDragState.tab;
                    let order = accordionConfig[tab].order;
                    let fromIdx = order.indexOf(pointerAccDragState.id);
                    let toIdx = order.indexOf(targetId);
                    if (fromIdx !== -1 && toIdx !== -1) {
                        order.splice(fromIdx, 1);
                        order.splice(toIdx, 0, pointerAccDragState.id);
                        saveAccordionConfig();
                        if (tab === 'layer') renderProps();
                        else renderGlobal();
                    }
                }
                document.querySelectorAll('.accordion-block').forEach(b => b.classList.remove('dragging', 'drag-over'));
                try { handle.releasePointerCapture(ev.pointerId); } catch(err) {}
                handle.onpointermove = null;
                handle.onpointerup = null;
                handle.onpointercancel = null;
                pointerAccDragState = null;
            };
        };

        function renderAccordionBlock(tab, id, title, icon, contentHTML) {
            let isExpanded = accordionConfig[tab].states[id] === true;
            return `
            <div class="accordion-block" 
                 data-acc-tab="${tab}" 
                 data-acc-id="${id}">
                <div class="accordion-header" onclick="toggleAccordionBlock('${tab}', '${id}')" title="Натисніть для розгортання/згортання">
                    <div class="accordion-header-left">
                        <span class="drag-handle" title="Затисніть мишою або пальцем та перетягніть" onpointerdown="handleAccPointerDown(event, '${tab}', '${id}')" onclick="event.stopPropagation()">⣿</span>
                        <span>${icon} ${title}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:6px;">
                        <span class="accordion-chevron ${isExpanded ? 'open' : ''}">▼</span>
                    </div>
                </div>
                <div class="accordion-body ${isExpanded ? '' : 'collapsed'}">
                    ${contentHTML}
                </div>
            </div>`;
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

            if (lay.generatorType === 'gradient') {
                if (!lp.gradType) lp.gradType = 'linear';
                if (!lp.spreadMethod) lp.spreadMethod = 'clamp';
                if (lp.centerX === undefined) lp.centerX = 0.5;
                if (lp.centerY === undefined) lp.centerY = 0.5;
                if (lp.aspectRatio === undefined) lp.aspectRatio = 1.0;
                if (lp.midpoint === undefined) lp.midpoint = 0.5;
                if (!lp.stops || !Array.isArray(lp.stops) || lp.stops.length === 0) {
                    lp.stops = [
                        { pos: 0.0, color: '#000000', val: 0.0 },
                        { pos: 1.0, color: '#ffffff', val: 1.0 }
                    ];
                }
            }

            // --- Constructing Accordion Content Blocks for Layer Properties ---
            let layerBlockContents = {};

            // Block: blend
            layerBlockContents.blend = `
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
                <div class="property-group" style="margin-bottom:0;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <label class="property-label" style="margin:0;">Базова Безшовність (Tileable)</label>
                        <input type="checkbox" ${lp.seamless ? 'checked' : ''} onchange="upd('seamless', this.checked)">
                    </div>
                </div>
            `;

            // Block: algo
            let algoSpecificHTML = '';
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

                algoSpecificHTML += `
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
                algoSpecificHTML += `<div class="section-title">Cymatics</div>`;
                algoSpecificHTML += createSlider("Частота", "frequency", 1, 300, 1, lp.frequency, false, 50);
                algoSpecificHTML += createSlider("Фаза", "phase", 0, 360, 1, lp.phase, false, 0);
                algoSpecificHTML += `<div class="property-group"><label class="property-label">Джерело (Source)</label><select class="form-control" onchange="upd('sourceMode', this.value)"><option value="Center" ${lp.sourceMode==='Center'?'selected':''}>Center</option><option value="Corners" ${lp.sourceMode==='Corners'?'selected':''}>Corners</option><option value="Edges" ${lp.sourceMode==='Edges'?'selected':''}>Edges</option><option value="Ring" ${lp.sourceMode==='Ring'?'selected':''}>Ring</option><option value="Polygon" ${lp.sourceMode==='Polygon'?'selected':''}>Polygon</option><option value="Random" ${lp.sourceMode==='Random'?'selected':''}>Random</option></select></div>`;
                algoSpecificHTML += createSlider("К-ть Джерел", "sourcesCount", 1, 64, 1, lp.sourcesCount, false, 4);
                algoSpecificHTML += createSlider("Симетрія", "symmetry", 1, 24, 1, lp.symmetry, false, 1);
                algoSpecificHTML += createSlider("Товщина лінії", "isolineWidth", 0, 1, 0.01, lp.isolineWidth, false, 0.5);
            }

            if (lay.generatorType === 'spider_web') {
                algoSpecificHTML += `<div class="section-title">Spider Web</div>`;
                algoSpecificHTML += createSlider("Кількість променів", "radialCount", 4, 64, 1, lp.radialCount || 18, false, 18);
                algoSpecificHTML += createSlider("Кількість кілець", "ringCount", 4, 64, 1, lp.ringCount || 22, false, 22);
                algoSpecificHTML += createSlider("Товщина кілець", "ringThick", 0.01, 0.2, 0.01, lp.ringThick || 0.04, false, 0.04);
                algoSpecificHTML += createSlider("Товщина променів", "radThick", 0.01, 0.2, 0.01, lp.radThick || 0.025, false, 0.025);
                algoSpecificHTML += createSlider("Wobble (Хвилювання)", "wobble", 0, 0.5, 0.01, lp.wobble || 0.03, false, 0.03);
                algoSpecificHTML += createSlider("Jitter (Джиттер)", "jitter", 0, 20, 0.5, lp.jitter || 8, false, 8);
                algoSpecificHTML += createSlider("Fractal (Фрактал)", "fractal", 0, 1, 0.05, lp.fractal || 0, false, 0);
                algoSpecificHTML += createSlider("Ампл. кілець (Sine)", "ringSineAmp", 0, 1, 0.05, lp.ringSineAmp || 0, false, 0);
                algoSpecificHTML += createSlider("Частота кілець (Sine)", "ringSineFreq", 1, 20, 1, lp.ringSineFreq || 5, false, 5);
                algoSpecificHTML += createSlider("Ампл. променів (Sine)", "radSineAmp", 0, 1, 0.05, lp.radSineAmp || 0, false, 0);
                algoSpecificHTML += createSlider("Частота променів (Sine)", "radSineFreq", 1, 20, 1, lp.radSineFreq || 10, false, 10);
            }

            if (lay.generatorType === 'gradient') {
                let sortedStops = lp.stops.slice().sort((a, b) => a.pos - b.pos);
                let cssStopsStr = sortedStops.map(s => `${s.color || '#888888'} ${Math.round(s.pos * 100)}%`).join(', ');
                let rampStyle = `background: linear-gradient(to right, ${cssStopsStr}); height: 28px; border-radius: 6px; border: 1px solid var(--border-color, #27272a); margin-bottom: 10px; position: relative; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);`;

                let stopsHTML = sortedStops.map((s) => {
                    let rawIdx = lp.stops.indexOf(s);
                    return `
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color, #27272a); border-radius: 6px; padding: 6px 8px; margin-bottom: 6px; display: grid; grid-template-columns: 28px 1fr 1fr 24px; gap: 6px; align-items: center;">
                        <input type="color" value="${s.color || '#ffffff'}" oninput="updateGradientStop(${rawIdx}, 'color', this.value)" onchange="finishGradientStopEdit();" style="width:24px; height:24px; padding:0; border:none; background:none; cursor:pointer;" title="Колір точки">
                        <div>
                            <div id="lbl_stop_pos_${rawIdx}" style="font-size:9px; color:var(--text-muted, #a1a1aa);">Поз: ${Math.round(s.pos * 100)}%</div>
                            <input type="range" min="0" max="1" step="0.01" value="${s.pos}" oninput="updateGradientStop(${rawIdx}, 'pos', this.value)" onchange="finishGradientStopEdit();" style="width:100%;">
                        </div>
                        <div>
                            <div id="lbl_stop_val_${rawIdx}" style="font-size:9px; color:var(--text-muted, #a1a1aa);">Вис: ${(s.val !== undefined ? s.val : s.pos).toFixed(2)}</div>
                            <input type="range" min="0" max="1" step="0.01" value="${s.val !== undefined ? s.val : s.pos}" oninput="updateGradientStop(${rawIdx}, 'val', this.value)" onchange="finishGradientStopEdit();" style="width:100%;">
                        </div>
                        <button type="button" class="reset-btn" style="color:#ef4444; font-size:12px;" title="Видалити точку" onclick="removeGradientStop(${rawIdx})" ${lp.stops.length <= 2 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>✕</button>
                    </div>`;
                }).join('');

                algoSpecificHTML += `
                <div class="section-title" style="margin-top:12px;">🎨 Градієнти (Procedural Gradients)</div>
                <div class="property-group">
                    <label class="property-label">Форма / Тип градієнта</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(3,1fr);">
                        <button onclick="upd('gradType','linear')" class="gen-btn ${lp.gradType==='linear'?'active':''}">Лінійний</button>
                        <button onclick="upd('gradType','radial')" class="gen-btn ${lp.gradType==='radial'?'active':''}">Радіальний</button>
                        <button onclick="upd('gradType','elliptical')" class="gen-btn ${lp.gradType==='elliptical'?'active':''}">Овальний</button>
                        <button onclick="upd('gradType','conical')" class="gen-btn ${lp.gradType==='conical'?'active':''}">Конічний</button>
                        <button onclick="upd('gradType','reflected')" class="gen-btn ${lp.gradType==='reflected'?'active':''}">Відбитий</button>
                        <button onclick="upd('gradType','diamond')" class="gen-btn ${lp.gradType==='diamond'?'active':''}">Ромбічний</button>
                    </div>
                </div>

                <div class="property-group">
                    <label class="property-label">Повторення (Spread Method)</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(3,1fr);">
                        <button onclick="upd('spreadMethod','clamp')" class="gen-btn ${lp.spreadMethod==='clamp'?'active':''}">Clamp</button>
                        <button onclick="upd('spreadMethod','repeat')" class="gen-btn ${lp.spreadMethod==='repeat'?'active':''}">Repeat</button>
                        <button onclick="upd('spreadMethod','reflect')" class="gen-btn ${lp.spreadMethod==='reflect'?'active':''}">Reflect</button>
                    </div>
                </div>

                ${createSlider("Центр X (Position X)", "centerX", 0, 1, 0.01, lp.centerX, false, 0.5)}
                ${createSlider("Центр Y (Position Y)", "centerY", 0, 1, 0.01, lp.centerY, false, 0.5)}
                ${createSlider("Пропорції / Еліпсис", "aspectRatio", 0.1, 5, 0.05, lp.aspectRatio, false, 1.0)}
                ${createSlider("Середня точка (Midpoint)", "midpoint", 0.05, 0.95, 0.01, lp.midpoint, false, 0.5)}

                <div class="property-group" style="margin-top:12px;">
                    <label class="property-label">Пресети градієнта</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(3,1fr); gap:4px;">
                        <button onclick="applyGradientPreset('bw')" class="gen-btn" style="font-size:10px;">Ч/Б (BW)</button>
                        <button onclick="applyGradientPreset('chrome')" class="gen-btn" style="font-size:10px;">Хром</button>
                        <button onclick="applyGradientPreset('gold')" class="gen-btn" style="font-size:10px;">Золото</button>
                        <button onclick="applyGradientPreset('sunset')" class="gen-btn" style="font-size:10px;">Захід</button>
                        <button onclick="applyGradientPreset('cyber')" class="gen-btn" style="font-size:10px;">Неон</button>
                        <button onclick="applyGradientPreset('rainbow')" class="gen-btn" style="font-size:10px;">Веселка</button>
                    </div>
                </div>

                <div class="property-group" style="margin-top:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span class="property-label" style="margin:0;">Шкала кольорів (Color Ramp)</span>
                        <button type="button" class="btn btn-primary" onclick="addGradientStop()" style="padding:2px 8px; font-size:10px;">+ Точка</button>
                    </div>
                    <div id="gradientRampPreview" style="${rampStyle}"></div>
                    ${stopsHTML}
                </div>
                `;
            }

            if(['perlin','fbm','ridged','spiral'].includes(lay.generatorType)) algoSpecificHTML+=createSlider(lay.generatorType==='spiral'?'Кількість рукавів (Arms)':'Октави', "octaves", 1, 10, 1, lp.octaves||3, false, 3);
            if(lay.generatorType==='voronoi') algoSpecificHTML+=`<div class="property-group grid-2"><div><label class="property-label">Метрика</label><select class="form-control" onchange="upd('metric',this.value)"><option value="euclidean" ${lp.metric==='euclidean'?'selected':''}>Euclidean</option><option value="manhattan" ${lp.metric==='manhattan'?'selected':''}>Manhattan</option><option value="chebyshev" ${lp.metric==='chebyshev'?'selected':''}>Chebyshev</option></select></div><div><label class="property-label">Режим</label><select class="form-control" onchange="upd('mode',this.value)"><option value="f1" ${lp.mode==='f1'?'selected':''}>F1</option><option value="f2" ${lp.mode==='f2'?'selected':''}>F2</option><option value="f2_minus_f1" ${lp.mode==='f2_minus_f1'?'selected':''}>F2-F1</option></select></div></div>`;
            if(lay.generatorType==='sine') algoSpecificHTML+=createSlider("Фаза зсуву", "phase", 0, 6.28, 0.1, lp.phase||0, false, 0);

            layerBlockContents.algo = `
                <div class="property-group">
                    <label class="property-label">Алгоритм (Algorithm)</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(3,1fr);">
                        ${['gradient','paint','simplex','perlin','voronoi','fbm','ridged','sine','radial','spiral','hexagon','pixel_noise','white_noise','checkerboard','dots','weave','value_noise','cellular','spider_web', 'cymatics'].map(t=>`<button onclick="upd('generatorType','${t}',true)" class="gen-btn ${lay.generatorType===t?'active':''}">${t}</button>`).join('')}
                    </div>
                </div>
                ${algoSpecificHTML}
            `;

            // Block: transform
            layerBlockContents.transform = `
                ${createSlider("Зсув X", "offsetX", -2, 2, 0.05, lp.offsetX, false, 0)}
                ${createSlider("Зсув Y", "offsetY", -2, 2, 0.05, lp.offsetY, false, 0)}
                <div class="property-group"><label class="property-label">Масштаб по осях <button type="button" class="layer-btn" title="${lp.lockScale?'Масштаб X/Y пов’язаний':'Масштаб X/Y незалежний'}" onclick="upd('lockScale',${!lp.lockScale}); renderProps();">${lp.lockScale?'🔒':'🔓'}</button></label></div>
                ${createScaleSlider("Масштаб X (Noise/Web)", "scaleX", lp.scaleX)}
                ${createScaleSlider("Масштаб Y (Noise/Web)", "scaleY", lp.scaleY)}
                ${createSlider("Масштаб Шару (Zoom)", "layerScale", 0.1, 10, 0.1, lp.layerScale, false, 1)}
                ${createSlider("Кут обертання (−180° … +180°)", "angle", -180, 180, 1, lp.angle, false, 0)}
            `;

            // Block: fx
            layerBlockContents.fx = `
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
                <div class="property-group" style="margin-top:-6px;">
                    <label class="checkbox-label" style="font-size:11px; display:flex; align-items:center; gap:6px;">
                        <input type="checkbox" ${lp.blurClampEdge ? 'checked' : ''} onchange="upd('blurClampEdge', this.checked)">
                        <span>Repeat Edge Pixels / Clamp to Edge</span>
                    </label>
                </div>
            `;

            // Block: warps
            let warpsHTML = lp.warps.map((w, idx) => `
                <div class="warp-card" data-warp-index="${idx}" style="${w.visible===false?'opacity:0.5;':''}">
                    <div class="warp-controls">
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

            layerBlockContents.warps = `
                <div class="property-group" style="margin-bottom:0;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <label class="property-label" style="margin:0;">Деформації шару</label>
                        <button onclick="addWarp()" class="btn btn-primary" style="padding:4px 8px; font-size:10px;">+ Додати</button>
                    </div>
                    ${warpsHTML || '<div style="font-size:11px; color:var(--text-muted);">Деформатори відсутні. Натисніть "+ Додати", щоб додати викривлення.</div>'}
                </div>
            `;

            let blockMeta = {
                blend: { title: "Блендинг та Непрозорість", icon: "🎛️" },
                algo: { title: "Алгоритм та Генератор", icon: "🎨" },
                transform: { title: "Трансформація та Масштаб", icon: "📐" },
                fx: { title: "Локальні Ефекти", icon: "✨" },
                warps: { title: "Деформатори (Warps)", icon: "🌀" }
            };

            // Build panel HTML by rendering accordion blocks in current order
            let html = accordionConfig.layer.order.map(key => {
                let meta = blockMeta[key];
                if (!meta || !layerBlockContents[key]) return '';
                return renderAccordionBlock('layer', key, meta.title, meta.icon, layerBlockContents[key]);
            }).join('');

            p.innerHTML = html;
            window.lay = lay; 
        }

        function renderGlobal() {
            let g = state.global;
            let modeBtn = (m, label) => `<button onclick="setTileMode('${m}')" class="gen-btn ${g.tileMode===m?'active':''}">${label}</button>`;

            let globalBlockContents = {};

            // Block: transform
            globalBlockContents.transform = `
                <div class="property-group" style="margin-bottom:8px;">
                    <button onclick="resetGlobalSettings()" class="btn btn-secondary" style="width:100%;" title="Скинути корекції, трансформацію і тайлінг до значень за замовчуванням">↺ Скинути глобальні налаштування</button>
                </div>
                ${createSlider("Масштаб (Zoom)", "globalZoom", 0.1, 5, 0.05, g.globalZoom, true, 1)}
                ${createSlider("Поворот", "globalRotation", -180, 180, 1, g.globalRotation, true, 0)}
                ${createSlider("Зсув X", "globalOffsetX", -2, 2, 0.02, g.globalOffsetX, true, 0)}
                ${createSlider("Зсув Y", "globalOffsetY", -2, 2, 0.02, g.globalOffsetY, true, 0)}
            `;

            // Block: tiling
            globalBlockContents.tiling = `
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
            `;

            // Block: fx
            globalBlockContents.fx = `
                ${createSlider("Контраст", "contrast", 0.5, 2, 0.05, g.contrast, true, 1)}
                ${createSlider("Гамма", "gamma", 0.2, 3, 0.05, g.gamma, true, 1)}
                ${createSlider("Віньєтка", "vignette", 0, 1, 0.05, g.vignette, true, 0)}
                ${createSlider("Глобальне розмиття", "blur", 0, 20, 1, g.blur||0, true, 0)}
                <div class="property-group" style="margin-top:-6px;">
                    <label class="checkbox-label" style="font-size:11px; display:flex; align-items:center; gap:6px;">
                        <input type="checkbox" ${g.blurClampEdge ? 'checked' : ''} onchange="state.global.blurClampEdge=this.checked; invalidateCaches(); requestRender(); commitHistorySnapshot();">
                        <span>Repeat Edge Pixels / Clamp to Edge</span>
                    </label>
                </div>
                ${createSlider("Зерно", "grain", 0, 50, 1, g.grain, true, 10)}
            `;

            let blockMeta = {
                transform: { title: "Глобальна Трансформація", icon: "🌐" },
                tiling: { title: "Глобальний Тайлінг", icon: "🔁" },
                fx: { title: "Глобальна Корекція", icon: "🎚️" }
            };

            let html = accordionConfig.global.order.map(key => {
                let meta = blockMeta[key];
                if (!meta || !globalBlockContents[key]) return '';
                return renderAccordionBlock('global', key, meta.title, meta.icon, globalBlockContents[key]);
            }).join('');

            $('propertiesPanel').innerHTML = html;
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

        // =========================================================================
        // === SEAMLESS TEXTURE STUDIO PRO v9.0 — СИСТЕМА БЕЗШОВНОГО ТАЙЛІНГУ ===
        // =========================================================================

        let tilingOriginalCanvas = null;
        let tilingProcessedCanvas = null;
        let tilingStampCanvas = null;
        let tilingMaskCanvas = null;
        let tilingLastSeams = null;
        let initialStampSource = null;
        let stampSource = null;
        let selectingStampSource = false;
        let stampCursorX = -9999;
        let stampCursorY = -9999;
        let isStamping = false;
        let isMaskBrushing = false;
        let lastDrawPos = null;
        let stampBackupCanvas = null;
        let maskBackupCanvas = null;

        function ensureTilingStampCanvas(w, h) {
            if (!tilingStampCanvas) {
                tilingStampCanvas = document.createElement('canvas');
            }
            if (tilingStampCanvas.width !== w || tilingStampCanvas.height !== h) {
                tilingStampCanvas.width = w;
                tilingStampCanvas.height = h;
            }
        }

        function clearTilingStampCanvas() {
            if (tilingStampCanvas) {
                let sctx = tilingStampCanvas.getContext('2d');
                sctx.clearRect(0, 0, tilingStampCanvas.width, tilingStampCanvas.height);
            }
        }

        function backupTilingStamp() {
            if (!tilingStampCanvas) return;
            if (!stampBackupCanvas) stampBackupCanvas = document.createElement('canvas');
            stampBackupCanvas.width = tilingStampCanvas.width;
            stampBackupCanvas.height = tilingStampCanvas.height;
            let bctx = stampBackupCanvas.getContext('2d');
            bctx.clearRect(0, 0, stampBackupCanvas.width, stampBackupCanvas.height);
            bctx.drawImage(tilingStampCanvas, 0, 0);
        }

        function restoreTilingStampBackup() {
            if (stampBackupCanvas && tilingStampCanvas) {
                let sctx = tilingStampCanvas.getContext('2d');
                sctx.clearRect(0, 0, tilingStampCanvas.width, tilingStampCanvas.height);
                sctx.drawImage(stampBackupCanvas, 0, 0);
            }
        }

        function cancelStamping() {
            if (isStamping) {
                isStamping = false;
                restoreTilingStampBackup();
                if (initialStampSource) {
                    stampSource = { x: initialStampSource.x, y: initialStampSource.y };
                }
                runTilingPipeline();
            }
        }

        function ensureTilingMaskCanvas(w, h) {
            if (!tilingMaskCanvas) {
                tilingMaskCanvas = document.createElement('canvas');
            }
            if (tilingMaskCanvas.width !== w || tilingMaskCanvas.height !== h) {
                tilingMaskCanvas.width = w;
                tilingMaskCanvas.height = h;
            }
        }

        function clearTilingMaskCanvas() {
            if (tilingMaskCanvas) {
                let mctx = tilingMaskCanvas.getContext('2d');
                mctx.clearRect(0, 0, tilingMaskCanvas.width, tilingMaskCanvas.height);
            }
        }

        function backupTilingMask() {
            if (!tilingMaskCanvas) return;
            if (!maskBackupCanvas) maskBackupCanvas = document.createElement('canvas');
            maskBackupCanvas.width = tilingMaskCanvas.width;
            maskBackupCanvas.height = tilingMaskCanvas.height;
            let bctx = maskBackupCanvas.getContext('2d');
            bctx.clearRect(0, 0, maskBackupCanvas.width, maskBackupCanvas.height);
            bctx.drawImage(tilingMaskCanvas, 0, 0);
        }

        function restoreTilingMaskBackup() {
            if (maskBackupCanvas && tilingMaskCanvas) {
                let mctx = tilingMaskCanvas.getContext('2d');
                mctx.clearRect(0, 0, tilingMaskCanvas.width, tilingMaskCanvas.height);
                mctx.drawImage(maskBackupCanvas, 0, 0);
            }
        }

        function cancelMaskBrushing() {
            if (isMaskBrushing) {
                isMaskBrushing = false;
                restoreTilingMaskBackup();
                runTilingPipeline();
            }
        }

        function toggleTilingStamp(enable) {
            tilingState.stamp_enable = enable;
            if (enable) tilingState.mask_brush_enable = false;
            renderTilingPanel();
            renderTilingView();
        }

        function toggleTilingMaskBrush(enable) {
            tilingState.mask_brush_enable = enable;
            if (enable) tilingState.stamp_enable = false;
            renderTilingPanel();
            renderTilingView();
        }

        let tilingState = {
            hasImage: false,
            currentViewMode: 'single', // 'single', 'tiled', 'tiled3', 'original'
            showGrid: false,
            showSeams: false,

            preset: 'organic',

            stamp_enable: false,
            stamp_mode: 'clone', // 'clone' or 'erase'
            stamp_aligned: true,
            stamp_size: 30,
            stamp_opacity: 80,
            stamp_softness: 60,

            mask_brush_enable: false,
            mask_brush_mode: 'erase_seam', // 'erase_seam' (reveal original) or 'restore_seam' (restore tile)
            mask_brush_size: 30,
            mask_brush_opacity: 80,
            mask_brush_softness: 60,

            guard_enable: true,
            guard_width: 16,
            guard_mix_strength: 85,
            guard_blend_mode: 'cosine',
            guard_jitter: 8,
            guard_frequency: 0.08,
            guard_detail_preserve: 70,

            guard_seam_algo: 'dp_mincost',
            guard_seam_metric: 'lab',
            guard_search: 15,
            guard_stiffness: 1.2,
            guard_grad_weight: 2.0,
            guard_warp_mode: 'chaotic',
            guard_warp_amp: 8,
            guard_warp_freq: 0.08,
            guard_curve: 'cosine',
            guard_overlap: 14,
            guard_feather: 8,
            guard_blur_radius: 8,

            seam_algo: 'dp_mincost',
            seam_metric: 'lab',
            seam_search: 20,
            seam_stiffness: 1.2,
            seam_grad_weight: 2.5,

            seam_warp_mode: 'chaotic',
            seam_warp_amp: 10,
            seam_warp_freq: 0.06,
            seam_warp_jitter: 4,

            seam_curve: 'sigmoid',
            seam_overlap: 14,
            seam_feather: 8,
            seam_blur_radius: 12,
            seam_contrast_match: 50,

            luma_balance_enable: true,
            luma_balance_strength: 75,

            flat_enable: true,
            flat_strength: 0.80,

            offset_x: 50,
            offset_y: 50,

            freq_gain: 1.30,
            freq_radius: 3,
            sharpen: 0.40,
            micro_contrast: 1.10,
            micro_noise: 2.5,
            micro_noise_scale: 'fine',

            accordions: {
                stamp: false,
                mask: false,
                guard: false,
                dp: false,
                warp: false,
                blend: false,
                luma: false,
                flat: false,
                offset: false,
                fx: false
            }
        };

        function getCanvasPos(e) {
            if (!canvas) return { x: 0, y: 0 };

            let clientX = e.clientX;
            let clientY = e.clientY;

            if (clientX === undefined || clientY === undefined) {
                if (e.touches && e.touches.length > 0) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else if (e.changedTouches && e.changedTouches.length > 0) {
                    clientX = e.changedTouches[0].clientX;
                    clientY = e.changedTouches[0].clientY;
                } else if (e.targetTouches && e.targetTouches.length > 0) {
                    clientX = e.targetTouches[0].clientX;
                    clientY = e.targetTouches[0].clientY;
                }
            }

            if (clientX === undefined || clientY === undefined) return { x: 0, y: 0 };

            const rect = canvas.getBoundingClientRect();
            if (!rect || rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };

            const targetW = canvas.width;
            const targetH = canvas.height;

            let normX = 0;
            let normY = 0;

            if (!viewport || !viewport.angle) {
                normX = (clientX - rect.left) / rect.width;
                normY = (clientY - rect.top) / rect.height;
            } else {
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const dx = clientX - centerX;
                const dy = clientY - centerY;
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

            return {
                x: normX * targetW,
                y: normY * targetH
            };
        }

        function setViewModeTiling(mode) {
            tilingState.currentViewMode = mode;
            renderTilingPanel();
            renderTilingView();
        }

        function toggleTilingAccordion(accKey) {
            tilingState.accordions[accKey] = !tilingState.accordions[accKey];
            let content = $(`acc_tiling_${accKey}`);
            let chev = $(`acc_tiling_${accKey}_chev`);
            if (content) content.classList.toggle('show', tilingState.accordions[accKey]);
            if (chev) chev.classList.toggle('open', tilingState.accordions[accKey]);
        }

        function updTiling(key, val, suffix='') {
            if (key in tilingState) {
                tilingState[key] = (typeof tilingState[key] === 'number') ? parseFloat(val) : val;
                let vSpan = $(`tiling_val_${key}`);
                if (vSpan) vSpan.innerText = val + suffix;
            }
            if (tilingState.hasImage && !key.startsWith('stamp')) {
                runTilingPipeline();
            } else {
                renderTilingView();
            }
        }

        function tilingSlider(label, key, min, max, step, suffix, defVal) {
            let val = tilingState[key];
            if (defVal === undefined) defVal = val;
            return `
                <div class="control-group">
                    <div class="control-label">
                        <span>${label}</span>
                        <span class="control-value" id="tiling_val_${key}">${val}${suffix}</span>
                    </div>
                    <div style="display:flex; gap:6px; align-items:center;">
                        <input type="range" id="rng_tiling_${key}" min="${min}" max="${max}" step="${step}" value="${val}" oninput="updTiling('${key}', this.value, '${suffix}'); if ($('num_tiling_${key}')) $('num_tiling_${key}').value=this.value;">
                        <input type="number" class="num-input" id="num_tiling_${key}" min="${min}" max="${max}" step="${step}" value="${val}" oninput="updTiling('${key}', this.value, '${suffix}'); if ($('rng_tiling_${key}')) $('rng_tiling_${key}').value=this.value;">
                        <button type="button" class="reset-btn" title="Скинути за замовчуванням (${defVal})" onclick="updTiling('${key}', ${defVal}, '${suffix}'); if ($('rng_tiling_${key}')) $('rng_tiling_${key}').value=${defVal}; if ($('num_tiling_${key}')) $('num_tiling_${key}').value=${defVal};">↺</button>
                    </div>
                </div>
            `;
        }

        function toggleTilingStamp(enabled) {
            tilingState.stamp_enable = enabled;
            selectingStampSource = false;
            if (enabled) {
                if (canvas) canvas.style.cursor = 'crosshair';
            } else {
                if (canvas) canvas.style.cursor = 'grab';
                initialStampSource = null;
                stampSource = null;
                stampCursorX = -9999;
                stampCursorY = -9999;
            }
            renderTilingPanel();
            renderTilingView();
        }

        function toggleSelectingStampSource() {
            selectingStampSource = !selectingStampSource;
            if (selectingStampSource) {
                tilingState.stamp_enable = true;
                if (canvas) canvas.style.cursor = 'crosshair';
            }
            renderTilingPanel();
            renderTilingView();
        }

        function applyTilingPreset(p) {
            tilingState.preset = p;
            if (p === 'organic') {
                tilingState.seam_search = 25;
                tilingState.seam_stiffness = 0.8;
                tilingState.seam_warp_mode = 'chaotic';
                tilingState.seam_warp_amp = 14;
                tilingState.seam_curve = 'sigmoid';
                tilingState.guard_jitter = 10;
                tilingState.guard_blend_mode = 'stochastic';
            } else if (p === 'pattern') {
                tilingState.seam_search = 12;
                tilingState.seam_stiffness = 2.8;
                tilingState.seam_warp_mode = 'sine';
                tilingState.seam_warp_amp = 2;
                tilingState.seam_curve = 'cosine';
                tilingState.guard_jitter = 2;
                tilingState.guard_blend_mode = 'cosine';
            } else if (p === 'wood') {
                tilingState.seam_search = 18;
                tilingState.seam_stiffness = 2.0;
                tilingState.seam_warp_mode = 'fractal';
                tilingState.seam_warp_amp = 8;
                tilingState.seam_curve = 'gaussian';
                tilingState.guard_jitter = 5;
                tilingState.guard_blend_mode = 'sigmoid';
            } else if (p === 'micro') {
                tilingState.freq_gain = 2.2;
                tilingState.freq_radius = 2;
                tilingState.sharpen = 0.8;
                tilingState.micro_contrast = 1.25;
                tilingState.micro_noise = 4.0;
                tilingState.micro_noise_scale = 'fine';
            }
            renderTilingPanel();
            if (tilingState.hasImage) runTilingPipeline();
        }

        function resetTilingToDefaults() {
            tilingState.preset = 'organic';
            tilingState.stamp_enable = false;
            tilingState.stamp_aligned = true;
            tilingState.stamp_size = 30;
            tilingState.stamp_opacity = 80;
            tilingState.stamp_softness = 60;
            tilingState.guard_enable = true;
            tilingState.guard_width = 16;
            tilingState.guard_mix_strength = 85;
            tilingState.guard_blend_mode = 'cosine';
            tilingState.guard_jitter = 8;
            tilingState.guard_frequency = 0.08;
            tilingState.guard_detail_preserve = 70;
            tilingState.seam_algo = 'dp_mincost';
            tilingState.seam_metric = 'lab';
            tilingState.seam_search = 20;
            tilingState.seam_stiffness = 1.2;
            tilingState.seam_grad_weight = 2.5;
            tilingState.seam_warp_mode = 'chaotic';
            tilingState.seam_warp_amp = 10;
            tilingState.seam_warp_freq = 0.06;
            tilingState.seam_warp_jitter = 4;
            tilingState.seam_curve = 'sigmoid';
            tilingState.seam_overlap = 14;
            tilingState.seam_feather = 8;
            tilingState.seam_blur_radius = 12;
            tilingState.seam_contrast_match = 50;
            tilingState.luma_balance_enable = true;
            tilingState.luma_balance_strength = 75;
            tilingState.flat_enable = true;
            tilingState.flat_strength = 0.80;
            tilingState.offset_x = 50;
            tilingState.offset_y = 50;
            tilingState.freq_gain = 1.30;
            tilingState.freq_radius = 3;
            tilingState.sharpen = 0.40;
            tilingState.micro_contrast = 1.10;
            tilingState.micro_noise = 2.5;
            tilingState.micro_noise_scale = 'fine';
            initialStampSource = null;
            stampSource = null;
            selectingStampSource = false;
            if (canvas) canvas.style.cursor = 'grab';
            renderTilingPanel();
            if (tilingState.hasImage) runTilingPipeline();
        }

        function captureProjectToTiling() {
            if (!tilingOriginalCanvas) {
                tilingOriginalCanvas = document.createElement('canvas');
            }
            tilingOriginalCanvas.width = canvasResolution;
            tilingOriginalCanvas.height = canvasResolution;
            renderProject(tilingOriginalCanvas);
            tilingState.hasImage = true;
            renderTilingPanel();
            runTilingPipeline();
        }

        function applyTilingToLayer() {
            if (!tilingProcessedCanvas || !tilingState.hasImage) return;
            prepareStateForSerialization();
            let id = 'l' + Date.now();
            let newLay = {
                id,
                name: 'Безшовний тайл',
                visible: true,
                opacity: 100,
                blendMode: 'normal',
                generatorType: 'paint',
                isMask: false,
                params: freshLayerParams()
            };
            ensureLayerPaintCanvas(newLay);
            let pCtx = newLay.paintCanvas.getContext('2d');
            pCtx.clearRect(0, 0, 1024, 1024);
            pCtx.drawImage(tilingProcessedCanvas, 0, 0, 1024, 1024);
            newLay.isDirty = true;

            state.layers.unshift(newLay);
            state.selectedLayerId = id;
            commitHistorySnapshot();
            renderLayers();
            switchRightTab('layer');
            requestRender();
        }

        function handleTilingImageUpload(e) {
            let file = e.target.files[0];
            if (!file) return;
            let reader = new FileReader();
            reader.onload = function(event) {
                let img = new Image();
                img.onload = function() {
                    if (!tilingOriginalCanvas) {
                        tilingOriginalCanvas = document.createElement('canvas');
                    }
                    tilingOriginalCanvas.width = img.width;
                    tilingOriginalCanvas.height = img.height;
                    let octx = tilingOriginalCanvas.getContext('2d');
                    octx.drawImage(img, 0, 0);
                    tilingState.hasImage = true;
                    renderTilingPanel();
                    runTilingPipeline();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
            e.target.value = '';
        }

        function openTilingExportModal() {
            if (!tilingProcessedCanvas || !tilingState.hasImage) return;
            let modalImg = $('modalPngPreview');
            if (modalImg) {
                modalImg.src = tilingProcessedCanvas.toDataURL('image/png');
            }
            let modal = $('pngModal');
            if (modal) {
                modal.style.display = 'flex';
            }
        }

        // --- Алгоритми обробки текстур ---
        function pseudoNoise(x, y) {
            let n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
            return n - Math.floor(n);
        }

        function getPixelWrapped(pixels, w, h, x, y, c) {
            let wx = (x % w + w) % w;
            let wy = (y % h + h) % h;
            return pixels[(wy * w + wx) * 4 + c];
        }

        function getBlendAlpha(t, curveType, x, y) {
            t = Math.max(0, Math.min(1, t));
            if (curveType === 'sigmoid') {
                return 1 / (1 + Math.exp(-10 * (t - 0.5)));
            } else if (curveType === 'gaussian') {
                return Math.exp(-Math.pow((t - 0.5) * 3, 2));
            } else if (curveType === 'dither' || curveType === 'stochastic') {
                let ditherVal = (pseudoNoise(x, y) - 0.5) * 0.3;
                return Math.max(0, Math.min(1, t + ditherVal));
            } else if (curveType === 'cosine') {
                return 0.5 - 0.5 * Math.cos(Math.PI * t);
            } else if (curveType === 'exponential') {
                return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            } else if (curveType === 'smoothstep') {
                return t * t * (3 - 2 * t);
            } else {
                return t;
            }
        }

        function getWarpOffset(i, mode, amp, freq, jitter) {
            let offset = 0;
            if (mode === 'sine') {
                offset = Math.sin(i * freq) * amp + Math.cos(i * freq * 1.7) * (amp * 0.4);
            } else if (mode === 'chaotic') {
                offset = Math.sin(i * freq) * amp + Math.sin(i * freq * 2.7 + 1.2) * (amp * 0.6) + (pseudoNoise(i, 1) - 0.5) * amp * 0.5;
            } else if (mode === 'jitter') {
                offset = (pseudoNoise(i, 87) - 0.5) * amp * 1.8;
            } else if (mode === 'fractal') {
                offset = Math.sin(i * freq) * amp + Math.sin(i * freq * 2) * (amp * 0.5) + Math.sin(i * freq * 4) * (amp * 0.25);
            }
            if (jitter > 0) offset += (pseudoNoise(i, 42) - 0.5) * jitter;
            return Math.round(offset);
        }

        function applyCyclicLumaBalance(pixels, w, h) {
            let strength = parseInt(tilingState.luma_balance_strength) / 100;
            if (strength <= 0) return;

            let stripW = Math.max(2, Math.floor(w * 0.08));
            let stripH = Math.max(2, Math.floor(h * 0.08));

            let lumaL = 0, lumaR = 0, countX = 0;
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < stripW; x++) {
                    let idxL = (y * w + x) * 4;
                    let idxR = (y * w + (w - 1 - x)) * 4;
                    lumaL += 0.299 * pixels[idxL] + 0.587 * pixels[idxL+1] + 0.114 * pixels[idxL+2];
                    lumaR += 0.299 * pixels[idxR] + 0.587 * pixels[idxR+1] + 0.114 * pixels[idxR+2];
                    countX++;
                }
            }
            lumaL /= countX; lumaR /= countX;

            let lumaT = 0, lumaB = 0, countY = 0;
            for (let x = 0; x < w; x++) {
                for (let y = 0; y < stripH; y++) {
                    let idxT = (y * w + x) * 4;
                    let idxB = ((h - 1 - y) * w + x) * 4;
                    lumaT += 0.299 * pixels[idxT] + 0.587 * pixels[idxT+1] + 0.114 * pixels[idxT+2];
                    lumaB += 0.299 * pixels[idxB] + 0.587 * pixels[idxB+1] + 0.114 * pixels[idxB+2];
                    countY++;
                }
            }
            lumaT /= countY; lumaB /= countY;

            for (let y = 0; y < h; y++) {
                let factorY = -Math.cos((2 * Math.PI * y) / h);
                let corrY = (lumaB - lumaT) * 0.25 * factorY * strength;

                for (let x = 0; x < w; x++) {
                    let factorX = -Math.cos((2 * Math.PI * x) / w);
                    let corrX = (lumaR - lumaL) * 0.25 * factorX * strength;
                    let corr = corrX + corrY;

                    let idx = (y * w + x) * 4;
                    for (let c = 0; c < 3; c++) {
                        pixels[idx + c] = Math.min(255, Math.max(0, pixels[idx + c] + corr));
                    }
                }
            }
        }

        function calcPixelCost(p1, p2, x, y, w, h, metric, gradW) {
            let idx = (y * w + x) * 4;
            let r1 = p1[idx], g1 = p1[idx+1], b1 = p1[idx+2];
            let r2 = p2[idx], g2 = p2[idx+1], b2 = p2[idx+2];

            let colorDist = 0;
            if (metric === 'lab') {
                let rmean = (r1 + r2) / 2;
                let dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
                colorDist = Math.sqrt((2 + rmean/256)*dr*dr + 4*dg*dg + (2 + (255-rmean)/256)*db*db);
            } else if (metric === 'rgb') {
                colorDist = Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
            } else if (metric === 'luma') {
                colorDist = Math.abs((0.299*r1 + 0.587*g1 + 0.114*b1) - (0.299*r2 + 0.587*g2 + 0.114*b2));
            }

            let gradDist = 0;
            if (gradW > 0 && x > 0 && x < w - 1 && y > 0 && y < h - 1) {
                let g1 = Math.abs(p1[idx + 4] - p1[idx - 4]) + Math.abs(p1[idx + w*4] - p1[idx - w*4]);
                let g2 = Math.abs(p2[idx + 4] - p2[idx - 4]) + Math.abs(p2[idx + w*4] - p2[idx - w*4]);
                gradDist = Math.abs(g1 - g2);
            }

            return colorDist + gradW * gradDist;
        }

        function computeDPPath(p1, p2, w, h, startOffset, bandSize, gradW, stiffness, metric, dir) {
            let steps = (dir === 'vertical') ? h : w;
            let dp = new Float32Array(steps * bandSize);
            let trace = new Int32Array(steps * bandSize);

            for (let k = 0; k < bandSize; k++) {
                let x = (dir === 'vertical') ? startOffset + k : 0;
                let y = (dir === 'vertical') ? 0 : startOffset + k;
                dp[k] = calcPixelCost(p1, p2, x, y, w, h, metric, gradW);
            }

            for (let i = 1; i < steps; i++) {
                for (let k = 0; k < bandSize; k++) {
                    let x = (dir === 'vertical') ? startOffset + k : i;
                    let y = (dir === 'vertical') ? i : startOffset + k;

                    let cost = calcPixelCost(p1, p2, x, y, w, h, metric, gradW);
                    let minPrev = dp[(i - 1) * bandSize + k];
                    let bestOffset = 0;

                    if (k > 0) {
                        let cLeft = dp[(i - 1) * bandSize + k - 1] + stiffness * 10;
                        if (cLeft < minPrev) { minPrev = cLeft; bestOffset = -1; }
                    }
                    if (k < bandSize - 1) {
                        let cRight = dp[(i - 1) * bandSize + k + 1] + stiffness * 10;
                        if (cRight < minPrev) { minPrev = cRight; bestOffset = 1; }
                    }

                    dp[i * bandSize + k] = cost + minPrev;
                    trace[i * bandSize + k] = k + bestOffset;
                }
            }

            let bestK = 0;
            let minVal = Infinity;
            for (let k = 0; k < bandSize; k++) {
                if (dp[(steps - 1) * bandSize + k] < minVal) {
                    minVal = dp[(steps - 1) * bandSize + k];
                    bestK = k;
                }
            }

            let path = new Int32Array(steps);
            path[steps - 1] = bestK;
            for (let i = steps - 1; i > 0; i--) {
                path[i - 1] = trace[i * bandSize + path[i]];
            }
            return path;
        }

        function applyOpticalDynamicSeamEngine(pixels, w, h, offX, offY) {
            let searchPct = parseInt(tilingState.seam_search) / 100;
            let gradWeight = parseFloat(tilingState.seam_grad_weight);
            let stiffness = parseFloat(tilingState.seam_stiffness);
            let metric = tilingState.seam_metric;

            let warpMode = tilingState.seam_warp_mode;
            let warpAmp = parseFloat(tilingState.seam_warp_amp);
            let warpFreq = parseFloat(tilingState.seam_warp_freq);
            let warpJitter = parseFloat(tilingState.seam_warp_jitter);

            let featherPx = parseInt(tilingState.seam_feather);
            let overlapPx = parseInt(tilingState.seam_overlap);
            let curveType = tilingState.seam_curve;
            let totalBlendSpan = featherPx + overlapPx;

            let bandW = Math.max(6, Math.floor(w * searchPct));
            let bandH = Math.max(6, Math.floor(h * searchPct));

            let refCanvas = document.createElement('canvas');
            refCanvas.width = w; refCanvas.height = h;
            let rctx = refCanvas.getContext('2d');
            rctx.drawImage(tilingOriginalCanvas, 0, 0);
            let refPixels = rctx.getImageData(0, 0, w, h).data;

            let copyPixels = new Uint8ClampedArray(pixels);

            let minX_L = Math.max(1, offX - bandW);
            let width_L = Math.max(2, offX - minX_L);
            let seamL = computeDPPath(copyPixels, refPixels, w, h, minX_L, width_L, gradWeight, stiffness, metric, 'vertical');

            let minX_R = offX;
            let width_R = Math.min(w - offX - 2, bandW);
            let seamR = computeDPPath(copyPixels, refPixels, w, h, minX_R, width_R, gradWeight, stiffness, metric, 'vertical');

            for (let y = 0; y < h; y++) {
                let wave = getWarpOffset(y, warpMode, warpAmp, warpFreq, warpJitter);
                seamL[y] = Math.max(0, Math.min(width_L - 1, seamL[y] + wave));
                seamR[y] = Math.max(0, Math.min(width_R - 1, seamR[y] - wave));
            }

            for (let y = 0; y < h; y++) {
                let cutL = minX_L + seamL[y];
                let cutR = minX_R + seamR[y];

                let xStart = Math.max(0, cutL - totalBlendSpan);
                let xEnd = Math.min(w - 1, cutR + totalBlendSpan);

                for (let x = xStart; x <= xEnd; x++) {
                    let idx = (y * w + x) * 4;
                    let alpha = 1.0;

                    if (x < cutL + totalBlendSpan) {
                        let t = (x - (cutL - totalBlendSpan)) / (2 * totalBlendSpan + 1);
                        alpha = getBlendAlpha(t, curveType, x, y);
                    } else if (x > cutR - totalBlendSpan) {
                        let t = ((cutR + totalBlendSpan) - x) / (2 * totalBlendSpan + 1);
                        alpha = getBlendAlpha(t, curveType, x, y);
                    }

                    for (let c = 0; c < 3; c++) {
                        pixels[idx + c] = pixels[idx + c] * (1 - alpha) + refPixels[idx + c] * alpha;
                    }
                }
            }

            copyPixels.set(pixels);
            let minY_T = Math.max(1, offY - bandH);
            let height_T = Math.max(2, offY - minY_T);
            let seamT = computeDPPath(copyPixels, refPixels, w, h, minY_T, height_T, gradWeight, stiffness, metric, 'horizontal');

            let minY_B = offY;
            let height_B = Math.min(h - offY - 2, bandH);
            let seamB = computeDPPath(copyPixels, refPixels, w, h, minY_B, height_B, gradWeight, stiffness, metric, 'horizontal');

            for (let x = 0; x < w; x++) {
                let wave = getWarpOffset(x, warpMode, warpAmp, warpFreq, warpJitter);
                seamT[x] = Math.max(0, Math.min(height_T - 1, seamT[x] + wave));
                seamB[x] = Math.max(0, Math.min(height_B - 1, seamB[x] - wave));
            }

            for (let x = 0; x < w; x++) {
                let cutT = minY_T + seamT[x];
                let cutB = minY_B + seamB[x];

                let yStart = Math.max(0, cutT - totalBlendSpan);
                let yEnd = Math.min(h - 1, cutB + totalBlendSpan);

                for (let y = yStart; y <= yEnd; y++) {
                    let idx = (y * w + x) * 4;
                    let alpha = 1.0;

                    if (y < cutT + totalBlendSpan) {
                        let t = (y - (cutT - totalBlendSpan)) / (2 * totalBlendSpan + 1);
                        alpha = getBlendAlpha(t, curveType, x, y);
                    } else if (y > cutB - totalBlendSpan) {
                        let t = ((cutB + totalBlendSpan) - y) / (2 * totalBlendSpan + 1);
                        alpha = getBlendAlpha(t, curveType, x, y);
                    }

                    for (let c = 0; c < 3; c++) {
                        pixels[idx + c] = pixels[idx + c] * (1 - alpha) + refPixels[idx + c] * alpha;
                    }
                }
            }

            tilingLastSeams = { seamL, seamR, seamT, seamB, minX_L, minX_R, minY_T, minY_B };
        }

        function applyCosineFeather(pixels, w, h, sx, sy) {
            let blendW = Math.floor(w * 0.15);
            let ref = new Uint8ClampedArray(pixels);
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    let dx = Math.abs(x - sx), dy = Math.abs(y - sy);
                    if (dx < blendW || dy < blendW) {
                        let idx = (y * w + x) * 4;
                        let aX = dx < blendW ? 0.5 * (1 + Math.cos(Math.PI * (dx / blendW))) : 0;
                        let aY = dy < blendW ? 0.5 * (1 + Math.cos(Math.PI * (dy / blendW))) : 0;
                        let a = Math.max(aX, aY);
                        let refIdx = (((y + sy) % h) * w + ((x + sx) % w)) * 4;
                        for (let c = 0; c < 3; c++) {
                            pixels[idx + c] = pixels[idx + c] * (1 - a) + ref[refIdx + c] * a;
                        }
                    }
                }
            }
        }

        function applyFlatField(pixels, w, h) {
            let str = parseFloat(tilingState.flat_strength);
            for (let y = 0; y < h; y++) {
                let ny = (y - h/2)/(h/2);
                for (let x = 0; x < w; x++) {
                    let nx = (x - w/2)/(w/2);
                    let idx = (y * w + x) * 4;
                    let illum = Math.max(0.2, 1.0 - (nx*nx + ny*ny) * 0.4);
                    for (let c = 0; c < 3; c++) {
                        pixels[idx + c] = Math.min(255, Math.max(0, pixels[idx + c] / (illum * str + (1 - str))));
                    }
                }
            }
        }

        function applyCyclicOffset(pctx, w, h, sx, sy) {
            let tmp = document.createElement('canvas');
            tmp.width = w; tmp.height = h;
            let tctx = tmp.getContext('2d');
            tctx.drawImage(pctx.canvas, 0, 0);

            pctx.clearRect(0, 0, w, h);
            pctx.drawImage(tmp, 0, 0, w - sx, h - sy, sx, sy, w - sx, h - sy);
            pctx.drawImage(tmp, w - sx, 0, sx, h - sy, 0, sy, sx, h - sy);
            pctx.drawImage(tmp, 0, h - sy, w - sx, sy, sx, 0, w - sx, sy);
            pctx.drawImage(tmp, w - sx, h - sy, sx, sy, 0, 0, sx, sy);
        }

        function applyToroidalPostFX(pixels, w, h) {
            let gain = parseFloat(tilingState.freq_gain);
            let rad = parseInt(tilingState.freq_radius);
            let sharp = parseFloat(tilingState.sharpen);
            let microContrast = parseFloat(tilingState.micro_contrast);
            let noise = parseFloat(tilingState.micro_noise) * 2.55;
            let noiseScale = tilingState.micro_noise_scale;

            let copy = new Uint8ClampedArray(pixels);

            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    let idx = (y * w + x) * 4;
                    for (let c = 0; c < 3; c++) {
                        let val = copy[idx + c];

                        if (gain > 1.0) {
                            let blurVal = (
                                getPixelWrapped(copy, w, h, x - rad, y, c) +
                                getPixelWrapped(copy, w, h, x + rad, y, c) +
                                getPixelWrapped(copy, w, h, x, y - rad, c) +
                                getPixelWrapped(copy, w, h, x, y + rad, c)
                            ) / 4;
                            val += (val - blurVal) * (gain - 1.0);
                        }

                        if (sharp > 0) {
                            let neighbors = (
                                getPixelWrapped(copy, w, h, x, y - 1, c) +
                                getPixelWrapped(copy, w, h, x, y + 1, c) +
                                getPixelWrapped(copy, w, h, x - 1, y, c) +
                                getPixelWrapped(copy, w, h, x + 1, y, c)
                            ) / 4;
                            val += (val - neighbors) * sharp;
                        }

                        if (microContrast !== 1.0) {
                            val = 128 + (val - 128) * microContrast;
                        }

                        if (noise > 0) {
                            let scaleFactor = noiseScale === 'fine' ? 1 : noiseScale === 'medium' ? 2 : 4;
                            let wx = Math.floor(x / scaleFactor);
                            let wy = Math.floor(y / scaleFactor);
                            let rnd = (pseudoNoise(wx, wy) - 0.5) * noise;
                            val += rnd;
                        }

                        pixels[idx + c] = Math.min(255, Math.max(0, val));
                    }
                }
            }
        }

        function enforceAdvancedToroidalGuard(pixels, w, h) {
            let guardW = parseInt(tilingState.guard_width || 16);
            let mixStr = parseInt(tilingState.guard_mix_strength || 85) / 100;
            let blendMode = tilingState.guard_blend_mode || tilingState.guard_curve || 'cosine';
            let jitterMax = parseInt(tilingState.guard_jitter || tilingState.guard_warp_amp || 8);
            let freq = parseFloat(tilingState.guard_frequency || tilingState.guard_warp_freq || 0.08);
            let preserveDetail = parseInt(tilingState.guard_detail_preserve || 70) / 100;

            let copy = new Uint8ClampedArray(pixels);

            // 1. Left-Right Boundary Blend
            for (let y = 0; y < h; y++) {
                let wave = Math.sin(y * freq) * jitterMax + (pseudoNoise(y, 19) - 0.5) * jitterMax;
                let effGuardW = Math.max(2, Math.round(guardW + wave));

                for (let x = 0; x < effGuardW; x++) {
                    let idxL = (y * w + x) * 4;
                    let idxR = (y * w + (w - 1 - x)) * 4;

                    let normT = x / effGuardW;
                    let alphaCurve = getBlendAlpha(1 - normT, blendMode, x, y);
                    let factor = 0.5 * alphaCurve * mixStr;

                    for (let c = 0; c < 3; c++) {
                        let valL = copy[idxL + c];
                        let valR = copy[idxR + c];

                        let newL = valL * (1 - factor) + valR * factor;
                        let newR = valR * (1 - factor) + valL * factor;

                        if (preserveDetail > 0) {
                            let detailL = valL - ((getPixelWrapped(copy, w, h, x-1, y, c) + getPixelWrapped(copy, w, h, x+1, y, c)) / 2);
                            let detailR = valR - ((getPixelWrapped(copy, w, h, w-1-x-1, y, c) + getPixelWrapped(copy, w, h, w-1-x+1, y, c)) / 2);
                            newL += detailL * preserveDetail * (1 - factor);
                            newR += detailR * preserveDetail * (1 - factor);
                        }

                        pixels[idxL + c] = Math.min(255, Math.max(0, Math.round(newL)));
                        pixels[idxR + c] = Math.min(255, Math.max(0, Math.round(newR)));
                    }
                }
            }

            copy.set(pixels);

            // 2. Top-Bottom Boundary Blend
            for (let x = 0; x < w; x++) {
                let wave = Math.sin(x * freq) * jitterMax + (pseudoNoise(x, 73) - 0.5) * jitterMax;
                let effGuardH = Math.max(2, Math.round(guardW + wave));

                for (let y = 0; y < effGuardH; y++) {
                    let idxT = (y * w + x) * 4;
                    let idxB = ((h - 1 - y) * w + x) * 4;

                    let normT = y / effGuardH;
                    let alphaCurve = getBlendAlpha(1 - normT, blendMode, x, y);
                    let factor = 0.5 * alphaCurve * mixStr;

                    for (let c = 0; c < 3; c++) {
                        let valT = copy[idxT + c];
                        let valB = copy[idxB + c];

                        let newT = valT * (1 - factor) + valB * factor;
                        let newB = valB * (1 - factor) + valT * factor;

                        if (preserveDetail > 0) {
                            let detailT = valT - ((getPixelWrapped(copy, w, h, x, y-1, c) + getPixelWrapped(copy, w, h, x, y+1, c)) / 2);
                            let detailB = valB - ((getPixelWrapped(copy, w, h, x, h-1-y-1, c) + getPixelWrapped(copy, w, h, x, h-1-y+1, c)) / 2);
                            newT += detailT * preserveDetail * (1 - factor);
                            newB += detailB * preserveDetail * (1 - factor);
                        }

                        pixels[idxT + c] = Math.min(255, Math.max(0, Math.round(newT)));
                        pixels[idxB + c] = Math.min(255, Math.max(0, Math.round(newB)));
                    }
                }
            }

            // 3. Toroidal Boundary Seam Edge Blur
            let guardBlurRad = parseInt(tilingState.guard_blur_radius || 0);
            if (guardBlurRad > 0) {
                applyToroidalBoundaryEdgeBlur(pixels, w, h, guardBlurRad);
            }
        }

        function applyToroidalBoundaryEdgeBlur(pixels, w, h, blurRadius) {
            if (blurRadius <= 0) return;
            let copy = new Uint8ClampedArray(pixels);
            let rad = Math.min(25, Math.round(blurRadius));

            function getBlurredVal(x, y, c) {
                let sum = 0, count = 0;
                let step = Math.max(1, Math.floor(rad / 4));
                for (let dy = -rad; dy <= rad; dy += step) {
                    for (let dx = -rad; dx <= rad; dx += step) {
                        let wx = (x + dx + w) % w;
                        let wy = (y + dy + h) % h;
                        sum += copy[(wy * w + wx) * 4 + c];
                        count++;
                    }
                }
                return count > 0 ? sum / count : copy[(y * w + x) * 4 + c];
            }

            for (let y = 0; y < h; y++) {
                for (let dx = 0; dx <= rad; dx++) {
                    let alpha = (1 - dx / (rad + 1)) * 0.6;
                    let idxL = (y * w + dx) * 4;
                    let idxR = (y * w + (w - 1 - dx)) * 4;
                    for (let c = 0; c < 3; c++) {
                        let blurL = getBlurredVal(dx, y, c);
                        pixels[idxL + c] = Math.round(pixels[idxL + c] * (1 - alpha) + blurL * alpha);
                        let blurR = getBlurredVal(w - 1 - dx, y, c);
                        pixels[idxR + c] = Math.round(pixels[idxR + c] * (1 - alpha) + blurR * alpha);
                    }
                }
            }

            for (let x = 0; x < w; x++) {
                for (let dy = 0; dy <= rad; dy++) {
                    let alpha = (1 - dy / (rad + 1)) * 0.6;
                    let idxT = (dy * w + x) * 4;
                    let idxB = ((h - 1 - dy) * w + x) * 4;
                    for (let c = 0; c < 3; c++) {
                        let blurT = getBlurredVal(x, dy, c);
                        pixels[idxT + c] = Math.round(pixels[idxT + c] * (1 - alpha) + blurT * alpha);
                        let blurB = getBlurredVal(x, h - 1 - dy, c);
                        pixels[idxB + c] = Math.round(pixels[idxB + c] * (1 - alpha) + blurB * alpha);
                    }
                }
            }
        }

        function drawDebugSeams(pctx, w, h) {
            let s = tilingLastSeams;
            if (!s) return;
            pctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
            for (let y = 0; y < h; y++) {
                pctx.fillRect(s.minX_L + s.seamL[y], y, 2, 1);
                pctx.fillRect(s.minX_R + s.seamR[y], y, 2, 1);
            }
            pctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
            for (let x = 0; x < w; x++) {
                pctx.fillRect(x, s.minY_T + s.seamT[x], 1, 2);
                pctx.fillRect(x, s.minY_B + s.seamB[x], 1, 2);
            }
        }

        function applyTilingStamp(tx, ty, sx, sy) {
            if (!tilingProcessedCanvas) return;
            let pctx = tilingProcessedCanvas.getContext('2d');
            let w = tilingProcessedCanvas.width;
            let h = tilingProcessedCanvas.height;
            if (w <= 0 || h <= 0) return;

            ensureTilingStampCanvas(w, h);
            let sctx = tilingStampCanvas.getContext('2d');

            let size = parseInt(tilingState.stamp_size);
            let opacity = parseInt(tilingState.stamp_opacity) / 100;
            let softness = parseInt(tilingState.stamp_softness) / 100;

            let baseTx = (Math.floor(tx) % w + w) % w;
            let baseTy = (Math.floor(ty) % h + h) % h;
            let baseSx = (Math.floor(sx) % w + w) % w;
            let baseSy = (Math.floor(sy) % h + h) % h;

            if (tilingState.stamp_mode === 'erase') {
                let tempCanvas = document.createElement('canvas');
                tempCanvas.width = size * 2;
                tempCanvas.height = size * 2;
                let tCtx = tempCanvas.getContext('2d');

                let grad = tCtx.createRadialGradient(size, size, Math.max(0.1, size * (1 - softness)), size, size, size);
                grad.addColorStop(0, `rgba(0, 0, 0, ${opacity})`);
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                tCtx.fillStyle = grad;
                tCtx.beginPath();
                tCtx.arc(size, size, size, 0, Math.PI * 2);
                tCtx.fill();

                sctx.save();
                sctx.globalCompositeOperation = 'destination-out';
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        let dx = baseTx - size + i * w;
                        let dy = baseTy - size + j * h;
                        sctx.drawImage(tempCanvas, dx, dy);
                    }
                }
                sctx.restore();
                runTilingPipeline();
                return;
            }

            let tempCanvas = document.createElement('canvas');
            tempCanvas.width = size * 2;
            tempCanvas.height = size * 2;
            let tCtx = tempCanvas.getContext('2d');

            tCtx.save();
            tCtx.translate(size - baseSx, size - baseSy);
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    tCtx.drawImage(tilingProcessedCanvas, i * w, j * h);
                }
            }
            tCtx.restore();

            tCtx.globalCompositeOperation = 'destination-in';
            let grad = tCtx.createRadialGradient(size, size, Math.max(0.1, size * (1 - softness)), size, size, size);
            grad.addColorStop(0, 'rgba(0,0,0,1)');
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            tCtx.fillStyle = grad;
            tCtx.beginPath();
            tCtx.arc(size, size, size, 0, Math.PI * 2);
            tCtx.fill();

            pctx.globalAlpha = opacity;
            sctx.globalAlpha = opacity;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let dx = baseTx - size + i * w;
                    let dy = baseTy - size + j * h;
                    pctx.drawImage(tempCanvas, dx, dy);
                    sctx.drawImage(tempCanvas, dx, dy);
                }
            }
            pctx.globalAlpha = 1.0;
            sctx.globalAlpha = 1.0;
        }

        function applyTilingMaskBrush(tx, ty) {
            if (!tilingOriginalCanvas) return;
            let w = tilingOriginalCanvas.width;
            let h = tilingOriginalCanvas.height;
            if (w <= 0 || h <= 0) return;

            ensureTilingMaskCanvas(w, h);
            let mctx = tilingMaskCanvas.getContext('2d');

            let size = parseInt(tilingState.mask_brush_size || 30);
            let opacity = parseInt(tilingState.mask_brush_opacity || 80) / 100;
            let softness = parseInt(tilingState.mask_brush_softness || 60) / 100;
            let mode = tilingState.mask_brush_mode || 'erase_seam';

            let baseTx = (Math.floor(tx) % w + w) % w;
            let baseTy = (Math.floor(ty) % h + h) % h;

            let tempCanvas = document.createElement('canvas');
            tempCanvas.width = size * 2;
            tempCanvas.height = size * 2;
            let tCtx = tempCanvas.getContext('2d');

            let grad = tCtx.createRadialGradient(size, size, Math.max(0.1, size * (1 - softness)), size, size, size);
            grad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            tCtx.fillStyle = grad;
            tCtx.beginPath();
            tCtx.arc(size, size, size, 0, Math.PI * 2);
            tCtx.fill();

            mctx.save();
            if (mode === 'erase_seam') {
                mctx.globalCompositeOperation = 'source-over';
            } else {
                mctx.globalCompositeOperation = 'destination-out';
            }

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let dx = baseTx - size + i * w;
                    let dy = baseTy - size + j * h;
                    mctx.drawImage(tempCanvas, dx, dy);
                }
            }
            mctx.restore();
        }

        function applySeamEdgeBlur(pixels, w, h, blurRadius) {
            if (blurRadius <= 0 || !tilingLastSeams) return;
            let s = tilingLastSeams;
            let copy = new Uint8ClampedArray(pixels);
            let rad = Math.min(25, Math.round(blurRadius));

            function getBlurredVal(x, y, c) {
                let sum = 0, count = 0;
                let step = Math.max(1, Math.floor(rad / 4));
                for (let dy = -rad; dy <= rad; dy += step) {
                    for (let dx = -rad; dx <= rad; dx += step) {
                        let wx = (x + dx % w + w) % w;
                        let wy = (y + dy % h + h) % h;
                        sum += copy[(wy * w + wx) * 4 + c];
                        count++;
                    }
                }
                return count > 0 ? sum / count : copy[(y * w + x) * 4 + c];
            }

            for (let y = 0; y < h; y++) {
                let cutL = s.minX_L + (s.seamL[y] || 0);
                let cutR = s.minX_R + (s.seamR[y] || 0);

                for (let dx = -rad; dx <= rad; dx++) {
                    let xL = (cutL + dx + w) % w;
                    let dist = Math.abs(dx) / (rad || 1);
                    let alpha = Math.max(0, 1 - dist) * 0.7;
                    let idxL = (y * w + xL) * 4;
                    for (let c = 0; c < 3; c++) {
                        let blurV = getBlurredVal(xL, y, c);
                        pixels[idxL + c] = Math.round(pixels[idxL + c] * (1 - alpha) + blurV * alpha);
                    }

                    let xR = (cutR + dx + w) % w;
                    let idxR = (y * w + xR) * 4;
                    for (let c = 0; c < 3; c++) {
                        let blurV = getBlurredVal(xR, y, c);
                        pixels[idxR + c] = Math.round(pixels[idxR + c] * (1 - alpha) + blurV * alpha);
                    }
                }
            }

            for (let x = 0; x < w; x++) {
                let cutT = s.minY_T + (s.seamT[x] || 0);
                let cutB = s.minY_B + (s.seamB[x] || 0);

                for (let dy = -rad; dy <= rad; dy++) {
                    let yT = (cutT + dy + h) % h;
                    let dist = Math.abs(dy) / (rad || 1);
                    let alpha = Math.max(0, 1 - dist) * 0.7;
                    let idxT = (yT * w + x) * 4;
                    for (let c = 0; c < 3; c++) {
                        let blurV = getBlurredVal(x, yT, c);
                        pixels[idxT + c] = Math.round(pixels[idxT + c] * (1 - alpha) + blurV * alpha);
                    }

                    let yB = (cutB + dy + h) % h;
                    let idxB = (yB * w + x) * 4;
                    for (let c = 0; c < 3; c++) {
                        let blurV = getBlurredVal(x, yB, c);
                        pixels[idxB + c] = Math.round(pixels[idxB + c] * (1 - alpha) + blurV * alpha);
                    }
                }
            }
        }

        function runTilingPipeline() {
            if (!tilingState.hasImage || !tilingOriginalCanvas) return;
            let t0 = performance.now();
            let w = tilingOriginalCanvas.width;
            let h = tilingOriginalCanvas.height;
            if (w <= 0 || h <= 0) return;

            if (!tilingProcessedCanvas) {
                tilingProcessedCanvas = document.createElement('canvas');
            }
            tilingProcessedCanvas.width = w;
            tilingProcessedCanvas.height = h;

            let pctx = tilingProcessedCanvas.getContext('2d');
            pctx.drawImage(tilingOriginalCanvas, 0, 0);

            let imgData = pctx.getImageData(0, 0, w, h);
            let pixels = imgData.data;

            if (tilingState.luma_balance_enable) {
                applyCyclicLumaBalance(pixels, w, h);
            }

            if (tilingState.flat_enable) {
                applyFlatField(pixels, w, h);
            }

            pctx.putImageData(imgData, 0, 0);

            let offX = Math.floor(w * (parseInt(tilingState.offset_x) / 100));
            let offY = Math.floor(h * (parseInt(tilingState.offset_y) / 100));
            applyCyclicOffset(pctx, w, h, offX, offY);

            imgData = pctx.getImageData(0, 0, w, h);
            pixels = imgData.data;

            let algo = tilingState.seam_algo;
            if (algo.startsWith('dp')) {
                applyOpticalDynamicSeamEngine(pixels, w, h, offX, offY);
            } else {
                applyCosineFeather(pixels, w, h, offX, offY);
            }

            if (tilingState.seam_blur_radius > 0) {
                applySeamEdgeBlur(pixels, w, h, parseInt(tilingState.seam_blur_radius));
            }

            applyToroidalPostFX(pixels, w, h);

            if (tilingState.guard_enable) {
                enforceAdvancedToroidalGuard(pixels, w, h);
            }

            pctx.putImageData(imgData, 0, 0);

            if (tilingMaskCanvas && tilingMaskCanvas.width === w && tilingMaskCanvas.height === h) {
                let maskTemp = document.createElement('canvas');
                maskTemp.width = w; maskTemp.height = h;
                let mctx = maskTemp.getContext('2d');
                mctx.drawImage(tilingOriginalCanvas, 0, 0);
                mctx.globalCompositeOperation = 'destination-in';
                mctx.drawImage(tilingMaskCanvas, 0, 0);

                pctx.drawImage(maskTemp, 0, 0);
            }

            if (tilingStampCanvas && tilingStampCanvas.width === w && tilingStampCanvas.height === h) {
                pctx.drawImage(tilingStampCanvas, 0, 0);
            }

            if (tilingState.showSeams && tilingLastSeams) {
                drawDebugSeams(pctx, w, h);
            }

            let t1 = performance.now();
            let badge = $('tilingStatusBadge');
            if (badge) badge.innerText = `Оброблено за ${(t1 - t0).toFixed(1)} мс`;

            if (currentTab === 'tiling') {
                renderTilingView();
            }
        }

        function renderTilingView() {
            if (!canvas) return;
            let cx = canvas.getContext('2d');
            if (!tilingProcessedCanvas || !tilingState.hasImage) {
                canvas.width = canvasResolution;
                canvas.height = canvasResolution;
                cx.fillStyle = '#0f0f11';
                cx.fillRect(0, 0, canvas.width, canvas.height);
                cx.fillStyle = '#9ca3af';
                cx.font = '14px sans-serif';
                cx.textAlign = 'center';
                cx.fillText('Немає текстури для тайлінгу. Отримайте з проєкту або завантажте.', canvas.width/2, canvas.height/2);
                return;
            }

            let w = tilingProcessedCanvas.width;
            let h = tilingProcessedCanvas.height;
            let m = tilingState.currentViewMode;
            let showGrid = tilingState.showGrid;

            if (m === 'single') {
                canvas.width = w; canvas.height = h;
                cx.drawImage(tilingProcessedCanvas, 0, 0);
            } else if (m === 'original') {
                canvas.width = tilingOriginalCanvas.width; canvas.height = tilingOriginalCanvas.height;
                cx.drawImage(tilingOriginalCanvas, 0, 0);
            } else if (m === 'tiled') {
                canvas.width = w * 2; canvas.height = h * 2;
                cx.drawImage(tilingProcessedCanvas, 0, 0, w, h);
                cx.drawImage(tilingProcessedCanvas, w, 0, w, h);
                cx.drawImage(tilingProcessedCanvas, 0, h, w, h);
                cx.drawImage(tilingProcessedCanvas, w, h, w, h);

                if (showGrid) {
                    cx.strokeStyle = 'rgba(59, 130, 246, 0.8)'; cx.lineWidth = 2;
                    cx.beginPath();
                    cx.moveTo(w, 0); cx.lineTo(w, h * 2); cx.moveTo(0, h); cx.lineTo(w * 2, h);
                    cx.stroke();
                }
            } else if (m === 'tiled3') {
                canvas.width = w * 3; canvas.height = h * 3;
                for (let r = 0; r < 3; r++) {
                    for (let c = 0; c < 3; c++) {
                        cx.drawImage(tilingProcessedCanvas, c * w, r * h, w, h);
                    }
                }
                if (showGrid) {
                    cx.strokeStyle = 'rgba(59, 130, 246, 0.8)'; cx.lineWidth = 2;
                    cx.beginPath();
                    cx.moveTo(w, 0); cx.lineTo(w, h * 3); cx.moveTo(w * 2, 0); cx.lineTo(w * 2, h * 3);
                    cx.moveTo(0, h); cx.lineTo(w * 3, h); cx.moveTo(0, h * 2); cx.lineTo(w * 3, h * 2);
                    cx.stroke();
                }
            }

            if ($('resolutionInfo')) {
                $('resolutionInfo').textContent = `${w} × ${h} (Тайлінг ${m})`;
            }

            if ((tilingState.stamp_enable || tilingState.mask_brush_enable) && m !== 'original') {
                let size = tilingState.stamp_enable ? parseInt(tilingState.stamp_size) : parseInt(tilingState.mask_brush_size);

                if (stampCursorX > -9999) {
                    cx.beginPath();
                    cx.arc(stampCursorX, stampCursorY, size, 0, Math.PI * 2);
                    let color = tilingState.mask_brush_enable ? 'rgba(168, 85, 247, 0.9)' : (tilingState.stamp_mode === 'erase' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(255, 255, 255, 0.9)');
                    cx.strokeStyle = color;
                    cx.lineWidth = 1.5;
                    cx.stroke();
                    cx.beginPath();
                    cx.arc(stampCursorX, stampCursorY, size, 0, Math.PI * 2);
                    cx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
                    cx.lineWidth = 1;
                    cx.setLineDash([4, 4]);
                    cx.stroke();
                    cx.setLineDash([]);
                }

                if (tilingState.stamp_enable && stampSource && tilingState.stamp_mode !== 'erase') {
                    let sX = stampSource.x;
                    let sY = stampSource.y;

                    cx.beginPath();
                    cx.arc(sX, sY, size, 0, Math.PI * 2);
                    cx.strokeStyle = 'rgba(16, 185, 129, 0.9)';
                    cx.lineWidth = 1.5;
                    cx.stroke();

                    cx.beginPath();
                    cx.moveTo(sX - 4, sY); cx.lineTo(sX + 4, sY);
                    cx.moveTo(sX, sY - 4); cx.lineTo(sX, sY + 4);
                    cx.stroke();
                }
            }
        }

        function renderTilingPanel() {
            let t = tilingState;
            let acc = t.accordions;
            let toggleAcc = (key) => `onclick="toggleTilingAccordion('${key}')"`;
            let isAccOpen = (key) => acc[key] ? 'show' : '';
            let isAccChev = (key) => acc[key] ? 'open' : '';

            let panel = $('propertiesPanel');
            if (!panel) return;

            panel.innerHTML = `
                <div class="property-group" style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                    <button onclick="captureProjectToTiling()" class="btn btn-primary" style="font-size:11px; padding:6px 4px;" title="Захопити результат з поточного проєкту">📸 З проєкту</button>
                    <button onclick="$('tilingImageInput').click()" class="btn btn-secondary" style="font-size:11px; padding:6px 4px;" title="Завантажити власне фото для тайлінгу">📂 Завантажити</button>
                    <button onclick="applyTilingToLayer()" class="btn btn-secondary" style="font-size:11px; padding:6px 4px;" title="Створити новий Paint шар з цим безшовним талом">🎨 У новий шар</button>
                    <button onclick="openTilingExportModal()" class="btn btn-success" style="font-size:11px; padding:6px 4px;" title="Зберегти PNG зображення">💾 Зберегти PNG</button>
                </div>

                <div class="property-group" style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                    <button type="button" class="btn btn-secondary" onclick="undo()" style="font-size:11px;" ${historyIndex <= 0 ? 'disabled' : ''}>↩ Скасувати (Undo)</button>
                    <button type="button" class="btn btn-secondary" onclick="redo()" style="font-size:11px;" ${historyIndex >= history.length - 1 ? 'disabled' : ''}>↪ Повторити (Redo)</button>
                </div>

                <div class="property-group">
                    <button onclick="resetTilingToDefaults()" class="btn btn-secondary" style="width:100%; font-size:11px;" title="Скинути всі налаштування тайлінгу">🔄 Скинути параметри тайлінгу</button>
                    <div style="font-size:11px; color:var(--text-muted, #a1a1aa); margin-top:4px; text-align:center;">
                        Експериментальна функція.<br>Функція може працювати дивно.
                    </div>
                </div>

                <hr>

                <div class="sidebar-section">
                    <div class="section-title">📦 Професійні Пресети</div>
                    <div class="control-group">
                        <select id="presetSelect" onchange="applyTilingPreset(this.value)" class="form-control">
                            <option value="organic" ${t.preset==='organic'?'selected':''}>Органіка (Камінь, Земля, Трава)</option>
                            <option value="pattern" ${t.preset==='pattern'?'selected':''}>Геометрія / Плитка / Бруківка</option>
                            <option value="wood" ${t.preset==='wood'?'selected':''}>Дерево / Текстиль</option>
                            <option value="micro" ${t.preset==='micro'?'selected':''}>Максимальні деталі (Micro-Highpass)</option>
                        </select>
                    </div>
                </div>

                <hr>

                <div class="sidebar-section">
                    <div class="section-title">👁️ Режим перегляду</div>
                    <div class="gen-grid" style="grid-template-columns:repeat(4,1fr); gap:4px; margin-bottom:8px;">
                        <button class="gen-btn ${t.currentViewMode==='single'?'active':''}" onclick="setViewModeTiling('single')">1x1</button>
                        <button class="gen-btn ${t.currentViewMode==='tiled'?'active':''}" onclick="setViewModeTiling('tiled')">2x2 Grid</button>
                        <button class="gen-btn ${t.currentViewMode==='tiled3'?'active':''}" onclick="setViewModeTiling('tiled3')">3x3 Grid</button>
                        <button class="gen-btn ${t.currentViewMode==='original'?'active':''}" onclick="setViewModeTiling('original')">Оригінал</button>
                    </div>
                    <div class="toggle-row">
                        <span style="font-size:11px;">📐 Лінії сітки:</span>
                        <label class="switch"><input type="checkbox" ${t.showGrid?'checked':''} onchange="tilingState.showGrid=this.checked; renderTilingView();"><span class="slider"></span></label>
                    </div>
                    <div id="tilingStatusBadge" style="font-size:10px; color:var(--accent-green, #10b981); font-family:monospace; margin-top:4px;">
                        ${t.hasImage ? 'Готовий' : 'Очікування зображення...'}
                    </div>
                </div>

                <hr>

                <!-- 1. ШТАМП -->
                <div class="sidebar-section" style="background-color: rgba(6, 182, 212, 0.08); padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('stamp')}>
                        <span class="section-title" style="color: #06b6d4; margin:0; border:none;"><span class="algo-badge" style="background: rgba(6, 182, 212, 0.2); color: #06b6d4;">🖌️ STAMP</span> Інструмент Штамп</span>
                        <span class="chevron ${isAccChev('stamp')}" id="acc_tiling_stamp_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('stamp')}" id="acc_tiling_stamp">
                        <div class="toggle-row" style="margin-bottom: 6px;">
                            <span style="font-weight: 600;">Увімкнути Штамп</span>
                            <label class="switch"><input type="checkbox" id="stamp_enable" ${t.stamp_enable?'checked':''} onchange="toggleTilingStamp(this.checked)"><span class="slider"></span></label>
                        </div>

                        <div class="control-group" style="margin-bottom:8px;">
                            <label class="control-label">Режим штампу:</label>
                            <div class="gen-grid" style="grid-template-columns: 1fr 1fr; gap: 4px;">
                                <button type="button" class="gen-btn ${t.stamp_mode !== 'erase' ? 'active' : ''}" onclick="tilingState.stamp_mode='clone'; renderTilingPanel();">🎯 Клон (Clone)</button>
                                <button type="button" class="gen-btn ${t.stamp_mode === 'erase' ? 'active' : ''}" onclick="tilingState.stamp_mode='erase'; renderTilingPanel();">🧹 Стерти (Eraser)</button>
                            </div>
                        </div>

                        ${t.stamp_mode !== 'erase' ? `
                            <div class="toggle-row" style="margin-bottom: 8px;">
                                <span style="font-size:11px;">Переміщати джерело (Aligned):</span>
                                <label class="switch"><input type="checkbox" ${t.stamp_aligned?'checked':''} onchange="tilingState.stamp_aligned=this.checked; renderTilingPanel();"><span class="slider"></span></label>
                            </div>

                            <button onclick="toggleSelectingStampSource()" class="btn ${selectingStampSource ? 'btn-primary' : 'btn-secondary'}" style="width:100%; margin-bottom:8px; font-size:11px; padding:6px 8px; display:flex; align-items:center; justify-content:center; gap:6px;">
                                <span>🎯</span>
                                <span>${selectingStampSource ? 'Клікніть на полотні для вибору точки' : 'Обрати точку джерела (зразка)'}</span>
                            </button>

                            ${selectingStampSource ? `
                                <div style="background: rgba(6, 182, 212, 0.2); color: #06b6d4; font-size:11px; padding:6px; border-radius:4px; margin-bottom:8px; text-align:center; font-weight:600;">
                                    👉 Торкніться або клікніть у будь-якому місці текстури, щоб встановити маркер зразка.
                                </div>
                            ` : `
                                <div class="hint-text" style="margin-bottom:8px;">
                                    <b>Підказка:</b> Натисніть кнопку вище або затисніть <b>SHIFT / ALT</b> і торкніться полотна.
                                </div>
                            `}
                        ` : ''}

                        ${tilingSlider("Розмір пензля", "stamp_size", 5, 200, 1, "px", 30)}
                        ${tilingSlider("Непрозорість", "stamp_opacity", 1, 100, 1, "%", 80)}
                        ${tilingSlider("М'якість країв", "stamp_softness", 0, 100, 1, "%", 60)}

                        <button type="button" class="btn btn-secondary" style="width:100%; margin-top:8px; color:#ef4444; border-color:rgba(239,68,68,0.3); font-size:11px;" onclick="clearTilingStampCanvas(); runTilingPipeline(); commitHistorySnapshot();">🗑️ Очистити штрихи штампу</button>
                    </div>
                </div>

                <!-- 1b. ТАЙЛІНГ СТЕРТИ / ВІДНОВИТИ -->
                <div class="sidebar-section" style="background-color: rgba(168, 85, 247, 0.08); padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('mask')}>
                        <span class="section-title" style="color: #a855f7; margin:0; border:none;"><span class="algo-badge" style="background: rgba(168, 85, 247, 0.2); color: #a855f7;">✨ MASK</span> Стерти / Відновити стики</span>
                        <span class="chevron ${isAccChev('mask')}" id="acc_tiling_mask_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('mask')}" id="acc_tiling_mask">
                        <div class="toggle-row" style="margin-bottom: 6px;">
                            <span style="font-weight: 600;">Увімкнути Пензель стиків</span>
                            <label class="switch"><input type="checkbox" id="mask_brush_enable" ${t.mask_brush_enable?'checked':''} onchange="toggleTilingMaskBrush(this.checked)"><span class="slider"></span></label>
                        </div>
                        <div class="control-group" style="margin-bottom:8px;">
                            <label class="control-label">Дія пензля:</label>
                            <div class="gen-grid" style="grid-template-columns: 1fr 1fr; gap: 4px;">
                                <button type="button" class="gen-btn ${t.mask_brush_mode==='erase_seam'?'active':''}" onclick="tilingState.mask_brush_mode='erase_seam'; renderTilingPanel();">👁️ Проявити нижні (Стерти стик)</button>
                                <button type="button" class="gen-btn ${t.mask_brush_mode==='restore_seam'?'active':''}" onclick="tilingState.mask_brush_mode='restore_seam'; renderTilingPanel();">🛡️ Перекрити (Відновити тайл)</button>
                            </div>
                        </div>
                        ${tilingSlider("Розмір пензля", "mask_brush_size", 5, 200, 1, "px", 30)}
                        ${tilingSlider("Непрозорість", "mask_brush_opacity", 1, 100, 1, "%", 80)}
                        ${tilingSlider("М'якість країв", "mask_brush_softness", 0, 100, 1, "%", 60)}
                        <button type="button" class="btn btn-secondary" style="width:100%; margin-top:8px; color:#ef4444; border-color:rgba(239,68,68,0.3); font-size:11px;" onclick="clearTilingMaskCanvas(); runTilingPipeline(); commitHistorySnapshot();">🗑️ Очистити маску стиків</button>
                    </div>
                </div>

                <!-- 2. TOROIDAL GUARD v9.0 -->
                <div class="sidebar-section" style="background-color: rgba(16, 185, 129, 0.08); padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('guard')}>
                        <span class="section-title" style="color: #10b981; margin:0; border:none;"><span class="algo-badge" style="background: rgba(16, 185, 129, 0.2); color: #10b981;">★ ADVANCED</span> Toroidal Guard v9.0</span>
                        <span class="chevron ${isAccChev('guard')}" id="acc_tiling_guard_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('guard')}" id="acc_tiling_guard">
                        <div class="toggle-row">
                            <span>Гарантія безшовності стиків</span>
                            <label class="switch"><input type="checkbox" ${t.guard_enable?'checked':''} onchange="tilingState.guard_enable=this.checked; runTilingPipeline();"><span class="slider"></span></label>
                        </div>
                        ${tilingSlider("Ширина зони", "guard_width", 2, 60, 1, "px", 16)}
                        ${tilingSlider("Сила змішування", "guard_mix_strength", 0, 100, 1, "%", 85)}
                        <div class="control-group">
                            <label class="control-label">Алгоритм генерації стиків країв:</label>
                            <select class="form-control" onchange="tilingState.guard_seam_algo=this.value; runTilingPipeline();">
                                <option value="dp_mincost" ${t.guard_seam_algo==='dp_mincost'?'selected':''}>DP Dual-Cut Graph (Мінімальна вартість)</option>
                                <option value="cosine" ${t.guard_seam_algo==='cosine'?'selected':''}>Cosine Feather (Плавне згасання)</option>
                                <option value="smoothstep" ${t.guard_seam_algo==='smoothstep'?'selected':''}>Smoothstep S-Curve</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label class="control-label">Метрика кольору країв:</label>
                            <select class="form-control" onchange="tilingState.guard_seam_metric=this.value; runTilingPipeline();">
                                <option value="lab" ${t.guard_seam_metric==='lab'?'selected':''}>CIELAB Perceptual (Перцептивна)</option>
                                <option value="rgb" ${t.guard_seam_metric==='rgb'?'selected':''}>RGB Euclidean</option>
                                <option value="sobel" ${t.guard_seam_metric==='sobel'?'selected':''}>Sobel Gradient (Структурні ребра)</option>
                                <option value="luma" ${t.guard_seam_metric==='luma'?'selected':''}>Luminance Only</option>
                            </select>
                        </div>
                        ${tilingSlider("Зона пошуку шва країв", "guard_search", 5, 50, 1, "px", 15)}
                        ${tilingSlider("Жорсткість лінії шва країв", "guard_stiffness", 0.1, 3.0, 0.1, "", 1.2)}
                        ${tilingSlider("Вага градієнта країв", "guard_grad_weight", 0.1, 5.0, 0.1, "", 2.0)}
                        <div class="control-group">
                            <label class="control-label">Режим деформації країв:</label>
                            <select class="form-control" onchange="tilingState.guard_warp_mode=this.value; runTilingPipeline();">
                                <option value="chaotic" ${t.guard_warp_mode==='chaotic'?'selected':''}>Chaotic Noise (Хаотична шумова)</option>
                                <option value="sine" ${t.guard_warp_mode==='sine'?'selected':''}>Sine Wave (Синусоїдальна)</option>
                                <option value="perlin" ${t.guard_warp_mode==='perlin'?'selected':''}>Perlin Noise (Фрактальна)</option>
                                <option value="stochastic" ${t.guard_warp_mode==='stochastic'?'selected':''}>Stochastic Dither (Стохастична)</option>
                                <option value="none" ${t.guard_warp_mode==='none'?'selected':''}>None (Пряма лінія)</option>
                            </select>
                        </div>
                        ${tilingSlider("Амплітуда деформації країв", "guard_warp_amp", 0, 30, 1, "px", 8)}
                        ${tilingSlider("Частота деформації країв", "guard_warp_freq", 0.01, 0.30, 0.01, "", 0.08)}
                        <div class="control-group">
                            <label class="control-label">Крива згладжування країв:</label>
                            <select class="form-control" onchange="tilingState.guard_blend_mode=this.value; runTilingPipeline();">
                                <option value="cosine" ${t.guard_blend_mode==='cosine'?'selected':''}>Cosine Feather</option>
                                <option value="sigmoid" ${t.guard_blend_mode==='sigmoid'?'selected':''}>Sigmoid S-Curve</option>
                                <option value="exponential" ${t.guard_blend_mode==='exponential'?'selected':''}>Exponential</option>
                                <option value="stochastic" ${t.guard_blend_mode==='stochastic'?'selected':''}>Stochastic Dither</option>
                                <option value="gaussian" ${t.guard_blend_mode==='gaussian'?'selected':''}>Gaussian Bell Curve</option>
                                <option value="smoothstep" ${t.guard_blend_mode==='smoothstep'?'selected':''}>Smoothstep</option>
                            </select>
                        </div>
                        ${tilingSlider("Зона перекриття країв", "guard_overlap", 2, 60, 1, "px", 14)}
                        ${tilingSlider("Згладжування стику (Feather)", "guard_feather", 0, 30, 1, "px", 8)}
                        ${tilingSlider("Розмиття країв гарантованого стику", "guard_blur_radius", 0, 30, 1, "px", 8)}
                        ${tilingSlider("Розсіювання шва (Jitter)", "guard_jitter", 0, 30, 1, "px", 8)}
                        ${tilingSlider("Частота вигину", "guard_frequency", 0.01, 0.30, 0.01, "", 0.08)}
                        ${tilingSlider("Збереження деталей", "guard_detail_preserve", 0, 100, 1, "%", 70)}
                    </div>
                </div>

                <!-- 3. OPTICAL DYNAMIC SEAM ENGINE -->
                <div class="sidebar-section" style="background-color: rgba(59, 130, 246, 0.05); padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('dp')}>
                        <span class="section-title" style="color: #3b82f6; margin:0; border:none;"><span class="algo-badge">DP</span> Optical Dynamic Seam Engine</span>
                        <span class="chevron ${isAccChev('dp')}" id="acc_tiling_dp_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('dp')}" id="acc_tiling_dp">
                        <div class="toggle-row" style="background: rgba(239, 68, 68, 0.1); padding: 4px 6px; border-radius: 4px; margin-bottom: 8px;">
                            <span style="color: #fca5a5; font-weight: 600;">🔴 Показувати лінію розрізу</span>
                            <label class="switch"><input type="checkbox" ${t.showSeams?'checked':''} onchange="tilingState.showSeams=this.checked; runTilingPipeline();"><span class="slider"></span></label>
                        </div>
                        <div class="control-group">
                            <label class="control-label">Алгоритм генерації:</label>
                            <select class="form-control" onchange="tilingState.seam_algo=this.value; runTilingPipeline();">
                                <option value="dp_mincost" ${t.seam_algo==='dp_mincost'?'selected':''}>Optical Dynamic Dual-Cut Graph (DP)</option>
                                <option value="cosine" ${t.seam_algo==='cosine'?'selected':''}>Cosine Feather Soft Crossfade</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label class="control-label">Метрика порівняння кольору:</label>
                            <select class="form-control" onchange="tilingState.seam_metric=this.value; runTilingPipeline();">
                                <option value="lab" ${t.seam_metric==='lab'?'selected':''}>CIELAB Perceptual</option>
                                <option value="rgb" ${t.seam_metric==='rgb'?'selected':''}>RGB Euclidean</option>
                                <option value="sobel" ${t.seam_metric==='sobel'?'selected':''}>Sobel Gradient Magnitude</option>
                                <option value="luma" ${t.seam_metric==='luma'?'selected':''}>Luminance / Яскравість</option>
                            </select>
                        </div>
                        ${tilingSlider("Ширина зони пошуку", "seam_search", 5, 40, 1, "%", 20)}
                        ${tilingSlider("Жорсткість шва (Stiffness)", "seam_stiffness", 0.0, 4.0, 0.1, "", 1.2)}
                        ${tilingSlider("Вага градієнта (Деталі)", "seam_grad_weight", 0.0, 5.0, 0.2, "", 2.5)}
                    </div>
                </div>

                <!-- 4. WARP FX -->
                <div class="sidebar-section" style="background-color: rgba(139, 92, 246, 0.05); padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('warp')}>
                        <span class="section-title" style="color: #8b5cf6; margin:0; border:none;"><span class="algo-badge" style="background: rgba(139, 92, 246, 0.2); color: #8b5cf6;">FX</span> Деформація Границі</span>
                        <span class="chevron ${isAccChev('warp')}" id="acc_tiling_warp_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('warp')}" id="acc_tiling_warp">
                        <div class="control-group">
                            <label class="control-label">Режим деформації шва:</label>
                            <select class="form-control" onchange="tilingState.seam_warp_mode=this.value; runTilingPipeline();">
                                <option value="chaotic" ${t.seam_warp_mode==='chaotic'?'selected':''}>🌀 Chaotic Noise</option>
                                <option value="jitter" ${t.seam_warp_mode==='jitter'?'selected':''}>⚡ Jitter / Scattered</option>
                                <option value="fractal" ${t.seam_warp_mode==='fractal'?'selected':''}>❄️ Fractal Wave</option>
                                <option value="sine" ${t.seam_warp_mode==='sine'?'selected':''}>🌊 Sinusoidal Wave</option>
                            </select>
                        </div>
                        ${tilingSlider("Амплітуда деформації", "seam_warp_amp", 0, 40, 1, "px", 10)}
                        ${tilingSlider("Частота хвилі/шуму", "seam_warp_freq", 0.01, 0.30, 0.01, "", 0.06)}
                        ${tilingSlider("Розсіювання шва", "seam_warp_jitter", 0, 20, 1, "px", 4)}
                    </div>
                </div>

                <!-- 5. MIX BLEND & FEATHER -->
                <div class="sidebar-section" style="padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('blend')}>
                        <span class="section-title" style="margin:0; border:none;"><span class="algo-badge">MIX</span> Змішування та Згладжування</span>
                        <span class="chevron ${isAccChev('blend')}" id="acc_tiling_blend_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('blend')}" id="acc_tiling_blend">
                        <div class="control-group">
                            <label class="control-label">Крива блендингу:</label>
                            <select class="form-control" onchange="tilingState.seam_curve=this.value; runTilingPipeline();">
                                <option value="sigmoid" ${t.seam_curve==='sigmoid'?'selected':''}>📉 Sigmoid S-Curve</option>
                                <option value="gaussian" ${t.seam_curve==='gaussian'?'selected':''}>🔔 Gaussian Bell Curve</option>
                                <option value="dither" ${t.seam_curve==='dither'?'selected':''}>🎲 Dithered Stochastic Mask</option>
                                <option value="cosine" ${t.seam_curve==='cosine'?'selected':''}>〰️ Cosine Feather</option>
                                <option value="smoothstep" ${t.seam_curve==='smoothstep'?'selected':''}>S-Smoothstep</option>
                            </select>
                        </div>
                        ${tilingSlider("Розмиття країв шва (Edge Blur)", "seam_blur_radius", 0, 50, 1, "px", 12)}
                        ${tilingSlider("Згладжування стику (Feather)", "seam_feather", 0, 100, 1, "px", 8)}
                        ${tilingSlider("Зона перекриття (Overlap)", "seam_overlap", 0, 100, 1, "px", 14)}
                    </div>
                </div>

                <!-- 6. LUMA BALANCE -->
                <div class="sidebar-section" style="background-color: rgba(245, 158, 11, 0.05); padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('luma')}>
                        <span class="section-title" style="color: #f59e0b; margin:0; border:none;"><span class="algo-badge" style="background: rgba(245, 158, 11, 0.2); color: #f59e0b;">LUMA</span> Вирівнювання Яскравості</span>
                        <span class="chevron ${isAccChev('luma')}" id="acc_tiling_luma_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('luma')}" id="acc_tiling_luma">
                        <div class="toggle-row">
                            <span>Баланс протилежних границь</span>
                            <label class="switch"><input type="checkbox" ${t.luma_balance_enable?'checked':''} onchange="tilingState.luma_balance_enable=this.checked; runTilingPipeline();"><span class="slider"></span></label>
                        </div>
                        ${tilingSlider("Сила компенсації", "luma_balance_strength", 0, 100, 1, "%", 75)}
                    </div>
                </div>

                <!-- 7. FLAT-FIELD LIGHT CORRECTION -->
                <div class="sidebar-section" style="padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('flat')}>
                        <span class="section-title" style="margin:0; border:none;"><span class="algo-badge">FLAT</span> Flat-Field Light Correction</span>
                        <span class="chevron ${isAccChev('flat')}" id="acc_tiling_flat_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('flat')}" id="acc_tiling_flat">
                        <div class="toggle-row">
                            <span>Корекція нерівності освітлення</span>
                            <label class="switch"><input type="checkbox" ${t.flat_enable?'checked':''} onchange="tilingState.flat_enable=this.checked; runTilingPipeline();"><span class="slider"></span></label>
                        </div>
                        ${tilingSlider("Сила корекції", "flat_strength", 0, 1, 0.05, "", 0.80)}
                    </div>
                </div>

                <!-- 8. CYCLIC OFFSET -->
                <div class="sidebar-section" style="padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('offset')}>
                        <span class="section-title" style="margin:0; border:none;"><span class="algo-badge">OFFSET</span> Cyclic Offset</span>
                        <span class="chevron ${isAccChev('offset')}" id="acc_tiling_offset_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('offset')}" id="acc_tiling_offset">
                        ${tilingSlider("X Offset", "offset_x", 0, 100, 1, "%", 50)}
                        ${tilingSlider("Y Offset", "offset_y", 0, 100, 1, "%", 50)}
                    </div>
                </div>

                <!-- 9. POST-FX MICRO-DETAILS -->
                <div class="sidebar-section" style="background-color: rgba(236, 72, 153, 0.05); padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('fx')}>
                        <span class="section-title" style="color: #ec4899; margin:0; border:none;"><span class="algo-badge" style="background: rgba(236, 72, 153, 0.2); color: #ec4899;">FX</span> Мікродеталі та Post-FX</span>
                        <span class="chevron ${isAccChev('fx')}" id="acc_tiling_fx_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('fx')}" id="acc_tiling_fx">
                        ${tilingSlider("High-Pass Gain", "freq_gain", 0.5, 3.0, 0.05, "", 1.30)}
                        ${tilingSlider("Радіус High-Pass", "freq_radius", 1, 10, 1, "px", 3)}
                        ${tilingSlider("Unsharp Mask (Чіткість)", "sharpen", 0, 2.0, 0.05, "", 0.40)}
                        ${tilingSlider("Локальний контраст", "micro_contrast", 0.8, 1.6, 0.05, "", 1.10)}
                        ${tilingSlider("Інтенсивність зерна", "micro_noise", 0, 15, 0.5, "%", 2.5)}
                        <div class="control-group">
                            <label class="control-label">Тип зернистості:</label>
                            <select class="form-control" onchange="tilingState.micro_noise_scale=this.value; runTilingPipeline();">
                                <option value="fine" ${t.micro_noise_scale==='fine'?'selected':''}>Fine (Дрібний пісок)</option>
                                <option value="medium" ${t.micro_noise_scale==='medium'?'selected':''}>Medium (Середнє зерно)</option>
                                <option value="coarse" ${t.micro_noise_scale==='coarse'?'selected':''}>Coarse (Шорсткість)</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;
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

        function captureTilingForHistory() {
            if (!tilingState || !tilingState.hasImage) return null;
            let stampImgData = null;
            if (tilingStampCanvas && tilingStampCanvas.width > 0 && tilingStampCanvas.height > 0) {
                let sctx = tilingStampCanvas.getContext('2d');
                stampImgData = sctx.getImageData(0, 0, tilingStampCanvas.width, tilingStampCanvas.height);
            }
            let maskImgData = null;
            if (tilingMaskCanvas && tilingMaskCanvas.width > 0 && tilingMaskCanvas.height > 0) {
                let mctx = tilingMaskCanvas.getContext('2d');
                maskImgData = mctx.getImageData(0, 0, tilingMaskCanvas.width, tilingMaskCanvas.height);
            }
            let origImgData = null;
            if (tilingOriginalCanvas && tilingOriginalCanvas.width > 0 && tilingOriginalCanvas.height > 0) {
                let octx = tilingOriginalCanvas.getContext('2d');
                origImgData = octx.getImageData(0, 0, tilingOriginalCanvas.width, tilingOriginalCanvas.height);
            }
            return {
                tilingState: JSON.parse(JSON.stringify(tilingState)),
                origImgData: origImgData,
                stampImgData: stampImgData,
                maskImgData: maskImgData
            };
        }

        function restoreTilingFromHistory(entry) {
            if (!entry || !entry.tilingData) return;
            let td = entry.tilingData;
            tilingState = JSON.parse(JSON.stringify(td.tilingState));
            if (td.origImgData) {
                if (!tilingOriginalCanvas) tilingOriginalCanvas = document.createElement('canvas');
                tilingOriginalCanvas.width = td.origImgData.width;
                tilingOriginalCanvas.height = td.origImgData.height;
                let octx = tilingOriginalCanvas.getContext('2d');
                octx.putImageData(td.origImgData, 0, 0);
            }
            if (td.stampImgData) {
                ensureTilingStampCanvas(td.stampImgData.width, td.stampImgData.height);
                let sctx = tilingStampCanvas.getContext('2d');
                sctx.putImageData(td.stampImgData, 0, 0);
            } else if (tilingStampCanvas) {
                clearTilingStampCanvas();
            }
            if (td.maskImgData) {
                ensureTilingMaskCanvas(td.maskImgData.width, td.maskImgData.height);
                let mctx = tilingMaskCanvas.getContext('2d');
                mctx.putImageData(td.maskImgData, 0, 0);
            } else if (tilingMaskCanvas) {
                clearTilingMaskCanvas();
            }
            if (tilingState.hasImage) {
                runTilingPipeline();
            }
            if (currentTab === 'tiling') {
                renderTilingPanel();
                renderTilingView();
            }
        }

        function initHistory() {
            let snap = serializeState(state);
            let paintData = capturePaintCanvasesForHistory();
            let tilingData = captureTilingForHistory();
            history = [{ snap, paintData, tilingData }];
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
            let tilingData = captureTilingForHistory();

            let prevEntry = history[historyIndex];
            if (prevEntry && prevEntry.snap === snap && JSON.stringify(prevEntry.tilingData) === JSON.stringify(tilingData)) {
                return;
            }

            history = history.slice(0, historyIndex + 1);

            let paintData = capturePaintCanvasesForHistory();
            history.push({ snap, paintData, tilingData });
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
            restoreTilingFromHistory(entry);
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
            restoreTilingFromHistory(entry);
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
                if (currentTab === 'tiling') {
                    renderTilingView();
                } else {
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
                }
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
                if (typeof v === 'boolean') {
                    state.global[k] = v;
                } else if (v === 'true' || v === 'false') {
                    state.global[k] = (v === 'true');
                } else {
                    state.global[k] = parseFloat(v);
                }
                const COORD_PARAMS = ['globalZoom', 'globalRotation', 'globalOffsetX', 'globalOffsetY', 'tileRepeatX', 'tileRepeatY', 'tileSeamOffsetX', 'tileSeamOffsetY', 'forceSeamlessSoftness', 'blur', 'blurClampEdge'];
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
                    if(['seamless','useThreshold','useLevels','useFindEdges','usePosterize','brushTool','gradType','spreadMethod','sourceMode','metric','mode','lockScale','blurClampEdge'].includes(k)) renderProps();
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

        window.applyCanvasBorderStyles = function() {
            let cv = $('canvas');
            if (!cv) return;
            cv.classList.toggle('no-border', !showCanvasBorder);
            cv.style.setProperty('--b-intensity', canvasBorderIntensity);
        };

        window.toggleCanvasBorder = function(val) {
            showCanvasBorder = val;
            try { localStorage.setItem('veil_show_canvas_border', val); } catch(e) {}
            if ($('chkCanvasBorder')) $('chkCanvasBorder').checked = val;
            applyCanvasBorderStyles();
        };

        window.setCanvasBorderIntensity = function(val) {
            let intVal = parseFloat(val) / 100;
            if (isNaN(intVal)) intVal = 1.0;
            canvasBorderIntensity = Math.max(0, Math.min(1, intVal));
            try { localStorage.setItem('veil_canvas_border_intensity', canvasBorderIntensity); } catch(e) {}
            
            if ($('borderIntensityValText')) {
                $('borderIntensityValText').innerText = Math.round(canvasBorderIntensity * 100) + '%';
            }
            if ($('rngBorderIntensity')) {
                $('rngBorderIntensity').value = Math.round(canvasBorderIntensity * 100);
            }
            
            if (canvasBorderIntensity > 0 && !showCanvasBorder) {
                toggleCanvasBorder(true);
            } else if (canvasBorderIntensity === 0 && showCanvasBorder) {
                toggleCanvasBorder(false);
            } else {
                applyCanvasBorderStyles();
            }
        };

        window.toggleBorderSliderPopover = function(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            let pop = $('borderSliderPopover');
            if (!pop) return;
            pop.classList.toggle('hidden');
        };

        document.addEventListener('click', function(evt) {
            let pop = $('borderSliderPopover');
            let wrapper = $('borderControlWrapper');
            if (pop && !pop.classList.contains('hidden') && wrapper && !wrapper.contains(evt.target)) {
                pop.classList.add('hidden');
            }
        });

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
        window.toggleSelectingStampSource = toggleSelectingStampSource;
        window.toggleCanvasBorder = toggleCanvasBorder;
        window.setCanvasBorderIntensity = setCanvasBorderIntensity;
        window.toggleBorderSliderPopover = toggleBorderSliderPopover;

        function initCanvasControlsUI() {
            if ($('chkLowRes')) $('chkLowRes').checked = lowResOnEdit;
            if ($('chkCanvasBorder')) $('chkCanvasBorder').checked = showCanvasBorder;
            if ($('rngBorderIntensity')) $('rngBorderIntensity').value = Math.round(canvasBorderIntensity * 100);
            if ($('borderIntensityValText')) $('borderIntensityValText').innerText = Math.round(canvasBorderIntensity * 100) + '%';
            applyCanvasBorderStyles();
            ['512', '1024'].forEach(r => {
                let btn = $('resBtn' + r);
                if (btn) btn.classList.toggle('active', parseInt(r) === canvasResolution);
            });
        }

        function initDragAndDrop() {
            let ghost = null;
            let activeItem = null;
            let container = null;
            let isLayer = false;
            let isWarp = false;
            let offsetX = 0;
            let offsetY = 0;

            document.addEventListener('pointerdown', (e) => {
                if (e.button !== undefined && e.button !== 0) return;
                if (e.target.closest('button, input, select, textarea, label, .reset-btn')) return;

                const card = e.target.closest('.layer-card, .warp-card');
                if (!card) return;

                isLayer = card.classList.contains('layer-card');
                isWarp = card.classList.contains('warp-card');

                container = card.parentElement;
                if (!container) return;

                activeItem = card;
                const rect = activeItem.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;

                ghost = activeItem.cloneNode(true);
                ghost.id = 'drag-ghost-clone';
                ghost.style.position = 'fixed';
                ghost.style.left = (e.clientX - offsetX) + 'px';
                ghost.style.top = (e.clientY - offsetY) + 'px';
                ghost.style.width = rect.width + 'px';
                ghost.style.height = rect.height + 'px';
                ghost.style.pointerEvents = 'none';
                ghost.style.zIndex = '999999';
                ghost.style.opacity = '0.85';
                ghost.style.boxShadow = '0 8px 24px rgba(0,0,0,0.6)';
                ghost.style.transform = 'scale(1.02)';
                ghost.style.transition = 'transform 0.05s ease';

                document.body.appendChild(ghost);
                activeItem.style.opacity = '0.35';

                const onPointerMove = (moveEvt) => {
                    if (!ghost || !activeItem) return;

                    ghost.style.left = (moveEvt.clientX - offsetX) + 'px';
                    ghost.style.top = (moveEvt.clientY - offsetY) + 'px';

                    ghost.style.display = 'none';
                    const elemBelow = document.elementFromPoint(moveEvt.clientX, moveEvt.clientY);
                    ghost.style.display = 'block';

                    if (!elemBelow) return;

                    const targetSelector = isLayer ? '.layer-card' : '.warp-card';
                    const targetItem = elemBelow.closest(targetSelector);

                    if (targetItem && targetItem !== activeItem && targetItem.parentElement === container) {
                        const targetRect = targetItem.getBoundingClientRect();
                        const targetCenterY = targetRect.top + targetRect.height / 2;

                        if (moveEvt.clientY > targetCenterY) {
                            container.insertBefore(activeItem, targetItem.nextElementSibling);
                        } else {
                            container.insertBefore(activeItem, targetItem);
                        }
                    }
                };

                const onPointerUp = () => {
                    document.removeEventListener('pointermove', onPointerMove);
                    document.removeEventListener('pointerup', onPointerUp);
                    document.removeEventListener('pointercancel', onPointerUp);

                    if (ghost && ghost.parentElement) {
                        ghost.parentElement.removeChild(ghost);
                    }
                    if (activeItem) {
                        activeItem.style.opacity = '';
                    }

                    if (isLayer && container) {
                        const layerCards = Array.from(container.querySelectorAll('.layer-card'));
                        const newLayersOrder = [];
                        layerCards.forEach(c => {
                            const layerId = c.getAttribute('data-layer-id');
                            const lay = state.layers.find(l => l.id === layerId);
                            if (lay) newLayersOrder.push(lay);
                        });
                        if (newLayersOrder.length === state.layers.length) {
                            let orderChanged = false;
                            for (let i = 0; i < state.layers.length; i++) {
                                if (state.layers[i] !== newLayersOrder[i]) {
                                    orderChanged = true;
                                    break;
                                }
                            }
                            if (orderChanged) {
                                state.layers = newLayersOrder;
                                commitHistorySnapshot();
                                renderLayers();
                                requestRender();
                            }
                        }
                    } else if (isWarp && container) {
                        const lay = state.layers.find(l => l.id === state.selectedLayerId);
                        if (lay && lay.params && lay.params.warps) {
                            const warpCards = Array.from(container.querySelectorAll('.warp-card'));
                            const newWarpsOrder = [];
                            warpCards.forEach(c => {
                                const warpIdx = parseInt(c.getAttribute('data-warp-index'));
                                if (!isNaN(warpIdx) && lay.params.warps[warpIdx]) {
                                    newWarpsOrder.push(lay.params.warps[warpIdx]);
                                }
                            });
                            if (newWarpsOrder.length === lay.params.warps.length) {
                                let orderChanged = false;
                                for (let i = 0; i < lay.params.warps.length; i++) {
                                    if (lay.params.warps[i] !== newWarpsOrder[i]) {
                                        orderChanged = true;
                                        break;
                                    }
                                }
                                if (orderChanged) {
                                    lay.params.warps = newWarpsOrder;
                                    lay.isDirty = true;
                                    commitHistorySnapshot();
                                    renderProps();
                                    requestRender();
                                }
                            }
                        }
                    }

                    ghost = null;
                    activeItem = null;
                    container = null;
                };

                document.addEventListener('pointermove', onPointerMove);
                document.addEventListener('pointerup', onPointerUp);
                document.addEventListener('pointercancel', onPointerUp);
            });
        }

        document.addEventListener('DOMContentLoaded', () => { 
            canvas=$('canvas'); 
            ctx=canvas.getContext('2d'); 
            initCanvasControlsUI();
            initDragAndDrop();

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
