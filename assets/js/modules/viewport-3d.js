/**
 * Viewport3D
 * Three.js 3D viewport for real-time PBR material preview with interactive lighting,
 * geometry swapping (Cube, Plane, Sphere, Cylinder), displacement, and texture mapping.
 */

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class Viewport3D {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.options = options;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.mesh = null;

    this.dirLight = null;
    this.ambientLight = null;
    this.lightGizmo = null;

    this.currentShape = "cube";
    this.repeatX = 1;
    this.repeatY = 1;
    this.displacementScale = 0.05;
    this.autoRotate = false;

    this.maps = {
      diffuse: null,
      normal: null,
      displacement: null,
      ao: null,
      specular: null,
    };

    this.activeMaps = {
      diffuse: true,
      normal: true,
      displacement: true,
      ao: true,
      specular: true,
    };

    this.textures = {};
    this.animFrameId = null;
    this.resizeObserver = null;

    this.init();
  }

  init() {
    if (!this.container) return;

    const width = this.container.clientWidth || 512;
    const height = this.container.clientHeight || 512;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x18181c);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(2.2, 1.8, 2.5);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 15;
    this.controls.minDistance = 0.5;

    // 5. Studio Lighting Setup
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x333344, 0.8);
    this.scene.add(this.hemiLight);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(this.ambientLight);

    // Key Light
    this.dirLight = new THREE.DirectionalLight(0xfff5ea, 1.8);
    this.dirLight.position.set(3, 4, 3);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);

    // Fill Light (Rear-Left)
    this.fillLight = new THREE.DirectionalLight(0x88bbff, 0.8);
    this.fillLight.position.set(-3, 2, -2);
    this.scene.add(this.fillLight);

    // Light position marker gizmo
    const gizmoGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const gizmoMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
    });
    this.lightGizmo = new THREE.Mesh(gizmoGeo, gizmoMat);
    this.lightGizmo.position.copy(this.dirLight.position);
    this.scene.add(this.lightGizmo);

    // 6. Mesh Creation
    this.createGeometry(this.currentShape);

    // 7. Grid & Background Floor
    const gridHelper = new THREE.GridHelper(10, 20, 0x3b82f6, 0x27272a);
    gridHelper.position.y = -1.01;
    this.scene.add(gridHelper);

    // 8. Resize Observer
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.container);

    // 9. Animation Loop
    this.animate = this.animate.bind(this);
    this.animate();
  }

  createGeometry(shapeType) {
    this.currentShape = shapeType;

    if (this.mesh) {
      this.scene.remove(this.mesh);
      if (this.mesh.geometry) this.mesh.geometry.dispose();
    }

    let geometry;
    const segs = 128; // High resolution mesh for smooth displacement mapping

    switch (shapeType) {
      case "plane":
        geometry = new THREE.PlaneGeometry(2, 2, segs, segs);
        break;
      case "sphere":
        geometry = new THREE.SphereGeometry(1, segs, segs);
        break;
      case "cylinder":
        geometry = new THREE.CylinderGeometry(0.8, 0.8, 2, segs, segs);
        break;
      case "cube":
      default:
        geometry = new THREE.BoxGeometry(1.6, 1.6, 1.6, segs, segs, segs);
        break;
    }

    const material = this.createMaterial();
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    if (shapeType === "plane") {
      this.mesh.rotation.x = -Math.PI / 2;
      this.mesh.position.y = 0;
    } else {
      this.mesh.position.y = 0;
    }

    this.scene.add(this.mesh);
  }

  createMaterial() {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Elegant slate-400 base color when diffuse map is off
      roughness: 0.55,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    this.applyTexturesToMaterial(mat);
    return mat;
  }

  applyTexturesToMaterial(mat) {
    if (!mat) return;

    const textureLoader = new THREE.TextureLoader();

    const applyTexture = (key, mapProp, isNormal = false) => {
      const dataUrl = this.maps[key];
      const isActive = this.activeMaps[key];

      if (dataUrl && isActive) {
        if (!this.textures[key] || this.textures[key].image?.src !== dataUrl) {
          if (this.textures[key]) this.textures[key].dispose();

          const tex = textureLoader.load(dataUrl, (t) => {
            t.wrapS = THREE.RepeatWrapping;
            t.wrapT = THREE.RepeatWrapping;
            t.repeat.set(this.repeatX, this.repeatY);
            t.needsUpdate = true;
            if (this.renderer && this.scene && this.camera) {
              this.renderer.render(this.scene, this.camera);
            }
          });
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(this.repeatX, this.repeatY);

          this.textures[key] = tex;
        } else {
          this.textures[key].repeat.set(this.repeatX, this.repeatY);
        }

        mat[mapProp] = this.textures[key];
        if (isNormal) {
          mat.normalScale.set(1.2, 1.2);
        }
      } else {
        mat[mapProp] = null;
      }
    };

    applyTexture("diffuse", "map");
    applyTexture("normal", "normalMap", true);
    applyTexture("displacement", "displacementMap");
    applyTexture("ao", "aoMap");
    applyTexture("specular", "roughnessMap");

    // Color handling
    if (this.maps.diffuse && this.activeMaps.diffuse) {
      mat.color.setHex(0xffffff);
    } else {
      mat.color.setHex(0x94a3b8);
    }

    if (this.maps.specular && this.activeMaps.specular) {
      mat.roughness = 0.8;
    } else {
      mat.roughness = 0.55;
    }

    mat.displacementScale = this.activeMaps.displacement
      ? this.displacementScale
      : 0;
    mat.displacementBias = -this.displacementScale * 0.5;
    mat.needsUpdate = true;
  }

  updateTextures(maps) {
    if (!maps) return;
    let changed = false;

    for (const key of ["diffuse", "normal", "displacement", "ao", "specular"]) {
      if (maps[key] !== undefined && maps[key] !== this.maps[key]) {
        this.maps[key] = maps[key];
        changed = true;
      }
    }

    if (changed && this.mesh) {
      this.applyTexturesToMaterial(this.mesh.material);
    }
  }

  toggleMapActive(key, isActive) {
    if (this.activeMaps[key] !== isActive) {
      this.activeMaps[key] = isActive;
      if (this.mesh) {
        this.applyTexturesToMaterial(this.mesh.material);
      }
    }
  }

  setLightParams({ intensity, x, y, z, ambientIntensity }) {
    if (this.dirLight) {
      if (intensity !== undefined) this.dirLight.intensity = intensity;
      if (x !== undefined && y !== undefined && z !== undefined) {
        this.dirLight.position.set(x, y, z);
        if (this.lightGizmo) this.lightGizmo.position.set(x, y, z);
      }
    }
    if (this.ambientLight && ambientIntensity !== undefined) {
      this.ambientLight.intensity = ambientIntensity;
    }
  }

  setMaterialParams({
    displacementScale,
    roughness,
    metalness,
    repeatX,
    repeatY,
    wireframe,
  }) {
    if (repeatX !== undefined || repeatY !== undefined) {
      this.repeatX = repeatX !== undefined ? repeatX : this.repeatX;
      this.repeatY = repeatY !== undefined ? repeatY : this.repeatY;

      Object.values(this.textures).forEach((tex) => {
        if (tex) tex.repeat.set(this.repeatX, this.repeatY);
      });
    }

    if (displacementScale !== undefined) {
      this.displacementScale = displacementScale;
    }

    if (this.mesh && this.mesh.material) {
      const mat = this.mesh.material;
      if (roughness !== undefined) mat.roughness = roughness;
      if (metalness !== undefined) mat.metalness = metalness;
      if (wireframe !== undefined) mat.wireframe = wireframe;
      mat.displacementScale = this.activeMaps.displacement
        ? this.displacementScale
        : 0;
      mat.displacementBias = -this.displacementScale * 0.5;
      mat.needsUpdate = true;
    }
  }

  toggleAutoRotate(enable) {
    this.autoRotate = enable !== undefined ? enable : !this.autoRotate;
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animFrameId = requestAnimationFrame(this.animate);

    if (this.controls) this.controls.update();

    if (this.autoRotate && this.mesh) {
      this.mesh.rotation.y += 0.005;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  dispose() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.resizeObserver) this.resizeObserver.disconnect();

    Object.values(this.textures).forEach((tex) => tex?.dispose());

    if (this.mesh) {
      this.mesh.geometry?.dispose();
      this.mesh.material?.dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement?.parentNode) {
        this.renderer.domElement.parentNode.removeChild(
          this.renderer.domElement,
        );
      }
    }
  }
}

window.Viewport3D = Viewport3D;
