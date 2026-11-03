# Design — Portfolio Moussa Zedira

Systeme de design verrouille du site. Toute page (accueil, page projet, 404)
le lit avant d'ecrire du CSS. On ne le regenere pas page par page : on le
complete ici quand il doit evoluer.

Public : recruteurs IT, centres de formation et tuteurs d'alternance, mais aussi
des lecteurs hors informatique. Tout doit se lire sans vocabulaire technique.
Action principale : telecharger le CV, appeler ou ecrire, parcourir les projets.

## Genre
atmospheric, theme sur mesure « Salle eteinte » (refonte du 3 novembre 2026).
Inspiration declaree : l'ADN du portfolio de Marcus Lorenzet (fond sombre chaud,
encre sable, titres geants sur le portrait, dock flottant, texte qui s'allume au
defilement). On reprend l'ADN, jamais ses elements signes : ni son logo, ni ses
textes, ni ses tuiles de chiffres posees dans le titre, ni sa police.

## Theme « Salle eteinte »
Valeurs de reference : `public/css/tokens.css`.

| Token | OKLCH | Role |
|---|---|---|
| `--color-paper` | 16% 0.008 80 | fond presque noir, chaud |
| `--color-paper-2` | 20% 0.01 80 | cartes, formulaire, dock |
| `--color-rule` | 32% 0.012 80 | filets |
| `--color-ghost` | 34% 0.012 80 | mots pas encore allumes |
| `--color-muted` | 68% 0.025 85 | texte secondaire |
| `--color-ink` | 87% 0.035 85 | encre sable, texte et titres |
| `--color-ink-strong` | 94% 0.025 85 | titres de projet, liens forts |
| `--color-accent` | 80% 0.17 150 | la LED verte |

La LED verte est le seul element de couleur : la goutte au bout du logo, le voyant du favicon, le statut
« Disponible », le pied de page. Jamais une surface, jamais un bouton.

## Logo et favicon
- Logo (barre haute) : M et Z d'un seul fil sable, angles fondus (filtre SVG), la
  LED est la goutte au bout. Il se trace une fois a l'arrivee ; fixe en mouvement reduit.
- Favicon : MZ en traits droits pleins sur fond `#11100d`, LED dans le coin haut droit.
  Genere par `scripts/make_favicons.py`.

## Typographie
- Titres geants : **Bricolage Grotesque** 750, axe `wdth` 75 (etroite), en capitales,
  interlignage 0,84. Titres de section et de projet : meme police, `wdth` 85 a 88, 600.
- Texte : **Geologica** 300 a 700, axe `SHRP` a 40.
- Etiquettes, dates, cartels : **Martian Mono** 400 / 500, capitales espacees.
- Titres en romain uniquement, jamais d'italique.

## Images
- Le portrait reel est la seule image de l'en-tete : noir et blanc, legerement sable,
  fondu dans le noir sur ses bords.
- Photos de projets en noir et blanc sable ; elles reprennent leur couleur au survol.
  La vraie capture de meschapitres.fr garde ses couleurs : c'est une preuve.
- Aucune image generee.

## Structure de l'accueil
1. En-tete : « SYSTEMES & RESEAUX » en geant par-dessus le portrait, statut et
   presentation en bas a droite, ville et « Defiler » dans les coins.
2. A propos : une phrase en grand qui s'allume mot a mot, puis le recit.
3. Projets : titre geant, puis un projet par ecran (image, numero, titre, cartel
   « Outils / Depuis / En ligne »).
4. En chiffres : a la place de temoignages, des chiffres tires des fiches projets
   (jamais saisis deux fois, jamais inventes).
5. Parcours : experiences et formation en lignes.
6. Competences, certifications, langues.
7. Contact : « On en parle ? » en geant, e-mail en grand, coordonnees, formulaire.

## Navigation
- Barre haute non collante : logo a gauche, « Telecharger le CV » a droite.
- Dock flottant en bas, toujours visible : Projets, Parcours, Competences et
  « Me contacter » (avec la photo). Sous 520 px, Competences disparait ; sous
  400 px, la photo du bouton aussi.

## Mouvement
- Texte qui s'allume au defilement (couleur seulement).
- Apparitions legeres (fondu + 12 px), 500 ms, `--ease-out`, une seule fois.
- Rien d'autre : ni curseur personnalise, ni ecran de chargement, ni defilement lisse.
- Tout est allume et visible sans JavaScript ou avec `prefers-reduced-motion: reduce`.

## Boutons
- Principal : fond sable, texte noir, rayon 6 px.
- Secondaire : contour filet, texte sable.
- Focus : anneau sable clair de 2 px, decale de 3 px, sans animation.

## Ce que les pages partagent
Polices, couleurs, barre haute, dock et pied de page. La page projet reprend le
titre geant, les chiffres en cartes et les cartels.
