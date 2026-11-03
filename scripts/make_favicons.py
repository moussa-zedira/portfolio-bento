"""
Genere le set complet de favicons pour le portfolio.

Sortie dans public/ :
  - favicon.svg
  - favicon.ico (16, 32, 48)
  - favicon-16x16.png
  - favicon-32x32.png
  - apple-touch-icon.png (180x180)
  - android-chrome-192x192.png
  - android-chrome-512x512.png

Design (voir design.md) : monogramme « MZ » dessine en traits droits, sable sur
le fond presque noir du site, avec la LED verte allumee dans le coin, comme le
voyant d'alimentation d'une machine. Les lettres sont des traces : aucune
police a charger, rendu identique partout.

Le logo de la barre haute (navbar.ejs) est un autre dessin : le meme MZ d'un
seul fil, qui se trace a l'arrivee sur la page.

Prerequis : pip install pillow playwright && playwright install chromium
"""
from io import BytesIO
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"

# Les couleurs de tokens.css (en hex : les favicons ne lisent pas l'OKLCH)
FOND = "#11100d"     # --color-paper
LETTRES = "#e3d7bf"  # --color-ink, le sable
LED = "#3ddc84"      # --color-accent

SVG = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
       f'<rect width="64" height="64" rx="12" fill="{FOND}"/>'
       f'<path d="M9 50V14h6l9 17 9-17h6v36h-6V26l-9 16-9-16v24z'
       f'M36 14h20v5L43 45h13v5H35v-5l13-26H36z" fill="{LETTRES}"/>'
       f'<circle cx="54" cy="10" r="4" fill="{LED}"/>'
       f'</svg>\n')


def render(page, size: int) -> Image.Image:
    """Rend le SVG en 4x dans Chromium puis reduit : bords nets meme a 16 px."""
    s = size * 4
    page.set_viewport_size({"width": s, "height": s})
    page.set_content(f'<body style="margin:0;background:transparent">'
                     f'{SVG.replace("<svg ", f"<svg width=\"{s}\" height=\"{s}\" ", 1)}</body>')
    png = page.screenshot(omit_background=True)
    return Image.open(BytesIO(png)).convert("RGBA").resize((size, size), Image.LANCZOS)


def main():
    (PUBLIC / "favicon.svg").write_text(SVG, encoding="utf-8")
    print("ecrit favicon.svg")
    sizes = {"favicon-16x16.png": 16, "favicon-32x32.png": 32, "apple-touch-icon.png": 180,
             "android-chrome-192x192.png": 192, "android-chrome-512x512.png": 512}
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        for name, size in sizes.items():
            icon = render(page, size)
            if name == "apple-touch-icon.png":
                # iOS n'aime pas la transparence : fond plein, iOS arrondit lui-meme
                flat = Image.new("RGB", (size, size), FOND)
                flat.paste(icon, (0, 0), icon)
                icon = flat
            icon.save(PUBLIC / name, optimize=True)
            print("ecrit", name)
        render(page, 48).save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
        print("ecrit favicon.ico")
        browser.close()


if __name__ == "__main__":
    main()
