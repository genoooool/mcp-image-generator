# MCP Image Generator

An MCP (Model Context Protocol) server for AI image generation with multi-provider support.

## Features

- **Multi-provider support**: Switch between Yunwu, Gemini Official, and custom Gemini providers without changing code
- **Environment variable configuration**: All provider settings controlled via environment variables
- **Flexible output**: Save images to custom directories with custom filenames
- **Multiple aspect ratios**: Support for 1:1, 16:9, 9:16, 4:3, 3:4
- **Quality control**: Standard and high quality options
- **Error handling**: Comprehensive error messages with HTTP status codes and response details
- **Timeout support**: Configurable request timeout (default: 60s)

## Installation

### Local Installation

```bash
# Clone or download the repository
cd F:\generate_image

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `IMAGE_PROVIDER` | Yes | Provider type: `yunwu`, `gemini_official`, or `custom_gemini` | - |
| `IMAGE_BASE_URL` | Depends on provider | Override default base URL | Provider-specific |
| `IMAGE_AUTH_TYPE` | No | Auth type: `bearer` or `apikey` | Provider-specific |
| `IMAGE_TOKEN` | Yes for bearer auth | Bearer token for authentication | - |
| `IMAGE_API_KEY` | Yes for apikey auth | API key for authentication | - |
| `IMAGE_OUT_DIR` | No | Default output directory for images | `./output` |
| `IMAGE_REQUEST_TIMEOUT` | No | Request timeout in milliseconds | `60000` |

### How to Switch Provider

#### 1. Using Yunwu Provider

Set the following environment variables:

```bash
export IMAGE_PROVIDER=yunwu
export IMAGE_TOKEN=your_yunwu_token
export IMAGE_BASE_URL=https://yunwu.ai  # Optional, this is the default
export IMAGE_OUT_DIR=./images  # Optional
```

#### 2. Using Gemini Official Provider

Set the following environment variables:

```bash
export IMAGE_PROVIDER=gemini_official
export IMAGE_API_KEY=your_gemini_api_key
export IMAGE_BASE_URL=https://generativelanguage.googleapis.com  # Optional, this is the default
export IMAGE_OUT_DIR=./images  # Optional
```

**Note**: Gemini Official API key authentication uses query parameter `?key=` for REST API requests to `generateContent` endpoints.

#### 3. Using Custom Gemini Provider

Set the following environment variables:

```bash
export IMAGE_PROVIDER=custom_gemini
export IMAGE_BASE_URL=https://your-custom-provider.com  # Required
export IMAGE_API_KEY=your_api_key  # Or use IMAGE_TOKEN with IMAGE_AUTH_TYPE=bearer
export IMAGE_AUTH_TYPE=apikey  # Optional: 'bearer' or 'apikey'
export IMAGE_OUT_DIR=./images  # Optional
```

## OpenCode MCP Configuration

### Configuration File Location

OpenCode loads MCP configuration from the following locations (in order of precedence):

1. **Global config**: `~/.config/opencode/opencode.json`
2. **Custom config**: `OPENCODE_CONFIG` environment variable
3. **Project config**: `opencode.json` in project root

For detailed information on configuration locations and precedence, see the [OpenCode Config documentation](https://opencode.ai/docs/config/).

### Configuration Format

Add the MCP server to your `opencode.json` file under the `mcp` section:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "image-generator-yunwu": {
      "type": "local",
      "command": ["node", "F:\\generate_image\\dist\\index.js"],
      "enabled": true,
      "environment": {
        "IMAGE_PROVIDER": "yunwu",
        "IMAGE_TOKEN": "your_yunwu_token",
        "IMAGE_OUT_DIR": "F:\\images"
      }
    },
    "image-generator-gemini": {
      "type": "local",
      "command": ["node", "F:\\generate_image\\dist\\index.js"],
      "enabled": true,
      "environment": {
        "IMAGE_PROVIDER": "gemini_official",
        "IMAGE_API_KEY": "your_gemini_api_key",
        "IMAGE_OUT_DIR": "F:\\images"
      }
    },
    "image-generator-custom": {
      "type": "local",
      "command": ["node", "F:\\generate_image\\dist\\index.js"],
      "enabled": true,
      "environment": {
        "IMAGE_PROVIDER": "custom_gemini",
        "IMAGE_BASE_URL": "https://your-custom-provider.com",
        "IMAGE_API_KEY": "your_api_key",
        "IMAGE_AUTH_TYPE": "apikey",
        "IMAGE_OUT_DIR": "F:\\images"
      }
    }
  }
}
```

### Enabling/Disabling MCP Servers

