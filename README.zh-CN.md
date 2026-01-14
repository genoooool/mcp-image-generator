# @genoooool/mcp-image-generator

**这是一个 MCP（Model Context Protocol）服务器**，用于AI图片生成，支持多个Provider。

## 功能特性

- **多Provider支持**：无需修改代码即可在云雾、Gemini官方和自定义Gemini Provider之间切换
- **环境变量配置**：所有Provider设置都通过环境变量控制
- **灵活输出**：可将图片保存到自定义目录并指定文件名
- **多种宽高比**：支持 1:1、16:9、9:16、4:3、3:4
- **质量控制**：支持标准和高质量选项
- **错误处理**：包含HTTP状态码和响应详情的完整错误信息
- **超时支持**：可配置的请求超时时间（默认60秒）

## 支持的MCP客户端

此MCP服务器可用于：
- **Claude Code** (Claude Desktop)
- **OpenCode**
- 任何兼容MCP的客户端

## 安装

### 方式1：NPX（推荐 - 无需安装）

```bash
npx -y @genoooool/mcp-image-generator
```

### 方式2：全局安装

```bash
npm install -g @genoooool/mcp-image-generator
```

### 方式3：本地安装

```bash
# 克隆或下载仓库
cd /path/to/project

# 安装依赖
npm install

# 构建项目
npm run build
```

## 配置

### 环境变量

| 变量 | 必填 | 说明 | 默认值 |
|------|--------|------|---------|
| `IMAGE_PROVIDER` | 是 | Provider类型：`yunwu`、`gemini_official` 或 `custom_gemini` | - |
| `IMAGE_BASE_URL` | 取决于Provider | 覆盖默认的基础URL | Provider特定 |
| `IMAGE_AUTH_TYPE` | 否 | 认证类型：`bearer` 或 `apikey` | Provider特定 |
| `IMAGE_TOKEN` | bearer认证时必填 | 用于认证的Bearer令牌 | - |
| `IMAGE_API_KEY` | apikey认证时必填 | 用于认证的API密钥 | - |
| `IMAGE_OUT_DIR` | 否 | 图片的默认输出目录 | `./output` |
| `IMAGE_REQUEST_TIMEOUT` | 否 | 请求超时时间（毫秒） | `60000` |

### 如何切换Provider

#### 1. 使用云雾Provider

设置以下环境变量：

```bash
export IMAGE_PROVIDER=yunwu
export IMAGE_TOKEN=your_yunwu_token
export IMAGE_BASE_URL=https://yunwu.ai  # 可选，这是默认值
export IMAGE_OUT_DIR=./images  # 可选
```

#### 2. 使用Gemini官方Provider

设置以下环境变量：

```bash
export IMAGE_PROVIDER=gemini_official
export IMAGE_API_KEY=your_gemini_api_key
export IMAGE_BASE_URL=https://generativelanguage.googleapis.com  # 可选，这是默认值
export IMAGE_OUT_DIR=./images  # 可选
```

**注意**：Gemini官方API密钥认证使用查询参数 `?key=` 来访问 `generateContent` 端点。

#### 3. 使用自定义Gemini Provider

设置以下环境变量：

```bash
export IMAGE_PROVIDER=custom_gemini
export IMAGE_BASE_URL=https://your-custom-provider.com  # 必填
export IMAGE_API_KEY=your_api_key  # 或使用 IMAGE_TOKEN 并设置 IMAGE_AUTH_TYPE=bearer
export IMAGE_AUTH_TYPE=apikey  # 可选：'bearer' 或 'apikey'
export IMAGE_OUT_DIR=./images  # 可选
```

## MCP客户端配置

### Claude Code (Claude Desktop)

#### 配置文件位置

Claude Code从以下位置加载MCP配置：
- **Windows**：`%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**：`~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**：`~/.config/Claude/claude_desktop_config.json`

#### 配置格式

将MCP服务器添加到配置文件：

