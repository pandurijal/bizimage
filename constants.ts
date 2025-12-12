import { SceneConfig, ScenePreset } from './types';

export const APP_NAME = "BizImage.ai";

export const BRANDING_INFO = {
  whatsapp: "+62 812-3456-7890",
  website: "www.bizimage.ai"
};

export const SCENES: SceneConfig[] = [
  {
    id: ScenePreset.STUDIO,
    label: "Studio White",
    description: "Clean, professional white background with soft shadows",
    promptModifier: "placed on a seamless white studio background, professional product photography, high key lighting, sharp focus, 4k",
    iconStr: "Box"
  },
  {
    id: ScenePreset.DESK,
    label: "Minimalist Desk",
    description: "Modern workspace environment",
    promptModifier: "placed on a clean minimalist wooden desk, warm natural lighting, blurred office background, professional workspace aesthetic",
    iconStr: "Monitor"
  },
  {
    id: ScenePreset.OUTDOOR,
    label: "Outdoor Lifestyle",
    description: "Natural sunlight and nature vibes",
    promptModifier: "placed outdoors in a sunny park, natural sunlight, bokeh nature background, lifestyle photography, vibrant colors",
    iconStr: "Sun"
  },
  {
    id: ScenePreset.SOFT,
    label: "Soft Aesthetic",
    description: "Pastel tones and cozy feel",
    promptModifier: "placed on a soft pastel fabric surface, cozy atmosphere, dreamy lighting, soft focus, aesthetic instagram style",
    iconStr: "Feather"
  },
  {
    id: ScenePreset.DARK,
    label: "Dark Premium",
    description: "Luxurious dark moody atmosphere",
    promptModifier: "placed on a dark slate surface, dramatic rim lighting, moody atmosphere, premium luxury aesthetic, cinematic",
    iconStr: "Moon"
  }
];

export const CREDIT_PACKAGES = [
  { credits: 30, price: 9.99, label: "Starter" },
  { credits: 100, price: 29.99, label: "Pro", popular: true },
  { credits: 500, price: 99.99, label: "Agency" },
];