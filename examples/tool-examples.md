# Example 1: Simple Image Generation
{
  "prompt": "A beautiful sunset over the ocean with vibrant colors",
  "aspect_ratio": "16:9",
  "quality": "high"
}

# Expected Output:
{
  "url": "",
  "file_path": "F:\\images\\20260111_034500.png",
  "provider": "yunwu"
}

---

# Example 2: Square Image with Default Quality
{
  "prompt": "A futuristic cityscape at night with neon lights",
  "model": "gemini-3-pro-image-preview",
  "aspect_ratio": "1:1"
}

# Expected Output:
{
  "url": "",
  "file_path": "F:\\images\\20260111_034501.png",
  "provider": "gemini_official"
}

---

# Example 3: Portrait Image with Custom Output Directory
{
  "prompt": "A serene mountain landscape with a lake reflection",
  "aspect_ratio": "9:16",
  "quality": "standard",
  "out_dir": "F:\\my_images"
}

# Expected Output:
{
  "url": "",
  "file_path": "F:\\my_images\\20260111_034502.png",
  "provider": "yunwu"
}

---

# Example 4: Image with Custom Filename
{
  "prompt": "A peaceful Japanese garden with cherry blossoms",
  "aspect_ratio": "4:3",
  "out_dir": "F:\\wallpapers",
  "filename": "cherry_blossom.png"
}

# Expected Output:
{
  "url": "",
  "file_path": "F:\\wallpapers\\cherry_blossom.png",
  "provider": "gemini_official"
}

---

# Example 5: Minimal Configuration
{
  "prompt": "A cute cartoon cat wearing glasses"
}

# Expected Output:
{
  "url": "",
  "file_path": "F:\\images\\20260111_034503.png",
  "provider": "yunwu"
}

---

# Example 6: Different Aspect Ratios
# 1:1 - Square
{
  "prompt": "Abstract geometric patterns",
  "aspect_ratio": "1:1"
}

# 16:9 - Widescreen
{
  "prompt": "Cinematic landscape",
  "aspect_ratio": "16:9"
}

# 9:16 - Portrait
{
  "prompt": "Portrait of a person",
  "aspect_ratio": "9:16"
}

# 4:3 - Standard
{
  "prompt": "Traditional painting style",
  "aspect_ratio": "4:3"
}

# 3:4 - Portrait standard
{
  "prompt": "Portrait photography style",
  "aspect_ratio": "3:4"
}

---

# Example 7: Quality Options
# Standard Quality
{
  "prompt": "A simple illustration",
  "quality": "standard"
}

# High Quality
{
  "prompt": "Detailed fantasy artwork",
  "quality": "high"
}
