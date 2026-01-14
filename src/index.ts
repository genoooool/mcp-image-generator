#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { getProviderFromEnv } from './providerFactory.js';
import { ImageGenerationConfig } from './types.js';

// Create MCP Server
const server = new Server(
  {
    name: 'mcp-image-generator',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Tool input schema
const GenerateImageInputSchema = z.object({
  model: z.string().default('gemini-3-pro-image-preview').optional(),
  prompt: z.string().describe('The prompt for image generation'),
  aspect_ratio: z.enum(['1:1', '16:9', '9:16', '4:3', '3:4']).default('1:1').optional(),
  quality: z.enum(['standard', 'high']).default('standard').optional(),
  out_dir: z.string().optional().describe('Directory to save the image (optional)'),
  filename: z.string().optional().describe('Custom filename (optional, default: timestamp.png)')
});

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'generate_image',
        description: 'Generate an image using AI models. Supports multiple providers (Yunwu, Gemini Official, Custom). Provider is configured via IMAGE_PROVIDER environment variable.',
        inputSchema: {
          type: 'object',
          properties: {
            model: {
              type: 'string',
              description: 'Model to use for generation (default: gemini-3-pro-image-preview)'
            },
            prompt: {
              type: 'string',
              description: 'The prompt for image generation'
            },
            aspect_ratio: {
              type: 'string',
              enum: ['1:1', '16:9', '9:16', '4:3', '3:4'],
              description: 'Aspect ratio of the generated image (default: 1:1)'
            },
            quality: {
              type: 'string',
              enum: ['standard', 'high'],
              description: 'Quality of the generated image (default: standard)'
            },
            out_dir: {
              type: 'string',
              description: 'Directory to save the image (optional)'
            },
            filename: {
              type: 'string',
              description: 'Custom filename (optional, default: timestamp.png)'
            }
          },
          required: ['prompt']
        }
      }
    ]
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'generate_image') {
    try {
      // Validate input
      const validated = GenerateImageInputSchema.parse(args);

      // Set output directory if provided
      if (validated.out_dir) {
        process.env.IMAGE_OUT_DIR = validated.out_dir;
      }

      // Get provider from environment
      const provider = getProviderFromEnv();

      // Build generation config
      const config: ImageGenerationConfig = {
        model: validated.model || 'gemini-3-pro-image-preview',
        prompt: validated.prompt,
        aspectRatio: validated.aspect_ratio || '1:1',
        quality: validated.quality || 'standard'
      };

      // Generate image
      const result = await provider.generate(config);

      // Handle custom filename
      if (validated.filename && result.filePath) {
        const fs = await import('fs/promises');
        const path = await import('path');
        const outDir = validated.out_dir || process.env.IMAGE_OUT_DIR || './output';
        const newFilePath = path.join(outDir, validated.filename);
        await fs.rename(result.filePath, newFilePath);
        result.filePath = newFilePath;
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };

    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
      }
      throw error;
    }
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Server is now listening on stdio
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
