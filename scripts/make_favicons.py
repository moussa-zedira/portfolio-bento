"""
Génère le set complet de favicons pour le portfolio.

Sortie dans public/ :
  - favicon.ico (16, 32, 48)
  - favicon-16x16.png
  - favicon-32x32.png
  - apple-touch-icon.png (180x180)
  - android-chrome-192x192.png
  - android-chrome-512x512.png
  - favicon.svg

Design : initiales "MZ" blanches sur fond gradient diagonal
         #818cf8 (--accent) -> #c084fc (--accent-2).
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"

ACCENT = (129, 140, 248)    # #818cf8
ACCENT_2 = (192, 132, 252)  # #c084fc
WHITE = (255, 255, 255)
TEXT = "MZ"

FONT_CANDIDATES = [
    "C:/Windows/Fonts/seguibl.ttf",   # Segoe UI Black
    "C:/Windows/Fonts/arialbd.ttf",   # Arial Bold
    "C:/Windows/Fonts/segoeuib.ttf",  # Segoe UI Bold
]


def load_font(size: int) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def make_gradient(size: int) -> Image.Image:
    img = Image.new("RGB", (size, size), ACCENT)
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * (size - 1))
            r = int(ACCENT[0] + (ACCENT_2[0] - ACCENT[0]) * t)
            g = int(ACCENT[1] + (ACCENT_2[1] - ACCENT[1]) * t)
            b = int(ACCENT[2] + (ACCENT_2[2] - ACCENT[2]) * t)
            px[x, y] = (r, g, b)
    return img


def make_icon(size: int) -> Image.Image:
    img = make_gradient(size).convert("RGBA")
    draw = ImageDraw.Draw(img)

    target_height = int(size * 0.62)
    font_size = max(8, target_height)
    font = load_font(font_size)

    while font_size > 6:
        font = load_font(font_size)
        bbox = draw.textbbox((0, 0), TEXT, font=font)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
        if text_w <= size * 0.84 and text_h <= size * 0.72:
            break
        font_size -= 1

    bbox = draw.textbbox((0, 0), TEXT, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (size - text_w) // 2 - bbox[0]
    y = (size - text_h) // 2 - bbox[1]
    draw.text((x, y), TEXT, font=font, fill=WHITE)
    return img


def main():
    PUBLIC.mkdir(exist_ok=True)

    sizes = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "apple-touch-icon.png": 180,
        "android-chrome-192x192.png": 192,
        "android-chrome-512x512.png": 512,
    }
    for name, size in sizes.items():
        out = PUBLIC / name
        make_icon(size).save(out, "PNG")
        print(f"  {out.relative_to(ROOT)}  ({size}x{size})")

    ico_sizes = [16, 32, 48]
    ico_images = [make_icon(s) for s in ico_sizes]
    ico_path = PUBLIC / "favicon.ico"
    ico_images[0].save(
        ico_path,
        format="ICO",
        sizes=[(s, s) for s in ico_sizes],
        append_images=ico_images[1:],
    )
    print(f"  {ico_path.relative_to(ROOT)}  (multi {ico_sizes})")

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="10" fill="url(#g)"/>
  <text x="32" y="44" text-anchor="middle"
        font-family="'Segoe UI', 'Inter', Arial, sans-serif"
        font-weight="900" font-size="34" fill="#ffffff">MZ</text>
</svg>
"""
    svg_path = PUBLIC / "favicon.svg"
    svg_path.write_text(svg, encoding="utf-8")
    print(f"  {svg_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
