# BIO-CORPS-06-R02 — Pointillé pelvien

- [Atelier du bassin](https://thsethse.github.io/Microcosme/preview/bio-corps-06-r02/#atelier-bassin)
- [Planche H/F avant et après](https://thsethse.github.io/Microcosme/preview/bio-corps-06-r02/#planche-anatomie-pelvienne)
- [PR nº 76](https://github.com/Thsethse/Microcosme/pull/76)

## Texture et ancrage

IMG_0741.png était disponible sur `main` et a été consultée avant modification. La zone H suit le repère juste au-dessus du U. La zone F est triangulaire, avec des arêtes adoucies et irrégulières. Son trait médian reste au premier plan. Les tracés et les aplats anatomiques reprennent R01 à l’identique. Les positions des points sont déterministes dans chaque zone et se projettent avec l’ossature et la corpulence. Tous les points sont présents dès la repousse visible. Leur rayon seul augmente avec le curseur, avec des interstices encore visibles à 75 %. [Référence IMG_0741.png](https://github.com/Thsethse/Microcosme/blob/15ef49e9e767a8514bc45f0988a58d8cf638b40c/docs/ai/visual-references/IMG_0741.png) · [Géométrie du pointillé](../../../bio-yeux-01/pubic-stipple.mjs) · [Composition anatomique](../../../bio-yeux-01/pelvic-details.mjs)

Le curseur unique « État de pousse » conserve le domaine 0–100 et le champ `pubicHairLength` des sauvegardes v22. À 0 %, la texture est absente. Les autres valeurs utilisent 220 points, ou un sous-ensemble stable de 85 points en miniature. Trois chemins regroupent les points selon leur nuance dérivée des cheveux. Un tracé de découpe maintient le contour. Le moteur conserve la zone neutre pour les enfants et adolescents. [Atelier](../../../bio-yeux-01/index.html) · [Sauvegarde](../../../bio-yeux-01/appearance.mjs)

## Résultats

- **Node** · 60 tests corporels réussis, dont 6 tests pelviens. Les comparaisons entre R01 et R02 couvrent les deux bases, sept ossatures, trois corpulences et deux modes de détail. Les tracés anatomiques et le SVG hors texture sont identiques. Un balayage complémentaire de 1 001 valeurs par base et mode de détail confirme que les rayons augmentent sur tout l’intervalle.
- **Chromium 151 et WebKit 26.5** · Les six états sont vérifiés sur H/F, avec les trois échelles, deux extrêmes de corpulence et d’ossature, plusieurs peaux et cheveux. La restauration du réglage fractionnaire à 63,375 % reproduit exactement le pointillé. La recette est passée sur la révision finale publiée.
- **Couverture raster isolée sur les témoins standards** · À 10 %, environ 1 % de la zone est couverte. À 25 %, 9 à 12 %. À 50 %, 44 à 55 %. À 75 %, 81 à 87 %. À 100 %, la couverture s’arrondit à 100 % et le grain reste visible grâce aux trois nuances.
- **Coût mesuré sur l’environnement de développement** · Pour un SVG F à 100 %, la médiane de 800 générations de chaîne est de 1,78 ms en R02 contre 1,56 ms en R01, et de 1,13 ms en miniature contre 1,20 ms en R01. Le SVG complet testé passe de 11,8 à 24,8 ko en taille normale. Cette mesure concerne la génération du SVG sous Node. Le temps de composition sur un iPad physique reste à mesurer lors de la recette.

[Tests corporels](../../../bio-yeux-01/tests/body-pelvic-anatomy.test.mjs) · [Tests navigateur](../../../bio-yeux-01/tests/pubic-stipple-browser.cjs)

```sh
node --test bio-yeux-01/tests/adult-body.test.mjs bio-yeux-01/tests/body-*.test.mjs
node bio-yeux-01/tests/pubic-stipple-browser.cjs https://thsethse.github.io/Microcosme/preview/bio-corps-06-r02/
```

La preview épingle la source `86fb73f54ab5801b00c7b9511797366478daba38`. La publication Pages `8dccad95fa0b6f64c48ca97b06e72f61762e23cc` porte sur la nouvelle preview. La validation artistique sur l’iPad du porteur reste en attente.
