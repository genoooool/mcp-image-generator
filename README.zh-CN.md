# MCP 图片生成器

一个支持多 Provider 的 MCP（Model Context Protocol）图片生成服务器。

## 功能特性

- **多 Provider 支持**：无需修改代码，可在云雾、Gemini 官方和自定义 Gemini Provider 之间切换
- **环境变量配置**：所有 Provider 设置均通过环境变量控制
- **灵活输出**：支持保存图片到自定义目录并指定文件名
- **多种宽高比**：支持 1:1, 16:9, 9:16, 4:3, 3:4
- **质量控制**：支持标准质量和高质量
- **错误处理**：包含 HTTP 状态码和响应详情的完整错误信息
- **超时支持**：可配置的请求超时时间（默认 60 秒）

## 安装

### 本地安装

```bash
# 克隆或下载仓库
cd F:\generate_image

# 安装依赖
npm install

# 构建项目
npm run build
```

## 配置

### 环境变量

| 变量 | 必填 | 说明 | 默认值 |
|------|--------|------|---------|
| `IMAGE_PROVIDER` | 是 | Provider 类型：`yunwu`、`gemini_official` 或 `custom_gemini` | - |
| `IMAGE_BASE_URL` | 取决于 Provider | 覆盖默认的基础 URL | Provider 特定 |
| `IMAGE_AUTH_TYPE` | 否 | 认证类型：`bearer` 或 `apikey` | Provider 特定 |
| `IMAGE_TOKEN` | bearer 认证时必填 | Bearer 令牌用于认证 | - |
| `IMAGE_API_KEY` | apikey 认证时必填 | API 密钥用于认证 | - |
| `IMAGE_OUT_DIR` | 否 | 图片的默认输出目录 | `./output` |
| `IMAGE_REQUEST_TIMEOUT` | 否 | 请求超时时间（毫秒） | `60000` |

### 如何切换 Provider

#### 1. 使用云雾 Provider

设置以下环境变量：

```bash
export IMAGE_PROVIDER=yunwu
export IMAGE_TOKEN=your_yunwu_token
export IMAGE_BASE_URL=https://yunwu.ai  # 可选，这是默认值
export IMAGE_OUT_DIR=./images  # 可选
```

#### 2. 使用 Gemini 官方 Provider

设置以下环境变量：

```bash
export IMAGE_PROVIDER=gemini_official
export IMAGE_API_KEY=your_gemini_api_key
export IMAGE_BASE_URL=https://generativelanguage.googleapis.com  # 可选，这是默认值
export IMAGE_OUT_DIR=./images  # 可选
```

**注意**：Gemini 官方 API 密钥认证使用查询参数 `?key=` 来访问 `generateContent` 端点。

#### 3. 使用自定义 Gemini Provider

设置以下环境变量：

```bash
export IMAGE_PROVIDER=custom_gemini
export IMAGE_BASE_URL=https://your-custom-provider.com  # 必填
export IMAGE_API_KEY=your_api_key  # 或使用 IMAGE_TOKEN 并设置 IMAGE_AUTH_TYPE=bearer
export IMAGE_AUTH_TYPE=apikey  # 可选：'bearer' 或 'apikey'
export IMAGE_OUT_DIR=./images  # 可选
```

## OpenCode MCP 配置

### 配置文件位置

OpenCode 从以下位置加载 MCP 配置（按优先级顺序）：

1. **全局配置**：`~/.config/opencode/opencode.json`
2. **自定义配置**：`OPENCODE_CONFIG` 环境变量
3. **项目配置**：项目根目录下的 `opencode.json`

