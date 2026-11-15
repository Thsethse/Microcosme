# BIO-STRUCT-T3-A — rapport de livraison

## État et sources

Lot T3-A implémenté dans `experiments/bio-struct-t3-a/`, branche `codex/bio-struct-t3-a`. Base main `80421a8900eb5d4d9e16db22a760122d4db352a0`. Contrat/audit/mission lus sur `docs/bio-struct-t3-a-contract` au commit `b7f9192e630b9506be3f8a659ca533b21e141a2b` ; PR #15 inchangée à `e057e5f906afba25ac943bcc617afb581eb8d296`. Croquis corps et visage consultés dans le message utilisateur, distinctement de la planche T2.

[Décisions d'implémentation et vérification préalable](DECISIONS-IMPLEMENTATION.md) · [Architecture/JSON](ARCHITECTURE.md) · [P1/P2](PARAMETRES.md) · [23 résultats individuels](RESULTATS-23-TESTS.md) · [Publication](PUBLICATION.md).

## Fonctions livrées

Trois corps M/F/T côte à côte, sans coiffure ni vêtements, sur échelle et sol communs. Onze paramètres P1 réglables, valeurs initiales P2 exactes. Le troisième type possède une seule fonction male ou female, basculable sans changement automatique de sa morphologie. Face, profil et dos calculés depuis le même squelette et les mêmes volumes. Sélection tactile, superpositions séparées volumes/squelette/articulations/ancrages, corps inspectable et rapport des limitations/rejets.

Les positions et dimensions des muscles, poitrine et signe anatomique pelvien dérivent des segments. La profondeur du profil est celle du corps canonique. Modifier le tronc, les membres, les largeurs ou la profondeur recalcule les descendants et leurs attaches. La référence mesure 100 unités = 25 tête + 30 tronc + 45 bassin/jambes, soit quatre têtes. Les variations ne sont pas renormalisées à 100.

JSON T3-A v1 conserve graine, catégorie, fonction, valeurs demandées/appliquées et corrections. Import reconstruit et contrôle le même corps ; export téléchargé et relu dans le parcours navigateur. Une entrée biologique ou géométrique invalide est rejetée sans remplacer l'état valide précédent. Aucune conversion T2 en catégorie biologique.

## Tests réellement exécutés

- **23/23 contractuels Node**, identifiants **T3A-01 à T3A-23**, un test distinct par identifiant ; résultats et intitulés individuels dans `RESULTATS-23-TESTS.md`.
- **35/35 historiques Node** (`npm test`) ; **6/6 T2 Node** dans son checkout non fusionné. Total Node local : **64 réussis**.
- **Chromium 151.0.7922.34 local réussi** : les 11 paramètres ont un effet de pixels pertinent ; **108 masques anatomiques connexes et non coupés** (M/F/T × 12 combinaisons extrêmes × trois vues), déterminisme des pixels, sélection tactile simulée, bascule de fonction T sans modification des autres volumes, debug sans mutation du corps, corrections persistantes, rejet sans perte, export relu/réimporté, refus T2 et formats 390/820/1180 sans débordement horizontal.
- WebKit local indisponible faute de bibliothèques système ; la CI dédiée installe les dépendances, exécute Chromium/WebKit localement et sur l'URL publique, puis les suites Node/navigateur T2 dans un checkout de sa révision auditée. La [CI 43743148481](https://github.com/Thsethse/Microcosme/actions/runs/43743148481) est **réussie** : Chromium 151 et WebKit 26.5 passent les parcours local et HTTPS public ; T2 passe aussi Node et navigateurs dans son checkout séparé.

Environnement local : VM Linux x86_64, 3 vCPU AMD EPYC 9V74, Node 24.22.1, Playwright 1.62.1 ; viewport 820×1180, DPR2, toucher simulé. `MESURES-LOCAL.jsonl` contient les effets de réglages, nombre de masques et coût ponctuel de 90 rendus (trois références × trois vues × dix passes). Aucun test de galerie de 100 personnages. Ni mémoire GPU, batterie, latence physique ou performance iPad certifiée.

## Corrections observées pendant la vérification

Le parcours navigateur a détecté qu'un second événement `change` produit lors du retrait de focus pouvait remplacer une demande hors bornes par sa valeur déjà plafonnée, effaçant ainsi sa correction. Les saisies numériques ne sont désormais traitées que lorsqu'une édition utilisateur les a marquées comme modifiées ; la trace `1,60 → 1,35` survit au changement de focus et à l'export/import.

Les pieds ont une boîte locale qui atteint exactement la cheville et le sol. Le signe sexuel partage l'ancrage pelvien nommé du squelette, sans position indépendante. Les faibles volumes mammaires utilisent un petit volume effectif distinct des rectangles pectoraux ; les références plus développées augmentent largeur, hauteur et profondeur sans sortir du thorax. Les en-têtes de cartes ont été alignés pour conserver un sol comparable entre M/F/T.

## Écarts, choix techniques et limites

Aucun écart fonctionnel volontaire à D1–D4/P1–P3. Deux choix explicités et à auditer : **P1 borne les multiplicateurs finaux, P2 ne fait qu'initialiser** ; sous-repères Y proposés repris comme calibration technique. La largeur relative du tronc P2 reste fixe par catégorie, faute de borne P1 dédiée ; aucun paramètre biologique supplémentaire n'est inventé.

Les ratios de formes, l'amplitude des signes et les volumes régionaux sont des paramètres techniques de ce banc, pas une approbation artistique séparée. Les boîtes restent visibles, les silhouettes sont schématiques. Les centres locaux sont des attaches de volumes, pas un modèle biomécanique de tissus ou une simulation de contraintes physiques. Les contrôles spatiaux vérifient régions, attaches, dimensions et continuité ; ils ne prouvent pas une plausibilité biologique complète.

Les volumes sont projetés orthographiquement puis ordonnés par profondeur moyenne ; ce n'est ni un maillage 3D détaillé ni un rendu de sprites définitifs. Certaines superpositions aux extrêmes peuvent être peu lisibles. Les trois catégories restent distinctes dans les données même si des réglages rapprochent leurs apparences. Leur reconnaissance artistique n'est pas démontrée par les tests.

Le portrait était facultatif et n'est pas ajouté ; les catalogues de visages, de nez et de coiffures du croquis facial restent T3-B. Pas d'animation, reproduction simulée, fertilité, génétique, psychologie ou intégration au jeu. Pas de lot T3-B/C lancé. **Safari iPad physique non testé.**

## Publication et fichiers

Preview cible : **https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a/**. Le déploiement confirmé, les commits exacts, les ressources HTTP et le parcours public sont indiqués dans `PUBLICATION.md`. Publication isolée dans un nouveau dossier de main, sans fusion de la PR de code, sans modification de configuration Pages ni d'une preview existante.

Fichiers de code : sept modules JS (`biological-profile`, `anatomical-skeleton`, `body-geometry`, `canonical-body`, `body-projection`, `render`, `lab`), `index.html`, `lab.css`. Tests dédiés `contract.test.cjs`, `browser.cjs` ; workflow `.github/workflows/bio-struct-t3-a.yml`. Documents nouveaux sous `docs/bio-struct-t3-a/`, dont résultats et preuves. Aucun fichier historique ou T2 modifié.

## Essai iPad et réception humaine

1. Ouvrir la preview HTTPS dans Safari, comparer M/F/T en face puis profil et dos.
2. Toucher une carte, modifier tronc/bras/jambes et volumes. Activer squelette, articulations et ancrages ; vérifier que les volumes suivent leurs chaînes.
3. Basculer T de male à female et constater que poitrine/bassin/muscles restent identiques. Saisir 1,60 pour les épaules et vérifier le rapport 1,35 appliqué.
4. Exporter vers Fichiers, réinitialiser, réimporter et comparer ; tester portrait et paysage.

Noter appareil, versions iPadOS/Safari et les graines/JSON des anomalies. L'utilisateur doit juger la reconnaissance M/F/T, la proximité des proportions avec les croquis, les raccords, les volumes et la lisibilité des superpositions. **PR pour audit uniquement, non fusionnée ; aucune phase suivante sans validation.**

## Preuves finales CI et HTTPS

- Code applicatif : `e122da5294daff8aaa1a8fbabe51a6ea635aa71f`. Révision complète testée : `ad6040ca0dbc306ef908ea53b3c50237f65d9111` (seule différence : récupération de l'historique Git pour T3A-15).
- [CI 43743148481](https://github.com/Thsethse/Microcosme/actions/runs/43743148481) **success** : les 23 identifiants passent individuellement, les 35 tests historiques et les 6 tests T2 aussi (**64 Node**). Parcours T3-A dans Chromium 151 / WebKit 26.5 Linux sur fichiers locaux puis **sur l'URL publique HTTPS**, 108 masques par moteur et contexte, saisies/limites et rejets sans perte, trois vues, bascule T, debug et JSON complet. Parcours T2 Chromium/WebKit également réussis.
- [Non-régression historique 43743148478](https://github.com/Thsethse/Microcosme/actions/runs/43743148478) **success**, y compris son parcours navigateur existant.
- Le premier job T3-A `43743016534` avait échoué uniquement sur l'absence du commit de comparaison T3A-15 dans le clone Git superficiel (22/23). `fetch-depth: 0` fournit désormais la base auditée ; le test n'a pas été supprimé ou affaibli. Les 23 passent dans la révision corrigée.
- [Déploiement Pages 43742970672](https://github.com/Thsethse/Microcosme/actions/runs/43742970672) **success** au commit de publication `1c28b507684836d91021732420fa998009a74d99`. Les neuf fichiers applicatifs sont HTTP 200 et identiques octet par octet/SHA-256 à la source (voir `RESSOURCES-HTTPS.json`).
- Mesures CI dans `MESURES-CI.jsonl` : runner Linux GitHub Actions ubuntu-latest, Node 22, Playwright 1.62.1, viewport 820×1180, DPR2, toucher simulé ; matériel précis non relevé. Le user-agent WebKit évoquant macOS ne constitue pas un test sur matériel Apple. Les derniers commits documentaires ne modifient pas les fichiers applicatifs publiés.

**URL effectivement ouverte et manipulée par les deux navigateurs : https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a/**. Test Safari iPad physique et validation artistique toujours ouverts.
