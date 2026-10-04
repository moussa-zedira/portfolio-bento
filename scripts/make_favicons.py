"""
Genere le set complet de favicons pour le portfolio.

Sortie dans public/ :
  - favicon.ico (16, 32, 48)
  - favicon-16x16.png
  - favicon-32x32.png
  - apple-touch-icon.png (180x180)
  - android-chrome-192x192.png
  - android-chrome-512x512.png
  - favicon.svg

Design (voir design.md) : initiales « MZ » en Archivo elargie, bleu nuit
(#101926) sur le fond clair du site (#f4f7fa), avec un trait encre de Prusse
(#005591) dessous qui rappelle le filet « cable » de la barre de navigation.

Un favicon SVG ne peut pas charger de police web : les lettres y sont donc
converties en traces (fontTools), pour un rendu identique partout.

Prerequis : pip install pillow fonttools
"""
from pathlib import Path
import urllib.request

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
CACHE = Path(__file__).resolve().parent / ".font-cache"
ARCHIVO_URL = "https://github.com/google/fonts/raw/main/ofl/archivo/Archivo%5Bwdth,wght%5D.ttf"

# Les couleurs de tokens.css (en hex : Pillow et les favicons ne lisent pas l'OKLCH)
FOND = "#f4f7fa"         # fond : --color-paper
LETTRES = "#101926"      # lettres : --color-slate
TRAIT = "#005591"        # trait : --color-accent, l'encre de Prusse
TEXT = "MZ"
WIDTH, WEIGHT = 112, 800  # axes d'Archivo : un peu moins elargi que les titres, pour tenir en 16 px


def archivo_static() -> Path:
    """Archivo figee a la largeur et la graisse voulues (instance statique, en cache)."""
    CACHE.mkdir(exist_ok=True)
    var = CACHE / "Archivo-var.ttf"
    if not var.exists():
        urllib.request.urlretrieve(ARCHIVO_URL, var)
    static = CACHE / f"Archivo-w{WIDTH}-{WEIGHT}.ttf"
    if not static.exists():
        font = instancer.instantiateVariableFont(TTFont(var), {"wdth": WIDTH, "wght": WEIGHT})
        font.save(static)
    return static


def make_icon(size: int, font_path: Path) -> Image.Image:
    """Dessine en 4x puis reduit : bords nets meme a 16 px."""
    s = size * 4
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radius = int(s * 0.18)
    draw.rounded_rectangle((0, 0, s - 1, s - 1), radius=radius, fill=FOND)

    # la plus grande taille de texte qui tient dans 80 % de la largeur
    font_size = int(s * 0.6)
    while font_size > 8:
        font = ImageFont.truetype(str(font_path), font_size)
        l, t, r, b = draw.textbbox((0, 0), TEXT, font=font)
        if r - l <= s * 0.8:
            break
        font_size -= 2
    l, t, r, b = draw.textbbox((0, 0), TEXT, font=font)
    text_w, text_h = r - l, b - t
    bar_h = max(4, int(s * 0.07))
    gap = int(s * 0.07)
    block_h = text_h + gap + bar_h
    x = (s - text_w) // 2 - l
    y = (s - block_h) // 2 - t
    draw.text((x, y), TEXT, font=font, fill=LETTRES)
    # le trait « cable », de la largeur des initiales
    bar_y = (s - block_h) // 2 + text_h + gap
    draw.rounded_rectangle(((s - text_w) // 2, bar_y, (s + text_w) // 2, bar_y + bar_h), radius=bar_h // 2, fill=TRAIT)
    return img.resize((size, size), Image.LANCZOS)


def make_svg(font_path: Path) -> str:
    """Meme dessin en SVG, lettres converties en traces."""
    font = TTFont(font_path)
    gs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font["hmtx"]
    upm = font["head"].unitsPerEm
    advance = 0
    # chaque glyphe est decale de la chasse cumulee
    paths = []
    for ch in TEXT:
        name = cmap[ord(ch)]
        p = SVGPathPen(gs)
        gs[name].draw(p)
        paths.append((advance, p.getCommands()))
        advance += hmtx[name][0]
    # boite englobante approximative des capitales : 0 -> hauteur de capitale
    cap = font["OS/2"].sCapHeight or int(upm * 0.7)
    box, target_w = 64, 64 * 0.8
    scale = target_w / advance
    text_h = cap * scale
    bar_h, gap = 64 * 0.07, 64 * 0.07
    top = (box - (text_h + gap + bar_h)) / 2
    tx = (box - advance * scale) / 2
    baseline = top + text_h
    glyphs = "".join(
        f'<path transform="translate({tx + off * scale:.2f} {baseline:.2f}) scale({scale:.5f} {-scale:.5f})" d="{cmd}"/>'
        for off, cmd in paths)
    bar_y = baseline + gap
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
            f'<rect width="64" height="64" rx="11.5" fill="{FOND}"/>'
            f'<g fill="{LETTRES}">{glyphs}</g>'
            f'<rect x="{tx:.2f}" y="{bar_y:.2f}" width="{advance * scale:.2f}" height="{bar_h:.2f}" rx="{bar_h / 2:.2f}" fill="{TRAIT}"/>'
            f'</svg>\n')


def main():
    font_path = archivo_static()
    sizes = {"favicon-16x16.png": 16, "favicon-32x32.png": 32, "apple-touch-icon.png": 180,
             "android-chrome-192x192.png": 192, "android-chrome-512x512.png": 512}
    for name, size in sizes.items():
        icon = make_icon(size, font_path)
        if name == "apple-touch-icon.png":
            # iOS n'aime pas la transparence : fond plein, iOS arrondit lui-meme
            flat = Image.new("RGB", (size, size), FOND)
            flat.paste(icon, (0, 0), icon)
            icon = flat
        icon.save(PUBLIC / name, optimize=True)
        print("ecrit", name)
    make_icon(48, font_path).save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print("ecrit favicon.ico")
    (PUBLIC / "favicon.svg").write_text(make_svg(font_path), encoding="utf-8")
    print("ecrit favicon.svg")


if __name__ == "__main__":
    main()