```jsonc
{
  "mcpServers": {
    "image-generator-yunwu": {
      "command": "npx",
      "args": ["-y", "@genoooool/mcp-image-generator"],
      "env": {
        "IMAGE_PROVIDER": "yunwu",
        "IMAGE_TOKEN": "your_yunwu_token",
        "IMAGE_OUT_DIR": "./images"
      }
    },
    "image-generator-gemini": {
      "command": "npx",
      "args": ["-y", "@genoooool/mcp-image-generator"],
      "env": {
        "IMAGE_PROVIDER": "gemini_official",
        "IMAGE_API_KEY": "your_gemini_api_key",
        "IMAGE_OUT_DIR": "./images"
      }
    },
    "image-generator-custom": {
      "command": "npx",
      "args": ["-y", "@genoooool/mcp-image-generator"],
      "env": {
        "IMAGE_PROVIDER": "custom_gemini",
        "IMAGE_BASE_URL": "https://your-custom-provider.com",
        "IMAGE_API_KEY": "your_api_key",
        "IMAGE_AUTH_TYPE": "apikey",
        "IMAGE_OUT_DIR": "./images"
      }
    }
  }
}
```

#### 使用全局安装

如果你已全局安装：

```jsonc
{
  "mcpServers": {
    "image-generator": {
      "command": "mcp-image-generator",
      "env": {
        "IMAGE_PROVIDER": "yunwu",
        "IMAGE_TOKEN": "your_token"
      }
    }
  }
}
```

#### 使用本地安装

如果你克隆了仓库：

**Windows**：
```jsonc
{
  "mcpServers": {
    "image-generator": {
      "command": "node",
      "args": ["C:\\path\\to\\project\\dist\\index.js"],
      "env": {
        "IMAGE_PROVIDER": "yunwu",
        "IMAGE_TOKEN": "your_token"
      }
    }
  }
}
```

**macOS/Linux**：
```jsonc
{
  "mcpServers": {
    "image-generator": {
      "command": "node",
      "args": ["/path/to/project/dist/index.js"],
      "env": {
        "IMAGE_PROVIDER": "yunwu",
        "IMAGE_TOKEN": "your_token"
      }
    }
  }
}
```

### OpenCode

#### 配置文件位置

OpenCode从以下位置加载MCP配置（按优先级顺序）：

1. **全局配置**：`~/.config/opencode/opencode.json`
2. **自定义配置**：`OPENCODE_CONFIG` 环境变量
3. **项目配置**：项目根目录下的 `opencode.json`

#### 配置格式

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "image-generator-yunwu": {
      "type": "local",
      "command": ["npx", "-y", "@genoooool/mcp-image-generator"],
      "enabled": true,
      "environment": {
        "IMAGE_PROVIDER": "yunwu",
        "IMAGE_TOKEN": "your_yunwu_token",
        "IMAGE_OUT_DIR": "./images"
      }
    },
    "image-generator-gemini": {
      "type": "local",
      "command": ["npx", "-y", "@genoooool/mcp-image-generator"],
      "enabled": true,
      "environment": {
        "IMAGE_PROVIDER": "gemini_official",
        "IMAGE_API_KEY": "your_gemini_api_key",
        "IMAGE_OUT_DIR": "./images"
      }
    }
  }
}
```

### Codex

#### 配置文件位置

Codex 从以下位置加载 MCP 配置：

1. **全局配置**：`~/.config/codex/config.toml`
2. **项目配置**：项目根目录下的 `codex.toml`

#### 配置格式

```toml
[mcp_servers.image_yunwu]
command = "npx"
args = ["-y", "@genoooool/mcp-image-generator"]

[mcp_servers.image_yunwu.env]
IMAGE_PROVIDER = "yunwu"
IMAGE_TOKEN = "你的_token"
IMAGE_OUT_DIR = "./images"

[mcp_servers.image_gemini]
command = "npx"
args = ["-y", "@genoooool/mcp-image-generator"]

[mcp_servers.image_gemini.env]
IMAGE_PROVIDER = "gemini_official"
IMAGE_API_KEY = "你的_gemini_api_key"
IMAGE_OUT_DIR = "./images"

[mcp_servers.image_custom]
command = "npx"
args = ["-y", "@genoooool/mcp-image-generator"]

