# BIO-CORPS-06 — Anatomie pelvienne adulte et pilosité pubienne

- [Atelier interactif](https://thsethse.github.io/Microcosme/preview/bio-corps-06/#atelier-bassin)
- [Planche H/F](https://thsethse.github.io/Microcosme/preview/bio-corps-06/#planche-anatomie-pelvienne)
- [PR nº 74](https://github.com/Thsethse/Microcosme/pull/74)
- [Manifeste de la preview](https://thsethse.github.io/Microcosme/preview/bio-corps-06/version.json)

## Anatomie et ancrage

Le calque utilise l’axe du pion, le bas du pli abdominal et la base pelvienne de R02. Sur H, un U ouvert et deux volumes arrondis emploient des nuances de peau. Sur F, un triangle orienté vers le bas et un détail médian forment le V et le I. Les détails restent à l’intérieur des plis de l’aine et s’ajustent à la largeur réellement disponible, après calcul de l’ossature et de la corpulence. La bande se resserre quand le ventre descend. Elle s’arrête au-dessus de la base pelvienne. Les calques existants conservent leur géométrie et leurs couleurs. [Calque SVG](../../../bio-yeux-01/pelvic-details.mjs) · [Composition corporelle](../../../bio-yeux-01/adult-body.mjs)

L’atelier actuel travaille sur les bases adultes H/F. Le rendu autorise les étapes `adult`, `mature` et `elder` dans son entrée `age`, et traite les autres étapes comme neutres pour le nouveau calque. L’âge transmis par défaut est `adult`. L’éditeur ne propose pas de sélection d’âge. [Filtre de rendu](../../../bio-yeux-01/render.mjs)

## Texture et commande

Le réglage unique couvre 0 à 100 %, avec 0 % comme référence. Quatre rangées décalées implantent 24 racines déterministes. Chaque mèche utilise deux courbes de Bézier. La longueur, la largeur, la courbure et le recouvrement augmentent avec le curseur. Les variations entre mèches créent un contour irrégulier à mesure qu’elles se développent. À 0 %, la texture est entièrement invisible. [Géométrie des mèches](../../../bio-yeux-01/pelvic-details.mjs)

Trois nuances sont dérivées de la couleur effective des cheveux ou de la couleur mémorisée pour une tête rasée. Les tons sont regroupés en trois tracés. En miniature, leurs écarts diminuent et le reflet anatomique le plus fin est omis. La grille d’implantation reste commune aux échelles. La planche présente les six repères sur H/F, sept ossatures, neuf corpulences, quatre teintes de peau et cinq couleurs de cheveux. Les vues tête et miniature gardent leur échelle historique et sont recentrées sur le bassin dans la planche. [Planche](../../../bio-yeux-01/pelvic-anatomy-study.mjs) · [Atelier](../../../bio-yeux-01/index.html)

## Sauvegardes

L’export complet passe en **v22** dès que la longueur est renseignée, y compris à 0 %. La valeur décimale est restituée à l’identique avec l’ossature, la corpulence et les réglages thoraciques et abdominaux. Chaque base garde sa préférence tant que l’atelier est ouvert. Les archives antérieures restent lisibles et s’ouvrent à 0 %. Elles gardent leur version habituelle tant que le réglage n’a pas été renseigné. Le JSON de sélection historique conserve son comportement. [Version et validation](../../../bio-yeux-01/appearance.mjs) · [Sélection](../../../bio-yeux-01/catalogue.mjs)

## Résultats des tests

| Contrôle | Résultat |
| --- | --- |
| Géométrie | 1 001 longueurs pour vérifier la continuité, trois hauteurs de menton, sept ossatures et 201 corpulences pour chacune des bases H/F, soit 8 442 configurations corporelles. L’égalité du SVG hors calque est vérifiée en conservant les réglages de thorax et d’abdomen. |
| Couverture de texture | En rasterisant le calque de pilosité isolé, la surface visible augmente aux six repères de longueur, sur H et F, à 0, 50 et 100 % de corpulence. |
| Suites Node | 169 tests d’atelier et 35 tests du jeu réussis. Les 58 tests corporels ont également été rejoués avec succès sur la révision finale. |
| Atelier public | Recette pelvienne réussie sous Chromium 151.0.7922.34 et WebKit 26.5. Chaque moteur vérifie les six longueurs sur H/F, le cadrage à longueur maximale aux trois échelles, quatre relectures d’archives, deux gestes tactiles sur le curseur et six sélections tactiles de base. Le SVG hors calque est identique à celui de R02 avec une coiffure longue et des réglages thoraciques et abdominaux actifs. |
| Non-régression de l’atelier | Recette étendue réussie sur la construction locale sous Chromium et WebKit. Chaque moteur retrouve 24 témoins SVG et raster hérités aux trois échelles et vérifie les commandes d’ossature, de corpulence, du thorax et des abdominaux. Le parcours pelvien repasse sur la révision publique finale après l’alignement du filtre d’âge. |
| Jeu dans les navigateurs | Vérifications de non-régression réussies sous Chromium et WebKit. |
| GitHub Pages | 1 148 fichiers publics concordent avec leurs empreintes SHA-256, dont 59 fichiers de la preview et 1 089 dépendances héritées. Deux constructions avec les mêmes révisions donnent exactement les mêmes fichiers. |

Les gestes tactiles testés utilisent un profil iPad simulé. La recette artistique et fonctionnelle sur un iPad physique appartient au porteur. [Tests géométriques et archives](../../../bio-yeux-01/tests/body-pelvic-anatomy.test.mjs) · [Tests navigateur](../../../bio-yeux-01/tests/body-browser.cjs)

## Reproduction

```sh
npm ci
npx playwright install chromium webkit
node --test bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
npm test
npm run test:browser
PREVIEW_MISSION=BIO-CORPS-06 node bio-yeux-01/tests/body-browser.cjs
node bio-yeux-01/build-pelvic-anatomy-preview.mjs /tmp/microcosme-bio-corps-06 \
  491410b3e57a199f0eee75ecdc004dbbe0a126eb 8930757309c3ff0382e4745a6676ec1c3d42f7bf
```

Branche de départ `307bcabbeb3516ddfa8456edc3c23fc658633da4`. Le manifeste public épingle la révision source `8930757309c3ff0382e4745a6676ec1c3d42f7bf`. La publication Pages `472f9ef2810d2d4cda1cad597c6f0a7faae80de7` porte sur les fichiers de la nouvelle preview. La PR reste ouverte sans fusion.
