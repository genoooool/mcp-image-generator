import { ProviderConfig, ProviderType, ImageProvider } from './types.js';
import { YunwuProvider } from './providers/yunwu.js';
import { GeminiOfficialProvider } from './providers/geminiOfficial.js';
import { CustomGeminiProvider } from './providers/customGemini.js';

export function getProviderFromEnv(): ImageProvider {
  const providerType = process.env.IMAGE_PROVIDER as ProviderType;

  if (!providerType) {
    throw new Error('IMAGE_PROVIDER environment variable is required');
  }

  return createProvider(providerType, getProviderConfig());
}

export function createProvider(type: ProviderType, config: ProviderConfig): ImageProvider {
  switch (type) {
    case 'yunwu':
      return new YunwuProvider(config);
    case 'gemini_official':
      return new GeminiOfficialProvider(config);
    case 'custom_gemini':
      return new CustomGeminiProvider(config);
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}

export function getProviderConfig(): ProviderConfig {
  const providerType = process.env.IMAGE_PROVIDER as ProviderType;

  // Default base URLs based on provider
  const defaultBaseUrls: Record<ProviderType, string> = {
    yunwu: 'https://yunwu.ai',
    gemini_official: 'https://generativelanguage.googleapis.com',
    custom_gemini: process.env.IMAGE_BASE_URL || ''
  };

  const baseUrl = process.env.IMAGE_BASE_URL || defaultBaseUrls[providerType];
  const authType = (process.env.IMAGE_AUTH_TYPE as 'bearer' | 'apikey') ||
    (providerType === 'yunwu' ? 'bearer' : 'apikey');
  const token = process.env.IMAGE_TOKEN;
  const apiKey = process.env.IMAGE_API_KEY;
  const timeout = process.env.IMAGE_REQUEST_TIMEOUT ? parseInt(process.env.IMAGE_REQUEST_TIMEOUT) : 60000;

  if (authType === 'bearer' && !token) {
    throw new Error(`IMAGE_TOKEN is required when IMAGE_AUTH_TYPE=bearer`);
  }

  if (authType === 'apikey' && !apiKey) {
    throw new Error(`IMAGE_API_KEY is required when IMAGE_AUTH_TYPE=apikey`);
  }

  if (providerType === 'custom_gemini' && !process.env.IMAGE_BASE_URL) {
    throw new Error(`IMAGE_BASE_URL is required for custom_gemini provider`);
  }

  return {
    baseUrl,
    authType,
    token,
    apiKey,
    timeout
  };
}
