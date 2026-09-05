"""Genere le PDF du CV depuis cv/cv.html, et verifie qu'il reste lisible par un ATS.

    python scripts/make_cv_pdf.py             # variante alternance (celle du site)
    python scripts/make_cv_pdf.py emploi      # variante candidature a une offre

Pourquoi ce script plutot qu'un "Imprimer en PDF" depuis le navigateur :
la version produite par Microsoft Print To PDF dessinait chaque lettre comme
un trace vectoriel. Le fichier pesait 929 Ko et ne contenait aucun texte
extractible — les ATS (les logiciels qui filtrent les candidatures) n'y
lisaient rien du tout. Chromium en mode headless produit un vrai PDF texte
de ~85 Ko.

Le script echoue si une regression ATS apparait, pour que le probleme se voie
au moment de la generation et non des mois plus tard.

Sur les variantes. Une candidature a une offre publiee (HelloWork, Indeed,
APEC) ne peut pas afficher "recherche une alternance" : le CV est ecarte
avant d'etre lu. La variante "emploi" existe pour ca. Elle n'est PAS une
seconde source : cv/cv.html reste le seul fichier a editer, et la variante
en est derivee a la generation en remplacant les seules lignes qui
changent : l'intitule de poste et l'objectif. Une copie maintenue a la main finirait perimee sans que
personne s'en apercoive - c'est exactement ce qui est arrive a la version
LaTeX du CV.

Prerequis : pip install playwright pypdf && playwright install chromium
"""

import pathlib
import re
import sys

from playwright.sync_api import sync_playwright
from pypdf import PdfReader

RACINE = pathlib.Path(__file__).resolve().parent.parent
SOURCE = RACINE / "cv" / "cv.html"

# Le CV de candidature n'entre pas dans le depot. Celui-ci est public sur
# GitHub : tout fichier commite y devient telechargeable, et un recruteur qui
# suit le lien GitHub du portfolio y lirait qu'un poste est cherche en
# parallele de l'alternance. Rien dans le site ne s'en sert, donc il est
# ecrit la ou on le prend pour le deposer sur un jobboard : le bureau.
BUREAU = pathlib.Path.home() / "Desktop"
if not BUREAU.is_dir():
    # Machine sans bureau (CI, serveur, WSL) : on retombe dans cv/, qui est
    # ignore par git pour ces fichiers-la.
    BUREAU = RACINE / "cv"

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
    "Moussa Zedira", "moussazedira@gmail.com",
    "Active Directory", "GLPI", "Windows", "Linux", "PowerShell", "LVM",
    "Proxmox", "VMware ESXi", "Hyper-V", "Docker", "TCP/IP", "DNS", "DHCP",
    "Cisco IOS", "Wireshark", "Python", "FastAPI", "PostgreSQL", "SIEM",
    "MITRE ATT&CK", "fail2ban", "configuration", "workflows", "Omexom",
    # Mention couverte par un accord de confidentialite : formulation au
    # niveau de la tache, sans resultat ni perimetre. Si l'accord evolue,
    # retirer la ligne du CV ET ce mot-cle, sinon la generation echoue.
    "NIS2",
]

# Ce qui separe les deux CV tient en trois choses : les lignes d'en-tete
# reecrites, les fichiers produits, et les mots-cles que le controle ATS exige
# en plus des communs. Tout le reste du contenu est partage.
#
# "remplacements" associe une classe CSS de l'en-tete au texte qui doit
# prendre sa place. Un dictionnaire vide veut dire : on rend cv/cv.html tel
# quel.
VARIANTES = {
    # La variante du site. C'est la seule qui ecrit dans public/ : le site
    # sert le CV alternance, rien d'autre ne doit venir l'ecraser.
    "alternance": {
        "remplacements": {},
        "pdf": [RACINE / "cv" / "CV-Moussa-Zedira.pdf",
                RACINE / "public" / "CV.MoussaZedira.pdf"],
        "docx": [RACINE / "cv" / "CV-Moussa-Zedira.docx",
                 RACINE / "public" / "CV.MoussaZedira.docx"],
        "mots_cles": ["alternance", "BTS SIO", "SISR"],
        "interdits": [],
    },
    # La variante a deposer sur les jobboards. Le nom de fichier est explicite :
    # c'est celui que le recruteur voit dans sa liste de candidatures.
    "emploi": {
        "remplacements": {
            # Sans "& Automatisation" : l'intitule doit se lire comme celui
            # des offres auxquelles il repond, pas comme un positionnement.
            "role": "Technicien Support IT",
            "objectif": ("Recherche un poste de technicien support informatique, "
                         "helpdesk ou proximité - CDI, CDD ou intérim"),
        },
        "pdf": [BUREAU / "CV-Moussa-Zedira-Technicien-Support-IT.pdf"],
        "docx": [BUREAU / "CV-Moussa-Zedira-Technicien-Support-IT.docx"],
        "mots_cles": ["technicien support informatique", "helpdesk", "CDI"],
        # Le point de toute la variante : un CV qui parle d'alternance est
        # ecarte d'une offre en CDI. Si une de ces mentions revient un jour
        # dans cv/cv.html ailleurs que dans l'objectif, la generation doit
        # s'arreter, pas produire un CV inutilisable sans le dire.
        "interdits": ["alternance", "BTS SIO", "SISR"],
    },
}