有关配置位置和优先级的详细信息，请参阅 [OpenCode Config 文档](https://opencode.ai/docs/config/)。

### 配置格式

将 MCP 服务器添加到 `opencode.json` 文件的 `mcp` 部分：

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

### 启用/禁用 MCP 服务器

可以通过在配置中设置 `enabled: false` 来临时禁用 MCP 服务器：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "image-generator": {
      "type": "local",
      "command": ["node", "F:\\generate_image\\dist\\index.js"],
      "enabled": false,  // 已禁用 - 改为 true 可重新启用
      "environment": {
        "IMAGE_PROVIDER": "yunwu",
        "IMAGE_TOKEN": "your_token"
      }
    }
  }
}
```

### NPX 一行分发方案

无需克隆仓库即可快速安装：

**注意**：此分发方法尚未发布到 npm。要启用此功能，需要：

1. 将包发布到 npm 注册表
2. 配置 OpenCode 使用已发布的包名

示例（发布后）：

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

**当前解决方案**：目前请使用上述本地安装方法。

## 工具使用

### `generate_image`

使用 AI 模型生成图片。

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|---------|-------------|
| `model` | string | 否 | `gemini-3-pro-image-preview` | 用于生成的模型 |
| `prompt` | string | 是 | - | 图片生成的提示词 |
| `aspect_ratio` | string | 否 | `1:1` | 宽高比：`1:1`, `16:9`, `9:16`, `4:3`, `3:4` |
| `quality` | string | 否 | `standard` | 质量：`standard` 或 `high` |
| `out_dir` | string | 否 | `./output` | 保存图片的目录 |
| `filename` | string | 否 | `timestamp.png` | 自定义文件名 |

#### 返回值

```json
{
  "url": "string",
  "file_path": "string | null",
  "provider": "string"
}
```

**注意**：对于云雾 Provider，如果响应不包含 URL 字段，仅返回 `file_path`，`url` 将为空。原始响应会输出到 stderr 用于调试。

## 使用示例

### 示例 1：生成简单图片

**输入：**
```json
{
  "prompt": "大海上的美丽日落",
  "aspect_ratio": "16:9",
  "quality": "high"
}
```

**输出：**
```json
{
  "url": "",
  "file_path": "F:\\images\\20260111_034500.png",
  "provider": "yunwu"
}
```

### 示例 2：使用自定义文件名生成

**输入：**
```json
{
  "prompt": "夜晚的未来城市天际线",
  "model": "gemini-3-pro-image-preview",
  "aspect_ratio": "1:1",
  "out_dir": "F:\\my_images",
  "filename": "cityscape.png"
}
```

**输出：**
```json
{
  "url": "",
  "file_path": "F:\\my_images\\cityscape.png",
  "provider": "gemini_official"
}
```

### 示例 3：生成带直链的图片（如果支持）

**输入：**
```json
{
  "prompt": "宁静的山地景观",
  "aspect_ratio": "4:3",
  "quality": "standard"
}
```

**输出：**
```json
{
  "url": "https://cdn.example.com/images/abc123.png",
  "file_path": null,
  "provider": "yunwu"
}
```

## 开发

### 构建

```bash
npm run build
```

### 开发模式（带自动重载）

```bash
npm run dev
```

### 手动测试

可以通过运行以下命令手动测试服务器：

```bash
IMAGE_PROVIDER=yunwu \
IMAGE_TOKEN=your_token \
node dist/index.js
```

然后通过 stdin 发送 JSON-RPC 消息。

## Provider 详情

### 云雾 Provider

- **端点**：`POST https://yunwu.ai/v1beta/models/{model}:generateContent`
- **认证**：通过 `Authorization: Bearer {token}` 请求头进行 Bearer 令牌认证
- **响应处理**：
  - 如果响应包含 `fileData.uri`，在 `url` 字段返回 URL
  - 如果响应包含 `inlineData.data`，解码 base64 并保存到本地文件
  - 如果没有可用的 URL，`url` 将为空，仅保证 `file_path`
  - 原始响应会记录到 stderr 用于调试

### Gemini 官方 Provider

- **端点**：`POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}`
- **认证**：通过 URL 查询参数 `?key=` 使用 API 密钥
- **响应处理**：与云雾 Provider 相同

### 自定义 Gemini Provider

- **端点**：通过 `IMAGE_BASE_URL` 可配置
- **认证**：基于 `IMAGE_AUTH_TYPE` 支持 bearer 令牌和 API 密钥
  - `bearer`：`Authorization: Bearer {token}` 请求头
  - `apikey`：`?key={api_key}` 查询参数

## 错误处理

当出现问题时，服务器会返回详细的错误信息：

- **HTTP 错误**：包含 HTTP 状态码和响应体
- **验证错误**：包含字段名和验证消息
- **配置错误**：清楚标示缺少必填的环境变量

错误响应示例：
```
云雾 API 错误 (401): {"error": "无效令牌"}
```

## 故障排除

### "IMAGE_PROVIDER environment variable is required"
确保设置了 `IMAGE_PROVIDER` 环境变量。

### "IMAGE_TOKEN is required when IMAGE_AUTH_TYPE=bearer"
您使用了 bearer 认证类型但未提供令牌。请：
- 设置 `IMAGE_TOKEN` 环境变量
- 或改为 `apikey` 认证类型并设置 `IMAGE_API_KEY`

### "Unable to extract image from response"
API 响应格式可能已更改。请检查 Provider 的 API 文档。

### 超时错误
通过设置 `IMAGE_REQUEST_TIMEOUT` 增加超时时间：
```bash
export IMAGE_REQUEST_TIMEOUT=120000  # 120 秒
```

## 许可证

MIT
