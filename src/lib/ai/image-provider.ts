import { IMAGE_STYLE_PROMPT } from "../constants";
import type { GeneratedImage, ImagePrompt } from "../types";

export interface ImageGenerationProvider {
  generateImages(prompts: ImagePrompt[]): Promise<GeneratedImage[]>;
}

const placeholderColors = ["#F6D6B3", "#D8E8F0", "#E8D4F0", "#D4E8D4"];

export class StubImageProvider implements ImageGenerationProvider {
  async generateImages(prompts: ImagePrompt[]): Promise<GeneratedImage[]> {
    await delay(1500);

    return prompts.map((item, index) => ({
      type: item.type,
      scene: item.scene,
      url: buildPlaceholderUrl(item, index),
      prompt: `${item.prompt}. ${IMAGE_STYLE_PROMPT}`,
    }));
  }
}

export class ChatGptImageProvider implements ImageGenerationProvider {
  async generateImages(_prompts: ImagePrompt[]): Promise<GeneratedImage[]> {
    throw new Error(
      "ChatGPT image provider is not configured yet. Set OPENAI_API_KEY and implement integration.",
    );
  }
}

export class NanoBananaImageProvider implements ImageGenerationProvider {
  async generateImages(_prompts: ImagePrompt[]): Promise<GeneratedImage[]> {
    throw new Error(
      "Nano Banana image provider is not configured yet. Set NANO_BANANA_API_KEY and implement integration.",
    );
  }
}

export function getImageProvider(): ImageGenerationProvider {
  if (process.env.NANO_BANANA_API_KEY) {
    return new NanoBananaImageProvider();
  }
  if (process.env.OPENAI_API_KEY) {
    return new ChatGptImageProvider();
  }
  return new StubImageProvider();
}

function buildPlaceholderUrl(prompt: ImagePrompt, index: number): string {
  const color = placeholderColors[index % placeholderColors.length].replace("#", "");
  const label = encodeURIComponent(
    prompt.type === "cover" ? "Обложка" : `Сцена ${prompt.scene}`,
  );
  return `https://placehold.co/900x600/${color}/5C4A3A?text=${label}`;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
