/**
 * MapGeneratorTabComponent
 * Main orchestrator component for the Map Generator (PBR / Normal Map Online) tab in Veil Studio.
 * Interfaces CanvasProcessingEngine, Viewport3D, and SyncManager with Veil Studio's UI design system.
 */

import { CanvasProcessingEngine } from './canvas-processing-engine.js';
import { Viewport3D } from './viewport-3d.js';
import { SyncManager } from './sync-manager.js';

export class MapGeneratorTabComponent {
  constructor(options = {}) {
    this.options = options;

    this.syncManager = new SyncManager();
    this.viewport3D = null;

    this.activeView = '2d'; // '2d' | '3d'
    this.selectedMapType = 'normal'; // 'normal' | 'displacement' | 'ao' | 'specular' | 'diffuse'

    this.sourceImageData = null;

    // 2D Viewport Zoom & Pan State
    this.zoomScale = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.isDragging2D = false;
    this.dragStartX = 0;
    this.dragStartY = 0;

    // Quality & Fast Preview Settings
    this.targetResolution = 512; // 256 | 512 | 1024
    this.fastPreview = false;

    // Processing parameters
    this.params = {
      normal: {
        algorithm: 'sobel', // 'sobel' | 'scharr' | 'prewitt'
        strength: 2.5,
        level: 1.0,
        blur: 0,
        sharp: 0,
        invert: false,
        invertR: false,
        invertG: false,
        invertH: false
      },
      displacement: {
        contrast: 1.0,
        invert: false
      },
      ao: {
        strength: 1.8,
        level: 1.0,
        blur: 1.0,
        sharp: 0,
        range: 8,
        falloff: 'linear',
        invert: false
      },
      specular: {
        mean: 0.5,
        range: 1.0,
        falloff: 'linear',
        strength: 1.2,
        level: 1.0,
        blur: 0,
        sharp: 0,
        invert: false
      }
    };

    this.generatedMaps = {
      diffuse: null,
      normal: null,
      displacement: null,
      ao: null,
      specular: null
    };

    this.generatedImageDatas = {
      diffuse: null,
      normal: null,
      displacement: null,
      ao: null,
      specular: null
    };

    this.isProcessing = false;
    this.isInteractingWithSliders = false;
    this.sliderTimer = null;
    this.initialized = false;
  }

  /**
   * Initialize Map Generator tab integration
   */
  init() {
    if (this.initialized) return;
    this.initialized = true;

    // Subscribe to canvas data updates
    this.syncManager.subscribe((imgData, meta) => {
      this.onSourceDataUpdated(imgData, meta);
    });

    this.setupHeaderButton();
    this.injectRightTabButton();
  }

  /**
   * Setup click handler for the PBR Maps button in the top header
   */
  setupHeaderButton() {
    const btn = document.getElementById('btnMapGenHeader');
    if (btn) {
      btn.onclick = () => this.activateTab();
    }
  }

  /**
   * Inject right panel tab button [🗺️ Карти]
   */
  injectRightTabButton() {
    const tabContainer = document.querySelector('.panel-tabs') || document.querySelector('.right-panel-header');
    if (!tabContainer || document.getElementById('btnTabMaps')) return;

    const btn = document.createElement('button');
    btn.id = 'btnTabMaps';
    btn.className = 'btn btn-secondary';
    btn.style.fontSize = '11px';
    btn.style.padding = '4px 8px';
    btn.innerHTML = '🗺️ Карти';
    btn.title = 'Генератор PBR Карт (Normal, Displacement, AO, Specular)';

    btn.onclick = () => {
      this.activateTab();
    };

    tabContainer.appendChild(btn);
  }

  /**
   * Called whenever Veil Studio re-renders canvas (real-time sync)
   */
  onCanvasUpdated() {
    if (window.isPbrModeActive || (window.state && window.state.currentRightTab === 'maps')) {
      this.syncManager.pullCanvasData();
    }
  }

  /**
   * Switch Veil Studio into the Map Generator Tab Mode
   */
  activateTab() {
    window.isPbrModeActive = true;
    if (window.switchRightTab) {
      window.switchRightTab('maps');
    }

    // Update tab button highlights
    ['btnTabLayer', 'btnTabGlobal', 'btnTabTiling'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.className = 'btn btn-secondary';
    });
    const mapsTabBtn = document.getElementById('btnTabMaps');
    if (mapsTabBtn) mapsTabBtn.className = 'btn btn-primary';

    const headerTitle = document.getElementById('rightPanelTitle');
    if (headerTitle) headerTitle.innerText = 'PBR Map Generator';

    // Ensure central viewport is mounted
    this.renderUnifiedViewportContainer();

    // Ensure right control panel is rendered
    this.renderRightPanelControls();

