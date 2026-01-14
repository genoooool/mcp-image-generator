export interface ImageGenerationConfig {
  model: string;
  prompt: string;
  aspectRatio: string;
  quality: string;
}

export interface ImageGenerationResult {
  url: string;
  filePath: string | null;
  provider: string;
}

export interface ProviderConfig {
  baseUrl: string;
  authType: 'bearer' | 'apikey';
  token?: string;
  apiKey?: string;
  timeout?: number;
}

export type ProviderType = 'yunwu' | 'gemini_official' | 'custom_gemini';

export interface ImageProvider {
  generate(config: ImageGenerationConfig): Promise<ImageGenerationResult>;
  getName(): ProviderType;
}
