"""Genere le PDF du CV depuis cv/cv.html, et verifie qu'il reste lisible par un ATS.

    python scripts/make_cv_pdf.py

Pourquoi ce script plutot qu'un "Imprimer en PDF" depuis le navigateur :
la version produite par Microsoft Print To PDF dessinait chaque lettre comme
un trace vectoriel. Le fichier pesait 929 Ko et ne contenait aucun texte
extractible — les ATS (les logiciels qui filtrent les candidatures) n'y
lisaient rien du tout. Chromium en mode headless produit un vrai PDF texte
de ~85 Ko.

Le script echoue si une regression ATS apparait, pour que le probleme se voie
au moment de la generation et non des mois plus tard.

Prerequis : pip install playwright pypdf && playwright install chromium
"""

import pathlib
import sys

from playwright.sync_api import sync_playwright
from pypdf import PdfReader

RACINE = pathlib.Path(__file__).resolve().parent.parent
SOURCE = RACINE / "cv" / "cv.html"
SORTIES = [RACINE / "cv" / "CV-Moussa-Zedira.pdf", RACINE / "public" / "CV.MoussaZedira.pdf"]

# Ligatures typographiques : "configuration" encode avec U+FB01 ne correspond
# plus a une recherche sur "configuration". Neutralisees en CSS, verifiees ici.
LIGATURES = "ﬀﬁﬂﬃﬄ"

# Caracteres que les parseurs ATS suppriment ou rendent en "?".
# Contre-intuitif mais documente : l'apostrophe COURBE est le probleme, pas la
# droite. Plusieurs moteurs rendent U+2019 en "?", et "d'assistance" devient
# "d?assistance" — introuvable. On compose donc en apostrophes droites, et ce
# controle est la pour qu'un copier-coller depuis Word ne les reintroduise pas.
# La puce U+2022 est explicitement acceptee, elle n'est pas dans la liste.
INTERDITS = {
    "—": "tiret cadratin — : utiliser un trait d'union",
    "–": "tiret demi-cadratin – : utiliser un trait d'union",
    "’": "apostrophe courbe ’ : utiliser l'apostrophe droite '",
    "“": "guillemet courbe ouvrant “ : utiliser \"",
    "”": "guillemet courbe fermant ” : utiliser \"",
    " ": "espace insecable : utiliser une espace normale",
    "·": "point median · : utiliser une virgule",
    "→": "fleche → : ecrire le mot",
    "✓": "coche ✓ : utiliser la puce •",
    "●": "puce decorative ● : utiliser la puce •",
}

# Un echantillon de ce qu'un recruteur ou un ATS cherche reellement.
MOTS_CLES = [
    "Moussa Zedira", "moussazedira@gmail.com", "alternance", "BTS SIO", "SISR",
    "Active Directory", "GLPI", "Windows", "Linux", "PowerShell", "LVM",
    "Proxmox", "VMware ESXi", "Hyper-V", "Docker", "TCP/IP", "DNS", "DHCP",
    "Cisco IOS", "Wireshark", "Python", "FastAPI", "PostgreSQL", "SIEM",
    "MITRE ATT&CK", "fail2ban", "configuration", "workflows", "Omexom",
    # Mention couverte par un accord de confidentialite : formulation au
    # niveau de la tache, sans resultat ni perimetre. Si l'accord evolue,
    # retirer la ligne du CV ET ce mot-cle, sinon la generation echoue.
    "NIS2",
]


def generer(destination):
    with sync_playwright() as p:
        navigateur = p.chromium.launch()
        page = navigateur.new_page()
        page.goto(SOURCE.as_uri(), wait_until="networkidle")
        page.emulate_media(media="print")
        page.pdf(
            path=str(destination),
            format="A4",
            print_background=True,
            # Marges a zero : c'est le @page de cv.html qui les definit.
            margin={"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"},
        )
        navigateur.close()


def verifier(chemin):
    """Retourne la liste des problemes ATS trouves dans le PDF genere."""
    lecteur = PdfReader(str(chemin))
    texte = "\n".join((page.extract_text() or "") for page in lecteur.pages)
    problemes = []

    if len(texte) < 2000:
        problemes.append(f"texte extrait trop court ({len(texte)} car.) — PDF probablement vectorise")
    if len(lecteur.pages) > 1:
        problemes.append(
            f"{len(lecteur.pages)} pages : une section coupee par un saut de page "
            "ressort dans le desordre a l'extraction"
        )
    trouvees = [c for c in LIGATURES if c in texte]
    if trouvees:
        problemes.append(f"ligatures presentes ({trouvees}) - mots-cles non trouvables")

    for caractere, explication in INTERDITS.items():
        if caractere in texte:
            problemes.append(f"{texte.count(caractere)}x {explication}")
    manquants = [m for m in MOTS_CLES if m.lower() not in texte.lower()]
    if manquants:
        problemes.append(f"mots-cles absents : {manquants}")

    return problemes, texte, lecteur


def main():
    generer(SORTIES[0])
    problemes, texte, lecteur = verifier(SORTIES[0])

    taille = SORTIES[0].stat().st_size / 1024
    print(f"{SORTIES[0].relative_to(RACINE)} : {taille:.0f} Ko | "
          f"{len(lecteur.pages)} page(s) | {len(texte)} caracteres extraits")

    if problemes:
        print("\nREGRESSION ATS :", file=sys.stderr)
        for probleme in problemes:
            print(f"  - {probleme}", file=sys.stderr)
        return 1

    for copie in SORTIES[1:]:
        copie.write_bytes(SORTIES[0].read_bytes())
        print(f"{copie.relative_to(RACINE)} : copie")

    print(f"\nOK — {len(MOTS_CLES)} mots-cles presents, aucune ligature, une seule page.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
