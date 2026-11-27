# Microcosme · BIO-SOCLE-02-R02

## Diagnostic et corrections

Le parcours de recette part de la PR [#78](https://github.com/Thsethse/Microcosme/pull/78) et de la distribution R01 au commit source `f69167e84dc90ca1b32238e62f1ffbb4021bedbe`. Le seul message du relevé physique est « Archive non exportée · Catégorie de pilosité inconnue. ». Sur cette distribution, les commandes ordinaires de thorax et d’export réussissent en Chromium. En forçant une sélection vide, puis dans une session séparée en remplaçant le libellé H par « Homme », on obtient ce message exact via **Exporter l’apparence** sous Chromium 151 et WebKit 26.5. Ces reproductions isolent la cause dans le logiciel. L’état exact qui a déclenché la valeur hors catalogue sur l’iPad du porteur reste inconnu.

| Défaut confirmé | Cause et effet | Correction et non-régression |
| --- | --- | --- |
| L’export de l’atelier échoue sur une catégorie de pilosité inconnue | `beardEditor.archiveSettings()` transmet directement la valeur du sélecteur. Sans attribut `value`, cette valeur dépend du libellé. Sans sélection elle devient vide. Le contrôle strict H/F/T rejette la valeur à la création de l’archive, même avec une pilosité historique. | Valeurs H/F/T explicites dans le HTML. Au rendu et à l’export, la dernière valeur valide est réappliquée si le DOM perd sa sélection. La valeur initiale reste H. La restauration alimente la mémoire de l’éditeur. Le test navigateur injecte les deux états dégradés et exige un export identique, avec catégorie F préservée. L’import d’une archive contenant une catégorie vide reste refusé. [Éditeur](../../../bio-yeux-01/beard-editor.mjs) · [Recette](../../../bio-yeux-01/tests/bio-socle-browser.cjs) |
| Une sélection vide peut changer silencieusement l’habitant affiché | La conversion `Number(select.value)` convertit la chaîne vide en zéro et charge le témoin F. Après affichage du témoin H, cela change l’identité affichée au lieu de signaler l’absence de choix. | Le bouton résout une valeur de témoin présente dans le sélecteur. En cas de valeur vide ou inconnue, il conserve le témoin et ses trois SVG et affiche un diagnostic. Le test navigateur compare l’identité et les vues avant et après. [Panneau](../../../bio-yeux-01/resident-preview.mjs) · [Recette](../../../bio-yeux-01/tests/bio-socle-browser.cjs) |
| L’export peut produire une archive dont la source historique est refusée en lecture | Le lecteur validait la provenance des anciens réglages du nombril et du thorax. L’exporteur joignait toute source fournie. Par exemple, un v1 valide passé comme source de ces réglages produit un document que le lecteur refuse. | Lecture et export utilisent la même validation de provenance. Les témoins v18, v19 et v20 conservent leur source acceptée sur plusieurs cycles. Les sources injustifiées, nulles ou incohérentes sont refusées aux deux entrées. [Archive](../../../bio-yeux-01/workshop-archive.mjs) · [Tests](../../../bio-yeux-01/tests/bio-socle-robustesse.test.mjs) |

Le compositeur SVG, les solveurs, les palettes, les témoins H/F, les cadrages et le CSS de l’atelier sont identiques à R01. Les six empreintes SVG de référence BIO-CORPS-06-R02 restent des oracles de non-régression. Les schémas de données restent aux versions existantes. [Contrat technique R01](../bio-socle-02-r01/CONTRAT-TECHNIQUE.md) · [Témoins graphiques](../../../bio-yeux-01/tests/bio-socle.test.mjs)

## Audit de la couverture

Les 214 réussites R01 réunissaient 171 tests historiques de l’atelier, huit tests du socle et 35 tests du jeu. Les tests de modèle composaient leur propre objet JavaScript. Le parcours navigateur R01 contrôlait déjà l’archive H/F dans un contexte neuf et l’identité du témoin H. Il laissait la pilosité sur H par défaut et injectait certaines valeurs de curseur avec un événement synthétique. Il n’exerçait ni un DOM de sélecteur dégradé, ni la sélection vide d’un témoin, ni un export de source historique invalide. L’ancien job GitHub Actions échouait par ailleurs à l’étape de recette du socle et ignorait les étapes navigateur suivantes. [Rapport R01](../bio-socle-02-r01/RAPPORT.md) · [Job antérieur](https://github.com/Thsethse/Microcosme/actions/runs/46014947614/job/140559583423)

| Axe | Nouvelle couverture |
| --- | --- |
| Bases, états et bornes | Produit cartésien de deux bases actives, trois catégories de pilosité, trois modes faciaux (historique, latent, actif), trois niveaux corporels (minimum, fractionnaire intermédiaire, maximum) et deux modes de palette. Les deux bases personnalisées restent dans l’archive. Les scénarios commencent dans les deux sens et effectuent trois exports par configuration. |
| Configurations hors grille | 48 graines de test fixes varient les axes corporels indépendamment, les proportions du visage, les coiffures dont une rasée et un alias historique, et le monochrome. Le corps, le visage, la palette et les calques sont comparés après restauration. Les graines appartiennent aux tests de robustesse. |
| Historique et entrées erronées | 22 documents JSON témoins couvrent chaque version d’apparence de v1 à v22. Ils passent par l’import de compatibilité, les migrations et le réexport. Trois sources historiques invalides vérifient la parité export/import. Les dossiers invalides vérifient notamment les champs requis, les valeurs hors domaine, la cohérence des champs effectifs et l’absence de remplacement de l’état affiché. |
| Identité et projections | 64 habitants de test à graine fixe varient base, morphologie, corpulence, thorax, finition pelvienne, rasage, teinture et maquillage. Les tests vérifient les JSON, les identifiants et les références internes SVG des trois projections. Les deux témoins prédéfinis sont également exportés et restaurés depuis l’interface. |
| Réutilisation | Les tests d’archives et de projection utilisent les points d’entrée du socle. Le runner navigateur prend un répertoire de build ou une URL Pages. Il valide la version source attendue, les empreintes des ressources et le fichier d’amorçage chargé. GitHub Actions exécute désormais toutes les suites Node de l’atelier et le parcours navigateur dédié. [Workflow](../../../.github/workflows/bio-yeux-01.yml) |

### Volume de la nouvelle recette

| Configurations Node | Nombre | Assertions de rejeu |
| --- | ---: | --- |
| Croisement d’atelier | 108 | 324 cycles de sauvegarde H/F |
| Configurations d’atelier à graine fixe | 48 | 144 cycles de sauvegarde H/F |
| Habitants de test à graine fixe | 64 | 192 comparaisons de représentation, identité et JSON vérifiés sur deux lectures |
| Versions historiques | 22 | 22 migrations vers l’enveloppe atelier et réexports |
| Ateliers invalides | 32 | 16 données invalides sur chaque base |
| Habitants invalides | 24 | 12 par base, chacun soumis au lecteur, à l’exporteur et au rendu |
| Provenances historiques invalides | 3 | Les trois cas soumis à l’export et au lecteur |

Les **301 entrées** de cette table comprennent 242 configurations valides et 59 entrées négatives. La suite ciblée de sept tests prend environ 18 s sous Node 24.22.3 dans l’environnement de travail. Pour les 156 configurations de l’atelier, les 468 passages de lecture comparent trois échelles, soit 1 404 comparaisons SVG. Le plan exhaustif couvre cinq axes de premier ordre avec un risque raisonnable de doublons sémantiques aux valeurs inactives. Les graines complètent cette grille par des valeurs indépendantes, sans prétendre couvrir le produit des domaines continus. La recette ciblée garde les tests de géométrie existants et réserve aux navigateurs les interactions, le DOM, la restauration à froid et le démarrage publié.

## Parcours automatisés

La [recette manuelle R01](../bio-socle-02-r01/RAPPORT.md#validation-sur-safari-ipad) décrit cinq étapes principales et une vérification d’erreur. Le profil iPad Mini simulé fait les opérations suivantes sur l’interface publique. Les seuls changements directs du DOM injectent les états de sélecteur dégradés. Le transfert explicite du texte JSON et la fermeture du contexte représentent ici le passage par Notes et la réouverture de l’onglet.

| Étape | Vérification |
| --- | --- |
| 1 · Thorax F | Lien de navigation, bouton F et focus volume, toucher à une valeur intermédiaire, six commandes actives, volume maximal au clavier, retour à zéro et cinq commandes désactivées. La largeur reste mémorisée. |
| 2 · Thorax H et alternances | Bouton H, cinq commandes actives en volume, largeur distincte de référence, minimum et maximum. Trois passages H/F puis retour à H. Le test réactive temporairement le volume F et retrouve la largeur stockée. |
| 3 · Archive H/F | Export depuis H et depuis F. Deux restaurations dans des contextes neufs avec comparaison des trois vues et réexport égal. Vérification des préférences de la base inactive, rejet des archives invalides et import d’un document historique qui remplace les préférences précédentes. |
| 4 · Habitants témoins | Ouvrir le panneau, sélectionner et afficher F puis H, vérifier portrait, pion et miniature, ouvrir les caractéristiques et comparer au JSON exporté. Une sélection vide conserve le témoin H et déclenche le diagnostic. |
| 5 · Restauration individuelle | Exporter puis restaurer F et H dans des contextes neufs. Vérifier identité, caractéristiques, trois projections et réexport. Tester le JSON tronqué et une sauvegarde incomplète en maintenant l’habitant à l’écran. |
| Complément pilosité | Tester H, F et T sur chacune des deux bases corporelles avec la même demande de pilosité et une graine fixe. Rejouer les exports dans un nouveau contexte, y compris le réglage latent et sa réactivation. Tester le libellé modifié et la sélection vide via le véritable bouton d’export. |

## Réexécution et publication

Chromium 151.0.7922.34 et WebKit 26.5 réussissent la recette dédiée sur le build local et sur l’URL publique. Sur chaque moteur et chaque distribution, la recette restaure deux archives thoraciques à froid, rejoue sept archives de pilosité et restaure deux habitants à froid. Elle rejette six archives atelier et quatre archives individuelles, récupère deux sélections de pilosité dégradées et conserve l’identité du témoin sur une sélection vide. Les relevés local et public concordent sur chaque moteur.

Les suites Node repassent sous Node 22 dans GitHub Actions, avec **186 tests d’atelier** et **35 tests du jeu**. Les 186 tests d’atelier comprennent 171 tests historiques, huit tests de socle R01 et sept tests de robustesse R02. Le même job a exécuté la recette du socle sur son build. La réexécution locale sous Node 24.22.3 donne aussi 221 réussites, sans échec ni test ignoré. [Recette et suites Node](https://github.com/Thsethse/Microcosme/actions/runs/46073769148) · [Non-régression du jeu](https://github.com/Thsethse/Microcosme/actions/runs/46073769020)

Les suites navigateur existantes du jeu, des yeux figés, des iris, des paupières, des sourcils, de la bouche, du nez, de la pilosité, des marques, des cicatrices, du maquillage, des contours naturels, des corrections BIO-INV-01 et des palettes ont été rejouées sur Chromium et WebKit. Les trois lots capillaires ont aussi été rejoués dans leurs révisions originales avec Node et les deux navigateurs. Les recettes du corps BIO-CORPS-01 et du pointillé BIO-CORPS-06-R02 passent sur les deux moteurs. [Suites navigateur](https://github.com/Thsethse/Microcosme/actions/runs/46073769148) · [Référence R02](https://thsethse.github.io/Microcosme/preview/bio-corps-06-r02/)

Le job élargi a révélé quatre échecs de lecture des témoins Git dans le conteneur. `git show` refusait le checkout pour cause de propriétaire différent. Le workflow déclare précisément ce checkout comme répertoire sûr avant les tests et les builds historiques. [Échec diagnostiqué](https://github.com/Thsethse/Microcosme/actions/runs/46073083813/job/140754393130) · [Workflow corrigé](../../../.github/workflows/bio-yeux-01.yml)

La recette historique de BIO-CORPS-06 a également signalé une fausse régression. À 25 %, sa preview montre « Tonte courte ». Le test importait les libellés R02 du module courant et attendait « Texture fine » tout en vérifiant les racines de l’ancien dessin. Le test utilise désormais les six libellés du commit source publié `8930757309c3ff0382e4745a6676ec1c3d42f7bf`. Le contrôle R02 du pointillé reste couvert par sa recette propre. Le runner historique accepte aussi le statut HTTP 304 observé lors d’une nouvelle navigation WebKit. Il exige toujours le démarrage effectif de l’atelier et le succès des assertions graphiques. La suite complète BIO-CORPS-06 repasse sous Chromium et WebKit après ces ajustements. Chaque moteur vérifie les 59 ressources du manifeste, les deux bases, les six repères et les 24 racines du dessin historique. [Fixture historique](../../../bio-yeux-01/tests/body-browser.cjs) · [Manifeste BIO-CORPS-06](https://thsethse.github.io/Microcosme/preview/bio-corps-06/version.json) · [Recette du pointillé](../../../bio-yeux-01/tests/pubic-stipple-browser.cjs)

Le build livré provient de `daa23709d32b84b9c565e9e71d92045accba03db`. Le commit statique Pages `1521036586106b97b8bf6737f444eab2e404d776` a comme parent la tête Pages précédente et touche uniquement la distribution existante. L’ancien bundle reste disponible pour les documents HTML mis en cache. Les quatre ressources publiques correspondent à l’octet au build testé. Le SHA-256 de l’amorçage est `6d1c9e65da52b558c9d33edc94c14556b4722cb945eb8b94a1090b8cae758a41`. [Commit source](https://github.com/Thsethse/Microcosme/commit/daa23709d32b84b9c565e9e71d92045accba03db) · [Déploiement Pages](https://github.com/Thsethse/Microcosme/actions/runs/46073343689) · [Manifeste publié](https://thsethse.github.io/Microcosme/preview/bio-socle-02-r01/version.json)

### Rejouer la recette

```sh
npm ci
npx playwright install chromium webkit
node --test tests/*.test.js bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
node preview/bio-socle-02-r01/build.mjs /tmp/microcosme-socle-r02
PREVIEW_SOURCE="$(git rev-parse HEAD)" PREVIEW_DIR=/tmp/microcosme-socle-r02 \
  node bio-yeux-01/tests/bio-socle-browser.cjs
PREVIEW_SOURCE=daa23709d32b84b9c565e9e71d92045accba03db \
  PREVIEW_URL=https://thsethse.github.io/Microcosme/preview/bio-socle-02-r01/ \
  node bio-yeux-01/tests/bio-socle-browser.cjs
```

`ARTIFACT_DIR` permet de conserver le relevé JSON des étapes, les versions des deux moteurs, les valeurs saisies par les commandes et le fichier d’amorçage. Pour le build local, partir d’un checkout propre afin que le contenu et la révision déclarée coïncident.

## Limites et recette physique restante

Le parcours automatisé vérifie les commandes, les fichiers et les données. Safari sur l’iPad du porteur reste nécessaire pour le menu natif, la navigation et les gestes tactiles réels, le copier-coller vers Notes, la fermeture et la reprise sous iPadOS et l’appréciation graphique sur l’appareil. La recette manuelle peut se concentrer sur un aller-retour de l’archive H/F et un de l’habitant, avec contrôle du sélecteur de pilosité. Le diagnostic affiché en cas de nouvel incident et la version du manifeste permettront de le situer. La couverture échantillonnée laisse ouverts les événements propres à iPadOS, les grandes combinaisons de calques et la perception aux trois tailles.

La [preview GitHub Pages](https://thsethse.github.io/Microcosme/preview/bio-socle-02-r01/) garde son URL pour les favoris. Le titre et le [manifeste](https://thsethse.github.io/Microcosme/preview/bio-socle-02-r01/version.json) identifient R02. La PR [#78](https://github.com/Thsethse/Microcosme/pull/78) reste ouverte en brouillon.