[mcp_servers.image_custom.env]
IMAGE_PROVIDER = "custom_gemini"
IMAGE_BASE_URL = "https://your-custom-provider.com"
IMAGE_API_KEY = "你的_api_key"
IMAGE_AUTH_TYPE = "apikey"
IMAGE_OUT_DIR = "./images"
```

## 工具使用

### `generate_image`

使用AI模型生成图片。

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|---------|-------------|
| `model` | string | 否 | `gemini-3-pro-image-preview` | 用于生成的模型 |
| `prompt` | string | 是 | - | 图片生成的提示词 |
| `aspect_ratio` | string | 否 | `1:1` | 宽高比：`1:1`、`16:9`、`9:16`、`4:3`、`3:4` |
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

**注意**：对于云雾Provider，如果响应不包含URL字段，仅返回 `file_path`，`url` 将为空。

## 使用示例

### 示例1：生成简单图片

**输入**：
```json
{
  "prompt": "大海上的美丽日落",
  "aspect_ratio": "16:9",
  "quality": "high"
}
```

**输出**：
```json
{
  "url": "",
  "file_path": "./images/20260111_034500.png",
  "provider": "yunwu"
}
```

### 示例2：使用自定义文件名生成

**输入**：
```json
{
  "prompt": "夜晚的未来城市天际线",
  "model": "gemini-3-pro-image-preview",
  "aspect_ratio": "1:1",
  "out_dir": "./my_images",
  "filename": "cityscape.png"
}
```

**输出**：
```json
{
  "url": "",
  "file_path": "./my_images/cityscape.png",
  "provider": "gemini_official"
}
```

### 示例3：生成带直链的图片（如果支持）

**输入**：
```json
{
  "prompt": "宁静的山地景观",
  "aspect_ratio": "4:3",
  "quality": "standard"
}
```

**输出**：
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

然后通过stdin发送JSON-RPC消息。

## Provider详情

### 云雾Provider

- **端点**：`POST https://yunwu.ai/v1beta/models/{model}:generateContent`
- **认证**：通过 `Authorization: Bearer {token}` 请求头进行Bearer令牌认证
- **响应处理**：
  - 如果响应包含 `fileData.uri`，在 `url` 字段返回URL
  - 如果响应包含 `inlineData.data`，解码base64并保存到本地文件
  - 如果没有可用的URL，`url` 将为空，仅保证 `file_path`

### Gemini官方Provider

- **端点**：`POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}`
- **认证**：通过URL查询参数 `?key=` 使用API密钥
- **响应处理**：与云雾Provider相同

### 自定义Gemini Provider

- **端点**：通过 `IMAGE_BASE_URL` 可配置
- **认证**：基于 `IMAGE_AUTH_TYPE` 支持bearer令牌和API密钥
  - `bearer`：`Authorization: Bearer {token}` 请求头
  - `apikey`：`?key={api_key}` 查询参数

## 错误处理

当出现问题时，服务器会返回详细的错误信息：

- **HTTP错误**：包含HTTP状态码和响应体
- **验证错误**：包含字段名和验证消息
- **配置错误**：清楚标示缺少必填的环境变量

错误响应示例：
```
云雾API错误 (401): {"error": "无效令牌"}
```

## 故障排除

### "IMAGE_PROVIDER environment variable is required"
确保设置了 `IMAGE_PROVIDER` 环境变量。

### "IMAGE_TOKEN is required when IMAGE_AUTH_TYPE=bearer"
你使用了bearer认证类型但未提供令牌。请：
- 设置 `IMAGE_TOKEN` 环境变量
- 或改为 `apikey` 认证类型并设置 `IMAGE_API_KEY`

### "Unable to extract image from response"
API响应格式可能已更改。请检查Provider的API文档。

### 超时错误
通过设置 `IMAGE_REQUEST_TIMEOUT` 增加超时时间：
```bash
export IMAGE_REQUEST_TIMEOUT=120000  # 120秒
```

### Claude Code不显示MCP服务器
1. 确保编辑配置文件后已重启Claude Code
2. 检查配置文件路径对于你的操作系统是否正确
3. 验证命令在你的终端中有效（例如，运行 `npx -y @genoooool/mcp-image-generator`）
4. 检查Claude Code日志中的错误消息

## 许可证

MIT

## 作者

genoooool

## 链接

- [npm包](https://www.npmjs.com/package/@genoooool/mcp-image-generator)
- [GitHub仓库](https://github.com/genoooool/mcp-image-generator)
- [问题反馈](https://github.com/genoooool/mcp-image-generator/issues)