You can temporarily disable an MCP server by setting `enabled: false` in your configuration:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "image-generator": {
      "type": "local",
      "command": ["node", "F:\\generate_image\\dist\\index.js"],
      "enabled": false,  // Disabled - can be re-enabled by changing to true
      "environment": {
        "IMAGE_PROVIDER": "yunwu",
        "IMAGE_TOKEN": "your_token"
      }
    }
  }
}
```

### NPX One-Line Distribution

For quick installation without cloning the repository, you can use npx directly:

**Note**: This distribution method is not yet published to npm. To enable this feature, you would need to:

1. Publish the package to npm registry
2. Configure OpenCode to use npx with the published package name

Example (when published):

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "image-generator": {
      "type": "local",
      "command": ["npx", "-y", "mcp-image-generator"],
      "enabled": true,
      "environment": {
        "IMAGE_PROVIDER": "yunwu",
        "IMAGE_TOKEN": "your_token"
      }
    }
  }
}
```

**Current workaround**: For now, use the local installation method described above.

## Tool Usage

### `generate_image`

Generate an image using AI models.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `model` | string | No | `gemini-3-pro-image-preview` | Model to use for generation |
| `prompt` | string | Yes | - | The prompt for image generation |
| `aspect_ratio` | string | No | `1:1` | Aspect ratio: `1:1`, `16:9`, `9:16`, `4:3`, `3:4` |
| `quality` | string | No | `standard` | Quality: `standard` or `high` |
| `out_dir` | string | No | `./output` | Directory to save the image |
| `filename` | string | No | `timestamp.png` | Custom filename |

#### Return Value

```json
{
  "url": "string",
  "file_path": "string | null",
  "provider": "string"
}
```

**Note**: For Yunwu provider, if the response does not include a URL field, only `file_path` will be returned and `url` will be empty. The raw response will be logged to stderr for debugging.

## Example Usage

### Example 1: Generate a simple image

**Input:**
```json
{
  "prompt": "A beautiful sunset over the ocean",
  "aspect_ratio": "16:9",
  "quality": "high"
}
```

**Output:**
```json
{
  "url": "",
  "file_path": "F:\\images\\20260111_034500.png",
  "provider": "yunwu"
}
```

### Example 2: Generate with custom filename

**Input:**
```json
{
  "prompt": "A futuristic cityscape at night",
  "model": "gemini-3-pro-image-preview",
  "aspect_ratio": "1:1",
  "out_dir": "F:\\my_images",
  "filename": "cityscape.png"
}
```

**Output:**
```json
{
  "url": "",
  "file_path": "F:\\my_images\\cityscape.png",
  "provider": "gemini_official"
}
```

### Example 3: Generate with direct URL (if supported)

**Input:**
```json
{
  "prompt": "A peaceful mountain landscape",
  "aspect_ratio": "4:3",
  "quality": "standard"
}
```

**Output:**
```json
{
  "url": "https://cdn.example.com/images/abc123.png",
  "file_path": null,
  "provider": "yunwu"
}
```

## Development

### Build

```bash
npm run build
```

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Manual Testing

You can test the server manually by running:

```bash
IMAGE_PROVIDER=yunwu \
IMAGE_TOKEN=your_token \
node dist/index.js
```

Then send JSON-RPC messages via stdin.

## Provider Details

### Yunwu Provider

- **Endpoint**: `POST https://yunwu.ai/v1beta/models/{model}:generateContent`
- **Authentication**: Bearer token via `Authorization: Bearer {token}` header
- **Response Handling**:
  - If response contains `fileData.uri`, returns the URL in `url` field
  - If response contains `inlineData.data`, decodes base64 and saves to local file
  - If no URL is available, `url` will be empty and only `file_path` is guaranteed
  - Raw response is logged to stderr for debugging

### Gemini Official Provider

- **Endpoint**: `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}`
- **Authentication**: API key via query parameter `?key=` in the URL
- **Response Handling**: Same as Yunwu provider

### Custom Gemini Provider

- **Endpoint**: Configurable via `IMAGE_BASE_URL`
- **Authentication**: Supports both bearer token and API key based on `IMAGE_AUTH_TYPE`
  - `bearer`: `Authorization: Bearer {token}` header
  - `apikey`: `?key={api_key}` query parameter

## Error Handling

The server returns detailed error messages when issues occur:

- **HTTP errors**: Includes HTTP status code and response body
- **Validation errors**: Includes field names and validation messages
- **Configuration errors**: Clearly indicates missing required environment variables

Example error response:
```
Yunwu API error (401): {"error": "Invalid token"}
```

## Troubleshooting

### "IMAGE_PROVIDER environment variable is required"
Make sure you set the `IMAGE_PROVIDER` environment variable.

### "IMAGE_TOKEN is required when IMAGE_AUTH_TYPE=bearer"
You're using bearer auth type but didn't provide a token. Either:
- Set `IMAGE_TOKEN` environment variable
- Change to `apikey` auth type and set `IMAGE_API_KEY`

### "Unable to extract image from response"
The API response format may have changed. Check the provider's API documentation.

### Timeout errors
Increase the timeout by setting `IMAGE_REQUEST_TIMEOUT`:
```bash
export IMAGE_REQUEST_TIMEOUT=120000  # 120 seconds
```

## License

MIT
