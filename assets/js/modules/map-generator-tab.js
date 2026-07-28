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
        algorithm: 'sobel',
        strength: 2.5,
        level: 1.0,
        blurSharpen: 0,
        invertR: false,
        invertG: false,
        invertH: false
      },
      displacement: {
        contrast: 1.0,
        brightness: 0,
        blur: 0,
        invert: false
      },
      ao: {
        strength: 1.8,
        level: 1.0,
        blur: 1,
        mean: 3,
        range: 8,
        falloff: 'linear',
        invert: false
      },
      specular: {
        strength: 1.2,
        level: 1.0,
        blur: 0,
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
   * Render Right Control Panel for Map Generator
   */
  renderRightPanelControls() {
    const rightPanel = document.getElementById('rightPanelBody') || document.querySelector('.right-panel-content') || document.querySelector('.panel-content');
    if (!rightPanel) return;

    rightPanel.innerHTML = `
      <div class="map-gen-controls" style="display:flex; flex-direction:column; gap:12px; padding:12px 4px; color:var(--text-color, #f4f4f5);">
        
        <!-- Source Sync Block -->
        <div class="accordion-block" style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color, rgba(255,255,255,0.1)); border-radius:8px; padding:10px;">
          <div style="font-weight:700; font-size:12px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
            <span>🔄 Джерело текстури</span>
            <span id="syncStatusBadge" style="font-size:10px; background:rgba(16,185,129,0.15); color:#10b981; padding:2px 6px; border-radius:4px;">Синхронізовано</span>
          </div>

          <div style="margin-bottom:8px;">
            <select id="selMapSourceType" class="form-control" style="font-size:11px; height:28px;">
              <option value="composite">🎨 Полотно Veil Studio (Всі шари)</option>
              <option value="active_layer">🥞 Активний шар</option>
              <option value="manual">📁 Власне фото / Файл</option>
            </select>
          </div>

          <div id="dropzoneManual" style="display:none; border:2px dashed rgba(59,130,246,0.4); border-radius:6px; padding:12px; text-align:center; font-size:11px; color:var(--text-muted, #a1a1aa); cursor:pointer; background:rgba(59,130,246,0.04);">
            Перетягніть фото сюди або <u>натисніть для вибору</u>
            <input type="file" id="fileManualInput" accept="image/*" style="display:none;">
          </div>

          <button id="btnResyncCanvas" class="btn btn-secondary" style="width:100%; margin-top:6px; font-size:11px; padding:4px;">
            🔄 Оновити з полотна
          </button>
        </div>

        <!-- Normal Map Panel -->
        <div class="accordion-block" style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color, rgba(255,255,255,0.1)); border-radius:8px; padding:10px;">
          <div style="font-weight:700; font-size:12px; margin-bottom:8px; color:#3b82f6;">
            📐 Normal Map (Карта Нормалей)
          </div>

          <div style="margin-bottom:6px;">
            <label class="property-label" style="font-size:10px; margin-bottom:2px;">Алгоритм</label>
            <select id="selNormAlgo" class="form-control" style="font-size:11px; height:26px;">
              <option value="sobel" ${this.params.normal.algorithm === 'sobel' ? 'selected' : ''}>Sobel (Збалансований)</option>
              <option value="scharr" ${this.params.normal.algorithm === 'scharr' ? 'selected' : ''}>Scharr (Висока чіткість)</option>
            </select>
          </div>

          <div style="margin-bottom:6px;">
            <label class="property-label" style="font-size:10px; margin-bottom:2px;">Сила (Strength)</label>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="range" id="rngNormStrength" min="0.1" max="10.0" step="0.1" value="${this.params.normal.strength}" style="flex:1;">
              <input type="number" id="numNormStrength" class="num-input" min="0.1" max="10.0" step="0.1" value="${this.params.normal.strength}" style="width:48px;">
            </div>
          </div>

          <div style="margin-bottom:6px;">
            <label class="property-label" style="font-size:10px; margin-bottom:2px;">Розмиття / Чіткість</label>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="range" id="rngNormBlur" min="-1.0" max="1.0" step="0.1" value="${this.params.normal.blurSharpen}" style="flex:1;">
              <input type="number" id="numNormBlur" class="num-input" min="-1.0" max="1.0" step="0.1" value="${this.params.normal.blurSharpen}" style="width:48px;">
            </div>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; font-size:10px;">
            <label><input type="checkbox" id="chkNormInvR" ${this.params.normal.invertR ? 'checked' : ''}> Інверт R</label>
            <label><input type="checkbox" id="chkNormInvG" ${this.params.normal.invertG ? 'checked' : ''}> Інверт G</label>
            <label><input type="checkbox" id="chkNormInvH" ${this.params.normal.invertH ? 'checked' : ''}> Інверт H</label>
          </div>
        </div>

        <!-- Displacement Map Panel -->
        <div class="accordion-block" style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color, rgba(255,255,255,0.1)); border-radius:8px; padding:10px;">
          <div style="font-weight:700; font-size:12px; margin-bottom:8px; color:#10b981;">
            🏔️ Displacement (Карта Висот)
          </div>

          <div style="margin-bottom:6px;">
            <label class="property-label" style="font-size:10px; margin-bottom:2px;">Контраст (Contrast)</label>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="range" id="rngDispContrast" min="0.1" max="3.0" step="0.1" value="${this.params.displacement.contrast}" style="flex:1;">
              <input type="number" id="numDispContrast" class="num-input" min="0.1" max="3.0" step="0.1" value="${this.params.displacement.contrast}" style="width:48px;">
            </div>
          </div>

          <div style="margin-bottom:6px;">
            <label class="property-label" style="font-size:10px; margin-bottom:2px;">Згладжування (Blur)</label>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="range" id="rngDispBlur" min="0" max="10" step="1" value="${this.params.displacement.blur}" style="flex:1;">
              <input type="number" id="numDispBlur" class="num-input" min="0" max="10" step="1" value="${this.params.displacement.blur}" style="width:48px;">
            </div>
          </div>

          <label style="font-size:10px; margin-top:4px; display:block;">
            <input type="checkbox" id="chkDispInvert" ${this.params.displacement.invert ? 'checked' : ''}> Інвертувати висоту
          </label>
        </div>

        <!-- Ambient Occlusion Panel -->
        <div class="accordion-block" style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color, rgba(255,255,255,0.1)); border-radius:8px; padding:10px;">
          <div style="font-weight:700; font-size:12px; margin-bottom:8px; color:#f59e0b;">
            🌘 Ambient Occlusion (AO)
          </div>

          <div style="margin-bottom:6px;">
            <label class="property-label" style="font-size:10px; margin-bottom:2px;">Інтенсивність (Strength)</label>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="range" id="rngAOStrength" min="0.1" max="5.0" step="0.1" value="${this.params.ao.strength}" style="flex:1;">
              <input type="number" id="numAOStrength" class="num-input" min="0.1" max="5.0" step="0.1" value="${this.params.ao.strength}" style="width:48px;">
            </div>
          </div>

          <div style="margin-bottom:6px;">
            <label class="property-label" style="font-size:10px; margin-bottom:2px;">Радіус вибірки (Range)</label>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="range" id="rngAORange" min="1" max="20" step="1" value="${this.params.ao.range}" style="flex:1;">
              <input type="number" id="numAORange" class="num-input" min="1" max="20" step="1" value="${this.params.ao.range}" style="width:48px;">
            </div>
          </div>

          <div style="margin-bottom:6px;">
            <label class="property-label" style="font-size:10px; margin-bottom:2px;">Загасання (Falloff)</label>
            <select id="selAOFalloff" class="form-control" style="font-size:11px; height:26px;">
              <option value="linear" ${this.params.ao.falloff === 'linear' ? 'selected' : ''}>Лінійне (Linear)</option>
              <option value="square" ${this.params.ao.falloff === 'square' ? 'selected' : ''}>Квадратичне (Square)</option>
              <option value="none" ${this.params.ao.falloff === 'none' ? 'selected' : ''}>Немає (None)</option>
            </select>
          </div>
        </div>

        <!-- Specular Panel -->
        <div class="accordion-block" style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color, rgba(255,255,255,0.1)); border-radius:8px; padding:10px;">
          <div style="font-weight:700; font-size:12px; margin-bottom:8px; color:#ec4899;">
            ✨ Specular (Карта Блиску)
          </div>

          <div style="margin-bottom:6px;">
            <label class="property-label" style="font-size:10px; margin-bottom:2px;">Яскравість блиску</label>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="range" id="rngSpecStrength" min="0.1" max="5.0" step="0.1" value="${this.params.specular.strength}" style="flex:1;">
              <input type="number" id="numSpecStrength" class="num-input" min="0.1" max="5.0" step="0.1" value="${this.params.specular.strength}" style="width:48px;">
            </div>
          </div>
        </div>

        <!-- Actions / Export Panel -->
        <div class="accordion-block" style="background:rgba(59,130,246,0.05); border:1px solid rgba(59,130,246,0.2); border-radius:8px; padding:10px;">
          <div style="font-weight:700; font-size:12px; margin-bottom:8px; color:#3b82f6;">
            🚀 Експорт та інтеграція
          </div>

          <button id="btnApplyAsLayer" class="btn btn-primary" style="width:100%; margin-bottom:6px; padding:6px; font-size:11px;">
            ➕ Застосувати як шар у Veil Studio
          </button>

          <button id="btnDownloadCurrentMap" class="btn btn-secondary" style="width:100%; margin-bottom:6px; padding:6px; font-size:11px;">
            💾 Завантажити активну карту
          </button>

          <button id="btnDownloadAllMaps" class="btn btn-secondary" style="width:100%; padding:6px; font-size:11px;">
            📦 Завантажити всі 4 карти
          </button>
        </div>

      </div>
    `;

    this.bindRightPanelEvents();
  }

  /**
   * Bind event handlers for control panel sliders and buttons
   */
  bindRightPanelEvents() {
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

    // Slider linker
    const linkInput = (rngId, numId, callback) => {
      const rng = document.getElementById(rngId);
      const num = document.getElementById(numId);
      if (rng && num) {
        rng.oninput = (e) => {
          num.value = e.target.value;
          callback(parseFloat(e.target.value));
        };
        num.oninput = (e) => {
          rng.value = e.target.value;
          callback(parseFloat(e.target.value));
        };
      }
    };

    // Normal Map Events
    const selNormAlgo = document.getElementById('selNormAlgo');
    if (selNormAlgo) {
      selNormAlgo.onchange = (e) => {
        this.params.normal.algorithm = e.target.value;
        this.reprocess();
      };
    }

    linkInput('rngNormStrength', 'numNormStrength', (val) => {
      this.params.normal.strength = val;
      this.reprocess();
    });

    linkInput('rngNormBlur', 'numNormBlur', (val) => {
      this.params.normal.blurSharpen = val;
      this.reprocess();
    });

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

    // Displacement Events
    linkInput('rngDispContrast', 'numDispContrast', (val) => {
      this.params.displacement.contrast = val;
      this.reprocess();
    });

    linkInput('rngDispBlur', 'numDispBlur', (val) => {
      this.params.displacement.blur = val;
      this.reprocess();
    });

    const chkDispInv = document.getElementById('chkDispInvert');
    if (chkDispInv) {
      chkDispInv.onchange = (e) => {
        this.params.displacement.invert = e.target.checked;
        this.reprocess();
      };
    }

    // AO Events
    linkInput('rngAOStrength', 'numAOStrength', (val) => {
      this.params.ao.strength = val;
      this.reprocess();
    });

    linkInput('rngAORange', 'numAORange', (val) => {
      this.params.ao.range = val;
      this.reprocess();
    });

    const selAOFalloff = document.getElementById('selAOFalloff');
    if (selAOFalloff) {
      selAOFalloff.onchange = (e) => {
        this.params.ao.falloff = e.target.value;
        this.reprocess();
      };
    }

    // Specular Events
    linkInput('rngSpecStrength', 'numSpecStrength', (val) => {
      this.params.specular.strength = val;
      this.reprocess();
    });

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
