import axios, { AxiosError } from 'axios';
import { ImageProvider, ImageGenerationConfig, ImageGenerationResult, ProviderConfig } from '../types.js';

export class CustomGeminiProvider implements ImageProvider {
  private config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  getName(): 'custom_gemini' {
    return 'custom_gemini';
  }

  async generate(config: ImageGenerationConfig): Promise<ImageGenerationResult> {
    let url = `${this.config.baseUrl}/v1beta/models/${config.model}:generateContent`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Add API key to query string for apikey auth type
    if (this.config.authType === 'apikey') {
      url += `?key=${this.config.apiKey}`;
    }

    // Add Authorization header for bearer auth type
    if (this.config.authType === 'bearer' && this.config.token) {
      headers['Authorization'] = `Bearer ${this.config.token}`;
    }

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: config.prompt
            }
          ]
        }
      ],
      generationConfig: {
        responseModalities: ['image'],
        imageConfig: {
          aspectRatio: config.aspectRatio,
          imageSize: config.imageSize
        }
      }
    };

    try {
      const response = await axios.post(url, requestBody, {
        headers,
        timeout: this.config.timeout
      });

      const data = response.data;

      // Check for response with image URL
      if (data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
        // Base64 encoded image
        const base64Data = data.candidates[0].content.parts[0].inlineData.data;
        const mimeType = data.candidates[0].content.parts[0].inlineData.mime_type || 'image/png';
        const extension = mimeType.split('/')[1] || 'png';

        return {
          url: '',
          filePath: await this.saveBase64Image(base64Data, extension),
          provider: this.getName()
        };
      }

      // Check for direct URL
      if (data.candidates?.[0]?.content?.parts?.[0]?.fileData?.uri) {
        return {
          url: data.candidates[0].content.parts[0].fileData.uri,
          filePath: null,
          provider: this.getName()
        };
      }

      throw new Error('Unable to extract image from response');

    } catch (error) {
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status || 'unknown';
        const responseData = error.response?.data;
        throw new Error(`Custom Gemini API error (${statusCode}): ${JSON.stringify(responseData || error.message)}`);
      }
      throw error;
    }
  }

  private async saveBase64Image(base64Data: string, extension: string): Promise<string> {
    const outDir = process.env.IMAGE_OUT_DIR || './output';
    const fs = await import('fs/promises');
    const path = await import('path');

    // Create directory if not exists
    await fs.mkdir(outDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
    const filename = `${timestamp}.${extension}`;
    const filePath = path.join(outDir, filename);

    const buffer = Buffer.from(base64Data, 'base64');
    await fs.writeFile(filePath, buffer);

    return filePath;
  }
}
