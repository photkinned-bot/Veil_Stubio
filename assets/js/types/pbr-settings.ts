/**
 * Data structures and TypeScript interfaces for PBR Texture Map Settings
 * in Veil Studio procedural texture generator.
 */

export type PbrMapType = 'normal' | 'displacement' | 'ao' | 'specular' | 'diffuse';

export type NormalFilterAlgorithm = 'sobel' | 'scharr' | 'prewitt';

export interface NormalMapParams {
  algorithm: NormalFilterAlgorithm;
  strength: number;
  level: number;
  blur: number;
  sharp: number;
  invert: boolean;
  invertR: boolean;
  invertG: boolean;
  invertH: boolean;
}

export interface DisplacementMapParams {
  contrast: number;
  invert: boolean;
}

export type FalloffMode = 'none' | 'linear' | 'square';

export interface AOMapParams {
  strength: number;
  level: number;
  blur: number;
  sharp: number;
  invert: boolean;
  range?: number;
  falloff?: FalloffMode;
}

export interface SpecularMapParams {
  mean: number;
  range: number;
  falloff: FalloffMode;
  strength?: number;
  level?: number;
  blur?: number;
  sharp?: number;
  invert?: boolean;
}

export interface PbrSettingsState {
  activeMapType: PbrMapType;
  sourceType: 'composite' | 'active_layer' | 'manual';
  normal: NormalMapParams;
  displacement: DisplacementMapParams;
  ao: AOMapParams;
  specular: SpecularMapParams;
}
