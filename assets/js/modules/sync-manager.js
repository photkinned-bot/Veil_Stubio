/**
 * SyncManager
 * Automatic Canvas Data Sync Manager for Vale Studio.
 * Subscribes to primary active canvas updates, active layer changes, or manual uploads
 * and provides ImageData for the Map Generator processing engine.
 */

export class SyncManager {
  constructor(options = {}) {
    this.options = options;
    this.subscribers = [];
    this.lastImageData = null;
    this.sourceType = 'composite'; // 'composite' | 'active_layer' | 'manual'
    this.manualImage = null;
  }

  /**
   * Subscribe callback for data updates: fn(imageData, metadata)
   */
  subscribe(callback) {
    if (typeof callback === 'function' && !this.subscribers.includes(callback)) {
      this.subscribers.push(callback);
    }
  }

  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter(cb => cb !== callback);
  }

  notifySubscribers(imageData, metadata = {}) {
    this.lastImageData = imageData;
    for (const callback of this.subscribers) {
      try {
        callback(imageData, metadata);
      } catch (err) {
        console.error('SyncManager subscriber error:', err);
      }
    }
  }

  setSourceType(type) {
    if (this.sourceType !== type) {
      this.sourceType = type;
      this.pullCanvasData();
    }
  }

  /**
   * Extract ImageData from Vale Studio's active composite canvas or selected layer
   */
  pullCanvasData() {
    try {
      if (this.sourceType === 'manual' && this.manualImage) {
        const imgData = this.imageToImageData(this.manualImage);
        this.notifySubscribers(imgData, { source: 'manual' });
        return imgData;
      }

      if (this.sourceType === 'active_layer') {
        const layerImageData = this.extractActiveLayerImageData();
        if (layerImageData) {
          this.notifySubscribers(layerImageData, { source: 'active_layer' });
          return layerImageData;
        }
      }

      // Default: Pull from primary composite canvas
      if (typeof window.renderProject === 'function') {
        const res = (window.mapGeneratorTab && window.mapGeneratorTab.fastPreview && window.mapGeneratorTab.isInteractingWithSliders)
      ? 256
      : (window.mapGeneratorTab?.targetResolution || (window.state && window.state.resolution) || 1024);
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = res;
        tempCanvas.height = res;
        window.renderProject(tempCanvas);
        const ctx = tempCanvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, res, res);
        this.notifySubscribers(imgData, { source: 'composite' });
        return imgData;
      }

      const mainCanvas = document.getElementById('canvas') || (window.$ && window.$('canvas')) || document.querySelector('canvas');
      if (mainCanvas && mainCanvas.width > 0 && mainCanvas.height > 0) {
        const ctx = mainCanvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
        this.notifySubscribers(imgData, { source: 'composite' });
        return imgData;
      }
    } catch (err) {
      console.error('SyncManager: Error pulling canvas data:', err);
    }
    return null;
  }

  /**
   * Extract ImageData from the active layer in window.state
   */
  extractActiveLayerImageData() {
    if (!window.state || !window.state.layers) return null;
    const selectedId = window.state.selectedLayerId;
    const layer = window.state.layers.find(l => l.id === selectedId) || window.state.layers[0];

    if (!layer) return null;

    if (layer.paintCanvas) {
      const ctx = layer.paintCanvas.getContext('2d');
      return ctx.getImageData(0, 0, layer.paintCanvas.width, layer.paintCanvas.height);
    }

    if (layer.cachedBuffer) {
      // Reconstruct ImageData from layer float buffer
      const width = 512;
      const height = 512;
      const imgData = new ImageData(width, height);
      const data = imgData.data;
      const buf = layer.cachedBuffer;

      for (let i = 0; i < buf.length; i++) {
        const val = Math.round(buf[i] * 255);
        const idx = i * 4;
        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val;
        data[idx + 3] = 255;
      }
      return imgData;
    }

    return null;
  }

  /**
   * Handle manual file upload (Drag & drop or file picker)
   */
  loadManualFile(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Обраний файл не є зображенням'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          this.manualImage = img;
          this.sourceType = 'manual';
          const imgData = this.imageToImageData(img);
          this.notifySubscribers(imgData, { source: 'manual', filename: file.name });
          resolve(imgData);
        };
        img.onerror = () => reject(new Error('Помилка зчитування зображення'));
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Convert HTMLImageElement to ImageData
   */
  imageToImageData(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width || 512;
    canvas.height = img.naturalHeight || img.height || 512;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
}

window.SyncManager = SyncManager;
