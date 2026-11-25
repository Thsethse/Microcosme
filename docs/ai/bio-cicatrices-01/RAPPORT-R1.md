# BIO-CICATRICES-01-R1 — Démarrage de la preview sur iPad

[Preview R1 à retester sur iPad](https://thsethse.github.io/Microcosme/preview/bio-cicatrices-01/?r1=c13c722#atelier) · [PR #56](https://github.com/Thsethse/Microcosme/pull/56) · [Déploiement Pages](https://github.com/Thsethse/Microcosme/actions/runs/45586065860)

## Diagnostic

Les pages publiques de BIO-MARQUES-01 et de BIO-CICATRICES-01 avant R1 ont démarré sous Chromium 151, WebKit 17.4 et WebKit 26.5 avec un profil iPad. Leur comparaison contenait six SVG et douze choix de formes d’yeux. Les 330 empreintes de la publication d’origine de BIO-CICATRICES-01 correspondaient au manifeste local. Les nouveaux modules répondaient avec un type MIME JavaScript.

L’ancien point d’entrée `app.mjs` chargeait l’ensemble des dépendances statiques avant d’exécuter la première instruction de l’atelier. Le module de la planche `scars-study.mjs` faisait partie de ce chargement, même en ouvrant directement `#atelier`. Avec une réponse HTTP 503 simulée sur ce seul fichier dans les deux moteurs, le document HTML répond en 200. Le navigateur affiche alors zéro portrait, zéro option dans la liste des yeux et zéro curseur. L’ancienne page ne signale pas cette erreur à l’écran. La panne reproduite se situe dans le chargement des dépendances, avant le montage des contrôles et le premier rendu.

La réponse 503 appartient au scénario de reproduction. Le déclencheur de la panne sur l’iPad physique reste à confirmer. Le symptôme rapporté ne fournissait ni message JavaScript ni requête défaillante, et le chargement normal à partir des ressources de l’ancienne version a réussi dans les moteurs disponibles.

## Correctif

La publication Pages compile le point d’entrée et ses dépendances depuis une même révision Git. L’HTML charge un seul fichier JavaScript différé, nommé d’après son empreinte, avec une compilation ciblant Safari 15.4. Les anciens modules restent disponibles pour les outils de contrôle et les recettes du générateur. Le navigateur n’a plus à les charger séparément pour démarrer l’atelier. Le chargement, le résultat du démarrage et une éventuelle erreur sont visibles dans l’interface. Un rechargement permet de reprendre après un échec transitoire.

Les fichiers du moteur de rendu, les formes, les paramètres, les invariants anatomiques et les archives gardent le comportement de BIO-CICATRICES-01. Le commit Pages `519a742` contient uniquement les fichiers de démarrage et le manifeste de la preview. La page publique correspond au commit source `c13c722`.

## Vérifications de R1

| Contrôle | Résultat |
| --- | --- |
| Démarrage public à froid | Chromium 151, WebKit 26.5 et WebKit 17.4. Aucun message JavaScript bloquant. Le seul script chargé correspond au fichier déclaré dans le manifeste. |
| Interface et trois échelles | Douze listes vérifiées, dont 119 entrées ordinaires, 126 historiques et six formes de cicatrices. Huit curseurs d’yeux et onze curseurs de cicatrices présents. Les deux colonnes produisent six portraits raster à 300, 178 et 70 px. |
| Contrôles hérités | Changement de corps et d’ouverture, déplacement du curseur de largeur, activation des iris, des détails des yeux, des sourcils, de la bouche, du nez, de la barbe, de la palette et des marques. |
| Cicatrices et sauvegarde | Ajout d’une cicatrice suturée, variation de sa maturation et export v9. Recette complète des cicatrices rejouée sur Pages sous Chromium et WebKit, y compris les comparaisons historiques et les réserves anatomiques. |
| Échec transitoire | Un 503 simulé du fichier de démarrage affiche le diagnostic et le bouton de rechargement. Après rechargement, les six portraits reviennent dans chaque moteur. |
| Correspondance des fichiers | 331 empreintes SHA-256 vérifiées sur Pages, dont les 299 dépendances héritées. Le fichier exécuté au démarrage correspond à son empreinte déclarée. |
| Tests Node | Suite du jeu et 18 tests des marques et cicatrices réussis. |

[Reproduction avant R1](reproduction-r1.json) · [Démarrage public R1](demarrage-r1.json) · [Recette publique complète R1](recette-publique-r1.json) · [Empreintes R1](publication-r1.json)

Le nouveau test démarre sur l’URL publique par défaut. En CI, il vérifie le dossier obtenu par la même compilation que GitHub Pages.

```sh
npm ci
node bio-yeux-01/tests/scars-startup-browser.cjs
node bio-yeux-01/build-scars-preview.mjs /tmp/microcosme-scars-r1
PREVIEW_DIR=/tmp/microcosme-scars-r1 node bio-yeux-01/tests/scars-startup-browser.cjs
```
