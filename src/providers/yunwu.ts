import axios, { AxiosError } from 'axios';
import { ImageProvider, ImageGenerationConfig, ImageGenerationResult, ProviderConfig } from '../types.js';

export class YunwuProvider implements ImageProvider {
  private config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  getName(): 'yunwu' {
    return 'yunwu';
  }

  async generate(config: ImageGenerationConfig): Promise<ImageGenerationResult> {
    const url = `${this.config.baseUrl}/v1beta/models/${config.model}:generateContent`;

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
          aspectRatio: config.aspectRatio
        }
      }
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.config.authType === 'bearer' && this.config.token) {
      headers['Authorization'] = `Bearer ${this.config.token}`;
    }

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
          url: '',  // URL is not guaranteed for Yunwu
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

      // If no URL is available, only guarantee filePath
      throw new Error('Unable to extract image from response. Check stderr for raw response.');

    } catch (error) {
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status || 'unknown';
        const responseData = error.response?.data;
        throw new Error(`Yunwu API error (${statusCode}): ${JSON.stringify(responseData || error.message)}`);
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