    // Auto-pull current canvas data
    this.syncManager.pullCanvasData();
  }

  /**
   * Render main central Viewport Container (2D / 3D switcher + Controls)
   */
  renderUnifiedViewportContainer() {
    let container = document.getElementById('mapGenViewportContainer');
    const mainArea = document.querySelector('main') || document.getElementById('canvasWrapper')?.parentNode;

    if (!container && mainArea) {
      container = document.createElement('div');
      container.id = 'mapGenViewportContainer';
      container.className = 'map-gen-viewport-container';
      container.style.cssText = 'position:absolute; inset:0; z-index:20; background:var(--bg-color, #121214); display:flex; flex-direction:column; overflow:hidden;';

      container.innerHTML = `
        <div class="viewport-header" style="display:flex; justify-content:space-between; align-items:center; padding:8px 16px; background:rgba(0,0,0,0.5); border-bottom:1px solid var(--border-color, rgba(255,255,255,0.1)); flex-wrap:wrap; gap:8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight:700; font-size:13px; color:var(--text-color, #f4f4f5);">PBR Карти</span>
            <div class="view-mode-toggle" style="display:flex; background:rgba(255,255,255,0.06); padding:2px; border-radius:6px; border:1px solid rgba(255,255,255,0.1);">
              <button id="btnView2D" class="btn btn-primary" style="padding:3px 12px; font-size:11px; border-radius:4px;">2D Карта</button>
              <button id="btnView3D" class="btn btn-secondary" style="padding:3px 12px; font-size:11px; border-radius:4px;">3D Сцена</button>
            </div>
          </div>

          <div class="map-type-tabs" style="display:flex; gap:4px; align-items:center;">
            <button class="map-type-btn active" data-map="normal">Normal</button>
            <button class="map-type-btn" data-map="displacement">Displacement</button>
            <button class="map-type-btn" data-map="ao">AO</button>
            <button class="map-type-btn" data-map="specular">Specular</button>
            <button class="map-type-btn" data-map="diffuse">Diffuse</button>
          </div>

          <button id="btnCloseMapGen" class="btn btn-secondary" style="padding:3px 10px; font-size:12px;" title="Повернутися до полотна">✕ Закрити</button>
        </div>

        <div class="viewport-stage" style="flex:1; position:relative; overflow:hidden; display:flex; justify-content:center; align-items:center; background:#0d0d0e;">
          <!-- 2D Preview Viewport -->
          <div id="view2DStage" style="position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; align-items:center; user-select:none;">
            
            <!-- 2D Canvas Stage Area with Drag and Pan -->
            <div id="stage2DContainer" style="width:100%; height:100%; position:relative; display:flex; justify-content:center; align-items:center; overflow:hidden; cursor:grab;">
              <div id="canvas2DWrapper" style="position:relative; border:1px solid rgba(255,255,255,0.2); border-radius:8px; overflow:hidden; box-shadow:0 12px 36px rgba(0,0,0,0.7); transform-origin:center center; transition:transform 0.05s ease-out; background:repeating-conic-gradient(#1a1a1e 0% 25%, #24242a 0% 50%) 50% / 16px 16px;">
                <canvas id="mapPreviewCanvas2D" width="512" height="512" style="display:block; max-width:80vh; max-height:80vh; object-fit:contain;"></canvas>
              </div>
            </div>

            <!-- 2D Viewport Controls Bar -->
            <div class="2d-toolbar" style="position:absolute; bottom:12px; left:50%; transform:translateX(-50%); background:rgba(18,18,20,0.85); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:6px 12px; display:flex; gap:10px; align-items:center; font-size:11px; z-index:10; box-shadow:0 8px 24px rgba(0,0,0,0.5);">
              <button id="btnZoomIn2D" class="btn btn-secondary" style="padding:2px 8px;" title="Збільшити">➕</button>
              <button id="btnZoomOut2D" class="btn btn-secondary" style="padding:2px 8px;" title="Зменшити">➖</button>
              <button id="btnReset2D" class="btn btn-secondary" style="padding:2px 8px;" title="Скинути масштаб">Fit</button>
              <span id="txtZoomInfo" style="font-weight:600; color:#3b82f6; min-width:40px; text-align:center;">100%</span>

              <div style="width:1px; height:16px; background:rgba(255,255,255,0.15);"></div>

              <div style="display:flex; align-items:center; gap:4px;">
                <span style="color:var(--text-muted, #a1a1aa);">Якість карт:</span>
                <button class="res-btn-map active" data-res="512" style="padding:2px 8px; font-size:10px;">512</button>
                <button class="res-btn-map" data-res="1024" style="padding:2px 6px; font-size:10px;">1024</button>
              </div>

              <div style="width:1px; height:16px; background:rgba(255,255,255,0.15);"></div>

              <label style="display:flex; align-items:center; gap:4px; cursor:pointer;" title="Тимчасово знижувати роздільну здатність при перетягуванні повзунків">
                <input type="checkbox" id="chkFastPreviewMap" checked> ⚡ Швидкий прев'ю (256px)
              </label>
            </div>

            <!-- 2D Map Label -->
            <div id="map2DLabel" style="position:absolute; top:12px; left:16px; background:rgba(0,0,0,0.6); padding:4px 10px; border-radius:4px; font-size:11px; color:var(--text-color, #f4f4f5); font-weight:600; backdrop-filter:blur(4px); border:1px solid rgba(255,255,255,0.1);">
              Normal Map (Sobel 2.5x)
            </div>
          </div>

          <!-- 3D Viewport Stage -->
          <div id="view3DStage" style="position:absolute; inset:0; display:none; flex-direction:column;">
            <div id="threeContainer" style="flex:1; width:100%; height:100%; position:relative;"></div>
            
            <!-- 3D Controls Toolbar -->
            <div class="three-toolbar" style="position:absolute; bottom:12px; left:50%; transform:translateX(-50%); background:rgba(18,18,20,0.85); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:6px 12px; display:flex; gap:12px; align-items:center; font-size:11px; z-index:10; box-shadow:0 8px 24px rgba(0,0,0,0.5); flex-wrap:wrap;">
              <div style="display:flex; align-items:center; gap:6px;">
                <label style="color:var(--text-muted, #a1a1aa);">Форма:</label>
                <select id="sel3DShape" class="form-control" style="font-size:11px; height:24px; padding:0 4px;">
                  <option value="cube">Куб (Cube)</option>
                  <option value="plane">Площина (Plane)</option>
                  <option value="sphere">Сфера (Sphere)</option>
                  <option value="cylinder">Циліндр (Cylinder)</option>
                </select>
              </div>

              <div style="display:flex; align-items:center; gap:6px;">
                <label style="color:var(--text-muted, #a1a1aa);">Повтор:</label>
                <input type="range" id="rng3DRepeat" min="1" max="5" step="1" value="1" style="width:60px;">
                <span id="txt3DRepeat" style="min-width:16px;">1x</span>
              </div>

              <div style="display:flex; align-items:center; gap:6px;">
                <label style="color:var(--text-muted, #a1a1aa);">Рельєф:</label>
                <input type="range" id="rng3DDisp" min="0" max="0.2" step="0.01" value="0.05" style="width:60px;">
              </div>

              <label style="display:flex; align-items:center; gap:4px; cursor:pointer;">
                <input type="checkbox" id="chk3DAutoRotate"> Обертання
              </label>
            </div>
          </div>
        </div>
      `;

      mainArea.appendChild(container);
      this.bindViewportEvents();
    } else if (container) {
      container.style.display = 'flex';
    }
  }

  /**
   * Bind event listeners for Viewport controls (Zoom, Pan, Resolution, Map Tabs, 3D)
   */
  bindViewportEvents() {
    const btn2D = document.getElementById('btnView2D');
    const btn3D = document.getElementById('btnView3D');
    const stage2D = document.getElementById('view2DStage');
    const stage3D = document.getElementById('view3DStage');

    if (btn2D && btn3D && stage2D && stage3D) {
      btn2D.onclick = () => {
        this.activeView = '2d';
        btn2D.className = 'btn btn-primary';
        btn3D.className = 'btn btn-secondary';
        stage2D.style.display = 'flex';
        stage3D.style.display = 'none';
        this.render2DPreview();
      };

      btn3D.onclick = () => {
        this.activeView = '3d';
        btn3D.className = 'btn btn-primary';
        btn2D.className = 'btn btn-secondary';
        stage2D.style.display = 'none';
        stage3D.style.display = 'flex';

        if (!this.viewport3D) {
          const threeContainer = document.getElementById('threeContainer');
          this.viewport3D = new Viewport3D(threeContainer);
        }
        this.update3DTextures();
        this.viewport3D.onResize();
      };
    }

    // Map type switcher tabs
    document.querySelectorAll('.map-type-btn').forEach(btn => {
      btn.onclick = (e) => {
        document.querySelectorAll('.map-type-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.selectedMapType = e.target.dataset.map;
        this.render2DPreview();
      };
    });

    // Close button
    const btnClose = document.getElementById('btnCloseMapGen');
    if (btnClose) {
      btnClose.onclick = () => {
        window.isPbrModeActive = false;
        const container = document.getElementById('mapGenViewportContainer');
        if (container) container.style.display = 'none';
        if (window.switchRightTab) window.switchRightTab('layer');
      };
    }

    // 2D Zoom & Pan interactions
    const stageContainer = document.getElementById('stage2DContainer');
    if (stageContainer) {
      stageContainer.onwheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        this.zoomScale = Math.min(Math.max(0.2, this.zoomScale + delta), 4.0);
        this.update2DTransform();
      };

      stageContainer.onmousedown = (e) => {
        if (e.button === 0 || e.button === 1) {
          this.isDragging2D = true;
          this.dragStartX = e.clientX - this.panX;
          this.dragStartY = e.clientY - this.panY;
          stageContainer.style.cursor = 'grabbing';
        }
      };

      window.addEventListener('mousemove', (e) => {
        if (this.isDragging2D) {
          this.panX = e.clientX - this.dragStartX;
          this.panY = e.clientY - this.dragStartY;
          this.update2DTransform();
        }
      });

      window.addEventListener('mouseup', () => {
        if (this.isDragging2D) {
          this.isDragging2D = false;
          if (stageContainer) stageContainer.style.cursor = 'grab';
        }
      });
    }

    // 2D Toolbar buttons
    const btnZoomIn = document.getElementById('btnZoomIn2D');
    if (btnZoomIn) btnZoomIn.onclick = () => {
      this.zoomScale = Math.min(4.0, this.zoomScale + 0.2);
      this.update2DTransform();
    };

    const btnZoomOut = document.getElementById('btnZoomOut2D');
    if (btnZoomOut) btnZoomOut.onclick = () => {
      this.zoomScale = Math.max(0.2, this.zoomScale - 0.2);
      this.update2DTransform();
    };

    const btnReset = document.getElementById('btnReset2D');
    if (btnReset) btnReset.onclick = () => {
      this.zoomScale = 1.0;
      this.panX = 0;
      this.panY = 0;
      this.update2DTransform();
    };

    // Resolution switcher
    document.querySelectorAll('.res-btn-map').forEach(btn => {
      btn.onclick = (e) => {
        document.querySelectorAll('.res-btn-map').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.targetResolution = parseInt(e.target.dataset.res, 10);
        this.reprocess();
      };
    });

    const chkFast = document.getElementById('chkFastPreviewMap');
    if (chkFast) {
      chkFast.onchange = (e) => {
        this.fastPreview = e.target.checked;
      };
    }

    // 3D Toolbar controls
    const selShape = document.getElementById('sel3DShape');
    if (selShape) {
      selShape.onchange = (e) => {
        if (this.viewport3D) this.viewport3D.createGeometry(e.target.value);
      };
    }

    const rngRepeat = document.getElementById('rng3DRepeat');
    const txtRepeat = document.getElementById('txt3DRepeat');
    if (rngRepeat) {
      rngRepeat.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        if (txtRepeat) txtRepeat.textContent = `${val}x`;
        if (this.viewport3D) this.viewport3D.setMaterialParams({ repeatX: val, repeatY: val });
      };
    }

    const rngDisp = document.getElementById('rng3DDisp');
    if (rngDisp) {
      rngDisp.oninput = (e) => {
        const val = parseFloat(e.target.value);
        if (this.viewport3D) this.viewport3D.setMaterialParams({ displacementScale: val });
      };
    }

    const chkAutoRot = document.getElementById('chk3DAutoRotate');
    if (chkAutoRot) {
      chkAutoRot.onchange = (e) => {
        if (this.viewport3D) this.viewport3D.toggleAutoRotate(e.target.checked);
      };
    }
  }

  /**
   * Update 2D Canvas Wrapper Transform for Zoom and Pan
   */
  update2DTransform() {
    const wrapper = document.getElementById('canvas2DWrapper');
    const txtInfo = document.getElementById('txtZoomInfo');
    if (wrapper) {
      wrapper.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomScale})`;
    }
    if (txtInfo) {
      txtInfo.textContent = `${Math.round(this.zoomScale * 100)}%`;
    }
  }

  /**
   * Switch active map type and re-render contextual panel and viewport
   */
  switchMapType(mapType) {
    this.selectedMapType = mapType;

    // Update viewport top bar buttons
    document.querySelectorAll('.map-type-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.map === mapType);
    });

    // Re-render contextual control panel in right settings area
    this.renderRightPanelControls();

    // Re-render active viewport preview
    if (this.activeView === '2d') {
      this.render2DPreview();
    } else if (this.activeView === '3d' && this.viewport3D) {
      this.update3DTextures();
    }
  }

  /**
   * Render Right Control Panel for Map Generator
   */
  renderRightPanelControls() {
    const rightPanel = document.getElementById('propertiesPanel') || document.getElementById('rightPanelBody') || document.querySelector('.right-panel-content') || document.querySelector('.panel-content');
    if (!rightPanel) return;

    const currentMap = this.selectedMapType || 'normal';

    let mapContextualHtml = '';

    if (currentMap === 'normal') {
      mapContextualHtml = `
        <div class="accordion-block" style="background:rgba(59,130,246,0.03); border:1px solid rgba(59,130,246,0.3); border-radius:8px; padding:12px;">
          <div style="font-weight:700; font-size:12px; margin-bottom:10px; color:#3b82f6; display:flex; align-items:center; justify-content:space-between;">
            <span>📐 Normal Map (Карта Нормалей)</span>
            <span style="font-size:10px; opacity:0.7;">RGB Vectors</span>
          </div>

          <!-- Filter Selection -->
          <div style="margin-bottom:8px;">
            <label class="property-label" style="font-size:10px; margin-bottom:2px; display:block;">Фільтр (Filter Selection)</label>
            <select id="selNormFilter" class="form-control" style="font-size:11px; height:26px;">
              <option value="sobel" ${this.params.normal.algorithm === 'sobel' ? 'selected' : ''}>Sobel (Стандартний 3x3)</option>
              <option value="scharr" ${this.params.normal.algorithm === 'scharr' ? 'selected' : ''}>Scharr (Висока чіткість)</option>
              <option value="prewitt" ${this.params.normal.algorithm === 'prewitt' ? 'selected' : ''}>Prewitt (Плавний градієнт)</option>
            </select>
          </div>

          <!-- Strength -->
          <div style="margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
              <label class="property-label" style="font-size:10px;">Сила (Strength)</label>
              <span id="valNormStrengthText" style="font-size:10px; color:#3b82f6; font-weight:600;">${this.params.normal.strength}</span>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="range" id="rngNormStrength" min="0.1" max="10.0" step="0.1" value="${this.params.normal.strength}" style="flex:1;">
              <input type="number" id="numNormStrength" class="num-input" min="0.1" max="10.0" step="0.1" value="${this.params.normal.strength}" style="width:52px;">
            </div>
          </div>

          <!-- Levels -->
          <div style="margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
              <label class="property-label" style="font-size:10px;">Рівні (Levels)</label>
              <span id="valNormLevelText" style="font-size:10px; color:#3b82f6; font-weight:600;">${this.params.normal.level}</span>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="range" id="rngNormLevel" min="0.1" max="5.0" step="0.1" value="${this.params.normal.level}" style="flex:1;">
              <input type="number" id="numNormLevel" class="num-input" min="0.1" max="5.0" step="0.1" value="${this.params.normal.level}" style="width:52px;">
            </div>
          </div>

          <!-- Blur -->
          <div style="margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
              <label class="property-label" style="font-size:10px;">Розмиття (Blur)</label>
              <span id="valNormBlurText" style="font-size:10px; color:var(--text-muted, #a1a1aa); font-weight:600;">${this.params.normal.blur}</span>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="range" id="rngNormBlur" min="0" max="10" step="0.5" value="${this.params.normal.blur}" style="flex:1;">
              <input type="number" id="numNormBlur" class="num-input" min="0" max="10" step="0.5" value="${this.params.normal.blur}" style="width:52px;">
            </div>
          </div>

          <!-- Sharp -->
          <div style="margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
              <label class="property-label" style="font-size:10px;">Чіткість (Sharp)</label>
              <span id="valNormSharpText" style="font-size:10px; color:var(--text-muted, #a1a1aa); font-weight:600;">${this.params.normal.sharp}</span>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="range" id="rngNormSharp" min="0" max="10" step="0.5" value="${this.params.normal.sharp}" style="flex:1;">
              <input type="number" id="numNormSharp" class="num-input" min="0" max="10" step="0.5" value="${this.params.normal.sharp}" style="width:52px;">
            </div>
          </div>

          <!-- Invert -->
          <div style="margin-bottom:8px; padding-top:4px;">
            <label style="font-size:11px; cursor:pointer; display:flex; align-items:center; gap:6px;">
              <input type="checkbox" id="chkNormInvert" ${this.params.normal.invert ? 'checked' : ''}>
              <span>Інвертувати геометрію (Invert)</span>
            </label>
          </div>

          <!-- Channels Selector / Toggles -->
          <div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:8px; margin-top:8px;">
            <label class="property-label" style="font-size:10px; margin-bottom:4px; display:block;">Перемикачі каналів (Channels)</label>
            <div style="display:flex; gap:10px; flex-wrap:wrap; font-size:10px;">
              <label style="cursor:pointer;"><input type="checkbox" id="chkNormInvR" ${this.params.normal.invertR ? 'checked' : ''}> Інверт R (X)</label>
              <label style="cursor:pointer;"><input type="checkbox" id="chkNormInvG" ${this.params.normal.invertG ? 'checked' : ''}> Інверт G (Y)</label>
              <label style="cursor:pointer;"><input type="checkbox" id="chkNormInvH" ${this.params.normal.invertH ? 'checked' : ''}> Інверт Height (H)</label>
            </div>
          </div>
        </div>
      `;
    } else if (currentMap === 'displacement') {
      mapContextualHtml = `
        <div class="accordion-block" style="background:rgba(16,185,129,0.03); border:1px solid rgba(16,185,129,0.3); border-radius:8px; padding:12px;">
          <div style="font-weight:700; font-size:12px; margin-bottom:10px; color:#10b981; display:flex; align-items:center; justify-content:space-between;">
            <span>🏔️ Displacement Map (Карта Висот)</span>
            <span style="font-size:10px; opacity:0.7;">Grayscale Height</span>
          </div>

          <!-- Contrast -->
          <div style="margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
              <label class="property-label" style="font-size:10px;">Контраст (Contrast)</label>
              <span id="valDispContrastText" style="font-size:10px; color:#10b981; font-weight:600;">${this.params.displacement.contrast}</span>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="range" id="rngDispContrast" min="0.1" max="3.0" step="0.1" value="${this.params.displacement.contrast}" style="flex:1;">
              <input type="number" id="numDispContrast" class="num-input" min="0.1" max="3.0" step="0.1" value="${this.params.displacement.contrast}" style="width:52px;">
            </div>
          </div>

          <!-- Invert -->
          <div style="margin-top:8px;">
            <label style="font-size:11px; cursor:pointer; display:flex; align-items:center; gap:6px;">
              <input type="checkbox" id="chkDispInvert" ${this.params.displacement.invert ? 'checked' : ''}>
              <span>Інвертувати карту висот (Invert)</span>
            </label>
          </div>
        </div>
      `;
    } else if (currentMap === 'ao') {
      mapContextualHtml = `
        <div class="accordion-block" style="background:rgba(245,158,11,0.03); border:1px solid rgba(245,158,11,0.3); border-radius:8px; padding:12px;">
          <div style="font-weight:700; font-size:12px; margin-bottom:10px; color:#f59e0b; display:flex; align-items:center; justify-content:space-between;">
            <span>🌘 Ambient Occlusion (AO Map)</span>
            <span style="font-size:10px; opacity:0.7;">Shadow Occlusion</span>
          </div>

          <!-- Strength -->
          <div style="margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
              <label class="property-label" style="font-size:10px;">Сила (Strength)</label>
              <span id="valAOStrengthText" style="font-size:10px; color:#f59e0b; font-weight:600;">${this.params.ao.strength}</span>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="range" id="rngAOStrength" min="0.1" max="5.0" step="0.1" value="${this.params.ao.strength}" style="flex:1;">
              <input type="number" id="numAOStrength" class="num-input" min="0.1" max="5.0" step="0.1" value="${this.params.ao.strength}" style="width:52px;">
            </div>
          </div>

          <!-- Levels -->
          <div style="margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
              <label class="property-label" style="font-size:10px;">Рівні (Levels)</label>
              <span id="valAOLevelText" style="font-size:10px; color:#f59e0b; font-weight:600;">${this.params.ao.level}</span>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="range" id="rngAOLevel" min="0.1" max="5.0" step="0.1" value="${this.params.ao.level}" style="flex:1;">
              <input type="number" id="numAOLevel" class="num-input" min="0.1" max="5.0" step="0.1" value="${this.params.ao.level}" style="width:52px;">
            </div>
          </div>

          <!-- Blur -->
          <div style="margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
              <label class="property-label" style="font-size:10px;">Розмиття (Blur)</label>
              <span id="valAOBlurText" style="font-size:10px; color:var(--text-muted, #a1a1aa); font-weight:600;">${this.params.ao.blur}</span>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="range" id="rngAOBlur" min="0" max="10" step="0.5" value="${this.params.ao.blur}" style="flex:1;">
              <input type="number" id="numAOBlur" class="num-input" min="0" max="10" step="0.5" value="${this.params.ao.blur}" style="width:52px;">
            </div>
          </div>

          <!-- Sharp -->
          <div style="margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
              <label class="property-label" style="font-size:10px;">Чіткість (Sharp)</label>
              <span id="valAOSharpText" style="font-size:10px; color:var(--text-muted, #a1a1aa); font-weight:600;">${this.params.ao.sharp}</span>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="range" id="rngAOSharp" min="0" max="10" step="0.5" value="${this.params.ao.sharp}" style="flex:1;">
              <input type="number" id="numAOSharp" class="num-input" min="0" max="10" step="0.5" value="${this.params.ao.sharp}" style="width:52px;">
            </div>
          </div>

          <!-- Invert -->
          <div style="margin-top:8px;">
            <label style="font-size:11px; cursor:pointer; display:flex; align-items:center; gap:6px;">
              <input type="checkbox" id="chkAOInvert" ${this.params.ao.invert ? 'checked' : ''}>
              <span>Інвертувати затінення (Invert)</span>
            </label>
          </div>
        </div>
      `;
    } else if (currentMap === 'specular') {
      mapContextualHtml = `
        <div class="accordion-block" style="background:rgba(236,72,153,0.03); border:1px solid rgba(236,72,153,0.3); border-radius:8px; padding:12px;">
          <div style="font-weight:700; font-size:12px; margin-bottom:10px; color:#ec4899; display:flex; align-items:center; justify-content:space-between;">
            <span>✨ Specular Map (Карта Блиску)</span>
            <span style="font-size:10px; opacity:0.7;">Gloss Intensity</span>
          </div>

          <!-- Mean -->
          <div style="margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
              <label class="property-label" style="font-size:10px;">Середнє значення (Mean)</label>
              <span id="valSpecMeanText" style="font-size:10px; color:#ec4899; font-weight:600;">${this.params.specular.mean}</span>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="range" id="rngSpecMean" min="0.0" max="1.0" step="0.05" value="${this.params.specular.mean}" style="flex:1;">
              <input type="number" id="numSpecMean" class="num-input" min="0.0" max="1.0" step="0.05" value="${this.params.specular.mean}" style="width:52px;">
            </div>
          </div>

          <!-- Range -->
          <div style="margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
              <label class="property-label" style="font-size:10px;">Діапазон (Range)</label>
              <span id="valSpecRangeText" style="font-size:10px; color:#ec4899; font-weight:600;">${this.params.specular.range}</span>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="range" id="rngSpecRange" min="0.1" max="5.0" step="0.1" value="${this.params.specular.range}" style="flex:1;">
              <input type="number" id="numSpecRange" class="num-input" min="0.1" max="5.0" step="0.1" value="${this.params.specular.range}" style="width:52px;">
            </div>
          </div>

          <!-- Falloff Dropdown -->
          <div style="margin-bottom:8px;">
            <label class="property-label" style="font-size:10px; margin-bottom:2px; display:block;">Спад градієнта (Falloff)</label>
            <select id="selSpecFalloff" class="form-control" style="font-size:11px; height:26px;">
              <option value="none" ${this.params.specular.falloff === 'none' ? 'selected' : ''}>Немає (None)</option>
              <option value="linear" ${this.params.specular.falloff === 'linear' ? 'selected' : ''}>Лінійне (Linear)</option>
              <option value="square" ${this.params.specular.falloff === 'square' ? 'selected' : ''}>Квадратичне (Square)</option>
            </select>
          </div>
        </div>
      `;
    } else {
      mapContextualHtml = `
        <div class="accordion-block" style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color, rgba(255,255,255,0.1)); border-radius:8px; padding:12px;">
          <div style="font-weight:700; font-size:12px; margin-bottom:6px; color:var(--text-color, #f4f4f5);">
            🖼️ Diffuse / Початкова Текстура
          </div>
          <p style="font-size:11px; color:var(--text-muted, #a1a1aa); margin:0;">
            Використовується як базова текстура кольору для генерації всіх PBR карт.
          </p>
        </div>
      `;
    }

    rightPanel.innerHTML = `
      <div class="map-gen-controls" style="display:flex; flex-direction:column; gap:10px; padding:8px 4px; color:var(--text-color, #f4f4f5);">
        
        <!-- Source Sync Block -->
        <div class="accordion-block" style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color, rgba(255,255,255,0.1)); border-radius:8px; padding:10px;">
          <div style="font-weight:700; font-size:12px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
            <span>🔄 Джерело текстури</span>
            <span id="syncStatusBadge" style="font-size:10px; background:rgba(16,185,129,0.15); color:#10b981; padding:2px 6px; border-radius:4px;">Синхронізовано</span>
          </div>

          <select id="selMapSourceType" class="form-control" style="font-size:11px; height:28px; margin-bottom:6px;">
            <option value="composite" ${this.syncManager.sourceType === 'composite' ? 'selected' : ''}>🎨 Полотно Veil Studio (Всі шари)</option>
            <option value="active_layer" ${this.syncManager.sourceType === 'active_layer' ? 'selected' : ''}>🥞 Активний шар</option>
            <option value="manual" ${this.syncManager.sourceType === 'manual' ? 'selected' : ''}>📁 Власне фото / Файл</option>
          </select>

          <div id="dropzoneManual" style="display:${this.syncManager.sourceType === 'manual' ? 'block' : 'none'}; border:2px dashed rgba(59,130,246,0.4); border-radius:6px; padding:10px; text-align:center; font-size:11px; color:var(--text-muted, #a1a1aa); cursor:pointer; background:rgba(59,130,246,0.04); margin-bottom:6px;">
            Перетягніть фото сюди або <u>виберіть файл</u>
            <input type="file" id="fileManualInput" accept="image/*" style="display:none;">
          </div>

          <button id="btnResyncCanvas" class="btn btn-secondary" style="width:100%; font-size:11px; padding:4px 8px;">
            🔄 Оновити з полотна
          </button>
        </div>

        <!-- Sub-Tabs Selector for Contextual Panels -->
        <div style="display:flex; gap:3px; background:rgba(0,0,0,0.3); padding:3px; border-radius:6px; border:1px solid var(--border-color, rgba(255,255,255,0.1));">
          <button class="pbr-subtab-btn ${currentMap === 'normal' ? 'active' : ''}" data-submap="normal" style="flex:1; min-width:55px; padding:4px 4px; font-size:10px; border-radius:4px;">Normal</button>
          <button class="pbr-subtab-btn ${currentMap === 'displacement' ? 'active' : ''}" data-submap="displacement" style="flex:1; min-width:55px; padding:4px 4px; font-size:10px; border-radius:4px;">Disp</button>
          <button class="pbr-subtab-btn ${currentMap === 'ao' ? 'active' : ''}" data-submap="ao" style="flex:1; min-width:40px; padding:4px 4px; font-size:10px; border-radius:4px;">AO</button>
          <button class="pbr-subtab-btn ${currentMap === 'specular' ? 'active' : ''}" data-submap="specular" style="flex:1; min-width:55px; padding:4px 4px; font-size:10px; border-radius:4px;">Specular</button>
        </div>

        <!-- Dynamic Contextual Panel Area -->
        <div id="pbrContextualPanelArea">
          ${mapContextualHtml}
        </div>

        <!-- Actions / Export Panel -->
        <div class="accordion-block" style="background:rgba(59,130,246,0.04); border:1px solid rgba(59,130,246,0.2); border-radius:8px; padding:10px;">
          <div style="font-weight:700; font-size:11px; margin-bottom:8px; color:#3b82f6;">
            🚀 Дії та Експорт
          </div>

          <button id="btnApplyAsLayer" class="btn btn-primary" style="width:100%; margin-bottom:6px; padding:6px; font-size:11px;">
            ➕ Додати карту як шар у Veil Studio
          </button>

          <button id="btnDownloadCurrentMap" class="btn btn-secondary" style="width:100%; margin-bottom:6px; padding:6px; font-size:11px;">
            💾 Завантажити активну карту (${currentMap.toUpperCase()})
          </button>

          <button id="btnDownloadAllMaps" class="btn btn-secondary" style="width:100%; padding:6px; font-size:11px;">
            📦 Завантажити всі 4 PBR карти
          </button>
        </div>

      </div>
    `;

    this.bindRightPanelEvents();
  }

  /**
   * Bind event handlers for control panel sliders, checkboxes, selects, and buttons
   */
  bindRightPanelEvents() {
    // Sub-tab switcher handler
    document.querySelectorAll('.pbr-subtab-btn').forEach(btn => {
      btn.onclick = (e) => {
        const submap = e.target.dataset.submap;
        if (submap) {
          this.switchMapType(submap);
        }
      };
    });

    // Source switcher
    const selSource = document.getElementById('selMapSourceType');
    const dropzone = document.getElementById('dropzoneManual');
    const fileInput = document.getElementById('fileManualInput');

    if (selSource) {
      selSource.onchange = (e) => {
        const val = e.target.value;
        if (dropzone) dropzone.style.display = val === 'manual' ? 'block' : 'none';
        this.syncManager.setSourceType(val);
      };
    }

    if (dropzone && fileInput) {
      dropzone.onclick = () => fileInput.click();
      fileInput.onchange = (e) => {
        if (e.target.files && e.target.files[0]) {
          this.syncManager.loadManualFile(e.target.files[0]);
        }
      };

      dropzone.ondragover = (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '#3b82f6';
      };
      dropzone.ondragleave = () => {
        dropzone.style.borderColor = 'rgba(59,130,246,0.4)';
      };
      dropzone.ondrop = (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'rgba(59,130,246,0.4)';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.syncManager.loadManualFile(e.dataTransfer.files[0]);
        }
      };
    }

    const btnResync = document.getElementById('btnResyncCanvas');
    if (btnResync) {
      btnResync.onclick = () => this.syncManager.pullCanvasData();
    }

    // Slider & Numeric Input linking helper
    const linkInput = (rngId, numId, textValId, callback) => {
      const rng = document.getElementById(rngId);
      const num = document.getElementById(numId);
      const txt = textValId ? document.getElementById(textValId) : null;

      if (rng && num) {
        rng.oninput = (e) => {
          const val = parseFloat(e.target.value);
          num.value = val;
          if (txt) txt.textContent = val;
          callback(val);
        };
        num.oninput = (e) => {
          const val = parseFloat(e.target.value);
          rng.value = val;
          if (txt) txt.textContent = val;
          callback(val);
        };
      }
    };

    // Normal Map Controls
    const selNormFilter = document.getElementById('selNormFilter');
    if (selNormFilter) {
      selNormFilter.onchange = (e) => {
        this.params.normal.algorithm = e.target.value;
        this.reprocess();
      };
    }

    linkInput('rngNormStrength', 'numNormStrength', 'valNormStrengthText', (val) => {
      this.params.normal.strength = val;
      this.reprocess();
    });

    linkInput('rngNormLevel', 'numNormLevel', 'valNormLevelText', (val) => {
      this.params.normal.level = val;
      this.reprocess();
    });

    linkInput('rngNormBlur', 'numNormBlur', 'valNormBlurText', (val) => {
      this.params.normal.blur = val;
      this.reprocess();
    });

    linkInput('rngNormSharp', 'numNormSharp', 'valNormSharpText', (val) => {
      this.params.normal.sharp = val;
      this.reprocess();
    });

    const chkNormInvert = document.getElementById('chkNormInvert');
    if (chkNormInvert) {
      chkNormInvert.onchange = (e) => {
        this.params.normal.invert = e.target.checked;
        this.reprocess();
      };
    }

    ['chkNormInvR', 'chkNormInvG', 'chkNormInvH'].forEach((id, idx) => {
      const el = document.getElementById(id);
      if (el) {
        el.onchange = (e) => {
          if (idx === 0) this.params.normal.invertR = e.target.checked;
          if (idx === 1) this.params.normal.invertG = e.target.checked;
          if (idx === 2) this.params.normal.invertH = e.target.checked;
          this.reprocess();
        };
      }
    });

    // Displacement Map Controls
    linkInput('rngDispContrast', 'numDispContrast', 'valDispContrastText', (val) => {
      this.params.displacement.contrast = val;
      this.reprocess();
    });

    const chkDispInv = document.getElementById('chkDispInvert');
    if (chkDispInv) {
      chkDispInv.onchange = (e) => {
        this.params.displacement.invert = e.target.checked;
        this.reprocess();
      };
    }

    // AO Map Controls
    linkInput('rngAOStrength', 'numAOStrength', 'valAOStrengthText', (val) => {
      this.params.ao.strength = val;
      this.reprocess();
    });

    linkInput('rngAOLevel', 'numAOLevel', 'valAOLevelText', (val) => {
      this.params.ao.level = val;
      this.reprocess();
    });

    linkInput('rngAOBlur', 'numAOBlur', 'valAOBlurText', (val) => {
      this.params.ao.blur = val;
      this.reprocess();
    });

    linkInput('rngAOSharp', 'numAOSharp', 'valAOSharpText', (val) => {
      this.params.ao.sharp = val;
      this.reprocess();
    });

    const chkAOInvert = document.getElementById('chkAOInvert');
    if (chkAOInvert) {
      chkAOInvert.onchange = (e) => {
        this.params.ao.invert = e.target.checked;
        this.reprocess();
      };
    }

    // Specular Map Controls
    linkInput('rngSpecMean', 'numSpecMean', 'valSpecMeanText', (val) => {
      this.params.specular.mean = val;
      this.reprocess();
    });

    linkInput('rngSpecRange', 'numSpecRange', 'valSpecRangeText', (val) => {
      this.params.specular.range = val;
      this.reprocess();
    });

    const selSpecFalloff = document.getElementById('selSpecFalloff');
    if (selSpecFalloff) {
      selSpecFalloff.onchange = (e) => {
        this.params.specular.falloff = e.target.value;
        this.reprocess();
      };
    }

    // Export & Layer Actions
    const btnApply = document.getElementById('btnApplyAsLayer');
    if (btnApply) btnApply.onclick = () => this.applySelectedMapAsLayer();

    const btnDownloadCurr = document.getElementById('btnDownloadCurrentMap');
    if (btnDownloadCurr) btnDownloadCurr.onclick = () => this.downloadMap(this.selectedMapType);

    const btnDownloadAll = document.getElementById('btnDownloadAllMaps');
    if (btnDownloadAll) btnDownloadAll.onclick = () => this.downloadAllMaps();
  }

  /**
   * Called when SyncManager updates source image data
   */
  onSourceDataUpdated(imgData, meta) {
    if (!imgData) return;
    this.sourceImageData = imgData;

    this.generatedImageDatas.diffuse = imgData;
    this.generatedMaps.diffuse = CanvasProcessingEngine.imageDataToDataURL(imgData);

    const badge = document.getElementById('syncStatusBadge');
    if (badge) {
      badge.textContent = meta.source === 'manual' ? 'Файл завантажено' : 'Синхронізовано';
    }

    this.reprocess();
  }

  /**
   * Resize image data if fast preview or target resolution differs
   */
  getScaledSourceImageData() {
    if (!this.sourceImageData) return null;
    let targetDim = this.targetResolution;
    if (this.fastPreview || this.isInteractingWithSliders) targetDim = 256;

    if (this.sourceImageData.width === targetDim && this.sourceImageData.height === targetDim) {
      return this.sourceImageData;
    }

    // Scale using temporary offscreen canvas
    const canvas = document.createElement('canvas');
    canvas.width = targetDim;
    canvas.height = targetDim;
    const ctx = canvas.getContext('2d');

    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = this.sourceImageData.width;
    srcCanvas.height = this.sourceImageData.height;
    srcCanvas.getContext('2d').putImageData(this.sourceImageData, 0, 0);

    ctx.drawImage(srcCanvas, 0, 0, targetDim, targetDim);
    return ctx.getImageData(0, 0, targetDim, targetDim);
  }

  /**
   * Render selected PBR map onto a target canvas at exact resolution 'res'
   */
  renderMapToCanvasAtRes(targetCanvas, res = 1024) {
    if (!targetCanvas) return;
    targetCanvas.width = res;
    targetCanvas.height = res;
    const ctx = targetCanvas.getContext('2d');

    let srcImageData = null;
    const sourceType = this.syncManager ? this.syncManager.sourceType : 'composite';

    if (sourceType === 'composite' && typeof window.renderProject === 'function' && window.state) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = res;
      tempCanvas.height = res;
      window.renderProject(tempCanvas);
      const tempCtx = tempCanvas.getContext('2d');
      srcImageData = tempCtx.getImageData(0, 0, res, res);
    } else if (this.sourceImageData) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = res;
      tempCanvas.height = res;
      const tempCtx = tempCanvas.getContext('2d');

      const srcCanvas = document.createElement('canvas');
      srcCanvas.width = this.sourceImageData.width;
      srcCanvas.height = this.sourceImageData.height;
      srcCanvas.getContext('2d').putImageData(this.sourceImageData, 0, 0);

      tempCtx.drawImage(srcCanvas, 0, 0, res, res);
      srcImageData = tempCtx.getImageData(0, 0, res, res);
    }

    if (!srcImageData) return;

    let resultMapData = null;
    const mapType = this.selectedMapType || 'normal';

    switch (mapType) {
      case 'normal':
        resultMapData = CanvasProcessingEngine.generateNormalMap(srcImageData, this.params.normal);
        break;
      case 'displacement':
        resultMapData = CanvasProcessingEngine.generateDisplacementMap(srcImageData, this.params.displacement);
        break;
      case 'ao':
        resultMapData = CanvasProcessingEngine.generateAOMap(srcImageData, this.params.ao);
        break;
      case 'specular':
        resultMapData = CanvasProcessingEngine.generateSpecularMap(srcImageData, this.params.specular);
        break;
      case 'diffuse':
      default:
        resultMapData = srcImageData;
        break;
    }

    if (resultMapData) {
      ctx.putImageData(resultMapData, 0, 0);
    }
  }

  /**
   * Re-generate all PBR texture maps using CanvasProcessingEngine
   */
  reprocess() {
    if (!this.sourceImageData || this.isProcessing) return;
    this.isProcessing = true;

    try {
      const srcData = this.getScaledSourceImageData();

      // 1. Normal Map
      const normImgData = CanvasProcessingEngine.generateNormalMap(srcData, this.params.normal);
      this.generatedImageDatas.normal = normImgData;
      this.generatedMaps.normal = CanvasProcessingEngine.imageDataToDataURL(normImgData);

      // 2. Displacement Map
      const dispImgData = CanvasProcessingEngine.generateDisplacementMap(srcData, this.params.displacement);
      this.generatedImageDatas.displacement = dispImgData;
      this.generatedMaps.displacement = CanvasProcessingEngine.imageDataToDataURL(dispImgData);

      // 3. AO Map
      const aoImgData = CanvasProcessingEngine.generateAOMap(srcData, this.params.ao);
      this.generatedImageDatas.ao = aoImgData;
      this.generatedMaps.ao = CanvasProcessingEngine.imageDataToDataURL(aoImgData);

      // 4. Specular Map
      const specImgData = CanvasProcessingEngine.generateSpecularMap(srcData, this.params.specular);
      this.generatedImageDatas.specular = specImgData;
      this.generatedMaps.specular = CanvasProcessingEngine.imageDataToDataURL(specImgData);

      // Update active view
      if (this.activeView === '2d') {
        this.render2DPreview();
      } else if (this.activeView === '3d' && this.viewport3D) {
        this.update3DTextures();
      }
    } catch (err) {
      console.error('Error reprocessing PBR maps:', err);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Draw selected map onto 2D Preview Canvas
   */
  render2DPreview() {
    const canvas = document.getElementById('mapPreviewCanvas2D');
    const label = document.getElementById('map2DLabel');
    if (!canvas) return;

    const imgData = this.generatedImageDatas[this.selectedMapType] || this.sourceImageData;
    if (!imgData) return;

    canvas.width = imgData.width;
    canvas.height = imgData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imgData, 0, 0);

    if (label) {
      const names = {
        normal: `Normal Map (${this.params.normal.algorithm.toUpperCase()}, ${this.params.normal.strength}x)`,
        displacement: `Displacement Map (Contrast: ${this.params.displacement.contrast})`,
        ao: `Ambient Occlusion (Strength: ${this.params.ao.strength})`,
        specular: `Specular Map (Strength: ${this.params.specular.strength})`,
        diffuse: `Diffuse / Source Image (${imgData.width}x${imgData.height})`
      };
      label.textContent = names[this.selectedMapType] || this.selectedMapType;
    }

    this.update2DTransform();
  }

  /**
   * Update Three.js 3D Viewport Material Textures
   */
  update3DTextures() {
    if (!this.viewport3D) return;
    this.viewport3D.updateTextures({
      diffuse: this.generatedMaps.diffuse,
      normal: this.generatedMaps.normal,
      displacement: this.generatedMaps.displacement,
      ao: this.generatedMaps.ao,
      specular: this.generatedMaps.specular
    });
  }

  /**
   * Apply selected map as a new layer in Veil Studio
   */
  applySelectedMapAsLayer() {
    const dataUrl = this.generatedMaps[this.selectedMapType];
    if (!dataUrl || !window.state) {
      alert('Немає згенерованої карти для експорту!');
      return;
    }

    const layerName = `${this.selectedMapType.toUpperCase()} Map`;
    const newLayerId = 'l_' + Date.now();

    const newLayer = {
      id: newLayerId,
      name: layerName,
      visible: true,
      opacity: 100,
      blendMode: 'normal',
      generatorType: 'paint',
      isMask: false,
      params: {
        seamless: false,
        scale: 10,
        paintDataUrl: dataUrl
      }
    };

    window.state.layers.unshift(newLayer);
    window.state.selectedLayerId = newLayerId;

    if (window.commitHistorySnapshot) window.commitHistorySnapshot();
    if (window.renderLayers) window.renderLayers();
    if (window.requestRender) window.requestRender();

    alert(`Карту "${layerName}" успішно додано як новий шар у Veil Studio!`);
  }

  /**
   * Download single map file
   */
  downloadMap(mapType) {
    const res = Math.max(1024, this.targetResolution || 1024);
    const canvas = document.createElement('canvas');
    const prevType = this.selectedMapType;
    this.selectedMapType = mapType;
    this.renderMapToCanvasAtRes(canvas, res);
    this.selectedMapType = prevType;

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `veil_studio_${mapType}_map_${res}x${res}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Download all 4 maps
   */
  downloadAllMaps() {
    ['normal', 'displacement', 'ao', 'specular'].forEach(mapType => {
      this.downloadMap(mapType);
    });
  }
}

window.MapGeneratorTabComponent = MapGeneratorTabComponent;
