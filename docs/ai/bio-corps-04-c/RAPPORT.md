# BIO-CORPS-04-C — Aréoles et mamelons adultes

- [Atelier interactif du thorax](https://thsethse.github.io/Microcosme/preview/bio-corps-04-c/#atelier-thorax)
- [Planche de contrôle](https://thsethse.github.io/Microcosme/preview/bio-corps-04-c/#planche-details-thorax)
- [PR de recette #68](https://github.com/Thsethse/Microcosme/pull/68)
- [Manifeste de la preview](https://thsethse.github.io/Microcosme/preview/bio-corps-04-c/version.json)

## Références et choix graphiques

Les quatre fichiers demandés ont été consultés avant la programmation. IMG_0612 et IMG_0613 montrent des positions différentes selon la projection et la forme des volumes. IMG_0614 montre que le relief peut être lisible avec très peu de traits. IMG_0730 situe le détail à l’échelle du pion, y compris sur une enveloppe corpulente. Les références ont guidé l’implantation et le contraste. La géométrie, les teintes et les limites sont calculées dans l’atelier. [Références consultées sur main](https://github.com/Thsethse/Microcosme/tree/8765e81f4e6acbc169b4420031480166688453c6/docs/ai/visual-references)

Le même calque SVG symétrique est utilisé pour les deux bases. Il juxtapose un aplat d’aréole, une nuance de mamelon et une petite ombre sous le mamelon à relief positif. Les couleurs sont calculées à partir de la peau, sans contour ajouté. La miniature conserve les positions, les dimensions et deux aplats. Elle résume le relief par une différence de nuance et omet l’ombre séparée. Les cadrages historiques sont conservés. La vue rapprochée couvre le thorax à l’atelier et sur la planche, notamment pour les volumes bas que les vues centrées sur la tête peuvent rogner. [Géométrie et nuances](../../../bio-yeux-01/thorax-details.mjs)

## Réglages

Les sept curseurs vont de 0 à 100 %. Les références sont propres à chaque base.

| Réglage | H | F | Effet |
| --- | ---: | ---: | --- |
| Taille de l’aréole | 36 | 44 | Du très petit au large. Le demi-axe horizontal demandé va de 1,35 à 5,50 unités SVG sur H et de 1,65 à 7 sur F, pour un corps de 142 unités de haut. |
| Forme de l’aréole | 13 | 19 | De circulaire à ovale horizontal. Le rapport vertical sur horizontal évolue de 1 à 0,60. |
| Pigmentation | 44 | 48 | Augmente la profondeur de la teinte dérivée de la peau. |
| Position horizontale | 54 | 50 | Déplace les deux centres en miroir de l’intérieur vers l’extérieur. |
| Position verticale | 52 | 48 | Déplace les deux centres du bas vers le haut dans le repère de leur support. |
| Taille du mamelon | 34 | 42 | Règle son rayon entre 17 et 49 % du demi-axe vertical de l’aréole. |
| Relief du mamelon | 31 | 37 | Règle l’offset, la diffusion géométrique et la teinte de l’ombre inférieure. À 0 %, l’ombre est absente. |

Les positions et le diamètre utilisent les limites du support courant. La compression du rayon s’effectue en continu à l’approche de cette limite. Augmenter la taille sur un thorax étroit conserve ainsi une progression plus faible qu’en présence d’une surface plus ample. La symétrie est maintenue par réflexion autour de l’axe du pion. Le mamelon et son ombre tiennent à l’intérieur de l’aréole. [Calcul des paramètres](../../../bio-yeux-01/thorax-details.mjs)

## Ancrage anatomique et compatibilité

À plat, le centre est calculé à partir du repère du thorax et de la largeur disponible à cette hauteur. Avec un volume, les courbes cubiques existantes donnent la largeur du plan pectoral ou du lobe mammaire à la hauteur demandée. Entre 0 et 30 % de volume, une interpolation continue accompagne le passage du thorax plat au relief. La marge est calculée sur la surface porteuse, dans les coordonnées de l’ellipse, avec une borne d’erreur pour l’échantillonnage du contour. À partir de 30 %, le calque s’inscrit entièrement sur le pectoral ou le volume mammaire correspondant. Les réglages demandés restent indépendants de la position et de la taille calculées. [Intersection des cubiques](../../../bio-yeux-01/bezier.mjs) · [Ancrage et limites](../../../bio-yeux-01/thorax-details.mjs)

Le calque s’ajoute par-dessus les volumes existants. Les chemins du corps, des pectoraux et des seins ainsi que le traitement du contour en cas de dépassement latéral restent identiques à la version acceptée. Le placement des volumes pectoraux signalé dans le contrat reste un sujet d’harmonisation ultérieur. [Composition SVG](../../../bio-yeux-01/adult-body.mjs) · [Contrat](CONTRAT.md)

Les boutons H et F conservent l’accès aux cinq et six commandes de volume et de forme. Sur les deux bases, le lien **Aréoles et mamelons** rejoint les sept nouvelles commandes actives, y compris à volume nul. Le premier mouvement d’un curseur ou le bouton **Appliquer les valeurs de référence** affiche le calque. Les anciennes sauvegardes se rouvrent donc avec leur rendu et leur format d’origine. Après activation, le format d’apparence v18 conserve les sept valeurs demandées, y compris les fractions, ainsi que les paramètres thoraciques déjà enregistrés. Passer de H à F garde les préférences de chaque base pendant la session. [Atelier](../../../bio-yeux-01/index.html) · [Édition et préférences](../../../bio-yeux-01/app.mjs) · [Archives](../../../bio-yeux-01/appearance.mjs)

## Planche et tests

La planche comporte **28 paires H/F**, soit 56 rendus. Les 21 premières paires isolent les sept axes à 0, 50 et 100 %. Les sept autres couvrent le thorax plat, les volumes faibles et élevés, les ossatures et les corpulences, ainsi que les détails aux limites admissibles. Quatre teintes de peau, les trois échelles historiques et la vue rapprochée s’appliquent à toute la planche. [Cas de recette](../../../bio-yeux-01/thorax-details-study.mjs)

| Contrôle | Résultat |
| --- | --- |
| Géométrie et archives | Cinq tests dédiés réussis. Le balayage de 46 080 combinaisons couvre les deux bases, 64 coins d’ossature, deux hauteurs de menton, trois corpulences, deux réglages de support et six volumes incluant la transition depuis le plat. Les tests vérifient la continuité de l’ancrage, les marges de support, la symétrie, les sept effets isolés et le rejeu des anciennes archives. Deux exports v16 et v17 de l’atelier public 04-B rouvrent avec des SVG identiques aux trois échelles et se réexportent à l’identique. |
| Suites Node | 143 tests des ateliers, dont les cinq tests dédiés, et 35 tests du jeu réussis. |
| Atelier public | Recette complète réussie sous Chromium 151 et WebKit 26.5. Les sept nouveaux curseurs sont vérifiés sur chaque base, ainsi que les onze commandes existantes, l’ancrage après modification des volumes, les sauvegardes v18 à plat et en volume, les sauvegardes v16/v17, les quatre peaux et les trois échelles. La suite couvre aussi les morphologies historiques, les raccords de tête et de cheveux, l’ossature et la corpulence. |
| Jeu dans les navigateurs | Vérifications de non-régression réussies sous Chromium et WebKit. |
| GitHub Pages | Les empreintes SHA-256 des 50 fichiers de la preview et de ses 757 dépendances héritées correspondent au contenu public. Deux constructions à partir des mêmes révisions donnent des dossiers identiques. |

Un contrôle complémentaire sur la preview publique en profil iPad portrait (810 × 1 080 px) applique deux touchers à chacun des sept curseurs sur H et sur F, soit 28 gestes par moteur. Sous Chromium et WebKit, chaque curseur change de valeur et son effet est immédiat sur le SVG. La recette artistique et fonctionnelle sur l’iPad du porteur reste à effectuer. [Tests unitaires](../../../bio-yeux-01/tests/body-thorax-details.test.mjs) · [Tests navigateur](../../../bio-yeux-01/tests/body-browser.cjs)

## Reproduire

```sh
npm ci
npx playwright install chromium webkit
node --test bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
npm test
npm run test:browser
PREVIEW_MISSION=BIO-CORPS-04-C node bio-yeux-01/tests/body-browser.cjs
node bio-yeux-01/build-thorax-details-preview.mjs /tmp/microcosme-bio-corps-04-c \
  8765e81f4e6acbc169b4420031480166688453c6 9d2963a1fabb027b71a6a661b10efa70648133ce
```

Branche de départ `6a959f123c1d664b6fb212da89caa093c0bc668e`. Le manifeste public identifie la révision source `9d2963a1fabb027b71a6a661b10efa70648133ce`. La publication Pages `5a5886da232018752573731d89e3c4da5cc8177b` porte uniquement sur la nouvelle preview. La PR reste ouverte sans fusion.
