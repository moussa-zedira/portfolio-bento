# Design — Portfolio Moussa Zedira

Systeme de design verrouille du site. Toute page (accueil, page projet, 404)
le lit avant d'ecrire du CSS. On ne le regenere pas page par page : on le
complete ici quand il doit evoluer.

Public : recruteurs IT et tuteurs d'alternance (support, infra, cyber) qui
arrivent depuis le CV ou LinkedIn. Action principale, tout a la fois :
telecharger le CV, appeler ou ecrire, parcourir les projets.

## Genre
modern-minimal, theme sur mesure « Atelier » : l'atelier d'un technicien.
Les matieres passent par les teintes, jamais par des textures en image.

## Theme « Atelier »
Valeurs de reference : `public/css/tokens.css`. Les hex sont donnes pour lecture.

| Token | OKLCH | Hex | Matiere / role |
|---|---|---|---|
| `--color-paper` | 95.5% 0.007 85 | #f2f0eb | pierre claire, fond |
| `--color-paper-2` | 92.5% 0.009 80 | #e9e6e0 | pierre, surfaces secondaires |
| `--color-field` | 97.5% 0.005 85 | #f8f7f3 | champs de formulaire |
| `--color-rule` | 84% 0.012 75 | #cfcac2 | filets |
| `--color-muted` | 46% 0.02 60 | #61564d | texte secondaire (6,3:1) |
| `--color-ink` | 23% 0.025 50 | #271a12 | noyer, texte (14,9:1) |
| `--color-accent` | 53% 0.13 48 | #a6501a | cuivre, signal (4,9:1) |
| `--color-accent-ink` | 97.5% 0.006 85 | #f9f6f2 | texte sur cuivre (5,2:1) |
| `--color-slate` | 27% 0.014 250 | #21272d | ardoise, bande sombre |
| `--color-slate-ink` | 93% 0.008 85 | #eae7e2 | texte sur ardoise (12,2:1) |
| `--color-slate-muted` | 76% 0.012 250 | #acb2b9 | secondaire sur ardoise (7,0:1) |
| `--color-slate-accent` | 78% 0.11 58 | #eca56f | cuivre sur ardoise (7,3:1) |
| `--color-success` | 46% 0.10 150 | #266739 | message envoye (6,0:1) |
| `--color-error` | 50% 0.17 28 | #af2b25 | erreur (5,7:1) |

Le cuivre reprend l'accent du CV (`#b45309`) : site et CV partagent une identite.
Il occupe 3 % au plus de l'ecran : lien actif, bouton principal, focus, le filet
« cable » sous la navigation, les petites etiquettes.

## Typographie
- Texte et titres : IBM Plex Sans 400 / 500 / 600 / 700 (la police du CV).
- Donnees, etiquettes, telephone : IBM Plex Mono 400 / 500.
- Titres en romain uniquement, jamais d'italique. Interlettrage -0.02em sur les grands titres.
- Echelle : voir `--text-*` dans tokens.css.

## Espacement
Echelle de 4 px nommee (`--space-*`). Les pages utilisent les tokens, jamais de valeurs brutes.

## Structure des pages
- Navigation : barre fixe en haut, toujours visible. Nom a gauche ; Projets, Parcours,
  Competences, Contact ; telephone et « Telecharger le CV » a droite. La section courante
  est soulignee en cuivre. Sur mobile, un menu qui se deplie sous la barre.
- Accueil : en-tete (identite a gauche, fiche technique a droite) → a propos → projets en
  lignes → bande ardoise HomeLab → parcours → competences → contact.
- Page projet : retour, en-tete, chiffres, vue d'ensemble, fonctionnalites, architecture.
- Une seule bande ardoise par page.
- Pied de page sur une ligne.

## Mouvement
- Apparitions legeres (fondu + 8 px), 500 ms, `--ease-out`, une seule fois.
- Rien d'autre : ni curseur personnalise, ni ecran de chargement, ni defilement lisse,
  ni texte brouille. Tout est desactive si `prefers-reduced-motion: reduce`.
- Le contenu est visible sans JavaScript.

## Boutons
- Principal : fond cuivre, texte `--color-accent-ink`, rayon 6 px. Un seul par zone.
- Secondaire : contour `--color-rule`, texte encre.
- Focus : anneau cuivre de 2 px, decale de 2 px, sans animation.

## Ce que les pages partagent
Polices, couleurs, boutons, navigation et pied de page. Les pages ne different que par
leur contenu et l'ordre de leurs blocs.