def html_variante(variante):
    """Retourne le chemin du HTML a rendre pour cette variante.

    Le fichier derive est ecrit dans cv/ et non dans un dossier temporaire :
    les polices sont appelees en chemin relatif (fonts/...) et ne se
    resolvent qu'a cote de la source. Il est reecrit a chaque generation et
    ignore par git - c'est un produit, pas une source.
    """
    remplacements = VARIANTES[variante]["remplacements"]
    if not remplacements:
        return SOURCE

    derive = SOURCE.read_text(encoding="utf-8")
    for classe, texte in remplacements.items():
        derive, faits = re.subn(
            rf'(<p class="{classe}">).*?(</p>)',
            lambda m: m.group(1) + texte + m.group(2),
            derive, count=1, flags=re.S,
        )
        if faits != 1:
            raise SystemExit(
                f'cv/cv.html : <p class="{classe}"> introuvable, '
                "la variante ne peut pas etre derivee"
            )
    banniere = f"""<body>
<!-- FICHIER GENERE, ne pas editer : derive de cv/cv.html (variante {variante})
     par scripts/make_cv_pdf.py. La source a editer est cv/cv.html. -->"""
    derive = derive.replace("<body>", banniere, 1)
    chemin = RACINE / "cv" / f"cv-{variante}.html"
    chemin.write_text(derive, encoding="utf-8")
    return chemin


def afficher(chemin):
    """Chemin lisible : relatif au depot quand il y est, absolu sinon."""
    try:
        return chemin.relative_to(RACINE)
    except ValueError:
        return chemin


def generer(source, destination):
    with sync_playwright() as p:
        navigateur = p.chromium.launch()
        page = navigateur.new_page()
        page.goto(source.as_uri(), wait_until="networkidle")
        page.emulate_media(media="print")
        page.pdf(
            path=str(destination),
            format="A4",
            print_background=True,
            # Marges a zero : c'est le @page de cv.html qui les definit.
            margin={"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"},
        )
        navigateur.close()


def verifier(chemin, mots_cles, interdits):
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
    manquants = [m for m in mots_cles if m.lower() not in texte.lower()]
    if manquants:
        problemes.append(f"mots-cles absents : {manquants}")
    presents = [m for m in interdits if m.lower() in texte.lower()]
    if presents:
        problemes.append(f"mentions a proscrire dans cette variante : {presents}")

    return problemes, texte, lecteur


def main():
    variante = sys.argv[1] if len(sys.argv) > 1 else "alternance"
    if variante not in VARIANTES:
        print(f"variante inconnue : {variante} "
              f"(attendu : {', '.join(VARIANTES)})", file=sys.stderr)
        return 2

    sorties = VARIANTES[variante]["pdf"]
    mots_cles = MOTS_CLES + VARIANTES[variante]["mots_cles"]
    interdits = VARIANTES[variante]["interdits"]

    generer(html_variante(variante), sorties[0])
    problemes, texte, lecteur = verifier(sorties[0], mots_cles, interdits)

    taille = sorties[0].stat().st_size / 1024
    print(f"{afficher(sorties[0])} ({variante}) : {taille:.0f} Ko | "
          f"{len(lecteur.pages)} page(s) | {len(texte)} caracteres extraits")

    if problemes:
        print("\nREGRESSION ATS :", file=sys.stderr)
        for probleme in problemes:
            print(f"  - {probleme}", file=sys.stderr)
        return 1

    for copie in sorties[1:]:
        copie.write_bytes(sorties[0].read_bytes())
        print(f"{afficher(copie)} : copie")

    print(f"\nOK — {len(mots_cles)} mots-cles presents, aucune ligature, une seule page.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
