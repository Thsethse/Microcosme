# BIO-EPURE-03-L01-R01 — Trois espaces de l’éditeur adulte

## Base et livraison

La branche `codex/bio-epure-03-l01-r01` part de `55a86c28d34814c45a79e42ecc4f289f3cdbcf64`, tête de `docs/bio-epure-03`. Les vérifications Git locales et GitHub confirment que `afadaa9abd4091ee94091d6f7448e94d02a8c137` (audit #79) et `6d5484d9350b05cf1de3eee1a4173853685008f9` (BIO-SOCLE-02-R02, PR #78) en sont des ancêtres. Entre R02 et la base documentaire, les cinq fichiers touchés sont l’inventaire, les dépendances, le rapport d’audit, le contrat maître et la mission. Aucun écart d’ascendance. [Contrat](../CONTRAT_MAITRE.md) · [Mission](../MISSION_LOT_01.md) · [Inventaire](../../bio-epure-01-r01/INVENTAIRE.md) · [Dépendances](../../bio-epure-01-r01/DEPENDANCES.md) · [R02](../../bio-socle-02-r02/RAPPORT.md) · [Audit](../../bio-epure-01-r01/RAPPORT.md)

- La PR #80 cible `docs/bio-epure-03` et reste en brouillon. [PR #80](https://github.com/Thsethse/Microcosme/pull/80)
- Le build de la preview provient de `3bbac606c824761db7f37daa6edc2088fd7ac307`. Le commit Pages `f04197ec8857697848a956cc6801c472d68571b4` est un commit statique à un parent sur la branche de publication configurée (`main`). Son diff ajoute uniquement quatre fichiers sous `preview/bio-epure-03-l01-r01/`. [Preview](https://thsethse.github.io/Microcosme/preview/bio-epure-03-l01-r01/) · [Manifeste](https://thsethse.github.io/Microcosme/preview/bio-epure-03-l01-r01/version.json) · [Commit source](https://github.com/Thsethse/Microcosme/commit/3bbac606c824761db7f37daa6edc2088fd7ac307) · [Commit Pages](https://github.com/Thsethse/Microcosme/commit/f04197ec8857697848a956cc6801c472d68571b4)

## Architecture

La distribution du lot active les trois espaces à l’amorçage de l’atelier R02. Les distributions historiques et l’entrée historique `bio-yeux-01/index.html` continuent d’utiliser leur disposition existante. Les nœuds de commande, leurs identifiants et leurs écouteurs sont réutilisés. Les trois espaces partagent une sélection, les mémoires corporelles H/F, chaque éditeur de calque et le compositeur SVG. Les témoins conservent leur état de consultation et leur API de fiche habitant, indépendants de l’archive de travail.

La barre des trois espaces reste accessible pendant le défilement. Création s’ouvre par défaut. Un lien direct vers une planche ou un panneau ouvre l’espace correspondant. La navigation affiche ou masque les groupes de nœuds. Les réglages, le fond, les textes JSON et les volets ouverts restent disponibles pendant la session. La confirmation d’un ajustement et le message de démarrage sont accessibles au-dessus de l’espace actif. Une alerte d’un panneau masqué est relayée dans la barre commune. Le bouton de relance du démarrage conserve son action de rechargement.

Création présente le personnage courant aux trois tailles et conserve les gros plans d’édition. Laboratoire reprend les règles de référence du comparatif et l’option d’enveloppes. Technique présente la demande des yeux, la valeur résolue et son domaine direct. En mode historique, ce tableau indique la valeur de départ des curseurs et signale le mode historique. La composition de maquillage reste éditable et enregistrable dans Création. Son transfert JSON possède son propre retour dans Technique.

## Répartition des anciens panneaux

| Panneau ou groupe R02 | Destination | Commandes et comportement |
| --- | --- | --- |
| Atelier du visage · réglages des yeux | Création → Vues et réglages des yeux | Forme, huit curseurs et informations de réglage, retour aux yeux historiques. |
| Atelier du visage · mise en scène | Création → Vues et réglages des yeux | Portrait 300 px, corps 178 px, miniature 70 × 70 px, fond Ivoire et Ardoise. |
| Avant / après, choix de référence, enveloppes | Laboratoire → Comparaisons | Comparateur recalculé lorsque son volet est ouvert, références et repères existants. |
| Tirage des yeux et ajustement conjoint | Laboratoire → Expérimentations | Graine, version, demande manuelle et confirmation explicite. Boîte de confirmation commune aux trois espaces. |
| Personnage et palette | Création → Personnage et palette | Catalogue ordinaire, arrangement, morphologie, accessoires et contrastes hérités, nuanciers, aplat et contour. |
| Identifiants capillaires historiques | Laboratoire → Expérimentations | Ouverture explicite et 126 identifiants, y compris les alias. |
| Atelier du thorax | Création → Atelier du thorax | Sélecteur Corps, raccourcis H/F avec focus, poitrine ou pectoraux, aréoles, abdominaux, corpulence, ossature et trois vues de contrôle. |
| Atelier du bassin | Création → Atelier du bassin | Raccourcis H/F, état de pousse et gros plan. |
| Iris et pupilles, paupières/cils/contours, sourcils, nez et bouche | Création → Panneaux correspondants | Références et réglages existants, gros plans et retours utiles. |
| Pilosité faciale | Création → Pilosité faciale | Catégorie H/F/T de l’atelier, références et valeurs latentes, réglages, tirage et gros plan. |
| Marques et cicatrices | Création → Panneaux correspondants | Ajout, liste, masquage, édition, placement tactile et gros plans. Les planches de référence sont au Laboratoire. |
| Maquillage et compositions locales | Création → Maquillage | Cinq familles, peintures, placement, compositions nommées et réapplication. |
| Tirage de composition de maquillage | Laboratoire → Expérimentations | Graine et tirage existants. |
| Planche des corps, ossature, corpulence, poitrine, pectoraux, aréoles, reliefs, abdominaux, pli/nombril, diagnostic pelvien et anatomie pelvienne | Laboratoire → Études anatomiques | 11 volets, repères, comparaisons et choix d’étude d’origine. |
| Formes des yeux, contour naturel, cicatrices, rousseur et maquillage | Laboratoire → Études du visage | Cinq volets. Le choix d’une forme reste une action explicite. |
| Une coiffure dans les 26 teintes, une teinte sur plusieurs coiffures | Laboratoire → Études chromatiques des cheveux | Deux volets. Les boutons de choix de teinte et de coupe restent actifs. |
| Archive atelier H/F | Technique → Archive H/F | Export, import, JSON et messages existants. La restauration des apparences v1–v22 passe aussi par cette entrée. |
| Habitants témoins | Technique → Fiche habitant | Affichage H/F, trois projections, caractéristiques canoniques, export et restauration JSON. |
| Données de la sélection historique | Technique → Sélection historique | Affichage et relecture de la sélection brute. |
| Composition JSON de maquillage | Technique → Échange JSON de maquillage | Export et import avec application explicite à l’apparence courante. |
| Précision des demandes et rapport de réalisation | Technique → Diagnostics et rapports | Tableau des yeux et lien vers ce rapport. |
| Navigation répétée par étude, raccourcis de retour et relance | Barre commune, navigation de l’espace et liens contextuels | Les liens de planche du bandeau général cèdent la place aux familles du Laboratoire. Depuis les gros plans, « Voir aux trois échelles » revient au personnage. Les liens de focus du thorax et du bassin gardent leur usage. |

## Chargement à la demande

Les onze études anatomiques et les deux études capillaires réutilisent leurs volets et leurs générateurs. Les formes des yeux et la rousseur acquièrent un volet fermé au départ. Les contours naturels, les cicatrices et le maquillage reprennent leurs volets à rendu différé. Le code des planches fait partie du bundle. La mise en page des commandes et le chargement du script précèdent le calcul des SVG. Une planche fermée garde les résultats déjà produits en mémoire DOM. Les planches dépendantes du personnage peuvent être recalculées à leur réouverture ou lorsqu’elles sont visibles et qu’une entrée change.

La recette instrumente le setter `innerHTML` avant le démarrage. Elle comptabilise les écritures contenant des SVG, le volet, son état ouvert et la visibilité de son espace. Elle vérifie également le DOM pour les planches jamais ouvertes. Elle ouvre puis referme les 18 planches une par une, compare le total instrumenté au nombre réellement monté et vérifie l’archive de l’atelier avant et après consultation. Elle contrôle l’application explicite d’une teinte et le cas d’une planche restée ouverte au Laboratoire pendant une modification du fond dans Création. Le lien direct vers la Planche des corps déclenche cette seule planche dans un chargement neuf. Sur chaque moteur, le parcours observe 0 écriture au démarrage et à la seule entrée dans le Laboratoire, puis 30 écritures et 646 SVG sur les 18 premières ouvertures. Il observe 0 écriture supplémentaire lorsque toutes les planches sont refermées et pendant l’édition en Création avec une étude capillaire masquée. [Recette automatisée](../../../../bio-yeux-01/tests/editor-spaces-browser.cjs)

| Planches | Nombre de SVG montés lors de l’ouverture individuelle |
| --- | --- |
| Corps, ossature, corpulence, poitrine, pectoraux | 26, 38, 36, 70, 35 |
| Aréoles, reliefs osseux, abdominaux, pli/nombril | 48, 40, 42, 36 |
| Diagnostic pelvien, anatomie pelvienne | 2, 24 |
| Formes des yeux, contours naturels, cicatrices, rousseur, maquillage | 11, 48, 40, 12, 28 |
| 26 teintes, variété de coiffures | 78, 32 |

## Résultats de recette

| Vérification | Résultat |
| --- | --- |
| Suites Node de l’atelier, des palettes et du jeu | **221 réussites**, zéro échec ou test ignoré sous Node 24.22.3. Les sept tests du socle rejouent notamment la matrice existante de 301 cas, les apparences v1 à v22, les latences et les projections canoniques. |
| Recette du lot sur le build local | Chromium 151.0.7922.34 et WebKit 26.5. Navigation tactile simulée, largeurs 390, 768 et 1 024 px, trois échelles, 18 planches, ajustement manuel annulable, teinte appliquée explicitement, placement d’une marque, quatre échanges distincts, erreurs transversales et relance après échec du script. |
| Comparaison R02 → lot 01 | **9 SVG identiques par moteur** aux trois échelles, sur les mêmes entrées pour l’état initial, un H modifié et un F modifié. Validation du fond et des enveloppes en tant que commandes de présentation. L’application d’une forme, l’ouverture d’un identifiant historique et le choix d’une coupe depuis les études ont aussi été vérifiés sur les deux moteurs. |
| Recette du socle adulte sur la nouvelle interface | Sur chacun des deux moteurs, 2 restaurations atelier H/F à froid, 7 archives de pilosité rejouées, 2 témoins restaurés à froid, 6 rejets d’archive atelier et 4 rejets de fiche habitant. Les deux états de DOM dégradé de la pilosité sont récupérés. Une sélection de témoin vide conserve l’identité et les dessins. La recette R02 passe également sur la disposition historique. |
| Inventaire DOM au démarrage | Les 272 champs, sélecteurs et zones de texte munis d’un identifiant sont identiques à R02 sur Chromium. Le catalogue affiche 119 entrées ordinaires et 126 identifiants historiques. |
| Suites navigateur historiques vérifiées | Sous Chromium et WebKit, les suites des yeux figés, iris, paupières, sourcils, bouche, nez, pilosité, marques, cicatrices et démarrage du bundle cicatrices, maquillage, contours naturels, corrections BIO-INV-01, palettes et jeu ont réussi. Les recettes BIO-CORPS-01, BIO-CORPS-06 (59 ressources vérifiées) et BIO-CORPS-06-R02 ainsi que les trois suites originales de dédoublonnage capillaire ont également réussi sur les deux moteurs. |
| Publication Pages | Le déploiement a réussi. Réponses HTTPS 200 et correspondance à l’octet avec le build local pour le manifeste, le HTML, la feuille de style et le bundle. L’amorçage publié est `atelier-fa2ac506a9869ae3.js`. |

Le parcours spécifique et la recette du socle ont également réussi sur les réponses de Pages avec les deux moteurs. Dans l’environnement d’exécution, la navigation Playwright directe a rencontré un problème de connectivité IPv6 et de confiance du certificat de proxy. Un relais HTTP local a transmis les ressources publiques récupérées avec vérification HTTPS. Les empreintes et le commit du manifeste ont été vérifiés avant la recette. Les étapes « Recette du socle adulte » et « Recette des trois espaces et comparaison graphique R02 » ont réussi dans GitHub Actions. Le journal du workflow consigne aussi la réexécution des suites historiques. Les planches ont également été examinées dans la disposition portrait simulée. [Workflow](../../../../.github/workflows/bio-yeux-01.yml) · [Recette du lot](../../../../bio-yeux-01/tests/editor-spaces-browser.cjs) · [Recette du socle](../../../../bio-yeux-01/tests/bio-socle-browser.cjs) · [Déploiement Pages](https://github.com/Thsethse/Microcosme/actions/runs/46107139912) · [Vérifications GitHub Actions](https://github.com/Thsethse/Microcosme/actions/runs/46107119846/job/140862240712)

```sh
npm ci
npx playwright install chromium webkit
node --test tests/*.test.js bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
node preview/bio-epure-03-l01-r01/build.mjs /tmp/microcosme-l01
PREVIEW_DIR=/tmp/microcosme-l01 PREVIEW_MISSION=BIO-EPURE-03-L01-R01 \
  node bio-yeux-01/tests/bio-socle-browser.cjs
PREVIEW_DIR=/tmp/microcosme-l01 REFERENCE_URL=https://thsethse.github.io/Microcosme/preview/bio-socle-02-r01/ \
  node bio-yeux-01/tests/editor-spaces-browser.cjs
```

Pour une référence locale, remplacer `REFERENCE_URL` par `REFERENCE_DIR` pointant vers un build R02 issu de `6d5484d9350b05cf1de3eee1a4173853685008f9`, comme dans le workflow.

## Accès transitoires et limites

- Le sélecteur Corps conserve les huit bases et le défaut « Corps de référence ». Les cas du sélecteur Morphologie, les extrêmes des yeux, la catégorie de pilosité et les graines mêlées à leurs contrôles restent disponibles dans leurs panneaux. Les tirages par module et les graines qui servent à éditer une marque ou une cicatrice restent avec leurs commandes historiques, conformément à la limite sur les panneaux mixtes. Les déplacements ciblés du lot portent sur l’œil, les choix capillaires historiques et le tirage de maquillage.
- Le diagnostic pelvien est une planche graphique du Laboratoire. Le panneau Technique expose le diagnostic détaillé des domaines de l’œil et les messages de validation des différents formats. Les indications de latence et de disponibilité restent près des réglages.
- Les contrôles graphiques automatisés portent sur les mêmes entrées et les mêmes dimensions SVG. Les comparaisons de chaînes normalisent seulement les identifiants d’instance des masques SVG. Le jugement visuel et les interactions propres à Safari sur iPadOS, notamment les sélecteurs natifs et le passage par Notes, relèvent de la recette physique.
- Le rapport prend comme référence d’interface la distribution adulte BIO-SOCLE-02-R02. Les archives conservent leurs schémas et leur interprétation courante. La réorganisation est activée par la distribution dédiée du lot.

## Parcours de recette sur iPad physique

1. Ouvrir la preview dans un nouvel onglet Safari. Vérifier l’arrivée sur **Création**, les trois boutons et leur accès après défilement en portrait puis en paysage. Dans **Vues et réglages des yeux**, vérifier portrait, corps et miniature. Basculer d’Ivoire à Ardoise.
2. Dans **Atelier du thorax**, ouvrir F, monter le volume, modifier la largeur puis remettre le volume à zéro. Ouvrir H et donner une largeur pectorale distincte. Passer par **Laboratoire** et **Technique**. Revenir à **Création**, réactiver le volume F puis passer à H et vérifier les deux largeurs. Dans **Marques cutanées**, ajouter un grain de beauté et le placer en touchant une joue dans le gros plan.
3. Dans **Laboratoire**, ouvrir successivement une étude anatomique, les formes des yeux et une étude capillaire. Vérifier l’apparition des dessins au dépliage et la stabilité du personnage après consultation. Utiliser ensuite explicitement un bouton de choix de teinte et vérifier son effet dans **Création**.
4. Dans **Technique**, exporter l’archive H/F et la copier dans Notes. Exporter séparément la fiche d’un témoin et vérifier son identifiant et ses caractéristiques. Fermer l’onglet, rouvrir la preview puis restaurer chaque fichier dans son panneau. Vérifier les deux mémoires H/F et les trois projections du témoin. Afficher et relire la sélection historique dans son propre panneau. Essayer aussi l’aller-retour du JSON de maquillage.
5. Dans un panneau de restauration, coller un JSON tronqué et vérifier le signal d’erreur. Changer d’espace et vérifier que l’erreur reste lisible et que le dernier état valide est toujours affiché. [Preview Safari](https://thsethse.github.io/Microcosme/preview/bio-epure-03-l01-r01/)
