export interface User {
  id: string;
  email: string;
  credits: number;
}

export interface GeneratedImage {
  id: string;
  url: string; // Base64 or remote URL
  prompt: string;
  type: 'text-to-image' | 'product-to-scene';
  createdAt: number;
}

export enum ScenePreset {
  STUDIO = 'studio',
  DESK = 'desk',
  OUTDOOR = 'outdoor',
  SOFT = 'soft',
  DARK = 'dark'
}

export interface SceneConfig {
  id: ScenePreset;
  label: string;
  description: string;
  promptModifier: string;
  iconStr: string;
}

export interface GenerationResult {
  images: string[]; // Array of base64 strings
  cost: number;
}
