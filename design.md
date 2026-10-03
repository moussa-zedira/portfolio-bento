# Design — Portfolio Moussa Zedira

Systeme de design verrouille du site. Toute page (accueil, page projet, 404)
le lit avant d'ecrire du CSS. On ne le regenere pas page par page : on le
complete ici quand il doit evoluer.

Public : recruteurs IT et tuteurs d'alternance (support, infra, cyber) qui
arrivent depuis le CV ou LinkedIn. Action principale, tout a la fois :
telecharger le CV, appeler ou ecrire, parcourir les projets.

## Genre
modern-minimal, theme sur mesure « Encre de Prusse » : la salle serveur, au calme.
Les decors (baie de serveurs, galets) sont dessines en SVG et CSS, jamais en photo.

## Theme « Encre de Prusse »
Valeurs de reference : `public/css/tokens.css`. Les hex sont donnes pour lecture.

| Token | OKLCH | Hex | Role |
|---|---|---|---|
| `--color-paper` | 97.5% 0.005 250 | #f4f7fa | fond |
| `--color-paper-2` | 95% 0.008 250 | #ebeff4 | surfaces secondaires |
| `--color-field` | 99% 0.003 250 | #fafcfe | champs de formulaire |
| `--color-rule` | 88% 0.012 250 | #d2d8df | filets |
| `--color-field-border` | 62% 0.02 250 | #7d8792 | bord des champs (3,5:1) |
| `--color-muted` | 47% 0.02 255 | #535c66 | texte secondaire (6,3:1) |
| `--color-ink` | 22% 0.025 258 | #131b26 | texte (16,1:1) |
| `--color-accent` | 44% 0.12 248 | #005591 | bleu de Prusse, signal (7,2:1) |
| `--color-accent-ink` | 98.5% 0.004 250 | #f8fafd | texte sur bleu (7,4:1) |
| `--color-slate` | 21% 0.03 258 | #101926 | bleu nuit, bande salle serveur |
| `--color-slate-ink` | 94% 0.008 250 | #e7ecf0 | texte sur bleu nuit (14,9:1) |
| `--color-slate-muted` | 76% 0.02 250 | #a8b2be | secondaire sur bleu nuit (8,3:1) |
| `--color-slate-accent` | 78% 0.09 240 | #81bfeb | bleu clair sur bleu nuit (9,0:1) |
| `--color-success` | 47% 0.10 155 | #1f6b41 | message envoye (6,1:1) |
| `--color-error` | 50% 0.17 28 | #af2b25 | erreur (6,1:1) |

Un bleu profond et dense, pas le bleu vif par defaut (#2563EB). Il occupe 3 % au plus
de l'ecran : lien actif, bouton principal, focus, le filet sous la navigation.

### Baie de serveurs (decor)
Facade de chassis 1U dessinee en SVG (`--rack-light`, `--rack-dark`) : rails, baies de
disques, ventilation, voyants vert #61cb7c et bleu #4fa8e1. En fond de l'en-tete, a
droite, efface vers le texte ; dans la bande HomeLab, sur toute la hauteur. Les donnees de
la bande sont posees sur un panneau plein (ecran de supervision), jamais sur le motif.

### Pierres froides (decor)
Galets dessines en CSS autour du portrait : `--stone-ardoise` (#606a74), `--stone-granit`
(#a1a5a9), `--stone-galet` (#d3d8dc), `--stone-basalte` (#383e45), `--stone-riviere`
(#858e92). Contour `--shape-galet`, modele (reflet + ombre) et grain de granit en bruit
procedural (`--stone-grain`, SVG feTurbulence). Jamais de texte pose sur une pierre.

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
  est soulignee en bleu. Sur mobile, un menu qui se deplie sous la barre.
- Accueil : en-tete (identite a gauche, portrait dans un galet parmi des pierres a droite ;
  le portrait passe en premier sur mobile) → a propos → projets en
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
- Principal : fond bleu de Prusse, texte `--color-accent-ink`, rayon 6 px. Un seul par zone.
- Secondaire : contour `--color-rule`, texte encre.
- Focus : anneau bleu de 2 px, decale de 2 px, sans animation.

## Motif
Le galet est le motif du site : portrait, puces de l'a propos, points de la frise du parcours.

## Ce que les pages partagent
Polices, couleurs, boutons, navigation et pied de page. Les pages ne different que par
leur contenu et l'ordre de leurs blocs.
