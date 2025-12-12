import { GoogleGenAI } from "@google/genai";
import { BRANDING_INFO } from "../constants";

// Ensure API Key is available
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const MODEL_NAME = 'gemini-2.5-flash-image'; 

export const generateTextToImage = async (prompt: string): Promise<string[]> => {
  try {
    // Generating 2 images in parallel to balance speed/quota vs the PRD's 4 images goal.
    const numberOfImages = 2;
    
    // Inject Branding CTA into the prompt
    const brandingPrompt = `Ensure the image clearly displays the text "${BRANDING_INFO.website}" and "WA: ${BRANDING_INFO.whatsapp}" in a professional, unobtrusive way suitable for an advertisement.`;
    const finalPrompt = `${prompt}. ${brandingPrompt}`;

    const requests = Array.from({ length: numberOfImages }).map(async () => {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: {
          parts: [{ text: finalPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          }
        }
      });

      // Extract image from response
      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (part?.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
      return null;
    });

    const results = await Promise.all(requests);
    return results.filter((img): img is string => img !== null);

  } catch (error) {
    console.error("Text-to-Image Error:", error);
    throw new Error("Failed to generate images. Please try again.");
  }
};

export const generateProductScene = async (base64Image: string, scenePrompt: string, userPrompt?: string): Promise<string[]> => {
  try {
    // Extract mime type and base64 data correctly
    const matches = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    
    let mimeType = 'image/jpeg';
    let data = base64Image;

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      data = matches[2];
    } else {
       // Fallback: strip header if it doesn't match the regex but looks like data url
       data = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
    }

    const brandingPrompt = `The image MUST include visible text overlay: "${BRANDING_INFO.website}" and "WA: ${BRANDING_INFO.whatsapp}". Place this text elegantly as if it is a commercial advertisement poster.`;

    const fullPrompt = `Generate a high-quality commercial product image based on the input image.
    Scene Setting: ${scenePrompt}.
    ${userPrompt ? `Additional Details: ${userPrompt}.` : ''}
    Requirements: Keep the product in the input image as the focal point. Apply photorealistic lighting and shadows. Commercial photography style.
    ${brandingPrompt}`;

    // Order matters: Image first, then text prompt is often more reliable for "edit/transform" tasks in Gemini
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: data
            }
          },
          {
            text: fullPrompt,
          }
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    
    if (part?.inlineData?.data) {
      return [`data:image/png;base64,${part.inlineData.data}`];
    }
    
    return [];

  } catch (error) {
    console.error("Product-to-Scene Error:", error);
    throw new Error("Failed to transform product image. Ensure the image is clear.");
  }
};