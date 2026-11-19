# BIO-VIS-P5-I2 — Lot B expérimental

Le catalogue propose **36 références** : 18 coiffures historiques P4-R1, neuf P5-A et neuf P5-B. Les 18 références P5 ont chacune deux arrangements G/D : **54 choix effectifs**, dont **18 arrangements B ajoutés**. G/D désigne les illustrations gauche/droite, sans restriction de personnage. Le retour utilisateur sur P5-I1 est positif ; cette intégration B reste à valider graphiquement sur iPad.

- [Preview Safari iPad](https://thsethse.github.io/Microcosme/preview/bio-vis-p5-i2/)
- [Comparaisons avec P5-I1, trois échelles et six corps](https://thsethse.github.io/Microcosme/preview/bio-vis-p5-i2/comparison.html)
- [P5-I1 conservé](https://thsethse.github.io/Microcosme/preview/bio-vis-p5-i1/)
- [Planche B](references/P5-B.png) ; [galerie couleur](captures/webkit-lot-b.png) ; [galerie monochrome sans accessoires](captures/webkit-lot-b-monochrome.png).

## Audit et provenance

Branches et PR revérifiées avant développement : #32 P4-R1, #33 P5-DOC et #34 P5-I1 ouvertes en brouillon, non fusionnées. Main de départ : `feb0a70b9fd45a0bc09007a0726ac6e8ba1e1435`. P5-I1 #34 : `9e6954fae81e9529f580fd4f05651f1d24fc3a1c`. P4-R1 #32 : `e9aadf830956dbfde172d25a30efa302f6bab7b1`. Documentation #33 : `0d8cc1dccea821c14c35ac4addf46bafa753bc86`. Ces révisions n’ont pas changé depuis la livraison I1. Aucune fusion de ces PR n’est nécessaire.

Catalogue 28–36, DOUBLONS, CONTRAT_ARTISTIQUE et CONTRAT_TECHNIQUE lus sur la branche documentaire. Le dossier P5-DOC reste intact ; son interdiction de programmer concernait la mission documentaire. La mission I2 autorise le seul lot B. Continuité START_HERE, PROJECT_STATE, DECISION_REGISTER et WORK_LOG consultée sur `docs/llm-project-memory` ; aucun changement biologique ou conceptuel. Aucun AGENTS.md retrouvé dans les checkouts, conforme à la recherche des arbres distants consignée dans l’audit P5-DOC.

Source obligatoire retrouvée : `docs/ai/visual-references/0F3CDCE7-24D6-40E4-80D8-4BE2429238AF.png`. PNG RGB **1536 × 1024**, **2 040 322 octets**, signature et CRC de tous les chunks vérifiés ; décodage et inspection visuelle effectués. SHA-256 : `34dfc2fd739c14fcd08dd37d34a60b702d63d84c35fc4a9193f1616eb51927e0`. Copie autonome `references/P5-B.png`, vérifiée octet pour octet. Les deux planches A, la planche originale des habitants et le catalogue V1 sont également conservés.

Les PNG servent uniquement à documenter les cheveux et ornements : **aucun visage, corps, proportion, ombre ou couleur des posters n’est importé dans les personnages**. Palette, contours, aplats, huit axes, ancres et six corps viennent de P4-R1/P5-I1. Les noms de source restent descriptifs et indépendants du sexe, de l’origine, du statut et de la personnalité.

## Dix-huit arrangements ajoutés

Chaque case reste sélectionnable sans bijoux et en monochrome. Position = ligne/colonne de la planche B. La comparaison montre une **parenté technique déjà disponible dans I1**, pas une prétendue ancienne version du nouveau modèle.

| ID / position | G | D | Capture comparative G / D |
| --- | --- | --- | --- |
| 28 · L1C1 · Couronne tressée | Anneau de cheveux entrelacés, front ouvert | Couronne, raie centrale et deux mèches libres | [G](captures/webkit-p5-028-G-comparison.png) / [D](captures/webkit-p5-028-D-comparison.png) |
| 29 · L1C2 · Chignon architectural | Grand éventail en mèches relevées | Chignon haut à rouleaux, attache et deux retombées | [G](captures/webkit-p5-029-G-comparison.png) / [D](captures/webkit-p5-029-D-comparison.png) |
| 30 · L1C3 · Boucles aristocratiques | Boucle frontale ouverte et boucles à la nuque | Demi-attache haute et cascade de boucles à la poitrine | [G](captures/webkit-p5-030-G-comparison.png) / [D](captures/webkit-p5-030-D-comparison.png) |
| 31 · L2C1 · Coiffure de cour | Sommet bombé et deux rouleaux courts | Chignon haut, rouleaux latéraux et mèches pendantes | [G](captures/webkit-p5-031-G-comparison.png) / [D](captures/webkit-p5-031-D-comparison.png) |
| 32 · L2C2 · Tresse royale | Racines balayées et une grosse natte avant | Couronne et deux longues nattes | [G](captures/webkit-p5-032-G-comparison.png) / [D](captures/webkit-p5-032-D-comparison.png) |
| 33 · L2C3 · Chignon ornementé | Cheveux courts balayés et ruban de nuque | Chignon latéral, mèche libre, fleur et chaîne amovibles | [G](captures/webkit-p5-033-G-comparison.png) / [D](captures/webkit-p5-033-D-comparison.png) |
| 34 · L3C1 · Haut volume sophistiqué | Quiff haut à grandes vagues | Grand balayage et cascade latérale | [G](captures/webkit-p5-034-G-comparison.png) / [D](captures/webkit-p5-034-D-comparison.png) |
| 35 · L3C2 · Natte et bijoux | Racines lissées et natte avant plus fine | Couronne basse et deux brins fins ; pendentifs séparés | [G](captures/webkit-p5-035-G-comparison.png) / [D](captures/webkit-p5-035-D-comparison.png) |
| 36 · L3C3 · Coiffure cérémonielle | Raie centrale et deux longs côtés libres | Rouleaux hauts étagés et deux rouleaux latéraux ; diadème séparé | [G](captures/webkit-p5-036-G-comparison.png) / [D](captures/webkit-p5-036-D-comparison.png) |

Les 18 arrangements B ont des signatures de géométrie distinctes en monochrome sans accessoires. Ce résultat technique ne certifie pas 18 bases artistiques nouvelles : il s’agit d’assemblages de composants mutualisés. Aucune référence documentaire n’est fusionnée ou supprimée.

## Réutilisations et architecture

- `i1/` : les quatre modules de catalogue/modèle/rendu/cheveux I1 et les 15 modules P4-R1 inclus sont **gelés, octet pour octet** depuis le snapshot I1. Les 18 styles historiques et les 18 arrangements A sont délégués intégralement à ce rendu, avec les mêmes options et cadrages.
- `model.mjs` : normalisation et modèle existants, avec déclaration des IDs B ; ID inconnu refusé. Aucune modification des huit bornes, du visage, des ancres, du corps ou des proportions.
- `hair.mjs` : enveloppe analytique de recouvrement P3-R1 réutilisée. Les nouveaux volumes sont construits dans le repère couronne/front/tempes/joues/bajoues/nuque, sans agrandissement uniforme de la coiffure. Toutes les régions supérieures de B sont couvertes ; les régions rasées A restent celles d’I1.
- Le balayage court **I1 19-G/21-G** est réutilisé pour les racines **32-G, 33-G et 35-G**. 32-G/35-G diffèrent par épaisseur et trajet de natte ; 33-G garde ses cheveux courts, sans inventer un gros chignon arrière invisible dans la source.
- Le principe d’entrelacs P4 est généralisé à une ligne centrale courbe avec normales locales : même primitive pour les couronnes **28, 32-D, 35-D** et les nattes **32/35**. Largeur, hauteur, trajet, nombre de brins et arrangement sont explicites. Une couronne tressée appartient aux cheveux et reste visible sans bijoux.
- Primitives communes de rouleaux et d’attache pour **29-D, 30-D, 31 et 33-D** ; **36-D** ajoute une structure étagée. Un raccord local assure la liaison chignon–calotte. Éventails **29-G/34-G** de hauteurs et contours différents. Raie centrale et rouleaux latéraux partagés lorsque pertinents, sans remplacer tous les styles par le même chignon.
- **30 G/D** : mêmes primitives de boucles à lobes et spirales ouvertes, longueur/densité différentes. **34-D/36-G** : même primitive de grande cascade, unilatérale ou bilatérale. Ce ne sont pas des changements de teinte ou de bijoux.
- `render.mjs` : arrière et accessoires arrière → corps → visage/calotte/front/côtés/texture → longueurs avant → accessoires avant. Les ornements sont des calques amovibles. Ruban 33-G derrière le personnage ; fleurs, perles et diadème au niveau de leurs attaches.
- Trois vues issues des mêmes chemins. Les nouvelles nattes, boucles et mèches libres sont conservées en gros plan et miniature ; seul le cadre change. Les hauts volumes restent dans le cadre. Les 18 anciens cadrages et ceux du lot A restent identiques.
- Interface I1 étendue : sélecteur par planche, galerie B puis A et historique, G/D, six corps, huit curseurs tactiles, préréglages, cas iPad combiné, ancres, monochrome, accessoires, reset. Pas de stockage ni d’appel au jeu. Le moteur principal, les sauvegardes et les autres previews ne sont pas modifiés.

## Vérifications reproductibles

```sh
npm ci
node --test bio-vis-p5-i2/model.test.mjs
npx playwright install --with-deps chromium webkit
node bio-vis-p5-i2/browser.test.cjs
npm test
npm run test:browser
```

Les matrices déterministes couvrent 256 sommets min/max pour chacun des 18 arrangements B (4 608 états), continuité sur huit axes à 21 positions, ancres/visage inchangés et géométrie identique aux trois échelles. La non-régression stricte couvre les 36 choix antérieurs × 256 sommets × trois vues (27 648 SVG comparés exactement).

Le navigateur interprète les vrais chemins SVG et contrôle les coordonnées, le recouvrement du crâne, les repères faciaux dégagés, les racines des tresses, les cadres, les six corps, la présence des mèches dans toutes les vues, les 54 choix tactiles et les ressources. Matrice de recouvrement : neutre, cas iPad, 16 sommets répartis et 12 intermédiaires déterministes par arrangement. Formats 820×1180, 1180×820, 768×1024 et 390×844 ; stockage du jeu préservé, contrôles utilisables sans réseau après chargement.

Les suites I1 et P4-R1 sont aussi exécutées depuis leurs branches intactes. Les tests du dépôt restent inchangés. Résultats détaillés et liens CI dans la PR de livraison.

Cas iPad combiné : [28-D](captures/webkit-p5-028-D-priority.png), [30-D](captures/webkit-p5-030-D-priority.png), [32-D](captures/webkit-p5-032-D-priority.png), [34-D](captures/webkit-p5-034-D-priority.png).

Les captures de `captures/` proviennent de **WebKit Playwright**, pas d’un iPad physique. Pour les régénérer : `CAPTURE_DIR=bio-vis-p5-i2/captures node bio-vis-p5-i2/browser.test.cjs`. Les comparaisons sont interactives : quatre morphologies et mode monochrome, plus six corps pour chaque G/D.

## Limites à examiner graphiquement

- Les entrelacs et boucles sont stylisés en aplats, avec moins de densité que le poster. Juger surtout 28-D, 30 G/D, 32/35 et le quiff 34-G aux trois échelles. Les petits détails se resserrent naturellement dans la miniature.
- Les longueurs passent devant les épaules et le buste selon les calques existants ; des superpositions avec bras/buste restent possibles, particulièrement sur les corps étroits ou volumineux. Aucun système de collisions ou de détournement des mèches n’a été ajouté.
- 32/35 partagent la topologie une/deux nattes. Leurs épaisseurs, hauteur de couronne et trajets diffèrent ; l’utilité artistique de ces variantes reste à confirmer sans bijoux.
- 29-D, 31-D et 36-D appartiennent à la même famille de chignons ; disposition des rouleaux, retombées et étagement diffèrent. Le diadème n’est pas compté comme coiffure.
- La nuque de 33-G est partiellement cachée dans la source. Seuls le balayage visible et le ruban sont représentés ; pas de chignon arrière inventé. Aucun profil/dos ni longueur hors champ du poster n’est prétendu exact.
- Fleurs, perles, liens, pendentifs et diadème sont simplifiés. Les boucles d’oreilles des posters ne sont pas ajoutées au personnage.
- Chromium et WebKit automatisés ne remplacent **ni Safari sur iPad physique ni la validation artistique humaine**. À tester : confort des curseurs, lisibilité des tresses/boucles et raccords sur les six corps. Aucune fusion et aucun lot C avant retour utilisateur.
