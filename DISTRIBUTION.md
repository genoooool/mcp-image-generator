# Distribution Guide

This guide explains different ways to distribute and install the MCP Image Generator server.

---

## Method 1: GitHub Distribution (Recommended for Open Source)

### For Publisher:

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Tag releases** (optional but recommended):
```bash
git tag v1.0.0
git push origin v1.0.0
```

### For Users:

1. Clone the repository:
```bash
git clone <repository-url>
cd <directory-name>
```

2. Install dependencies and build:
```bash
npm install
npm run build
```

3. Configure OpenCode:
Add to `opencode.json`:
```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "image-generator-yunwu": {
      "type": "local",
      "command": ["node", "<path-to-cloned-repo>/dist/index.js"],
      "enabled": true,
      "environment": {
        "IMAGE_PROVIDER": "yunwu",
        "IMAGE_TOKEN": "your-yunwu-token",
        "IMAGE_OUT_DIR": "./images"
      }
    }
  }
}
```

**Pros**: No npm permissions needed, users can view source code
**Cons**: Users need to build themselves
**Best for**: Open source projects, technical users

---

## Method 2: NPM Package Publishing

### For Publisher:

1. **Update `package.json`**:
Ensure these fields are included:
```json
{
  "name": "mcp-image-generator-yunwu",
  "version": "1.0.0",
  "description": "MCP server for AI image generation with multi-provider support",
  "main": "dist/index.js",
  "bin": {
    "mcp-image-generator": "./dist/index.js"
  },
  "files": ["dist"],
  "repository": {
    "type": "git",
    "url": "git+<your-repo-url>.git"
  },
  "keywords": ["mcp", "image-generation", "openai", "gemini", "yunwu"],
  "license": "MIT"
}
```

2. **Make sure executable has shebang**:
`dist/index.js` should start with:
```javascript
#!/usr/bin/env node
```

3. **Publish to npm**:
```bash
npm login
npm publish
```

### For Users:

1. Install globally:
```bash
npm install -g mcp-image-generator-yunwu
```

2. Configure OpenCode:
```jsonc
{
  "mcp": {
    "image-generator": {
      "type": "local",
      "command": ["mcp-image-generator"],
      "enabled": true,
      "environment": {
        "IMAGE_PROVIDER": "yunwu",
        "IMAGE_TOKEN": "your-token",
        "IMAGE_OUT_DIR": "./images"
      }
    }
  }
}
```

**Pros**: One-click install, easy updates, standard npm workflow
**Cons**: Requires npm account, version management
**Best for**: Official releases, wide distribution

---

## Method 3: NPX One-Line Installation

### For Publisher:

Same as Method 2, but emphasize NPX usage in README.

### For Users:

No installation needed! Just configure `opencode.json`:
```jsonc
{
  "mcp": {
    "image-generator": {
      "type": "local",
      "command": ["npx", "-y", "mcp-image-generator-yunwu"],
      "enabled": true,
      "environment": {
        "IMAGE_PROVIDER": "yunwu",
        "IMAGE_TOKEN": "your-token",
        "IMAGE_OUT_DIR": "./images"
      }
    }
  }
}
```

OpenCode will automatically download and run the package on first use.

**Pros**: Simplest for users, no manual installation, always latest version
**Cons**: Download time on first run, requires internet connection
**Best for**: Quick testing, non-technical users

---

## Method 4: Precompiled Binary

### For Publisher:

1. **Ensure build is complete**:
```bash
npm run build
```

2. **Package the `dist` directory**:

   **Windows PowerShell**:
   ```powershell
   Compress-Archive -Path dist -DestinationPath image-generator-dist.zip
   ```

   **Linux/macOS**:
   ```bash
   zip -r image-generator-dist.zip dist/
   ```

3. **Optionally compile to executable** using pkg or nexe:
```bash
npm install -g pkg
pkg dist/index.js --targets node18-win-x64 --output image-generator-win.exe
```

### For Users:

1. Download and extract the package

2. Configure OpenCode to point to the extracted path:
```jsonc
{
  "mcp": {
    "image-generator": {
      "type": "local",
      "command": ["node", "C:/path/to/extracted/dist/index.js"],
      "enabled": true,
      "environment": {
        "IMAGE_PROVIDER": "yunwu",
        "IMAGE_TOKEN": "your-token"
      }
    }
  }
}
```

If you provided an executable:
```jsonc
{
  "command": ["C:/path/to/image-generator-win.exe"]
}
```

**Pros**: Works without Node.js (if compiled to exe), single file
**Cons**: Larger file size, harder to update
**Best for**: Closed-source projects, users without Node.js

---

## Comparison Table

| Method | Ease of Use | Maintenance | Best For |
|--------|-------------|-------------|----------|
| **GitHub** | Medium (needs build) | Manual updates | Open source, technical users |
| **NPM** | Easy (one install) | Standard versioning | Official releases |
| **NPX** | Easiest (no install) | Auto-latest version | Quick testing, non-technical users |
| **Precompiled** | Medium (download only) | Manual updates | Closed source, offline scenarios |

---

## Quick Start for Users

### Option A: I want the easiest way
→ Use **NPX** (if npm package is published)

### Option B: I want to install once and forget
→ Use **NPM global install** (if npm package is published)

### Option C: I want to see the code and contribute
→ Use **GitHub clone**

### Option D: I don't have Node.js
→ Use **Precompiled binary** (if provided)

---

## Environment Variables Reference

All distribution methods require these environment variables:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `IMAGE_PROVIDER` | Yes | Provider type | `yunwu`, `gemini_official`, `custom_gemini` |
| `IMAGE_TOKEN` | Yes for bearer | Bearer token | `sk-xxx...` |
| `IMAGE_API_KEY` | Yes for apikey | API key | `AI...` |
| `IMAGE_BASE_URL` | Depends | Custom base URL | `https://your-provider.com` |
| `IMAGE_OUT_DIR` | No | Output directory | `./images` |
| `IMAGE_REQUEST_TIMEOUT` | No | Timeout in ms | `60000` |

---

## Publishing Checklist

Before publishing via NPM:

- [ ] Update `package.json` with correct name, version, description
- [ ] Ensure `dist/index.js` has shebang `#!/usr/bin/env node`
- [ ] Run `npm run build` to generate dist files
- [ ] Test with `npm link` locally
- [ ] Create GitHub release with changelog
- [ ] Update README with installation instructions
- [ ] Add `LICENSE` file
- [ ] Test installation on clean machine

---

## Support

For issues or questions:
- GitHub Issues: `<your-repo-url>/issues`
- Documentation: See `README.md` for detailed usage

---

## License

This project is licensed under the MIT License.
